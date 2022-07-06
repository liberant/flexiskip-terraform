const User = require('../../../models/user');
const validate = require('validate.js');
const {
  removeItem,
  addItem,
} = require('../../../../common/helpers');
const {
  validateDateOfIssued,
  validateExpiryDate,
} = require('../../../helpers');

/**
 * Class responsible for updating driver
 */
class UpdateDriverForm {
  /**
   * @param {object} contractor contractor model
   */
  constructor(driver) {
    this.driver = driver;
    this.data = {};
    this.errors = undefined;
  }

  validateStatusChange(status) {
    const oldStatus = this.driver.status;
    if (oldStatus === User.STATUS_PENDING
      && status === User.STATUS_ACTIVE) {
      return 'is not allowed to change to Active';
    }

    return undefined;
  }

  /**
   * Validate input data submitted by client
   * @param {object} input
   */
  validate() {
    validate.validators.status = this.validateStatusChange.bind(this);
    validate.validators.validateDateOfIssued = validateDateOfIssued;
    validate.validators.validateExpiryDate = validateExpiryDate;
    const constraints = {
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
      status: {
        status: true,
      },
    };
    this.errors = validate(this.data, constraints, { format: 'grouped' });
    return this.errors === undefined;
  }

  async save() {
    if (!await this.validate()) {
      return false;
    }

    const { driver, data } = this;
    driver.avatar = data.avatar;
    driver.firstname = data.firstname;
    driver.lastname = data.lastname;
    driver.phone = data.phone;
    driver.status = data.status;
    driver.driverProfile = {
      ...driver.toObject().driverProfile,
      licence: {
        licenceNo: data.licence.licenceNo,
        licenceClass: data.licence.licenceClass,
        dateOfIssued: data.licence.dateOfIssued,
        expiryDate: data.licence.expiryDate,
        stateOfIssue: data.licence.stateOfIssue,
      },
    };

    const { roles } = driver;
    if (data.isAdmin) {
      addItem(roles, User.ROLE_CONTRACTOR);
      driver.roles = roles;
      driver.firstname = data.firstname;
      driver.lastname = data.lastname;
      driver.phone = data.phone;
      driver.contractorProfile = {
        isPrimary: data.isPrimary || false,
        organisation: driver.driverProfile.organisation,
      };
    } else {
      removeItem(roles, User.ROLE_CONTRACTOR);
      driver.roles = roles;
      driver.contractorProfile = null;
    }

    await driver.save();
    return true;
  }
}

module.exports = UpdateDriverForm;
