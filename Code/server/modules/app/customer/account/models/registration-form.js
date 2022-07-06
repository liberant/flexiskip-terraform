const validate = require('validate.js');
const { validateUniqueEmail } = require('../../../helpers');
const {
  filterObjectKeys,
} = require('../../../../common/helpers');
const User = require('../../../models/user');
const Organisation = require('../../../models/organisation');
const { getCouncilByAddress } = require('../../../helpers');
const {
  createCustomer,
  updateCustomerCard,
} = require('../../../../common/payment');
const EmailHelper = require('../../../helpers/email');
const { AU_PHONE_PATTERN } = require('../../../../common/constants');

/**
 * Class responsible for processing customer registration
 */
class RegistrationForm {
  /**
   * constructor of the class
   */
  constructor() {
    this.data = {};
    this.errors = undefined;
  }

  static async validateConnectedUser(data) {
    const constraints = {
      email: {
        presence: { allowEmpty: false },
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
        length: {
          is: 10,
          message: '^Invalid phone number. Phone number must have 10 characters',
        },
        // TODO: validate on form https://trello.com/c/VrbWVIz4
        format: {
          pattern: AU_PHONE_PATTERN,
          message: '^Please enter a 10 digit number. If it\'s a landline don\'t forget the area code!',
        },
      },
      isPrimary: {
        presence: { allowEmpty: false },
      },
    };
    try {
      await validate.async(data, constraints, { format: 'grouped' });
      return null;
    } catch (errors) {
      return errors;
    }
  }

  /**
   * Validate input data submitted by client
   */
  async validate(fields) {
    const { data } = this;
    validate.Promise = global.Promise;
    validate.validators.unique = validateUniqueEmail;
    validate.validators.connectedUsers = async (users) => {
      const errors = await Promise.all(users
        .map(item => RegistrationForm.validateConnectedUser(item)));
      const error = errors.find(err => !!err);
      return error && `^${Object.values(error)[0]}`;
    };

    let constraints = {
      email: {
        presence: { allowEmpty: false },
        email: true,
        unique: {
          message:
            '^This email address is already registered. Please enter a new email address or login using this email address on the Sign In page. If you have forgotten your password you can also reset it!',
        },
      },
      password: {
        presence: { allowEmpty: false },
      },
      firstname: {
        presence: { allowEmpty: false },
      },
      lastname: {
        presence: { allowEmpty: false },
      },
      phone: {
        presence: { allowEmpty: false },
        length: {
          is: 10,
          message: '^Invalid phone number. Phone number must have 10 characters',
        },
        // TODO: Get thispattern validation checked on form input
        // https://trello.com/c/VrbWVIz4
        format: {
          pattern: AU_PHONE_PATTERN,
          message:
            "^Please enter a 10 digit number. If it's a landline don't forget the area code!",
        },
      },
      address: {
        presence: { allowEmpty: false },
      },
      customerType: {
        presence: { allowEmpty: false },
        inclusion: {
          within: ['Residential', 'Business'],
          message: 'must be Residential or Business',
        },
      },
    };

    if (data.customerType === 'Business') {
      constraints = {
        ...constraints,
        abn: {
          presence: { allowEmpty: false },
          length: { is: 11 },
        },
        businessName: {
          presence: { allowEmpty: false },
        },
        users: {
          connectedUsers: true,
        },
      };
    }

    if (data.socialType) {
      delete constraints.password;
    }

    if (Array.isArray(fields)) {
      // only validate specific fields
      constraints = filterObjectKeys(constraints, fields);
    }

    try {
      await validate.async(data, constraints, { format: 'grouped' });
    } catch (errors) {
      this.errors = errors;
    }
    return this.errors === undefined;
  }

  async saveBusinessCustomer() {
    const { data } = this;
    // save organisation
    let customer = await createCustomer(data.businessEmail, data.businessName);
    let payment = {
      stripeCustomerId: customer.id,
      cardLast4Digits: '',
      cardBrand: '',
    };

    // update customer payment card if submitted
    if (data.cardId) {
      customer = await updateCustomerCard(customer.id, data.cardId);
      payment = {
        stripeCustomerId: customer.id,
        cardLast4Digits: customer.sources.data[0].last4,
        cardBrand: customer.sources.data[0].brand,
      };
    }

    // save organisation
    const org = new Organisation({
      abn: data.abn,
      name: data.businessName,
      email: data.businessEmail,
      address: data.address,
      payment,
    });
    await org.save();

    // save connected users
    const user = await this.saveConnectedUsers(org);
    return user;
  }

  async saveConnectedUsers(org) {
    const { data } = this;
    if (!data.users || !Array.isArray(data.users)) {
      return false;
    }

    const council = await getCouncilByAddress(org.address);
    let returnedUser = null;
    await Promise.all(data.users.map(async (userData) => {
      let updatedData = {
        email: userData.email,
        status: User.STATUS_ACTIVE,
        roles: User.ROLE_BUS_CUSTOMER,
        council: council ? council._id : undefined,
        firstname: userData.firstname,
        lastname: userData.lastname,
        phone: userData.phone,
        businessCustomerProfile: {
          isPrimary: userData.isPrimary,
          organisation: org._id,
          position: userData.position,
        },
        contactMethod: User.CONTACT_METHOD_APP,
      };
      if (data.email === updatedData.email) {
        updatedData = {
          ...updatedData,
          avatar: data.avatar,
          socialType: data.socialType,
          socialId: data.socialId,
        };
      }
      const user = new User(updatedData);
      if (data.email === user.email) {
        returnedUser = user;
        if (data.password) {
          user.setPassword(data.password);
        }
      } else {
        await EmailHelper.sendWelcomeEmailToBusinessCustomer(user);
      }
      return user.save();
    }));

    return returnedUser;
  }

  async saveResidentialCustomer() {
    const { data } = this;
    let customer = await createCustomer(data.email.toLowerCase());
    let cardLast4Digits = '';
    if (data.cardId) {
      customer = await updateCustomerCard(customer.id, data.cardId);
      cardLast4Digits = customer.sources.data[0].last4;
    }
    const council = await getCouncilByAddress(data.address);
    const user = new User({
      email: data.email,
      status: User.STATUS_ACTIVE,
      roles: User.ROLE_RES_CUSTOMER,
      council: council ? council._id : undefined,
      firstname: data.firstname,
      lastname: data.lastname,
      phone: data.phone,
      avatar: data.avatar,
      socialType: data.socialType,
      socialId: data.socialId,
      residentialCustomerProfile: {
        address: data.address,
        payment: {
          stripeCustomerId: customer.id,
          cardLast4Digits,
        },
      },
      contactMethod: User.CONTACT_METHOD_APP,
    });
    if (data.password) {
      user.setPassword(data.password);
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

    const { data } = this;
    const user = data.customerType === 'Business' ?
      await this.saveBusinessCustomer() :
      await this.saveResidentialCustomer();
    this.customer = user;
    return true;
  }
}

module.exports = RegistrationForm;
