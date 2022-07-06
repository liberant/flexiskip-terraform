const path = require('path');
const querystring = require('querystring');
const config = require('../../../config');
const { formatDateTime, formatDate, formatDateAu } = require('../../common/helpers');
const { sendMail } = require('../../common/mail');
const Promise = require('bluebird');
const { generateQRCode } = require('../../common/helpers');
const moment = require('moment');

const {
  CUSTOMER_APN,
  CUSTOMER_IBI,
  CUSTOMER_ISI,
  DRIVER_APN,
  DRIVER_IBI,
  DRIVER_ISI,
} = process.env;

function formatPrefix(prefix) {
  return prefix && prefix != 'standard' ? `${prefix}-` : '';
}

/**
 * Return reset password link for customer user
 * @param {String} token
 */
function getCustomerResetPwdLink(token) {
  const webLink = encodeURIComponent(`${config.webUrl}/customer/reset-password?token=${token}`);
  const longDynamicLink = `https://q8qd3.app.goo.gl/?link=${webLink}&apn=${CUSTOMER_APN}&ibi=${CUSTOMER_IBI}&isi=${CUSTOMER_ISI}&ius=handelcustomer`;
  // return getCustomerShortLink(longDynamicLink);
  return longDynamicLink;
}

/**
 * Return set password link for customer user
 *
 * @param {String} token
 */
function getCustomerCreatePwdLink(token, email) {
  const webLink = encodeURIComponent(`${config.webUrl}/customer/set-password?token=${token}&email=${email}`);
  const longDynamicLink = `https://q8qd3.app.goo.gl/?link=${webLink}&apn=${CUSTOMER_APN}&ibi=${CUSTOMER_IBI}&isi=${CUSTOMER_ISI}&ius=handelcustomer`;
  // return getCustomerShortLink(longDynamicLink);
  return longDynamicLink;
}

/**
 * Return reset password link for driver user
 * @param {String} token
 */
function getDriverResetPwdLink(token) {
  const webLink = encodeURIComponent(`${config.webUrl}/driver/reset-password?token=${token}`);
  const longDynamicLink = `https://f8v6y.app.goo.gl/?link=${webLink}&apn=${DRIVER_APN}&ibi=${DRIVER_IBI}&isi=${DRIVER_ISI}&ius=handeldriver`;
  // return getDriverShortLink(longDynamicLink);
  return longDynamicLink;
}

/**
 * Generate a link for driver to set password in the app  fiytgh
 * @param {String} token
 */
function getDriverCreatePwdLink(token, email) {
  const webLink = encodeURIComponent(`${config.webUrl}/driver/set-password?token=${token}&email=${email}`);
  const longDynamicLink = `https://f8v6y.app.goo.gl/?link=${webLink}&apn=${DRIVER_APN}&ibi=${DRIVER_IBI}&isi=${DRIVER_ISI}&ius=handeldriver`;
  // return getDriverShortLink(longDynamicLink);
  return longDynamicLink;
}

/**
 * Return reset password link for all kinds of user
 *
 * @param {Object} user
 */
async function getResetPwdLink(user) {
  const token = user.createToken(config.resetPasswordTokenLifeTime).value;
  const q = querystring.stringify({ token });
  const User = require('../models/user');
  if (user.can(User.ROLE_ADMIN)
    || user.can('adminlv2')
    || user.can('adminlv3')
    || user.can('adminlv4')
  ) {
    return `${config.webUrl}/admin/forgot-password?${q}`;
  }

  if (user.can(User.ROLE_CONTRACTOR)) {
    return `${config.webUrl}/contractor/set-password?${q}`;
  }

  if (user.can(User.ROLE_COUNCIL_OFFICER)) {
    return `${config.webUrl}/council-officer/set-password?${q}`;
  }

  if (user.can(User.ROLE_RES_CUSTOMER)
    || user.can(User.ROLE_BUS_CUSTOMER)
  ) {
    return getCustomerResetPwdLink(token);
  }

  if (user.can(User.ROLE_DRIVER)) {
    return getDriverResetPwdLink(token);
  }
  return '';
}


/**
 * Return create password link on first login for all kinds of user
 *
 * @param {Object} user
 */
async function getCreatePwdLink(user, type) {
  const token = user.createToken(config.setPasswordTokenLifeTime).value;
  const q = querystring.stringify({ token });
  const User = require('../models/user');

  switch (type) {
    case User.ROLE_ADMIN:
      return `${config.webUrl}/admin/set-password?${q}`;

    case User.ROLE_CONTRACTOR:
      return `${config.webUrl}/contractor/set-password?${q}`;

    case User.ROLE_COUNCIL_OFFICER:
      return `${config.webUrl}/council-officer/set-password?${q}`;

    case User.ROLE_DRIVER:
      return getDriverCreatePwdLink(token, user.email);

    case 'customer':
      return getCustomerCreatePwdLink(token, user.email);

    default:
      return '';
  }
}

/**
 * Get path from email template name
 * @param {String} name
 */
function getViewPath(name) {
  return path.resolve(config.basePath, 'views', 'email', `${name}.pug`);
}

class EmailHelper {
  /**
   * Send email that contain login instruction to admin
   *
   * @param {Object} user
   */
  static async sendWelcomeEmailToAdmin(user) {
    const User = require('../models/user');
    const { appName, mail: { autoEmail } } = config;
    const link = await getCreatePwdLink(user, User.ROLE_ADMIN);
    const message = {
      from: `${appName} <${autoEmail}>`,
      to: `${user.email} <${user.email}>`,
      subject: `${appName} - Create account success`,
      templatePath: getViewPath('admin-welcome'),
      params: {
        appName: config.appName,
        link,
      },
    };

    return sendMail(message);
  }

  /**
   * Send email that contain login instruction to council officer
   *
   * @param {Object} user
   */
  static async sendWelcomeEmailToCouncilOfficer(user) {
    const User = require('../models/user');
    const { appName, mail: { autoEmail } } = config;
    const link = await getCreatePwdLink(user, User.ROLE_COUNCIL_OFFICER);
    const message = {
      from: `${appName} <${autoEmail}>`,
      to: `${user.email} <${user.email}>`,
      subject: `${appName} - Create account success`,
      templatePath: getViewPath('council-officer-welcome'),
      params: {
        appName: config.appName,
        link,
      },
    };

    return sendMail(message);
  }

  /**
   * Send an email that contain login instruction to driver
   *
   * @param {Object} user
   */
  static async sendWelcomeEmailToDriver(driver) {
    const User = require('../models/user');
    const { appName, mail: { autoEmail } } = config;
    const data = await driver.toUserObject();
    const link = await getCreatePwdLink(driver, User.ROLE_DRIVER);
    const message = {
      from: `${appName} <${autoEmail}>`,
      to: `${data.firstname} ${data.lastname} <${driver.email}>`,
      subject: `Your account in ${appName} has been created`,
      templatePath: getViewPath('driver-welcome'),
      params: {
        appName,
        email: driver.email,
        link,
      },
    };

    return sendMail(message);
  }

  /**
   * Send welcome email to contractor
   *
   * @param {Organisation} org
   */
  static async sendWelcomeEmailToContractor(contractor) {
    const User = require('../models/user');
    const { appName, mail: { autoEmail } } = config;
    const data = await contractor.toUserObject();
    const link = await getCreatePwdLink(contractor, User.ROLE_CONTRACTOR);
    const message = {
      from: `${appName} <${autoEmail}>`,
      to: `${data.firstname} ${data.lastname} <${contractor.email}>`,
      subject: `${appName} - Your account has been created`,
      templatePath: getViewPath('contractor-welcome'),
      params: {
        appName,
        email: contractor.email,
        link,
      },
    };

    return sendMail(message);
  }

  /**
   * Send welcome email to contractor
   *
   * @param {Organisation} org
   */
  static async sendWelcomeEmailToContractorDriver(contractor) {
    const User = require('../models/user');
    const { appName, mail: { autoEmail } } = config;
    const data = await contractor.toUserObject();
    const link = await getCreatePwdLink(contractor, User.ROLE_CONTRACTOR);
    const downloadlink = await getCreatePwdLink(contractor, User.ROLE_DRIVER);
    const message = {
      from: `${appName} <${autoEmail}>`,
      to: `${data.firstname} ${data.lastname} <${contractor.email}>`,
      subject: `${appName} - Your account has been created`,
      templatePath: getViewPath('contractor-and-driver-welcome'),
      params: {
        appName,
        email: contractor.email,
        link,
        downloadlink,
      },
    };

    return sendMail(message);
  }

  /**
   * Send welcome email to residential customer
   *
   * @param {Organisation} org
   */
  static async sendWelcomeEmailToResidentialCustomer(customer) {
    const { appName, mail: { autoEmail } } = config;
    const data = await customer.toUserObject();
    const link = await getCreatePwdLink(customer, 'customer');
    const prefix = customer.prefix != 'standard' ? `${customer.prefix}-` : '';

    const message = {
      from: `${appName} <${autoEmail}>`,
      to: `${data.firstname} ${data.lastname} <${customer.email}>`,
      subject: `${appName} - Your account has been created`,
      templatePath: getViewPath(`${prefix}res-customer-welcome`),
      params: {
        appName,
        email: customer.email,
        link,
      },
    };

    return sendMail(message);
  }

  /**
   * Send an email that contain login instruction to business customer connected user
   *
   * @param {Object} user
   */
  static async sendWelcomeEmailToBusinessCustomer(user) {
    const { appName, mail: { autoEmail } } = config;
    const userData = await user.toUserObject();
    const link = await getCreatePwdLink(user, 'customer');
    const message = {
      from: `${appName} <${autoEmail}>`,
      to: `${userData.firstname} ${userData.lastname} <${userData.email}>`,
      subject: `${appName} - Your account has been created`,
      templatePath: getViewPath('customer-user-welcome'),
      params: {
        appName,
        email: user.email,
        link,
      },
    };

    return sendMail(message);
  }

  /**
   * Send email that contain reset password instruction to user
   *
   * @param {Object} user
   */
  static async sendResetPasswordEmailToUser(user) {
    const { appName, mail: { autoEmail } } = config;
    const resetPwdLink = await getResetPwdLink(user);
    const message = {
      from: `${appName} <${autoEmail}>`,
      to: user.email,
      subject: 'Reset your password',
      templatePath: getViewPath('reset-password'),
      params: {
        appName: config.appName,
        link: resetPwdLink,
        firstName: user.firstname,
      },
    };

    return sendMail(message);
  }

  /**
   * Send an email to customer after making bin request
   * @param {Object} user
   */
  static async sendNewBinReqEmailToCustomer(user, binReq, prefix) {
    const { appName, mail: { autoEmail } } = config;
    prefix = formatPrefix(prefix);
    const message = {
      from: `${appName} <${autoEmail}>`,
      to: `<${user.email}>`,
      subject: `${appName} - Your order has been placed successfully`,
      templatePath: getViewPath(`${prefix}customer-new-bin-req`),
      params: {
        appName,
        firstName: user.firstname,
        binReq,
      },
    };
    return sendMail(message);
  }

  /**
 * Send an email to customer after making bin request
 * @param {Object} user
 */
  static async sendNewBinReqEmailToCustomerTraditional(user, binReq, prefix) {
    const { appName, mail: { autoEmail } } = config;
    prefix = formatPrefix(prefix);

    binReq.items = binReq.items.filter(i => i.deliveryDate)
      .map((i) => {
        i.deliveryDateFormatted = formatDateAu(i.deliveryDate, 'DD-MMM-YY');
        return i;
      });
    binReq.bins = binReq.bins.filter(i => i.deliveryDate)
      .map((i) => {
        i.deliveryDateFormatted = formatDateAu(i.deliveryDate, 'DD-MMM-YY');
        return i;
      });

    const message = {
      from: `${appName} <${autoEmail}>`,
      to: `<${user.email}>`,
      subject: `${appName} - Your order has been placed successfully`,
      templatePath: getViewPath('customer-new-bin-req-with-tradition'),
      params: {
        appName,
        firstName: user.firstname,
        binReq,
      },
    };
    return sendMail(message);
  }

  /**
   * Send an email to customer when his collection request is processed
   * @param {Object} user
   */
  static async sendFinishedJobEmailToCustomer(driver, colReq, prefix, linkRating) {
    const { appName, mail: { autoEmail } } = config;
    prefix = formatPrefix(prefix);

    const message = {
      from: `${appName} <${autoEmail}>`,
      to: `<${colReq.customer.email}>`,
      subject: `${appName} - Driver Finish Job`,
      templatePath: getViewPath(`${prefix}customer-job-finished`),
      params: {
        appName,
        driverName: driver ? `${driver.firstname} ${driver.lastname}` : '',
        collectionRequestCode: colReq.code,
        linkRating,
      },
    };
    return sendMail(message);
  }

  /**
   * Send notification email to customer when a driver refuse to collect a bin
   * (not used)
   *
   * @param {*} driver
   * @param {*} bin
   */
  static async sendRefusedBinEmailToAdmin(driver, bin) {
    const { adminEmail } = config.mail;
    const { appName, mail: { autoEmail } } = config;
    const message = {
      from: `${appName} <${autoEmail}>`,
      to: `<${adminEmail}>`,
      subject: `${appName} - Driver Not Collected`,
      templatePath: getViewPath('customer-bin-refused'),
      params: {
        appName,
        driverName: `${driver.firstname} ${driver.lastname}`,
        binCode: bin.code,
        reason: bin.reason,
      },
    };
    return sendMail(message);
  }

  /**
   * Send notification email to admin when a new contractor signup
   * @param {object} contractor
   */
  static async sendNewContractorRegEmaillToAdmin(contractor) {
    const { adminEmail } = config.mail;
    const { appName, mail: { autoEmail } } = config;
    const link = `${config.webUrl}/admin/manage-accounts/contractor/${contractor._id}`;
    const message = {
      from: `${appName} <${autoEmail}>`,
      to: `<${adminEmail}>`,
      subject: 'A new contractor registration is waiting for your approbation',
      templatePath: getViewPath('admin-new-contractor'),
      params: {
        appName,
        contractor,
        link,
      },
    };
    return sendMail(message);
  }

  /**
   * Send email to contractor user when their account is rejected
   * @param {object} contractor
   */
  static async sendRejectEmailToContractor(contractor, reason) {
    const { appName, mail: { autoEmail } } = config;
    const data = await contractor.toUserObject();
    const message = {
      from: `${appName} <${autoEmail}>`,
      to: `${data.firstname} ${data.lastname} <${contractor.email}>`,
      subject: `${appName} - Your registration was rejected`,
      templatePath: getViewPath('contractor-rejected'),
      params: {
        appName,
        email: contractor.email,
        reason,
      },
    };

    return sendMail(message);
  }

  /**
   * Send invitation email to driver
   * @param {object} contractor
   */
  static async sendInvitationEmailToDriver(contractor, email) {
    const { appName, mail: { autoEmail } } = config;
    const data = await contractor.toUserObject();
    const invLink = '#';
    const message = {
      from: `${appName} <${autoEmail}>`,
      to: email,
      subject: `${data.firstname} ${data.lastname} - has invited you to ${appName}`,
      templatePath: getViewPath('driver-invitation'),
      params: {
        appName,
        link: invLink,
      },
    };

    return sendMail(message);
  }

  /**
   * Send notification email to handel admin
   * when a dispute is raised
   * @param {object} dispute
   */
  static async sendDisputeNotifEmailToAdmin(dispute) {
    const { appName, mail: { autoEmail } } = config;
    await dispute
      .populate('collectionRequest')
      .populate('reporter')
      .populate('user')
      .execPopulate();
    const message = {
      from: `${appName} <${autoEmail}>`,
      to: config.mail.disputeEmail,
      subject: `A dispute has been raised for request ${dispute.collectionRequest.code}`,
      templatePath: getViewPath('dispute-notification'),
      params: {
        appName,
        dispute,
        dateReported: formatDateTime(dispute.createdAt),
        loginLink: config.webUrl,
      },
    };

    return sendMail(message);
  }

  /**
   * Send notification to driver about thier expiration license
   * @param {object} driver
   */
  static async sendLicenseExpireEmailToDriver(driver) {
    const { appName, mail: { autoEmail } } = config;
    const expiredDate = formatDate(driver.driverProfile.licence.expiryDate);
    const message = {
      from: `${appName} <${autoEmail}>`,
      to: driver.email,
      subject: 'Your license will expire soon',
      templatePath: getViewPath('driver-license-expired'),
      params: {
        appName,
        expiredDate,
        driverName: driver.fullname,
      },
    };

    return sendMail(message);
  }

  /**
   * Send notification to handel admin about drive will be expiry license
   * @param {object} driver
   */
  static async sendLicenseExpireEmailToAdmin(driver, receiver) {
    const { appName, mail: { autoEmail } } = config;
    const expiredDate = formatDate(driver.driverProfile.licence.expiryDate);

    const receiverEmail = receiver ? receiver.email : 'yourfuture@handel.group';
    const message = {
      from: `${appName} <${autoEmail}>`,
      to: receiverEmail,
      subject: `${driver.fullname} driver license will expire soon`,
      templatePath: getViewPath('driver-license-expired'),
      params: {
        appName,
        expiredDate,
        driverName: driver.fullname,
      },
    };
    return sendMail(message);
  }

  /**
   * Send email to customer when product request is delivered
   * @param {Object} user
   * @param {Object} binReq
   */
  static async sendBinReqCompletedEmailToCustomer(binReq, prefix) {
    await binReq.populate('customer').execPopulate();
    const user = binReq.customer;
    const { appName, mail: { autoEmail } } = config;
    prefix = formatPrefix(prefix);

    const message = {
      from: `${appName} <${autoEmail}>`,
      to: `<${user.email}>`,
      subject: `${appName} - Thank you for choosing`,
      templatePath: getViewPath(`${prefix}customer-bin-req-completed`),
      params: {
        appName,
        user,
        binReq,
      },
    };
    return sendMail(message);
  }

  /**
   * Send verification email to customer when sign in with email
   * @param {String} email
   */
  static async sendResCustomerSignInVerificationEmail(user, code, prefix) {
    const { appName, mail: { autoEmail }, kerbsideLandingPageUrl } = config;
    prefix = formatPrefix(prefix);
    const q = querystring.stringify({ verificationCode: code });
    const link = `${kerbsideLandingPageUrl}?${q}`;

    const message = {
      from: `${appName} <${autoEmail}>`,
      to: `<${user.email}>`,
      subject: `${appName} - Verify your email address`,
      templatePath: getViewPath(`${prefix}customer-email-verification`),
      params: {
        appName,
        email: user.email,
        link,
      },
    };
    return sendMail(message);
  }
  /**
   * Send collection information require for customer
   * @param {Object} user
   */
  static async sendCustomerNewCollectionReq(user, prefix) {
    const { appName, mail: { autoEmail } } = config;
    prefix = formatPrefix(prefix);
    const message = {
      from: `${appName} <${autoEmail}>`,
      to: `<${user.email}>`,
      subject: `${appName} - FLEXiSKiP Collection booked successfully`,
      templatePath: getViewPath(`${prefix}customer-new-collection-req`),
      params: {
        appName,
        firstName: user.firstname,
      },
    };
    return sendMail(message);
  }

  /**
   * Send 20 days reminder for charging expired Flexiskip order
   * @param {Object} user
   */
  static async sendGCCExpiredFlexiskipChargeReminder(user, prefix) {
    const { appName, mail: { autoEmail } } = config;
    prefix = formatPrefix(prefix);
    const message = {
      from: `${appName} <${autoEmail}>`,
      to: `<${user.email}>`,
      subject: `${appName} - Remember to book your collection`,
      templatePath: getViewPath(`${prefix}customer-expiring-flexiskip-reminder`),
      params: {
        appName,
        firstName: user.firstname,
      },
    };
    return sendMail(message);
  }

  /**
   * Send futile charge notification
   * @param {Object} user
   */
  static async sendNotifyFutileCharge(dispute, includePhotoEvidence = false) {
    const { appName, mail: { autoEmail } } = config;
    const {
      user, collectionRequest, images, createdAt,
    } = dispute;
    const { items, collectionAddress } = collectionRequest;

    await Promise.map(items, (item) => {
      const { code, reason } = item.bin;

      let viewPath = 'gc-futile-charge-default'; // default
      if (reason.includes('I was unable to access the FLEXiSKiP')) {
        viewPath = 'gc-futile-charge-inaccessible';
      } else if (reason.includes('The FLEXiSKiP was overweight')) {
        viewPath = 'gc-futile-charge-overfilled';
      }

      if (viewPath == 'gc-futile-charge-default') return; // [TO-DO] Wait for default template

      const message = {
        from: `${appName} <${autoEmail}>`,
        to: user.email,
        subject: `${appName} - ${code} Failed FLEXiSKiP collection ${collectionAddress}`,
        templatePath: getViewPath(viewPath),
        params: {
          appName,
          firstName: user.firstname,
          evidenceImages: includePhotoEvidence ? images : [],
          date: moment(createdAt).format('DD/MM/YYYY'),
        },
      };
      return sendMail(message);
    });
  }


  /**
   * Debug anomaly
   *
   */
  static async sendDebuggingEmail(payload) {
    const { appName, mail: { autoEmail }, webUrl } = config;
    const { customer } = payload;

    const customerEmail = customer && customer.email;
    const collectionRequestAddress = payload && payload.collectionAddress;
    const customerProfileLink = `${webUrl}/admin/manage-accounts/res-customers/${customer && customer._id}`;

    const message = {
      from: `${appName} <${autoEmail}>`,
      to: '<hello@handel.group>',
      cc: '<welly@weareflip.com>',
      subject: `${appName} - Debug anomaly`,
      templatePath: getViewPath('debug-anomaly'),
      params: {
        customerEmail,
        collectionRequestAddress,
        customerProfileLink,
        payload: JSON.stringify(payload),
      },
    };
    return sendMail(message);
  }
}

module.exports = EmailHelper;
