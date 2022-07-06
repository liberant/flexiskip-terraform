const validate = require('validate.js');

const User = require('../../../models/user');
const Organisation = require('../../../models/organisation');
const { parseAddress } = require('../../../../common/shipping');
const { validateUniqueEmail } = require('../../../helpers');
const EmailHelper = require('../../../helpers/email');
const {
  validateDateOfIssued,
  validateExpiryDate,
} = require('../../../helpers');

/**
 * Class responsible for adding driver
 */
class AddDriverForm {
  constructor() {
    this.data = {};
    this.errors = undefined;
  }

  /**
   * Validate input data submitted by client
   * @param {object} input
   */
  async validate() {
    validate.Promise = global.Promise;
    validate.validators.unique = validateUniqueEmail;
    validate.validators.organisation = async (id) => {
      if (!id) {
        return Promise.resolve("can't be blank");
      }

      const org = await Organisation.findById(id);
      return org
        ? Promise.resolve()
        : Promise.resolve('not found');
    };
    validate.validators.validateDateOfIssued = validateDateOfIssued;
    validate.validators.validateExpiryDate = validateExpiryDate;

    const constraints = {
      email: {
        presence: true,
        email: true,
        unique: true,
      },
      firstname: {
        presence: true,
      },
      lastname: {
        presence: true,
      },
      phone: {
        presence: true,
      },
      organisation: {
        presence: true,
        organisation: true,
      },
      'licence.licenceNo': {
        presence: true,
      },
      'licence.licenceClass': {
        presence: true,
      },
      'licence.dateOfIssued': {
        presence: true,
        validateDateOfIssued: true,
      },
      'licence.expiryDate': {
        presence: true,
        validateExpiryDate: true,
      },
      'licence.stateOfIssue': {
        presence: true,
      },
    };
    try {
      await validate.async(this.data, constraints, { format: 'grouped' });
      this.organisation = await Organisation.findById(this.data.organisation);
    } catch (errors) {
      this.errors = errors;
    }
    return this.errors === undefined;
  }

  async save() {
    if (!await this.validate()) {
      return false;
    }

    const { organisation, data } = this;
    const { location } = await parseAddress(organisation.address);
    // save new driver account
    const driver = new User({
      email: data.email,
      status: User.STATUS_PENDING,
      avatar: data.avatar,
      roles: User.ROLE_DRIVER,
      firstname: data.firstname,
      lastname: data.lastname,
      phone: data.phone,
      'location.coordinates': [location.lng, location.lat],
      driverProfile: {
        organisation: organisation._id,
        licence: data.licence,
      },
      contactMethod: User.CONTACT_METHOD_ADMIN,
    });

    // driver is also a contractor
    if (data.isAdmin) {
      driver.roles.push(User.ROLE_CONTRACTOR);
      driver.firstname = data.firstname;
      driver.lastname = data.lastname;
      driver.phone = data.phone;
      driver.contractorProfile = {
        organisation: organisation._id,
      };
    }

    await driver.save();
    if (driver.status === User.STATUS_ACTIVE) { await EmailHelper.sendWelcomeEmailToDriver(driver); }
    this.driver = driver;
    return true;
  }
}

module.exports = AddDriverForm;
