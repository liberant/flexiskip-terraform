const validate = require('validate.js');
const User = require('../../../models/user');
const { validateAddress, validateUniqueEmail } = require('../../../helpers');
const { createCustomer } = require('../../../../common/payment');
const { getCouncilByAddress } = require('../../../helpers');
const EmailHelper = require('../../../helpers/email');

/**
 * Class responsible for adding residential customer account
 */
class AddCustomerForm {
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
    validate.validators.address = validateAddress;
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
      address: {
        presence: { allowEmpty: false },
        address: true,
      },
      prefix: {
        presence: { allowEmpty: false },
      }
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
    const stripeCustomer = await createCustomer(data.email.toLowerCase());
    const council = await getCouncilByAddress(data.address);
    const customer = new User({
      email: data.email,
      avatar: data.avatar,
      council: council ? council._id : undefined,
      status: User.STATUS_ACTIVE,
      roles: User.ROLE_RES_CUSTOMER,
      firstname: data.firstname,
      lastname: data.lastname,
      phone: data.phone,
      prefix: data.prefix,
      residentialCustomerProfile: {
        address: data.address,
        payment: {
          stripeCustomerId: stripeCustomer.id,
          cardLast4Digits: '',
        },
      },
    });
    await customer.save();
    await EmailHelper.sendWelcomeEmailToResidentialCustomer(customer);
    this.customer = customer;
    return true;
  }
}

module.exports = AddCustomerForm;
