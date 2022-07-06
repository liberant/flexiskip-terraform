
const { sendSMS } = require('../../common/lambda');
const logger = require('../../common/log');

class SMSHelper {
    /**
     * Send an sms to customer when his collection request is processed
     * @param {Object} colReq
     * @param {Object} user
     * @param {string} linkRating
     */
    static async sendFinishedJobSMSToCustomer(user, colReq, linkRating) {
        logger.info(`Sending rating SMS User: ${user} CR: ${colReq} Link: linkRating`);
        const message = {
            to: `${colReq.customer.phone}`,
            url: linkRating,
            };
        logger.info(`${message}`);
        return sendSMS(message);
    }
}
module.exports = SMSHelper;