/**
 * Contain all reusable functions
 */

import validate from 'validate.js';
import moment from 'moment';
import { put, call } from 'redux-saga/effects';
import numeral from 'numeral';

import http from './http';
import { getHttpErrorMessages } from '../common/utils/common';
import {
  requestStart,
  requestFinished,
  setError,
  clearIdentity,
} from './actions';
import { APP_NAME } from './constants/params';

/**
 * Get value of nested property by path
 *
 * @param {Mixed} obj
 * @param {String} path
 * @param {Mixed} defVal default value when the result is undefined
 */
export function getObjectValue(obj, keyPath, defVal) {
  const result = validate.getDeepObjectValue(obj, keyPath);
  return result || defVal;
}


/**
 * Save data to browser's local storage
 *
 * @param {String} name
 * @param {Mixed} value
 */
export function saveItemToStorage(name, value) {
  const itemName = `${APP_NAME}_${name}`;
  if (value) {
    window.localStorage.setItem(itemName, JSON.stringify(value));
  } else {
    window.localStorage.removeItem(itemName);
  }
}

/**
 * Get data from browser's local storage
 *
 * @param {String} name
 */
export function loadItemFromStorage(name) {
  const itemName = `${APP_NAME}_${name}`;
  const str = window.localStorage.getItem(itemName);
  return str === null ? null : JSON.parse(str);
}

/**
 * Save identity to local storage
 *
 * @param {Object} value
 */
export function saveIdentity(value) {
  saveItemToStorage('identity', value);
}

/**
 * Load identity from local storage
 *
 * @returns {Object}
 */
export function loadIdentity() {
  return loadItemFromStorage('identity');
}

/**
 * Check identity data is valid or not (expired)
 *
 * @param {Object} identity
 */
export function validateIdentity(identity) {
  const { token: { value, expireAt } } = identity;
  if (!value) return false;

  const now = new Date();
  const expired = expireAt ? new Date(expireAt) : null;

  if (!expired || expired < now) return false;

  return true;
}

/**
 * Get component's display name
 *
 * @param {Component} Component
 */
export function getComponentName(Component) {
  return Component.displayName || Component.name || 'Component';
}

/**
 * Helper function used to create redux action
 *
 * @param {String} type
 * @returns {Object} redux action
 */
export function createAction(type) {
  return payload => ({ type, payload });
}

/**
 * Helper function used to create redux action for asynchronous task
 * In the returned action, beside type, payload fields, also
 * contain a promise object plus resolve, reject function for that promise
 *
 * Saga worker or redux thunk will call resolve, reject function when async tasks done
 * Component (or caller function) can use the returned promise to be notified when
 * async tasks complete
 *
 * @param {String} type
 * @returns {Object} redux action
 */
export function createAsyncAction(type) {
  return (payload) => {
    let resolve;
    let reject;
    const promise = new Promise((rs, rj) => {
      resolve = rs;
      reject = rj;
    });

    return {
      type,
      payload,
      promise,
      resolve,
      reject,
    };
  };
}

/**
 * Generator function to perform ajax request
 *
 * This function is called in redux saga code, example:
 * ```
 * var response = yield call(request, {
 *   url: '/admin/session',
 *   method: 'post',
 *   data: payload
 * })
 * ```
 *
 * - set flag in redux store to know whether request is pending or finished
 * - set error alert when request fail
 * - handle 401 (unauthorized) response
 *
 * @param {Object} config
 */
export function* request(config) {
  const { requestName = 'default', hideMessage, ...axiosConfig } = config;

  if (requestName) {
    yield put(requestStart(requestName));
  }

  // execute http request
  try {
    const response = yield call(http, axiosConfig);
    yield put(requestFinished(requestName));
    return response;
  } catch (error) {
    yield put(requestFinished(requestName));

    // display error message
    let message = 'An error occurred while processing your request';
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { data } = error.response;
      if (data.errors) {
        message = getHttpErrorMessages(error);
        error.errors = data.errors;
      } else if (typeof data === 'string') {
        message = data;
      } else {
        message = data.message || error.message;
      }
    } else if (error.request) {
      // The request was made but no response was received
      message = 'Error while connecting to server.';
    }
    if (!hideMessage) {
      yield put(setError(message));
    }

    // clear identity and show login page on 401 response
    if (error.response && error.response.status === 401) {
      yield put(clearIdentity());
    }

    throw error;
  }
}

function bindActionCreator(actionCreator, dispatch) {
  return function wrapper(...params) {
    const action = actionCreator.apply(this, params);
    const dispData = dispatch(action);
    return action.promise ? action.promise : dispData;
  };
}

/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass a single function as the first argument,
 * and get a function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */
export function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error('bindActionCreators expected an object or a function');
  }

  const keys = Object.keys(actionCreators);
  const boundActionCreators = {};
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const actionCreator = actionCreators[key];
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}

/**
 * Build url query string from javascript object
 * @param {*} obj
 */
export function buildQueryString(obj) {
  const parts = Object.entries(obj)
    .filter(([key, val]) => !!val)
    .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
  return parts.join('&');
}

/**
 * Format a value to number with 2 decimal places
 * @param {String} value
 */
export function formatPrice(value) {
  return numeral(value).format('$0,0.00');
}

/**
 * Format datetime, 04 Mar, 2018 05:56 pm
 * @param {String} value
 */
export function formatDateTime(value) {
  return moment(value).format('DD MMM, YYYY hh:mm a');
}

/**
 * Format date, 04 Mar, 2018
 * @param {String} value
 */
export function formatDate(value) {
  return moment(value).format('DD MMM, YYYY');
}

/**
 * Format date, 04 Mar, 2018
 * @param {String} value
 */
export function formatCouponValue(coupon) {
  switch (coupon.type) {
    case 'percentage':
      return `${coupon.discount}%`;

    case 'flat':
      return formatPrice(coupon.discount);

    case 'free':
      return 'Free';

    default:
      return '';
  }
}

/**
 * Get display text for the user type
 * @param {String} value
 */
export function formatUserType(roles) {
  const type = roles[0];
  switch (type) {
    case 'residentialCustomer':
      return 'Residential Customer';

    case 'businessCustomer':
      return 'Business Customer';

    case 'contractor':
      return 'Contractor';

    case 'driver':
      return 'Driver';

    default:
      break;
  }
  return type;
}

/**
 * Get resize url from a S3 image url
 *
 * @param {string} orgUrl original image url
 * @param {number} width width of preivew image
 * @param {number} height height of preview image
 */
export function getResizeUrl(orgUrl, width, height) {
  if (!orgUrl) {
    return `https://via.placeholder.com/${width}x${height}?text=No+image`;
  }
  const baseUrl = orgUrl.substring(0, orgUrl.lastIndexOf('/') + 1);
  const filename = orgUrl.substring(orgUrl.lastIndexOf('/') + 1, orgUrl.length);
  const previewUrl = `${baseUrl}${width}x${height}/${filename}`;
  return previewUrl;
}

export function truncate(str, maxLength = 100, ending = '...') {
  if (str.length <= maxLength) return str;

  // trim the string to the maximum length
  let trimmedString = str.substr(0, maxLength);

  // re-trim if we are in the middle of a word
  trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')));

  return trimmedString + ending;
}

export function readBlobError(error) {
  if (error) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(JSON.parse(reader.result));
      };

      reader.onerror = () => {
        reject(error);
      };

      reader.readAsText(error);
    });
  }
  return Promise.reject(error);
}
