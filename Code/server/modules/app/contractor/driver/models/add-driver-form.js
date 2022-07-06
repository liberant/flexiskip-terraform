const User = require('../../../models/user');
const validate = require('validate.js');
const {
  validateUniqueEmail,
  validateDateOfIssued,
  validateExpiryDate,
} = require('../../../helpers');
const { parseAddress } = require('../../../../common/shipping');

/**
 * Class responsible for adding driver
 */
class AddDriverForm {
  /**
   * @param {object} contractor contractor model
   */
  constructor(contractor) {
    this.contractor = contractor;
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
    } catch (errors) {
      this.errors = errors;
    }
    return this.errors === undefined;
  }

  async save() {
    if (!await this.validate()) {
      return false;
    }

    const { contractor, data } = this;
    await contractor.populate('contractorProfile.organisation').execPopulate();
    const org = contractor.contractorProfile.organisation;
    const { location } = await parseAddress(org.address);
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
        organisation: contractor.contractorProfile.organisation,
        licence: data.licence,
      },
      contactMethod: User.CONTACT_METHOD_WEB,
    });

    // driver is also a contractor
    if (data.isAdmin) {
      driver.roles.push(User.ROLE_CONTRACTOR);
      driver.firstname = data.firstname;
      driver.lastname = data.lastname;
      driver.phone = data.phone;
      driver.contractorProfile = {
        organisation: contractor.contractorProfile.organisation,
      };
    }

    await driver.save();
    this.driver = driver;
    return true;
  }
}

module.exports = AddDriverForm;
