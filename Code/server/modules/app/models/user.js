const mongoose = require('mongoose');
const config = require('../../../config');
const {
  encryptPassword,
  verifyPassword,
  verifyCouncil,
  verifyPostalCode,
  createToken,
  arrayIncludesArray,
} = require('../../common/helpers');
const { generateUserCode, sendJobAcceptedNotifToCustomer } = require('../helpers');
const Council = require('./council');
const Vehicle = require('./vehicle');
const Permission = require('./permission');
const CollectionRequest = require('./collection-request');

// available user roles
const ROLE_ADMIN = 'admin';
const ROLE_RES_CUSTOMER = 'residentialCustomer';
const ROLE_BUS_CUSTOMER = 'businessCustomer';
const ROLE_CONTRACTOR = 'contractor';
const ROLE_DRIVER = 'driver';
const ROLE_COUNCIL_OFFICER = 'councilOfficer';


/**
 * Available user statuses
 */

/**
 * Account is create but pending for approbation from admin
 */
const STATUS_PENDING = 'Pending';

/**
 * Account is available for use
 */
const STATUS_ACTIVE = 'Active';

/**
 * Account is rejected by admin
 */
const STATUS_REJECTED = 'Rejected';

/**
 * Account is disabled by user themselves
 */
const STATUS_INACTIVE = 'Inactive';

/**
 * Account is disabled by admin
 */
const STATUS_SUSPENDED = 'Suspended';

/**
 * Status for driver
 * Can login but is not able to receive any collection request or start job
 */
const STATUS_UNAVAILABLE = 'Unavailable';

/**
 * Account is removed by soft delete
 */
const STATUS_REMOVED = 'Removed';


/**
 * Contact method
 */
const CONTACT_METHOD_APP = 'App';
const CONTACT_METHOD_WEB = 'Web';
const CONTACT_METHOD_ADMIN = 'Admin';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String },
    avatar: { type: String, default: null },
    firstname: { type: String },
    lastname: { type: String },

    // combination field between first name and last name for searching
    fullname: { type: String },
    phone: { type: String },
    deletedAt: { type: Date, default: null },

    // social data
    socialId: { type: String, default: null },
    socialType: { type: String, default: null },


    // prefix for email template
    prefix: { type: String, default: 'standard' },

    // user's status
    status: {
      type: String,
      required: true,
      enum: [
        STATUS_PENDING,
        STATUS_ACTIVE,
        STATUS_INACTIVE,
        STATUS_SUSPENDED,
        STATUS_UNAVAILABLE,
        STATUS_REMOVED,
        STATUS_REJECTED,
      ],
    },

    // assigned roles/permissions
    roles: [
      {
        type: String,
        required: true,
      },
    ],

    // short user id
    uId: { type: String, unique: true },

    // firebase cloud message token for push nottification
    fcmToken: { type: String },

    // id of the council customer belong to
    council: { type: Schema.Types.ObjectId, ref: 'Council' },

    // customer/driver rating 0 -> 5
    rating: { type: Number, default: 0 },

    location: {
      type: {
        type: String,
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    residentialCustomerProfile: {
      address: { type: String },
      receiveInvoiceEmail: { type: Boolean },
      payment: {
        stripeCustomerId: { type: String },
        cardLast4Digits: { type: String },
      },
    },
    businessCustomerProfile: {
      position: { type: String },
      isPrimary: { type: Boolean },
      receiveInvoiceEmail: { type: Boolean },
      organisation: { type: Schema.Types.ObjectId, ref: 'Organisation' },
    },
    contractorProfile: {
      position: { type: String },
      isPrimary: { type: Boolean },
      organisation: { type: Schema.Types.ObjectId, ref: 'Organisation' },
    },
    driverProfile: {
      dob: { type: String },
      vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
      organisation: { type: Schema.Types.ObjectId, ref: 'Organisation' },
      licence: {
        licenceNo: { type: String },
        licenceClass: { type: String },
        licenceType: { type: String },
        dateOfIssued: { type: Date },
        expiryDate: { type: Date },
        stateOfIssue: { type: String },
      },

      // last time driver accept a job
      lastJobAt: { type: Date },
    },
    adminProfile: {
      address: { type: String },
    },
    contactMethod: {
      type: String,
      enum: [CONTACT_METHOD_APP, CONTACT_METHOD_WEB, CONTACT_METHOD_ADMIN],
    },
  },
  { timestamps: true },
);

userSchema.index({ location: '2dsphere' });

/**
 * Generate user's short id for new record
 */
userSchema.pre('save', async function preValidate(next) {
  try {
    this.fullname = `${(this.firstname || '').trim()} ${(this.lastname || '').trim()}`.trim();
    if (this.email) {
      this.email = this.email.toLowerCase();
    }
    if (!this.uId) {
      this.uId = await generateUserCode(this);
    }
    return next();
  } catch (err) {
    return next(err);
  }
});

/**
 * Class that provide methods for User model
 */
class UserClass {
  /**
   * Check user have permission or not
   *
   * @param {string} permission
   * @returns {boolean}
   */
  can(permission) {
    if (permission === 'customer') {
      return this.roles.includes(ROLE_RES_CUSTOMER) || this.roles.includes(ROLE_BUS_CUSTOMER);
    }
    return this.roles.includes(permission);
  }

  /**
   * Set login password for user
   * @param {String} value
   */
  setPassword(value) {
    this.password = encryptPassword(value);
  }

  /**
   * Check if login password is valid
   * @param {*} value
   * @returns {boolean}
   */
  checkPassword(value) {
    try {
      return verifyPassword(value, this.password);
    } catch (err) {
      return false;
    }
  }

  /**
   * Check the postal code of user if it is served by any council that still active
   * @param {Number} value Postal code value of the Council/ Address.
   * @returns true if the postal code is availble, false if it is not available
   */
  checkAvailablePostalCode(value) {
    try {
      return verifyPostalCode(value);
    } catch (err) {
      return false;
    }
  }

  /**
   * Check the council of user if it is available (Active) or not
   * @param {String} council
   */
  async checkAvailableCouncil() {
    try {
      if (!this.council) return false;
      return (await verifyCouncil(this.council));
    } catch (err) {
      return false;
    }
  }

  /**
   * Generate a token that present this user
   * @param {String} duration
   */
  createToken(duration) {
    return createToken(this._id, duration);
  }

  /**
   * Find all sub permissions from a list of permission names
   * @param {Array} permissions
   */
  async getAllowedPermissions(permissions) {
    let result = [...permissions];
    await Promise.all(permissions.map(async (per) => {
      const item = await Permission.findOne({ name: per });
      if (!item) return;
      const subs = await this.getAllowedPermissions(item.children);
      result = result.concat(subs);
    }));
    return result;
  }

  /**
   * Get user data for returning to client
   * @returns {object}
   */
  async toUserObject() {
    const User = this.constructor;
    let result = {
      _id: this._id,
      uId: this.uId,
      email: this.email,
      firstname: this.firstname,
      lastname: this.lastname,
      phone: this.phone,
      prefix: this.prefix,
      roles: this.roles,
      status: this.status,
      avatar: this.avatar,
      fcmToken: this.fcmToken,
      rating: this.rating,
      council: this.council,
      deletedAt: this.deletedAt,
      createdAt: this.createdAt,
      fullname: this.fullname,
      socialId: this.socialId,
      socialType: this.socialType,
    };
    let additionalsProps = {};

    if (this.can(User.ROLE_RES_CUSTOMER)) {
      additionalsProps = this.toObject().residentialCustomerProfile;
      // remove sensitive information
      if (additionalsProps.payment) {
        delete additionalsProps.payment.stripeCustomerId;
      }

      // add council detail
      const council = await Council.findById(this.council);
      additionalsProps.council =
        council && council.status === 'Active' ?
          council._id : null;
      result = { ...result, ...additionalsProps };
    }

    if (this.can(User.ROLE_BUS_CUSTOMER)) {
      await this.populate('businessCustomerProfile.organisation').execPopulate();
      additionalsProps = this.toObject().businessCustomerProfile;

      // remove sensitive information
      if (additionalsProps.organisation.payment) {
        delete additionalsProps.organisation.payment.stripeCustomerId;
      }

      // get connected users of organisation
      const users = await User.find({
        'businessCustomerProfile.organisation': this.businessCustomerProfile.organisation._id,
        roles: ROLE_BUS_CUSTOMER,
        status: { $ne: STATUS_REMOVED },
      });
      additionalsProps.organisation.users = users.map((u) => {
        const resultBus = {
          _id: u._id,
          email: u.email,
          roles: u.roles,
          status: u.status,
          avatar: u.avatar,
          deletedAt: u.deletedAt,
          firstname: u.firstname,
          lastname: u.lastname,
          phone: u.phone,
          council: u.council,
          ...u.toObject().businessCustomerProfile,
        };
        delete resultBus.organisation;
        return resultBus;
      });

      // add council detail
      const council = await Council.findById(this.council);
      additionalsProps.council =
        council && council.status === 'Active' ?
          council._id : null;

      result = { ...result, ...additionalsProps };
    }

    if (this.can(User.ROLE_CONTRACTOR)) {
      await this.populate('contractorProfile.organisation').execPopulate();
      additionalsProps = this.toObject().contractorProfile;

      // remove sensitive information
      if (additionalsProps.organisation && additionalsProps.organisation.payment) {
        delete additionalsProps.organisation.payment.stripeCustomerId;
      }
      result = { ...result, ...additionalsProps };
    }

    if (this.can(User.ROLE_DRIVER)) {
      await this.populate('driverProfile.vehicle').execPopulate();
      await this.populate('driverProfile.organisation').execPopulate();
      additionalsProps = this.toObject().driverProfile;

      // remove sensitive information
      if (additionalsProps.organisation && additionalsProps.organisation.payment) {
        delete additionalsProps.organisation.payment.stripeCustomerId;
      }
      result = { ...result, ...additionalsProps };
    }

    if (this.can(User.ROLE_ADMIN)) {
      additionalsProps = this.toObject().adminProfile;
      result = { ...result, ...additionalsProps };
    }

    result.roles = await this.getAllowedPermissions(this.roles);
    return result;
  }

  /**
   * Update status
   * @param {String} status
   * @returns {boolean}
   */
  async updateStatus(status) {
    const User = this.constructor;
    // when disable business customer admin,
    // also disable connected users
    const inactiveStatuses = [
      STATUS_INACTIVE,
      STATUS_UNAVAILABLE,
      STATUS_REMOVED,
      STATUS_SUSPENDED,
    ];

    if (this.can(User.ROLE_BUS_CUSTOMER)
      && this.businessCustomerProfile.isPrimary
      && inactiveStatuses.includes(status)) {
      await this.updateBusinessCustomerStatus(status);
    }

    if (this.can(User.ROLE_CONTRACTOR)
      && this.contractorProfile.isPrimary
      && inactiveStatuses.includes(status)) {
      if (status === STATUS_INACTIVE) {
        await this.updateContractorStatus(status);
        await this.updateDriverStatus(status);
        await this.updateVehicleStatus(STATUS_UNAVAILABLE);
      }
    }

    // update status of this user
    this.status = status;
    this.deletedAt = this.status === STATUS_REMOVED ? Date.now() : null;
    await this.save();
    return true;
  }

  /**
   * Update status for business customer
   * @param {string} status
   */
  async updateBusinessCustomerStatus(status) {
    const User = this.constructor;
    // get connected users of organisation
    const users = await User.find({
      'businessCustomerProfile.organisation': this.businessCustomerProfile.organisation,
    });
    await Promise.all(users.map((user) => {
      const u = user;
      u.status = status;
      return u.save();
    }));
    return true;
  }

  /**
   * Update status for driver contractor
   * @param {string} status
   */
  async updateContractorStatus(status) {
    const User = this.constructor;
    const users = await User.find({
      roles: ROLE_CONTRACTOR,
      'contractorProfile.organisation': this.contractorProfile.organisation,
    });
    await Promise.all(users.map((user) => {
      const u = user;
      u.status = status;
      return u.save();
    }));
    return true;
  }

  /**
   * Update status for driver
   * @param {string} status
   */
  async updateDriverStatus(status) {
    const User = this.constructor;
    const users = await User.find({
      roles: ROLE_DRIVER,
      'driverProfile.organisation': this.contractorProfile.organisation,
    });
    await Promise.all(users.map((user) => {
      const u = user;
      u.status = status;
      return u.save();
    }));
    return true;
  }

  /**
   * Update vehicle status
   * @param {string} status
   */
  async updateVehicleStatus(status) {
    const vehicles = await Vehicle.find({
      organisation: this.contractorProfile.organisation,
    });
    await Promise.all(vehicles.map((vehicle) => {
      const v = vehicle;
      v.status = status;
      return v.save();
    }));
    return true;
  }

  // check if customer has filled their credit card (residential + business)
  async hasPaymentInfo() {
    if (this.can(ROLE_RES_CUSTOMER)
      && this.residentialCustomerProfile.payment.cardLast4Digits
    ) {
      return true;
    }

    if (this.can(ROLE_BUS_CUSTOMER)) {
      await this.populate('businessCustomerProfile.organisation').execPopulate();
      if (this.businessCustomerProfile.organisation.payment.cardLast4Digits) {
        return true;
      }
    }

    return false;
  }

  // get stripe customer token for charging (residential + business)
  async getStripeCustomerId() {
    if (this.can(ROLE_RES_CUSTOMER)
      && this.residentialCustomerProfile.payment.stripeCustomerId
    ) {
      return this.residentialCustomerProfile.payment.stripeCustomerId;
    }

    if (this.can(ROLE_BUS_CUSTOMER)) {
      await this.populate('businessCustomerProfile.organisation').execPopulate();
      if (this.businessCustomerProfile.organisation.payment.stripeCustomerId) {
        return this.businessCustomerProfile.organisation.payment.stripeCustomerId;
      }
    }
    return null;
  }

  // get customer address (residential + business)
  async getAddress() {
    if (this.can(ROLE_RES_CUSTOMER)) {
      return this.residentialCustomerProfile.address;
    }

    if (this.can(ROLE_BUS_CUSTOMER)) {
      await this.populate('businessCustomerProfile.organisation')
        .execPopulate();
      return this.businessCustomerProfile.organisation.address;
    }
    return null;
  }

  // get customer type
  async getType() {
    if (this.can(ROLE_BUS_CUSTOMER)) {
      return 'Business';
    }
    return 'Residential';
  }

  /**
   * Driver: Accept a collection request
   * @param {object} colReq
   */
  async acceptJob(colReq) {
    // perform checking and throw exceptions if sth wrong
    if (!await this.canAcceptJob(colReq)) {
      return false;
    }

    // update status of each bins in collection request to accepted
    const Bin = require('./bin');
    const promises = colReq.items.map(async (item) => {
      const { bin } = item;
      bin.collectionStatus = Bin.STATUS_ACCEPTED;
      return bin.save();
    });
    await Promise.all(promises);

    // update collection request status
    colReq.driver = this._id;
    colReq.contractorOrganisation = this.driverProfile.organisation;
    await colReq.updateStatus(CollectionRequest.STATUS_ACCEPTED);

    // send notification to customer
    colReq.driver = this;
    sendJobAcceptedNotifToCustomer(colReq);

    // save the last time driver accept job
    this.driverProfile.lastJobAt = new Date();
    await this.save();

    return true;
  }

  /**
   * Driver: Check if driver can accept a collection request
   * @param {*} colReq
   * @return bool
   */
  async canAcceptJob(colReq) {
    const User = this.constructor;
    if (this.status !== User.STATUS_ACTIVE) {
      return false;
      // throw validationExc('Driver can\'t accept any job until status become Active');
    }

    // Check number of current jobs the driver is carrying
    const MAXIMUM_ACCEPTED_JOBS = config.limitJob;
    const noJobsAccepted = await CollectionRequest.countDocuments({
      driver: this._id,
      status: CollectionRequest.STATUS_ACCEPTED,
    });
    if (noJobsAccepted >= MAXIMUM_ACCEPTED_JOBS) {
      return false;
      // throw validationExc(`Driver can't accept more than ${MAXIMUM_ACCEPTED_JOBS} request`);
    }

    // check if the request was already accepted
    if (colReq.status !== CollectionRequest.STATUS_REQUESTED) {
      return false;
      // throw validationExc('Request was already accepted.', undefined, 'collection_was_accepted');
    }

    // check request waste types
    const driverWasteTypes = await this.getVehicleWasteTypes();
    const reqWasteTypes = await colReq.getWasteTypes();
    if (!arrayIncludesArray(driverWasteTypes, reqWasteTypes)) {
      return false;
      // throw validationExc('Your vehicle is not match', undefined, 'vehicle_not_match');
    }
    return true;
  }

  /**
   * Get list of waste types that driver can collect
   * @returns array
   */
  async getVehicleWasteTypes() {
    const User = this.constructor;
    if (!this.can(User.ROLE_DRIVER)) {
      return [];
    }

    await this.populate('driverProfile.vehicle').execPopulate();
    if (!this.driverProfile.vehicle) {
      return [];
    }

    const { wasteTypes } = this.driverProfile.vehicle;
    return Array.isArray(wasteTypes) ? wasteTypes : [];
  }

  /*
   * Get list of collection requests that driver can collect
   * @deprecated
   */
  async getAvailableColReqs() {
    const MAX_DISTANCE = 50000; // 50km
    const [lng, lat] = this.location.coordinates;
    let requests = await CollectionRequest.find({
      status: CollectionRequest.STATUS_REQUESTED,
      // collectBy: { $gt: new Date() },
      collectionLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          $maxDistance: MAX_DISTANCE,
          $minDistance: 0,
        },
      },
    }).sort({ createdAt: -1 });

    // filter requests that driver can collect
    const flags = await Promise.all(requests.map(request => this.canAcceptJob(request)));
    requests = requests.filter((request, index) => flags[index]);
    return requests;
  }

  /*
   * Get list of accepted collection requests
   * @deprecated
   */
  async getConfirmedColReqs() {
    const requests = await CollectionRequest.find({
      driver: this._id,
      status: {
        $in: [CollectionRequest.STATUS_IN_PROGRESS, CollectionRequest.STATUS_ACCEPTED],
      },
    }).sort({ createdAt: -1 });
    return requests;
  }

  /*
   * Get list of completed collection requests
   * @deprecated
   */
  async getCompletedColReqs() {
    const requests = await CollectionRequest.find({
      driver: this._id,
      status: {
        $in: [CollectionRequest.STATUS_COMPLETED, CollectionRequest.STATUS_CANCELLED],
      },
    }).sort({ disposedAt: -1 });
    return requests;
  }
}

userSchema.loadClass(UserClass);

// define mogoose model
const User = mongoose.model('User', userSchema);

// user's status list
User.STATUS_PENDING = STATUS_PENDING;
User.STATUS_ACTIVE = STATUS_ACTIVE;
User.STATUS_INACTIVE = STATUS_INACTIVE;
User.STATUS_SUSPENDED = STATUS_SUSPENDED;
User.STATUS_UNAVAILABLE = STATUS_UNAVAILABLE;
User.STATUS_REJECTED = STATUS_REJECTED;
User.STATUS_REMOVED = STATUS_REMOVED;

// user's role list
User.ROLE_ADMIN = ROLE_ADMIN;
User.ROLE_RES_CUSTOMER = ROLE_RES_CUSTOMER;
User.ROLE_BUS_CUSTOMER = ROLE_BUS_CUSTOMER;
User.ROLE_CONTRACTOR = ROLE_CONTRACTOR;
User.ROLE_DRIVER = ROLE_DRIVER;
User.ROLE_COUNCIL_OFFICER = ROLE_COUNCIL_OFFICER;

User.CONTACT_METHOD_APP = CONTACT_METHOD_APP;
User.CONTACT_METHOD_WEB = CONTACT_METHOD_WEB;
User.CONTACT_METHOD_ADMIN = CONTACT_METHOD_ADMIN;

module.exports = User;
