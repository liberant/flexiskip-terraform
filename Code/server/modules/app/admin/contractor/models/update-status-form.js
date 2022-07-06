const User = require('../../../models/user');
const validate = require('validate.js');
const EmailHelper = require('../../../helpers/email');

/**
 * Class responsible for updating contractor account status
 */
class UpdateStatusForm {
  /**
   * constructor of the class
   */
  constructor(contractor) {
    this.contractor = contractor;
    this.data = {};
    this.errors = undefined;
  }

  /**
   * Check if contractor's status is pending
   */
  validateCurrentStatus() {
    if (this.contractor.status !== User.STATUS_PENDING) {
      return '^Current status must be pending';
    }
    return undefined;
  }

  /**
   * Validate input data submitted by client
   */
  validate() {
    validate.validators.currentStatus = this.validateCurrentStatus.bind(this);
    const constraints = {
      status: {
        presence: { allowEmpty: false },
        inclusion: {
          within: [
            User.STATUS_ACTIVE,
            User.STATUS_REJECTED,
          ],
          message: 'is not allowed',
        },
        currentStatus: true,
      },
      reason: (this.data.status === User.STATUS_REJECTED) ?
        { presence: { allowEmpty: false } } :
        undefined,
    };

    this.errors = validate(this.data, constraints, { format: 'grouped' });
    return this.errors === undefined;
  }

  /**
   * Save registration data
   */
  async save() {
    if (!this.validate()) {
      return false;
    }

    const { data, contractor } = this;
    contractor.status = data.status;
    await contractor.save();

    if (data.status === User.STATUS_ACTIVE && data.password == null) {
      await EmailHelper.sendWelcomeEmailToContractor(contractor);
    }

    if (data.status === User.STATUS_REJECTED) {
      await EmailHelper.sendRejectEmailToContractor(contractor, data.reason);
    }

    return true;
  }
}

module.exports = UpdateStatusForm;
