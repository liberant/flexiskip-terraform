const path = require('path');
const config = require('../../../config');
const { formatDateTime, formatDate, formatDateAu } = require('../../common/helpers');
const { sendMail } = require('../../common/mail');
const Promise = require('bluebird');
const moment = require('moment');

/**
 * Get path from email template name
 * @param {String} name
 */
function getViewPath(name) {
  return path.resolve(config.basePath, 'views', 'email', `${name}.pug`);
}

class ClickUpHelper {

  /**
   * Send an email to customer after making bin request
   * @param {Object} user
   */
  static async notifyNewBinRequest(binReq) {
    const { appName, mail: { autoEmail } } = config;
    const { customer, items } = binReq;

    const partnerDeliveredItems = items.filter(i => i.deliveryDate)
                                       .map(i => {
                                          i.deliveryDateFormatted = formatDateAu(i.deliveryDate, 'DD-MMM-YY');
                                          return i;
                                        });
    const deliveryDates = partnerDeliveredItems.map(i => i.deliveryDate)
                                               .sort((a, b) => {return new Date(a) - new Date(b)})

    if (partnerDeliveredItems.length == 0) return // no partner deliver skip

    const earliestDeliveryDateClickUpFormat = formatDateAu(deliveryDates[0], 'DD/MM/YYYY');
    const earliestDeliveryDate = formatDateAu(deliveryDates[0], 'DD-MMM-YY');
    const orderDate = formatDateAu(binReq.createdAt, 'DD-MMM-YY HH:mm');

    const message = {
      from: `${appName} <${autoEmail}>`,
      to: `"ClickUp list: MVP Orders"<${config.clickUpTaskMail}>`,
      subject: `${binReq.code} | order Date: ${orderDate} | due ${earliestDeliveryDate} <due ${earliestDeliveryDateClickUpFormat}>`,
      templatePath: getViewPath(`clickup-new-partner-delivered-order`),
      params: {
        appName,
        customer: {
          name: customer.firstname + customer.lastname,
          email: customer.email,
          phone: customer.phone
        },
        items: partnerDeliveredItems,
        shippingAddress: binReq.shippingAddress
      },
    };

    return sendMail(message);
  }

  static async notifyNewCollectionRequest(colReq) {
    const { appName, mail: { autoEmail } } = config;
    const { customer, items } = colReq;


    const partnerDeliveredItems = items.filter(i => i.bin && i.bin.deliveryDate)
    if (partnerDeliveredItems.length == 0) return // no partner deliver skip

    const requestDate = formatDateAu(moment(), 'DD-MMM-YY HH:mm');
    const dueDate = moment(moment()).add(3, 'days');

    const dueDateClickUpFormat = formatDateAu(dueDate, 'DD/MM/YYYY');
    const dueDateSub = formatDateAu(dueDate, 'DD-MMM-YY');

    const message = {
      from: `${appName} <${autoEmail}>`,
      to: `"ClickUp list: MVP Orders"<${config.clickUpTaskMail}>`,
      subject: `${colReq.code} | Request Date: ${requestDate} | due ${dueDateSub} <due ${dueDateClickUpFormat}>`,
      templatePath: getViewPath(`clickup-new-partner-delivered-collection-request`),
      params: {
        appName,
        customer: {
          name: customer.firstname + customer.lastname,
          email: customer.email,
          phone: customer.phone
        },
        items: partnerDeliveredItems,
        dueDateSub,
        collectionAddress: colReq.collectionAddress
      },
    };

    return sendMail(message);
  }
}
module.exports = ClickUpHelper;
