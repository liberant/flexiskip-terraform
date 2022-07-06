const validate = require('validate.js');
const User = require('../../../models/user');
const { validateUniqueEmail } = require('../../../helpers');
const { createCustomer } = require('../../../../common/payment');
const EmailHelper = require('../../../helpers/email');

/**
 * Class responsible for adding residential customer account
 */
class AddCouncilOfficerForm {
  /**
   * constructor of the class
   */
  constructor() {
    this.data = {};
    this.errors = undefined;
  }

  /**
   * Validate input data submitted by client
   */
  async validate() {
    validate.Promise = global.Promise;
    validate.validators.unique = validateUniqueEmail;
    const constraints = {
      email: {
        presence: true,
        email: true,
        unique: true,
      },
      firstname: {
        presence: { allowEmpty: false },
      },
      lastname: {
        presence: { allowEmpty: false },
      },
      phone: {
        presence: { allowEmpty: false },
        length: { is: 10 },
      },
      council: {
        presence: { allowEmpty: false },
      },
    };

    try {
      await validate.async(this.data, constraints, { format: 'grouped' });
    } catch (errors) {
      this.errors = errors;
    }
    return this.errors === undefined;
  }

  /**
   * Save registration data
   */
  async save() {
    if (!await this.validate()) {
      return false;
    }

    const { data } = this;
    const customer = new User({
      email: data.email,
      avatar: data.avatar,
      council: data.council,
      status: User.STATUS_ACTIVE,
      roles: User.ROLE_COUNCIL_OFFICER,
      firstname: data.firstname,
      lastname: data.lastname,
      phone: data.phone,
    });
    await customer.save();
    await EmailHelper.sendWelcomeEmailToCouncilOfficer(customer);
    this.customer = customer;
    return true;
  }
}

module.exports = AddCouncilOfficerForm;
