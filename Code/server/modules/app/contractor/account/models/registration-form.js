const User = require('../../../models/user');
const Organisation = require('../../../models/organisation');
const Vehicle = require('../../../models/vehicle');
const validate = require('validate.js');
const { passwordStrength } = require('../../../../common/helpers');
const { validateAddress, validateUniqueEmail } = require('../../../helpers');
const EmailHelper = require('../../../helpers/email');
const {
  createCustomer,
  updateCustomerCard,
} = require('../../../../common/payment');

/**
 * Class responsible for processing contractor registration
 */
class RegistrationForm {
  /**
   * constructor of the class
   */
  constructor() {
    this.data = {};
    this.errors = undefined;
  }

  /**
   * Validate vehicle input
   * @param {object} data
   */
  static validateVehicle(data) {
    const constraints = {
      model: {
        presence: { allowEmpty: false },
      },
      compliance: {
        presence: { allowEmpty: false },
      },
      class: {
        presence: { allowEmpty: false },
      },
      regNo: {
        presence: { allowEmpty: false },
      },
    };

    return validate(data, constraints);
  }

  /**
   * Validate input data submitted by client
   */
  async validate() {
    validate.Promise = global.Promise;
    validate.validators.unique = validateUniqueEmail;
    validate.validators.passwordStrength = passwordStrength;
    validate.validators.address = validateAddress;
    validate.validators.validateVehicle = (vehicles) => {
      const errors = vehicles
        .map(data => RegistrationForm.validateVehicle(data))
        .filter(error => !!error);
      return errors;
    };

    const constraints = {
      email: {
        presence: { allowEmpty: false },
        email: true,
        unique: true,
      },
      password: {
        presence: { allowEmpty: false },
        passwordStrength: true,
      },

      'company.abn': {
        presence: { allowEmpty: false },
        length: { is: 11 },
      },
      'company.name': {
        presence: { allowEmpty: false },
      },
      'company.address': {
        presence: { allowEmpty: false },
        address: true,
      },
      'company.phone': {
        presence: { allowEmpty: false },
        length: { is: 10 },
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
      },

      vehicles: {
        validateVehicle: true,
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
    let customer = await createCustomer(data.company.email.toLowerCase(), data.company.name);
    payment.stripeCustomerId = customer.id;
    if (data.cardId) {
      customer = await updateCustomerCard(customer.id, data.cardId);
      payment.cardLast4Digits = customer.sources.data[0].last4;
      payment.cardBrand = customer.sources.data[0].brand;
    }

    // save model
    const org = new Organisation({
      ...data.company,
      contact: data.contact,
      payment,
    });
    await org.save();
    return org;
  }

  async savePrimaryContact(org) {
    const { data } = this;
    const user = new User({
      email: data.email,
      status: User.STATUS_PENDING,
      roles: User.ROLE_CONTRACTOR,
      contractorProfile: {
        ...data.contact,
        isPrimary: true,
        organisation: org._id,
        position: data.position,
      },
      contactMethod: User.CONTACT_METHOD_WEB,
    });
    user.setPassword(data.password);
    await user.save();
    return user;
  }

  async saveVehicles(org) {
    const { data } = this;
    if (!Array.isArray(data.vehicles)) {
      return false;
    }

    await Promise.all(data.vehicles.map((vd) => {
      const vehicle = new Vehicle({
        class: vd.class,
        regNo: vd.regNo,
        model: vd.model,
        compliance: vd.compliance,
        organisation: org._id,
      });
      return vehicle.save();
    }));
    return true;
  }

  /**
   * Save registration data
   */
  async save() {
    if (!await this.validate()) {
      return false;
    }

    const { data } = this;
    const org = await this.saveOrganisation();
    const contractor = await this.savePrimaryContact(org);
    await this.saveVehicles(data, org);
    await EmailHelper.sendNewContractorRegEmaillToAdmin(contractor);
    contractor.contractorProfile.organisation = org;
    this.contractor = contractor;
    return true;
  }
}

module.exports = RegistrationForm;
