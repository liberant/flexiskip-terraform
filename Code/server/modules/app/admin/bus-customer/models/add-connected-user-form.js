const validate = require('validate.js');
const User = require('../../../models/user');
const Organisation = require('../../../models/organisation');
const { validateUniqueEmail, getCouncilByAddress } = require('../../../helpers');
const EmailHelper = require('../../../helpers/email');

/**
 * Class responsible for adding residential customer account
 */
class AddConnectedUserForm {
  /**
   * constructor of the class
   */
  constructor() {
    this.data = {};
    this.errors = undefined;
  }

  async validateOrganisation(orgId) {
    const organisation = await Organisation.findById(orgId);
    if (!organisation) {
      return Promise.resolve('is not existed.');
    }

    this.organisation = organisation;
    return Promise.resolve();
  }

  /**
   * Validate input data submitted by client
   */
  async validate() {
    validate.Promise = global.Promise;
    validate.validators.unique = validateUniqueEmail;
    validate.validators.validateOrganisation = this.validateOrganisation.bind(this);
    const constraints = {
      orgId: {
        validateOrganisation: { allowEmpty: true },
      },
      email: {
        presence: true,
        email: true,
        unique: true,
      },
      firstname: {
        presence: {
          allowEmpty: false,
        },
      },
      lastname: {
        presence: {
          allowEmpty: false,
        },
      },
      phone: {
        presence: { allowEmpty: false },
        length: { is: 10 },
      },
    };

    try {
      await validate.async(this.data, constraints, {
        format: 'grouped',
      });
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

    // update user's council after changing address
    const council = await getCouncilByAddress(this.organisation.address);

    const { data } = this;
    const customer = new User({
      email: data.email,
      status: User.STATUS_ACTIVE,
      roles: User.ROLE_BUS_CUSTOMER,
      firstname: data.firstname,
      lastname: data.lastname,
      phone: data.phone,
      businessCustomerProfile: {
        isPrimary: false,
        organisation: this.organisation._id,
        position: data.position,
      },
      council: council ? council._id : undefined,
    });

    await customer.save();
    await EmailHelper.sendWelcomeEmailToBusinessCustomer(customer);
    this.customer = customer;
    return true;
  }
}

module.exports = AddConnectedUserForm;
