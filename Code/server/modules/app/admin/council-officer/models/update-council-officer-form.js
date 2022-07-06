const validate = require('validate.js');
const User = require('../../../models/user');
const { validateUniqueEmail } = require('../../../helpers');
const { getCouncilByAddress } = require('../../../helpers');

/**
 * Class responsible for adding residential customer account
 */
class UpdateCustomerForm {
  /**
   * constructor of the class
   */
  constructor(customer) {
    this.customer = customer;
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
      status: {
        presence: { allowEmpty: false },
        inclusion: {
          within: [
            User.STATUS_ACTIVE,
            User.STATUS_INACTIVE,
            User.STATUS_UNAVAILABLE,
            User.STATUS_SUSPENDED,
            User.STATUS_REMOVED,
            User.STATUS_PENDING,
          ],
          message: 'is not allowed',
        },
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

    const { data, customer } = this;
    customer.avatar = data.avatar;
    customer.firstname = data.firstname;
    customer.lastname = data.lastname;
    customer.phone = data.phone;
    customer.council = data.council;

    await customer.updateStatus(data.status);
    return true;
  }
}

module.exports = UpdateCustomerForm;
