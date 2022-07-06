const validate = require('validate.js');
const EmailHelper = require('../../../helpers/email');

/**
 * Class responsible for adding driver
 */
class InviteDriverForm {
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
    const rules = {
      email: {
        presence: true,
        email: true,
      },
    };
    try {
      await validate.async(this.data, rules, { format: 'grouped' });
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
    await EmailHelper.sendInvitationEmailToDriver(contractor, data.email);
    return true;
  }
}

module.exports = InviteDriverForm;
