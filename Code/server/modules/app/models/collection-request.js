const mongoose = require('mongoose');
const ms = require('ms');
const moment = require('moment');
const { PAYMENT_TYPE_STRIPE } = require('./payment');
const Coupon = require('./coupon');
const config = require('../../../config');
const logger = require('../../common/log');
const { parseAddress } = require('../../common/shipping');
const { round, arrayIncludesArray } = require('../../common/helpers');
const CollectionRequestStatus = require('./collection-request-status');
const QueueJob = require('../../common/models/queue-job');

const _ = require('lodash');

const { Schema } = mongoose;

const STATUS_DRAFT = 'Draft';
const STATUS_REQUESTED = 'Requested';
const STATUS_ACCEPTED = 'Accepted';
const STATUS_IN_PROGRESS = 'In Progress';
const STATUS_COMPLETED = 'Completed';
const STATUS_CANCELLED = 'Cancelled';
const STATUS_NOT_COMPLETED = 'Not Completed';
const STATUS_FUTILED = 'Futiled';

const itemSchema = new Schema(
  {
    bin: { type: Schema.Types.ObjectId, ref: 'Bin' },
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    total: { type: Number },
    quantity: { type: Number },
    price: { type: Number },

    // collection status of bin in this collection request
    binStatus: { type: String },
  },
  { _id: false },
);

const colReqSchema = new Schema(
  {
    // collection request id
    code: { type: String, unique: true },
    comment: { type: String },
    rating: { type: Number },

    // applied discount codes
    discountCodes: [{ type: String }],

    subTotal: { type: Number },
    discount: { type: Number },
    gst: { type: Number },
    total: { type: Number },

    additionalChargePaymentIntentId: { type: String },

    // collection request's status
    status: {
      type: String,
      enum: [
        STATUS_DRAFT,
        STATUS_REQUESTED,
        STATUS_ACCEPTED,
        STATUS_IN_PROGRESS,
        STATUS_COMPLETED,
        STATUS_CANCELLED,
        STATUS_NOT_COMPLETED,
        STATUS_FUTILED,
      ],
    },

    // purchased items
    items: [{ type: itemSchema }],

    // address where bins are collected
    collectionAddress: { type: String },
    // collectionAddressCouncilId: { type: Number },
    // collectionAddressDivision: { type: Number },

    // state where bins are collected
    // added for querying
    // must be synced when `collectionAddress` change
    collectionState: { type: String },
    collectionSuburb: { type: String },

    // coordinate of collection address
    collectionLocation: {
      type: {
        type: String,
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },

    // dumpsite name
    disposalSite: { type: String, default: '' },

    // dumpsite address
    disposalAddress: { type: String, default: '' },

    // coordinate of disposal address
    disposalLocation: {
      type: {
        type: String,
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },

    // customer that make collection request
    customer: { type: Schema.Types.ObjectId, ref: 'User' },

    // driver that handle this request
    driver: { type: Schema.Types.ObjectId, ref: 'User', default: null },

    // the contractor organisation of driver
    // added for querying
    contractorOrganisation: {
      type: Schema.Types.ObjectId,
      ref: 'Organisation',
      default: null,
    },

    // whether this request is paid by customer
    paid: { type: Boolean, default: false },

    // type of payment, should be `stripe`
    paymentType: { type: String, default: PAYMENT_TYPE_STRIPE },

    // stripe unique code for making charge
    stripeChargeId: { type: String },

    // expected collection date
    collectBy: { type: Date, default: null },

    // time when collection process is accepted
    acceptedAt: { type: Date },

    // time when status is changed to In progress
    // when the first bin is processed (collect or not collected)
    collectedAt: { type: Date, default: null },

    // time when status is changed to Completed
    // the status change is triggered by an api call
    disposedAt: { type: Date },
    invoiceCode: { type: String },
  },
  {
    timestamps: true,
    collection: 'collectionRequests',
  },
);

colReqSchema.index({ collectionLocation: '2dsphere' });

/**
 * Class contain methods for CollectionRequest models
 */
class CollectionRequestClass {
  /**
   * Calculate prices based on current data
   */
  async setPrices() {
    this.applyItemPrice();
    await require('../helpers').applyDiscount(this, 'collection');
    this.subTotal = round(this.subTotal, 2);
    this.gst = round(this.gst, 2);
    this.discount = round(this.discount, 2);
    this.total = round(this.total, 2);
  }

  async setRatingData(rateNumber, comment) {
    this.rating = rateNumber;
    this.comment = comment;
    this.save();
  }

  async calculateAndSetPrices(amount) {
    this.applyItemPrice();
    await require('../helpers').applyDiscount(this, 'collection');
    const total = _.round(amount / 100, 2);
    const subTotal = _.round(total / 1.1, 2);
    const gst = _.round(total - subTotal, 2);

    this.subTotal = subTotal;
    this.gst = gst;
    this.discount = round(this.discount, 2);
    this.total = total;
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
   * Update bin request's status and add status change history
   */
  updateStatus(status) {
    const CollectionRequest = this.constructor;
    if (status === this.status) {
      return this;
    }

    switch (status) {
      case CollectionRequest.STATUS_ACCEPTED:
        this.acceptedAt = new Date();
        break;

      case CollectionRequest.STATUS_IN_PROGRESS:
        this.collectedAt = new Date();
        break;

      case CollectionRequest.STATUS_COMPLETED:
        this.disposedAt = new Date();
        break;

      case CollectionRequest.STATUS_FUTILED:
        this.collectedAt = new Date();
        break;

      default:
        break;
    }

    const sh = new CollectionRequestStatus({
      collectionRequest: this._id,
      status,
    });
    this.status = status;
    return Promise.all([sh.save(), this.save()]);
  }

  /**
   * Find drivers that can handle this request
   */
  async findDriversForCollection(shouldApplyFilter) {
    const User = require('./user');
    const CollectionRequest = this.constructor;

    // filter drivers by status, location
    const { location: { lat, lng } } = await parseAddress(this.collectionAddress);
    const query = {
      roles: User.ROLE_DRIVER,
    };

    if (shouldApplyFilter) {
      query.status = User.STATUS_ACTIVE;
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          $maxDistance: config.maximumDistance,
          $minDistance: 0,
        },
      };
    }

    let drivers = await User.find(query);

    // filter drivers with number of accepted collection requests < 3
    if (shouldApplyFilter) {
      let flags = await Promise.all(drivers.map(async (driver) => {
        const noColReq = await CollectionRequest.countDocuments({
          driver: driver._id,
          status: CollectionRequest.STATUS_ACCEPTED,
        });
        return noColReq < config.limitJob;
      }));
      drivers = drivers.filter((driver, index) => flags[index]);

      // filter drivers that have ability to carry this collection request
      flags = await Promise.all(drivers.map(driver => driver.canAcceptJob(this)));
      drivers = drivers.filter((driver, index) => flags[index]);
    }

    return drivers;
  }

  async broadcastColReqToDrivers() {
    logger.info(`Broadcasting collection request ${this.code}`);
    const CollectionRequest = this.constructor;

    // exit if collection request is not applicable
    const newReq = await CollectionRequest.findOne({
      _id: this._id,
      collectBy: { $gt: new Date() },
      status: CollectionRequest.STATUS_REQUESTED,
    });
    if (!newReq) {
      logger.warn('Collection request\'s status changed or expired. Stop broadcasting.');
      return;
    }

    // if request is not accepted over a period of time, notify handel admin
    // const COLLECTION_REQUEST_TIMEOUT = ms('6h'); // 6 hours
    // const diffInMls = getTimeDiff(new Date(), this.createdAt);
    // if (diffInMls >= COLLECTION_REQUEST_TIMEOUT) {
    //   logger.info('Collection request timeout. Send notification to handel admin');
    //   return;
    // }

    // Find drivers that can handle this request
    const drivers = await this.findDriversForCollection(true);

    // send push notification to filtered drivers
    drivers.forEach((driver) => {
      logger.info(`Send notification to driver ${driver.uId} about Requested collection request ${this.code}`);
      require('../helpers').sendFCMToDriver(
        driver.fcmToken,
        'A collection request is awaiting for your acceptance',
        `New request ${this.code} has been made by a customer. You can click this message to view this request detail`,
        { id: this._id, type: 'collection_created' },
      );
    });

    // check this request again after a period of time
    setTimeout(() => this.broadcastColReqToDrivers(), ms(config.broadcastInterval));
  }

  /**
   * Get list of waste types of all bins in the request
   * @returns array
   */
  async getWasteTypes() {
    await this.populate('items.bin').execPopulate();
    const wasteTypes = this.items.map(item => item.bin.wasteType);
    return Array.isArray(wasteTypes) ? wasteTypes : [];
  }

  async toClientObject() {
    await this
      .populate('items.bin')
      .populate('customer')
      .execPopulate();
    if (this.customer && !this.customer.firstname) this.customer.firstname = 'BlankFirst';
    if (this.customer && !this.customer.lastname) this.customer.lastname = 'BlankLast';
    if (this.customer && !this.customer.fullname) this.customer.fullname = 'BlankFullName';
    if (this.customer && !this.customer.phone) this.customer.phone = '0400 000 000';
    const data = this.toObject();

    // get customer information
    const {
      _id, email, firstname, lastname, rating, uId, avatar, phone, roles,
    } = await this.customer.toObject();
    data.customer = {
      _id, email, firstname, lastname, rating, uId, avatar, phone, roles,
    };

    // get location
    data.collectionLocation = {
      longitude: this.collectionLocation.coordinates[0],
      latitude: this.collectionLocation.coordinates[1],
    };

    data.disposalLocation = {
      longitude: this.disposalLocation.coordinates[0],
      latitude: this.disposalLocation.coordinates[1],
    };

    data.items = data.items.map(item => ({
      ...item,
      bin: {
        ...item.bin,
        collectionStatus: item.binStatus,
      },
    }));
    return data;
  }

  /**
   * Set collection address
   */
  async setCollectionAddress(address) {
    this.collectionAddress = address;
    const { state, suburb } = await parseAddress(address);
    // this.collectionState = await getState(address);
    this.collectionState = state;
    this.collectionSuburb = suburb;
  }

  /**
   * Get materials of products in this collection request
   */
  getMaterials() {
    let arr = this.toObject().items.map(item => item.bin.wasteType);
    arr = [...new Set(arr)];
    return arr;
  }

  /**
   * Update disposal address with the dumpsite's address
   * closest to a specific location
   * @param {number} lat
   * @param {number} lng
   */
  async updateDisposalAddress(lat, lng) {
    const Dumpsite = require('./dumpsite');
    // execute database query and get the cursor
    // for fetching data. using cursor because we don't
    // want to fetch all records in database at once
    const cursor = Dumpsite.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
        },
      },
    }).cursor();

    // while fetching each individual record, we want to
    // apply some business logic to filter data, this process
    // is finished when we get enough data
    const fetchData = () => new Promise((resolve) => {
      const fetchRecord = async () => {
        const dumpsite = await cursor.next();
        if (dumpsite) {
          // apply some business logic checking to filter data
          const dumpsiteMaterials = dumpsite.getMaterials();
          const reqMaterials = this.getMaterials();
          const match = arrayIncludesArray(dumpsiteMaterials, reqMaterials);
          if (match) {
            resolve(dumpsite);
          } else {
            fetchRecord();
          }
        } else {
          resolve(null);
        }
      };
      fetchRecord();
    });
    const dumpsite = await fetchData();
    if (!dumpsite) {
      throw new Error('No dumpsites match with this request.');
    }
    this.disposalAddress = dumpsite.address;
    this.disposalLocation = dumpsite.location;
    return this.save();
  }

  isExpiredAcception() {
    const CollectionRequest = this.constructor;
    if (this.status === CollectionRequest.STATUS_ACCEPTED) {
      const acceptedTime = moment(this.acceptedAt);
      const currentTime = moment();
      const hrsDuration = moment.duration(currentTime.diff(acceptedTime)).asMilliseconds();
      if (hrsDuration > config.collectionProcessLifeTime) {
        return true;
      }
      return false;
    }
    return false;
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
      request: Coupon.REQUEST_TYPE_COLLECTION,
    });
    const flags = await Promise.all(coupons.map(async (coupon) => {
      const error = await require('../helpers').validateDiscountCode(
        [coupon.code],
        { order: this, requestType: 'bin' },
      );
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
colReqSchema.post('save', async (doc) => {
  // updateGoogleSheetReportForCollectionRequest([doc], 'update');
  if (doc.status !== STATUS_DRAFT) {
    const queueJob = new QueueJob({
      collectionRequest: doc._id,
      type: QueueJob.TYPE_GG_SHEET_UPDATE,
    });
    queueJob.save();
  }
});

colReqSchema.loadClass(CollectionRequestClass);

const CollectionRequest = mongoose.model('CollectionRequest', colReqSchema);

CollectionRequest.STATUS_DRAFT = STATUS_DRAFT;
CollectionRequest.STATUS_REQUESTED = STATUS_REQUESTED;
CollectionRequest.STATUS_ACCEPTED = STATUS_ACCEPTED;
CollectionRequest.STATUS_IN_PROGRESS = STATUS_IN_PROGRESS;
CollectionRequest.STATUS_COMPLETED = STATUS_COMPLETED;
CollectionRequest.STATUS_NOT_COMPLETED = STATUS_NOT_COMPLETED;
CollectionRequest.STATUS_CANCELLED = STATUS_CANCELLED;
CollectionRequest.STATUS_FUTILED = STATUS_FUTILED;

module.exports = CollectionRequest;
