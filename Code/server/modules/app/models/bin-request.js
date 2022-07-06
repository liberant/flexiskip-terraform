const moment = require('moment');
const mongoose = require('mongoose');
const BinRequestStatus = require('./bin-request-status');
const Product = require('./product');
const Bin = require('./bin');
const Coupon = require('./coupon');
const Address = require('./address');
const { PAYMENT_TYPE_STRIPE } = require('./payment');
const {
  applyDiscount,
  validateDiscountCode,
  generateBinRequestCode,
} = require('../helpers');
const { round } = require('../../common/helpers');
const { chargeCustomer } = require('../../common/payment');
const { getState } = require('../helpers');
const logger = require('../../common/log');
const EmailHelper = require('../helpers/email');
const ClickUpHelper = require('../helpers/clickup');
const { updateGoogleSheetReportForProducts } = require('../../common/google-sheet-helpers');
const QueueJob = require('../../common/models/queue-job');

const { Schema } = mongoose;

/**
 * Bin request with status Draft is used as a temporary shopping cart
 * Should be excluded when listing bin request
 */
const STATUS_DRAFT = 'Draft';

/**
 * Skip bin has been ordered and has not yet been actioned by handel:
 */
const STATUS_PENDING = 'Pending';

const STATUS_IN_PROGRESS = 'In Progress';
const STATUS_COMPLETED = 'Completed';
const STATUS_CANCELLED = 'Cancelled';

const COURIER_FASTWAY = 'Fastway';
const COURIER_OTHER = 'Other';

const itemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number },
  price: { type: Number },
  total: { type: Number },
  deliveryDate: { type: Date },
}, {
  _id: false,
});

const binRequestSchema = new Schema({
  code: { type: String, unique: true },
  comment: { type: String },

  // bin delivery address
  shippingAddress: { type: String },
  shippingAddressCouncilId: { type: Number },
  shippingAddressDivision: { type: Number },

  // state name of delivery address
  // this field must be updated when `shippingAddress` change
  shippingState: { type: String },

  // list of applied discount codes
  discountCodes: [{ type: String }],

  subTotal: { type: Number },
  discount: { type: Number },
  gst: { type: Number },
  total: { type: Number },
  customer: { type: Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: [
      STATUS_DRAFT,
      STATUS_PENDING,
      STATUS_IN_PROGRESS,
      STATUS_COMPLETED,
      STATUS_CANCELLED,
    ],
  },
  items: [{
    type: itemSchema,
  }],
  bins: [
    { type: Schema.Types.ObjectId, ref: 'Bin' },
  ],
  estDeliveryAt: { type: Date },
  paid: { type: Boolean, default: false },
  paymentType: { type: String, default: PAYMENT_TYPE_STRIPE },
  stripeChargeId: { type: String },
  courier: { type: String, default: COURIER_FASTWAY },
  invoiceCode: { type: String },
  enableNotification: { type: Boolean, default: true },
}, {
  timestamps: true,
  collection: 'binRequests',
});

/**
 * Class contain methods for BinRequest models
 */
class BinRequestClass {
  /**
   * Calculate prices based on current data
   */
  async setPrices() {
    this.applyItemPrice();
    await applyDiscount(this, 'bin');
    this.subTotal = round(this.subTotal, 2);
    this.gst = round(this.gst, 2);
    this.discount = round(this.discount, 2);
    this.total = round(this.total, 2);
  }

  applyItemPrice() {
    const totalProdPrice = this.items.reduce((sum, item) => sum + item.total, 0);
    const subTotal = totalProdPrice / 1.1;
    const gst = totalProdPrice - subTotal;
    this.subTotal = subTotal;
    this.gst = gst;
    this.total = subTotal + gst;
  }

  /**
   * Update bin request's status and add to history
   */
  async updateStatus(status) {
    // status change check
    if (status === this.status) return;

    // add status change history
    const statusHistory = new BinRequestStatus({
      binRequest: this._id,
      status,
    });
    await statusHistory.save();
    logger.info(`Bin request ${this.code} has changed its status to ${status}`);

    // update status
    this.status = status;
    await this.save();
  }

  /**
   * Auto detect bin request's status base on bin's status and update
   */
  async autoSetStatus() {
    const bins = await Bin.find({ binRequest: this._id });
    let status;
    const isInProgress = bins.some(bin => bin.status !== Bin.STATUS_PENDING
      && bin.status !== Bin.STATUS_DELIVERED);
    const isCompleted = bins.every(bin => bin.status === Bin.STATUS_DELIVERED);
    const isCancelled = bins.every(bin => bin.status === Bin.STATUS_CANCELLED);
    if (isInProgress) {
      status = STATUS_IN_PROGRESS;
    } else if (isCompleted) {
      status = STATUS_COMPLETED;
    } else if (isCancelled) {
      status = STATUS_CANCELLED;
    }

    return this.updateStatus(status);
  }

  /**
   * Set delivery address
   */
  async setDeliveryAddress(address) {
    this.shippingAddress = address;
    this.shippingState = await getState(address);
  }

  async publish() {
    const BinRequest = this.constructor;
    await this.populate('customer').execPopulate();
    const { customer } = this;
    this.code = await generateBinRequestCode();
    // handle process for credit card
    if (this.paymentType === PAYMENT_TYPE_STRIPE) {
      // check if user had entered billing information
      const hasPayment = await customer.hasPaymentInfo();
      if (this.total > 0 && !hasPayment) {
        const err = {
          status: 400,
          code: 'no_billing_info',
          message: 'Please update your payment information first.',
        };
        throw err;
      }

      // charge customer
      if (this.total > 0) {
        const total = round(this.total * 100, 0);
        const stripeCustomerId = await customer.getStripeCustomerId();
        const stripeChargeId = await chargeCustomer(
          stripeCustomerId,
          total,
          `Pay for bin request ${this.code}`,
          {
            code: this.code,
            type: 'bin request charge',
          },
        );
        this.stripeChargeId = stripeChargeId;
      }
    }
    this.paid = true;

    // save request
    this.createdAt = new Date();
    this.estDeliveryAt = moment().add(2, 'days').toDate();
    await this.updateStatus(BinRequest.STATUS_PENDING);
    await this.generateBins();
    await this.populate('items.product').execPopulate();
    await this.populate({
      path: 'bins',
      populate: {
        path: 'product',
      }
    }).execPopulate();


    const isTraditionalSkip = this.items.filter(item => item.product.partnerDelivered).length > 0 ? true : false
    const isItemNotTraditionalSkip = this.items.filter(item => !item.product.partnerDelivered).length > 0 ? true : false
    // send notification email to customer
    if (isItemNotTraditionalSkip){
      await EmailHelper.sendNewBinReqEmailToCustomer(customer, this, this.prefix);
    }
    if(isTraditionalSkip){
      await EmailHelper.sendNewBinReqEmailToCustomerTraditional(customer, this, this.prefix);
    }

    // Deduct coupon usage
    if (this.discountCodes) {
      await Promise.all(this.discountCodes.map(async (code) => {
        const coupon = await Coupon.findOne({ code });
        await coupon.deductCoupon();
      }));
    }

    // save customer delivery address for later use
    await Address.findOneAndUpdate({
      user: customer._id,
      type: Address.TYPE_DELIVERY,
      address: this.shippingAddress,
    }, {
      user: customer._id,
      type: Address.TYPE_DELIVERY,
      address: this.shippingAddress,
    }, { upsert: true });
    await ClickUpHelper.notifyNewBinRequest(this);
  }

  async generateBins() {
    const binPromises = [];
    const { customer } = this;
    let prefix = 'standard'
    await Promise.all(this.items.map(async (item) => {
      const product = await Product.findById(item.product);
      if (product.prefix != 'standard') prefix = product.prefix;
      const {
        _id,
        createdAt,
        updatedAt,
        comment,
        status,
        ...data
      } = product.toObject();
      for (let i = 0; i < item.quantity; i += 1) {
        const bin = new Bin({
          ...data,
          code: null,
          productCode: data.code,
          productName: data.name,
          images: product.getImages(),
          customer: customer._id,
          product: product._id,
          binRequest: this._id,
          status: Bin.STATUS_PENDING,
          price: item.price,
          deliveryDate: item.deliveryDate,
        });
        binPromises.push(bin.save());
      }
    }));
    const bins = await Promise.all(binPromises);
    this.bins = bins.map(bin => bin._id);
    this.prefix = prefix;
    return this.save();
  }

  async findCustomerDiscountCode() {
    const now = new Date();
    const User = require('./user');
    const customer = await User.findById(this.customer);
    const org = customer.businessCustomerProfile.organisation;
    if (!org) return null;
    let coupons = await Coupon.find({
      organisation: org,
      status: Coupon.STATUS_ACTIVE,
      dateStart: { $lt: now },
      dateEnd: { $gt: now },
      request: Coupon.REQUEST_TYPE_BIN,
    });
    const flags = await Promise.all(coupons.map(async (coupon) => {
      const error = await validateDiscountCode([coupon.code], { order: this, requestType: 'bin' });
      return error === undefined;
    }));
    coupons = coupons.filter((cp, index) => flags[index]);
    if (coupons.length > 0) {
      logger.info(`apply customer discount code: ${coupons[0].code}`);
      return coupons[0];
    }
    return null;
  }

  async addCustomerDiscount() {
    const coupon = await this.findCustomerDiscountCode();
    if (coupon) {
      const newCodes = [...this.toObject().discountCodes, coupon.code];
      this.discountCodes = newCodes;
    }
  }
}

/**
 * Update to Googlesheet for any changes
 */
binRequestSchema.post('save', async (doc) => {
  // updateGoogleSheetReportForProducts([doc], 'update');
  if (doc.status != STATUS_DRAFT){
    const queueJob = new QueueJob({
      binRequest: doc._id,
      type: QueueJob.TYPE_GG_SHEET_UPDATE,
    });
    queueJob.save();
  }
});

binRequestSchema.loadClass(BinRequestClass);

const BinRequest = mongoose.model('BinRequest', binRequestSchema);

BinRequest.STATUS_DRAFT = STATUS_DRAFT;
BinRequest.STATUS_PENDING = STATUS_PENDING;
BinRequest.STATUS_IN_PROGRESS = STATUS_IN_PROGRESS;
BinRequest.STATUS_COMPLETED = STATUS_COMPLETED;
BinRequest.STATUS_CANCELLED = STATUS_CANCELLED;

BinRequest.COURIER_FASTWAY = COURIER_FASTWAY;
BinRequest.COURIER_OTHER = COURIER_OTHER;

module.exports = BinRequest;
