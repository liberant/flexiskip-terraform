const mongoose = require('mongoose');
const Product = require('./product');
const AsyncLock = require('async-lock');
const EmailHelper = require('../helpers/email');
const logger = require('../../common/log');
const moment = require('moment');
const { gcProductIds } = require('../../../config');
const { generateQRCode } = require('../../common/helpers');


const lock = new AsyncLock();

const { Schema } = mongoose;

const binSchema = new Schema({
  name: { type: String },
  code: { type: String, unique: true },
  qrCodeImage: { type: String },
  fastwayLabel: { type: String },
  fastwayEstDays: { type: String },
  productCode: { type: String },
  vendorCode: { type: String },
  type: { type: String },
  price: { type: Number },
  images: [String],
  comment: { type: String },
  wasteType: { type: String },
  size: {
    width: { type: Number },
    height: { type: Number },
    length: { type: Number },
  },
  postageSize: {
    width: { type: Number },
    height: { type: Number },
    length: { type: Number },
  },
  weight: { type: Number },
  weightAllowance: { type: Number },
  collectedWeight: { type: Number },
  materialsAllowance: [String],
  collectionRequest: { type: Schema.Types.ObjectId, ref: 'CollectionRequest' },
  binRequest: { type: Schema.Types.ObjectId, ref: 'BinRequest' },
  product: { type: Schema.Types.ObjectId, ref: 'Product' },
  customer: { type: Schema.Types.ObjectId, ref: 'User' },

  // bin already charged for GCC violation if expired
  chargedGCCViolationFeeAt: { type: Date },
  sentGCCViolationFeeReminderAt: { type: Date },

  // for partner delivery product
  deliveryDate: { type: Date },

  // delivery status (when making bin request)
  status: { type: String },

  // collection status (when making collection request)
  collectionStatus: { type: String },

  // reason why driver refuse to collect this bin
  reason: { type: String },

  // last time collection status is updated
  statusUpdatedAt: { type: Date, default: null },

  // time when delivery status is changed to Ready
  dispatchedAt: { type: Date },

  // time when collection status is changed to Collected
  collectedAt: { type: Date },

  // time when collection status is changed to Completed
  droppedAt: { type: Date },
}, { timestamps: true });

/**
 * Generate bin's short id for new record
 */
binSchema.pre('save', async function preValidate(next) {
  const { generateBinCode } = require('../helpers');
  try {
    if (this.code) {
      return next();
    }
    this.code = await generateBinCode(this);

    if (this.deliveryDate){ // Traditional skip don't require printing to generate qrCodeImage
        this.qrCodeImage = await generateQRCode(this.code);
    }

    return next();
  } catch (err) {
    return next(err);
  }
});

/**
 * Class contain methods for Bin models
 */
class BinClass {
  /**
   * Update bin's status (for collection workflow)
   * @param {String} status
   */
  async updateCollectionStatus(status) {
    // perform old status check
    if (status === this.collectionStatus) {
      return;
    }

    const Bin = this.constructor;
    if (status === Bin.STATUS_COLLECTED) {
      this.collectedAt = new Date();
    } else if (status === Bin.STATUS_COMPLETED) {
      this.disposedAt = new Date();
    }

    this.collectionStatus = status;
    this.statusUpdatedAt = new Date();
    await this.save();
  }

  /**
   * Update bin's status (for bin request workflow)
   * @param {String} status
   */
  async updateDeliveryStatus(status) {
    if (status === this.status) return;
    await lock.acquire('handleBinStatusChange', () => this.handleStatusChange(status));
  }

  async handleStatusChange(status) {
    const Bin = this.constructor;
    // update status
    logger.info(`Bin ${this.code} is changing its delivery status from ${this.status} to ${status}`);
    this.status = status;
    if (this.status === Bin.STATUS_READY) {
      this.dispatchedAt = new Date();
    }
    await this.save();

    // update status of bin request base on each bins in the request
    await this.populate('binRequest').populate('product').execPopulate();
    const { binRequest } = this;
    await binRequest.autoSetStatus();

    // handle status change
    if (this.status === Bin.STATUS_DISPATCHED) {
      // deduct stock when dispatched to client
      const product = await Product.findById(this.product);
      if (product) {
        product.quantity -= 1;
        if (product.quantity < 1) {
          product.status = Product.STATUS_OUT_OF_STOCK;
        }
        await product.save();
      }
    } else if (this.status === Bin.STATUS_DELIVERED) {
      // update collection status to enable making collection request
      await this.updateCollectionStatus(Bin.STATUS_NEW);
    }

    // send notification
    const bins = await Bin.find({ binRequest: binRequest._id });
    const allReady = bins.every(bin => bin.status === Bin.STATUS_READY);
    const allDispatched = bins.every(bin => bin.status === Bin.STATUS_DISPATCHED);
    const allDelivered = bins.every(bin => bin.status === Bin.STATUS_DELIVERED);
    const {
      sendBinDispatchedNotifToCustomer,
      sendBinDeliveredNotifToCustomer,
      sendBinReadyNotifToCustomer,
    } = require('../helpers');
    if (allReady) {
      await sendBinReadyNotifToCustomer(binRequest);
    } else if (allDispatched) {
      await sendBinDispatchedNotifToCustomer(binRequest);
      await EmailHelper.sendBinReqCompletedEmailToCustomer(binRequest, this.product.prefix);
    } else if (allDelivered) {
      await sendBinDeliveredNotifToCustomer(binRequest);
    }
  }

  /**
   * Check if this bin is available for making collection request
   * @returns bool
   */
  isOrderable() {
    const Bin = this.constructor;
    return [Bin.STATUS_NEW, Bin.STATUS_NOT_COLLECTED].includes(this.collectionStatus);
  }

  // // Check if bin is expired and return expired price for GCC product if needed.
  getGCPrice() {
    const Bin = this.constructor;
    const isGCExpired = gcProductIds.includes(this.product._id.toString()) && moment(this.statusUpdatedAt).isSameOrBefore(moment().subtract(30, 'days'));
    return isGCExpired ? 125 : 0;
  }
}

binSchema.loadClass(BinClass);

const Bin = mongoose.model('Bin', binSchema);

/**
 * STATUSES FOR BIN REQUEST FEATURE
 */

/**
 * When a product in an order is requested and no actions have been done yet
 */
Bin.STATUS_PENDING = 'Pending';

/**
 * Product has QR and FastWay labels and is packaged ready for collection
 */
Bin.STATUS_READY = 'Ready';

/**
 * Product has been collected by courier service and is in transit to delivery address
 */
Bin.STATUS_DISPATCHED = 'Dispatched';

/**
 * Product is confirmed as delivered at requested delivery address
 */
Bin.STATUS_DELIVERED = 'Delivered';

/**
 * Product is not going to be dispatched to customer or product has been returned by customer
 */
Bin.STATUS_CANCELLED = 'Cancelled';


/**
 * STATUSES FOR COLLECTION REQUEST FEATURE
 */

Bin.STATUS_NEW = 'New'; // bin is new and don't belong to any collection request
Bin.STATUS_REQUESTED = 'Requested'; // a collection request is made and waiting for driver to accept
Bin.STATUS_ACCEPTED = 'Accepted'; // driver confirmed
Bin.STATUS_COLLECTED = 'Collected'; // collected by driver
Bin.STATUS_NOT_COLLECTED = 'Not Collected'; // driver refuse to collect
Bin.STATUS_COMPLETED = 'Completed'; // driver delivered bin at dump site successfully

module.exports = Bin;
