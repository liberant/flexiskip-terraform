const axios = require('axios');
const moment = require('moment');
const momentTz = require('moment-timezone');
const qrcode = require('qrcode');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const bcrypt = require('bcrypt-nodejs');
const ms = require('ms');
const mongoose = require('mongoose');
const config = require('../../config');
const validate = require('validate.js');
const querystring = require('querystring');
const logger = require('./log');
const passwordMeter = require('passwordmeter');
const Council = require('./../app/models/council');

/**
 * Return api error data for internal server error
 *
 * @param {String} message
 * @param {Object} options
 */
function serverExc(message, options = {}) {
  return {
    status: 500,
    code: 'server_error',
    message,
    ...options,
  };
}

/**
 * Return api error data for 404 error
 *
 * @param {String} message
 * @param {Object} options
 */
function notFoundExc(message, options = {}) {
  return {
    status: 404,
    code: 'resource_not_found',
    message,
    ...options,
  };
}

/**
 * Return api error data for form submission error
 *
 * @param {String} message
 * @param {Object} errors object contain field errors
 */
function validationExc(message, errors, code = null, options = {}) {
  return {
    status: 400,
    code: code || 'invalid_data',
    message,
    errors,
    ...options,
  };
}

/**
 * Return api error data for unauthenticated error
 *
 * @param {String} message
 */
function unauthorizedExc(message) {
  return {
    status: 401,
    code: 'unauthorized',
    message,
  };
}

/**
 * @returns Promise
 */
function connectToDb() {
  mongoose.set('debug', config.db.debug);
  mongoose.Promise = global.Promise;
  const options = {
    config: { autoIndex: false },
    useNewUrlParser: true,
  };
  return mongoose.connect(config.db.uri, options);
}

function encryptPassword(value) {
  return bcrypt.hashSync(value);
}

function verifyPassword(value, hash) {
  return bcrypt.compareSync(value, hash);
}

/**
 * Create an access token for user
 * @param {Object} user
 * @param {String} duration
 */
function createToken(user, duration) {
  const expireAt = new Date();
  expireAt.setSeconds(expireAt.getSeconds() + (ms(duration) / 1000));
  const value = jwt.sign({ userId: user._id }, config.appSecret, { expiresIn: duration });
  return {
    value,
    expireAt,
  };
}

function verifyToken(token) {
  let result = false;
  try {
    result = jwt.verify(token, config.appSecret);
  } catch (err) {
    logger.info('Validate access token failed.');
  }
  return result;
}

function verifyJWT(token, publicKey) {
  let result = false;
  try {
    result = jwt.verify(token, publicKey);
  } catch (err) {
    logger.info('Validate access token failed.');
  }
  return result;
}

/**
 * Verify post code if there is any council that is availble to serve that code
 * @param {*} postcode given postal code
 */
async function verifyPostalCode(postcode) {
  if (!postcode) return false;
  try {
    const count = await Council.countDocuments({
      postCodes: postcode,
      status: 'Active',
    });
    return (count > 0);
  } catch (err) {
    return false;
  }
}

/**
 * Verify post code if there is any council that is availble to serve that code
 * @param {*} postcode given postal code
 */
async function verifyCouncil(council) {
  if (!council) return false;

  try {
    const count = await Council.countDocuments({
      _id: council,
      status: 'Active',
    });
    return (count > 0);
  } catch (err) {
    return false;
  }
}

/**
 * Get value of nested property by path
 *
 * @param {Mixed} obj
 * @param {String} path
 * @param {Mixed} defVal default value when the result is undefined
 */
function getObjectValue(obj, path, defVal = undefined) {
  const result = validate.getDeepObjectValue(obj, path);
  return result || defVal;
}

function filterObjectKeys(obj, allowedKeys = []) {
  const result = {};
  allowedKeys.forEach((key) => {
    if (obj[key]) {
      result[key] = obj[key];
    }
  });
  return result;
}

function validateFileData(data) {
  const rules = {
    url: {
      presence: { allowEmpty: false },
    },
    filename: {
      presence: { allowEmpty: false },
    },
    mimeType: {
      presence: { allowEmpty: false },
    },
    bucket: {
      presence: { allowEmpty: false },
    },
    region: {
      presence: { allowEmpty: false },
    },
    key: {
      presence: { allowEmpty: false },
    },
  };
  return validate(data, rules, { format: 'grouped' });
}

function createWebUrl(path, params = null) {
  const q = params ? `?${querystring.stringify(params)}` : '';
  return `${config.webUrl}/${path}${q}`;
}

/**
 * Return string with padding
 * @param {Number} n number
 * @param {Number} width
 * @param {String} z padding character
 */
function pad(n, width, z = '0') {
  const str = n.toString();
  return str.length >= width ? str : new Array((width - str.length) + 1).join(z) + str;
}

function randomCode(min, max) {
  const n = Math.floor((Math.random() * ((max - min) + 1)) + min);
  return pad(n, 4);
}

function randomString(length = 5) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function round(number, precision) {
  return parseFloat(number).toFixed(precision);
}

/**
 * password strength validator
 * score must larger than 70%
 */
function passwordStrength(value) {
  const score = passwordMeter.checkPass(value, 8);
  return score <= 60 ? 'is not strength enough, must minimum 8 characters in length, and contain number, symbol, or uppercase/lowercase letters' : null;
}

async function generateQRCode(text) {
  try {
    const result = await qrcode.toDataURL(text);
    return result;
  } catch (err) {
    throw err;
  }
}

function getDatePart(date) {
  return date.toISOString().substr(0, 10);
}

function buildQuery(obj) {
  return Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&');
}

/**
 * Send Firebase Cloud Message
 *
 * @param {String} deviceToken
 * @param {Object} object
 */
async function sendFCM(accessKey, deviceToken, title, body, data) {
  try {
    if (!accessKey || !deviceToken) {
      return false;
    }

    const _data = { ...data, title, body };
    logger.info(`Sending push notification to device ${deviceToken} with title: ${title} - body: ${body}`);
    const resp = await axios({
      url: 'https://fcm.googleapis.com/fcm/send',
      method: 'POST',
      headers: {
        Authorization: `key=${accessKey}`,
        'content-type': 'application/json',
      },
      data: {
        to: deviceToken,
        collapse_key: 'type_a',
        notification: {
          title,
          body,
        },
        data: _data,
      },
    });

    if (resp.data && resp.data.success) {
      logger.info('sendFCM succeeded.');
    } else {
      logger.info('sendFCM failed.');
    }
    return resp.data.success === 1;
  } catch (error) {
    logger.info(`sendFCM error: ${error.message}`);
    throw new Error('Error while sending Firebase message.');
  }
}

/**
 * Get duration between two dates in miliseconds
 * Return negative value if d1 is less than d2
 *
 * @param {String} date1
 * @param {String} date2
 */
function getTimeDiff(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1 - d2;
}

function timeout(milis) {
  return new Promise((resolve) => {
    setTimeout(resolve, milis);
  });
}

function removeItem(array, item) {
  const index = array.indexOf(item);
  if (index !== -1) array.splice(index, 1);
}

function addItem(array, item) {
  const index = array.indexOf(item);
  if (index === -1) array.push(item);
}

function arrayOverlap(arrayOne, arrayTwo) {
  return arrayOne.some(one => arrayTwo.some(two => one.toString() === two.toString()));
}

function arrayIncludesArray(arr1, arr2) {
  return arr2.every(it2 => arr1.includes(it2));
}

function getMonthDateRange(date) {
  const startDate = moment(date).startOf('month');
  const endDate = moment(date).endOf('month');
  return {
    start: startDate.toDate(),
    end: endDate.toDate(),
  };
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function generateRandomPassword(len = 8) {
  return Math.random().toString(36).slice(-len);
}

/**
 * Get firebase short link
 * @param {String} apiKey
 * @param {*} link
 */
async function getFireBaseShortLink(apiKey, link) {
  const urlFirebase = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${apiKey}`;
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    data: {
      longDynamicLink: link,
    },
    url: urlFirebase,
  };
  const resp = await axios(options);
  return resp.data.shortLink;
}

/**
 * Format javascript date to human readable string
 * @param {String} value
 */
function formatDate(value) {
  return value ? moment(value).format('DD/MM/YYYY') : '';
}

/**
 * Format javascript date to human readable string using the AEST timezone
 * @param {String} value
 */
function formatDateAu(value, dateFormat = 'DD/MM/YYYY') {
  return value ? momentTz.tz(value, 'Australia/Brisbane').format(dateFormat) : '';
}

/**
 * Format javascript date to human readable string
 * @param {String} value
 */
function formatDateTime(value) {
  return value ? moment(value).format('DD/MM/YYYY h:mm a') : '';
}

async function verifyAccessToken(data) {
  const { accessToken, socialType } = data;
  if (socialType === 'facebook') {
    const url = `https://graph.facebook.com/v6.0/me?fields=id%2Cname%2Cemail%2Cfirst_name%2Clast_name%2Cpicture.width(320).height(320)&access_token=${accessToken}`;
    const res = await axios.get(url);
    const object = {
      socialId: (res && res.data && res.data.id) || null,
      email: (res && res.data && res.data.email) || null,
    };
    return object;
  } else if (socialType === 'apple') {
    const json = jwt.decode(accessToken, { complete: true });
    const client = jwksClient({
      jwksUri: 'https://appleid.apple.com/auth/keys',
    });

    const key = await new Promise((resolve, reject) => {
      client.getSigningKey(json.header.kid, (err, key) => {
        if (err) return reject(err);
        const signingKey = key.getPublicKey();
        return resolve(signingKey);
      });
    });

    if (!key) {
      logger.error('Apple public key not found');
      return {};
    }

    const verified = verifyJWT(accessToken, key);

    if (!verified || verified.iss != 'https://appleid.apple.com' || verified.aud != 'group.handel.kerbside') {
      logger.error('Invalid Identity Token');
      return {};
    }

    const object = {
      socialId: verified.sub || null,
      email: verified.email || null,
    };

    return object;
  }
  const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${accessToken}`;
  const res = await axios.get(url);
  const object = {
    socialId: (res && res.data && res.data.sub) || null,
    email: (res && res.data && res.data.email) || null,
  };
  return object;
}

function checkAvailableDeliveryDate(deliveryDate) { // must pick 2 business days before hand
  const DateSkipMap = {
    1: 2, // Mon
    2: 2,
    3: 4,
    4: 4,
    5: 4,
    6: 3,
    0: 2,
  };

  const today = moment().utc().startOf('day');

  // ######## DEBUGGING
  console.log("--------------- moment().format('Z')");
  console.log(moment().format('Z'));

  console.log('--------------- deliveryDate');
  console.log(deliveryDate);
  console.log('--------------- moment(deliveryDate).utc().day()');
  console.log(moment(deliveryDate).utc().day());


  console.log("--------------- moment().startOf('day').utc().format()");
  console.log(moment().utc().startOf('day').format());
  console.log("--------------- moment().startOf('day').utc().day()");
  console.log(moment().utc().startOf('day').day());
  // ######## DEBUGGING

  const nextAvailableDate = today.add(DateSkipMap[today.utc().day()], 'days');

  // ######## DEBUGGING
  console.log('--------------- nextAvailableDate.utc().format()');
  console.log(nextAvailableDate.utc().format());
  console.log("--------------- momentTz.tz(deliveryDate, 'Australia/Brisbane').format()");
  console.log(momentTz.tz(deliveryDate, 'Australia/Brisbane').format());
  console.log("--------------- momentTz.tz(deliveryDate, 'Australia/Brisbane').day()");
  console.log(momentTz.tz(deliveryDate, 'Australia/Brisbane').day());
  // ######## DEBUGGING

  console.log("+++++ [0, 6].includes(momentTz.tz(deliveryDate, 'Australia/Brisbane').day())");
  console.log([0, 6].includes(momentTz.tz(deliveryDate, 'Australia/Brisbane').day()));
  console.log("+++++ moment(deliveryDate).isSameOrBefore(today, 'day')");
  console.log(moment(deliveryDate).isSameOrBefore(moment().utc().startOf('day'), 'day'));

  return deliveryDate && !(
    [0, 6].includes(momentTz.tz(deliveryDate, 'Australia/Brisbane').day())
    || moment(deliveryDate).isSameOrBefore(moment().utc().startOf('day'), 'day') // after today check

    // temp disable business day check
    // [0, 6].includes(moment(deliveryDate).day())
    // || moment(deliveryDate).isSameOrBefore(nextAvailableDate, 'day')
  );
}

const generateGeoAddress = (address) => {
  // eg: "address: 2/23 Callistemon Ct, Arundel QLD 4214, Australia";
  // => addressTreated = "23 Callistemon"
  // => postcode = 4214
  const address1 = address.split(',')[0].split('/').pop();
  const addressTreated = address1
    .split(' ')
    .slice(0, 2)
    .join(' ')
    .toUpperCase();
  const address2 = address.split(',')[1];
  const postcode = Number(address2 && address2.slice(address2.length - 4));
  return {
    addressTreated,
    postcode,
  };
};


module.exports = {
  notFoundExc,
  validationExc,
  serverExc,
  unauthorizedExc,
  connectToDb,
  encryptPassword,
  verifyPassword,
  createToken,
  verifyToken,
  verifyCouncil,
  verifyPostalCode,
  getObjectValue,
  filterObjectKeys,
  validateFileData,
  createWebUrl,
  randomCode,
  round,
  passwordStrength,
  generateQRCode,
  getDatePart,
  buildQuery,
  sendFCM,
  getTimeDiff,
  timeout,
  removeItem,
  addItem,
  arrayOverlap,
  arrayIncludesArray,
  pad,
  getMonthDateRange,
  escapeRegExp,
  generateRandomPassword,
  getFireBaseShortLink,
  formatDate,
  formatDateAu,
  formatDateTime,
  randomString,
  verifyAccessToken,
  checkAvailableDeliveryDate,
  generateGeoAddress,
};
