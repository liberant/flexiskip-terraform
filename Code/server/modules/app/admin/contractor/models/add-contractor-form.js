const validate = require('validate.js');
const User = require('../../../models/user');
const Organisation = require('../../../models/organisation');
const { validateAddress, validateUniqueEmail } = require('../../../helpers');
const { createCustomer } = require('../../../../common/payment');
const { parseAddress } = require('../../../../common/shipping');
const EmailHelper = require('../../../helpers/email');

/**
 * Class responsible for adding contractor account
 */
class AddContractorForm {
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
      'company.abn': {
        presence: { allowEmpty: false },
      },
      'company.name': {
        presence: { allowEmpty: false },
      },
      'company.address': {
        presence: { allowEmpty: false },
        address: true,
      },
      'company.email': {
        email: true,
      },
      'contact.firstname': {
        presence: { allowEmpty: false },
      },
      'contact.lastname': {
        presence: { allowEmpty: false },
      },
      'contact.phone': {
        presence: { allowEmpty: false },
        length: { is: 10 },
      },
      'contact.email': {
        presence: { allowEmpty: false },
        email: true,
        unique: { message: '^Email is not available' },
      },
    };

    try {
      await validate.async(this.data, constraints, { format: 'grouped' });
    } catch (errors) {
      this.errors = errors;
    }
    return this.errors === undefined;
  }

  async saveOrganisation() {
    const { data } = this;

    // save payment info
    const payment = {
      stripeCustomerId: '',
      cardLast4Digits: '',
      cardBrand: '',
    };

    const customer = await createCustomer(data.company.email, data.company.name);
    payment.stripeCustomerId = customer.id;

    // save model
    const org = new Organisation({
      ...data.company,
      contact: data.contact,
      payment,
    });
    await org.save();
    return org;
  }

  /**
   * Save contractor account
   * @param {Object} org
   */
  async savePrimaryContact(org) {
    const { data } = this;
    const user = new User({
      email: data.contact.email,
      avatar: data.avatar,
      status: User.STATUS_ACTIVE,
      roles: User.ROLE_CONTRACTOR,
      firstname: data.contact.firstname,
      lastname: data.contact.lastname,
      phone: data.contact.phone,
      contractorProfile: {
        ...data.contact,
        isPrimary: true,
        organisation: org._id,
        position: data.position,
      },
      contactMethod: User.CONTACT_METHOD_ADMIN,
    });

    // if user is also a driver, set the status of the account as Pending and wait for Admin approval before sending Welcome email.
    if (data.isDriver) {
      const { location } = await parseAddress(org.address);
      user.location.coordinates = [location.lng, location.lat];
      user.roles = [User.ROLE_CONTRACTOR, User.ROLE_DRIVER];
      user.status = User.STATUS_PENDING;

      user.driverProfile = {
        organisation: org._id,
      };
    } else { // This account is a pure contractor, then send welcome email immediately
      await EmailHelper.sendWelcomeEmailToContractor(user);
    }
    await user.save();
    return user;
  }

  /**
   * Save registration data
   */
  async save() {
    if (!await this.validate()) {
      return false;
    }

    const org = await this.saveOrganisation();
    const contractor = await this.savePrimaryContact(org);
    contractor.contractorProfile.organisation = org;
    this.contractor = contractor;
    return true;
  }
}

module.exports = AddContractorForm;
