
/* global google */
import React, { Component } from 'react';
import { DropdownList, DateTimePicker, SelectList, Multiselect } from 'react-widgets';
import axios from 'axios';
import MaskedInput from 'react-text-mask';
import { startCase } from 'lodash';
import moment from 'moment';
import momentLocaliser from 'react-widgets-moment';
import shortid from 'shortid';
import { Switch } from 'antd';
import { getFormattedDate, getFormattedTime, getFormattedDateTime } from '../../utils/common';
import {
  statusStyles,
  statusRefArray,
  textStyles,
} from '../../constants/styles';

// define special eslint rules for this file.
/* eslint react/prop-types: 0 */
/* eslint no-restricted-globals: 0 */
/* eslint no-restricted-syntax: 0 */
/* eslint no-await-in-loop: 0 */
/* eslint prefer-destructuring: 0 */
/* eslint react/no-danger: 0 */
/* eslint-disable prefer-promise-reject-errors */


// Normalize functions
export const lowercase = value => value && value.toLowerCase();
export const uppercase = value => value && value.toUpperCase();
export const numberOnly = value => value && value.replace(/[^\d]/g, '');
export const decimalAllowed = value => value && value.replace(/[^\d|^.|^-]/g, '');

export const normalizeABNNumber = (value, previousValue) => {
  if (!value) {
    return value;
  }
  const onlyNums = value.replace(/[^\d]/g, '');
  if (!previousValue || value.length > previousValue.length) {
    // typing forward
    if (onlyNums.length === 2) {
      return `${onlyNums} `;
    }
    if ((onlyNums.length > 2) && (onlyNums.length < 6)) {
      return `${onlyNums.slice(0, 2)} ${onlyNums.slice(2, 5)}`;
    }
    if ((onlyNums.length > 5) && (onlyNums.length < 9)) {
      return `${onlyNums.slice(0, 2)} ${onlyNums.slice(2, 5)} ${onlyNums.slice(5, 8)}`;
    }
    if (onlyNums.length > 8) {
      return `${onlyNums.slice(0, 2)} ${onlyNums.slice(2, 5)} ${onlyNums.slice(5, 8)} ${onlyNums.slice(8, 11)}`;
    }
  }
  if (onlyNums.length <= 2) {
    return onlyNums;
  }
  if ((onlyNums.length > 2) && (onlyNums.length < 6)) {
    return `${onlyNums.slice(0, 2)} ${onlyNums.slice(2, 5)}`;
  }
  if ((onlyNums.length > 5) && (onlyNums.length < 9)) {
    return `${onlyNums.slice(0, 2)} ${onlyNums.slice(2, 5)} ${onlyNums.slice(5, 8)}`;
  }
  if (onlyNums.length > 8) {
    return `${onlyNums.slice(0, 2)} ${onlyNums.slice(2, 5)} ${onlyNums.slice(5, 8)} ${onlyNums.slice(8, 11)}`;
  }

  return `${onlyNums.slice(0, 2)} ${onlyNums.slice(3)}`;
};

export const normalizePhoneNumber9 = (value, previousValue) => {
  if (!value) {
    return value;
  }
  const onlyNums = value.replace(/[^\d]/g, '');
  if (!previousValue || value.length > previousValue.length) {
    // typing forward
    if (onlyNums.length === 3) {
      return `${onlyNums} `;
    }
    if ((onlyNums.length > 3) && (onlyNums.length < 7)) {
      return `${onlyNums.slice(0, 3)} ${onlyNums.slice(3, 6)}`;
    }
    if (onlyNums.length > 6) {
      return `${onlyNums.slice(0, 3)} ${onlyNums.slice(3, 6)} ${onlyNums.slice(6, 9)}`;
    }
  }
  if (onlyNums.length <= 3) {
    return onlyNums;
  }
  if ((onlyNums.length > 3) && (onlyNums.length < 7)) {
    return `${onlyNums.slice(0, 3)} ${onlyNums.slice(3, 6)}`;
  }
  if (onlyNums.length > 6) {
    return `${onlyNums.slice(0, 3)} ${onlyNums.slice(3, 6)} ${onlyNums.slice(6, 9)}`;
  }

  return `${onlyNums.slice(0, 3)} ${onlyNums.slice(3)}`;
};

export const normalizePhoneNumber10 = (value, previousValue) => {
  if (!value) {
    return value;
  }

  const onlyNums = value.replace(/[^\d]/g, '');
  const preNums = onlyNums.substring(0, 2);

  if (!previousValue || value.length > previousValue.length) {
    // typing forward
    if ((onlyNums.length === 2) && (preNums !== '04')) {
      return `${onlyNums} `;
    }
    if ((onlyNums.length > 2) && (onlyNums.length < 7)) {
      if (preNums === '04') {
        return `${onlyNums.slice(0, 4)} ${onlyNums.slice(4, 6)}`;
      }
      return `${onlyNums.slice(0, 2)} ${onlyNums.slice(2, 6)}`;
    }
    if (onlyNums.length > 6) {
      if (preNums === '04') {
        return `${onlyNums.slice(0, 4)} ${onlyNums.slice(4, 7)} ${onlyNums.slice(7, 10)}`;
      }
      return `${onlyNums.slice(0, 2)} ${onlyNums.slice(2, 6)} ${onlyNums.slice(6, 10)}`;
    }
  }
  return value;
};

export const normalizeCVVPayment = (value, previousValue) => {
  if (!value) {
    return value;
  }
  const onlyNums = value.replace(/[^\d]/g, "");

  return `${onlyNums.slice(0, 3)}`;
};

export const normalizeCardNumberPayment = (value, previousValue) => {
  if (!value) {
    return value;
  }

  const onlyNums = value.replace(/[^\d]/g, '');

  if (!previousValue || value.length > previousValue.length) {
    // typing forward
    if (onlyNums.length < 5) {
      return `${onlyNums.slice(0, 4)} ${onlyNums.slice(4)}`;
    }
    if (onlyNums.length < 9) {
      return `${onlyNums.slice(0, 4)} ${onlyNums.slice(4, 8)} ${onlyNums.slice(8)}`;
    }
    if (onlyNums.length < 13) {
      return `${onlyNums.slice(0, 4)} ${onlyNums.slice(4, 8)} ${onlyNums.slice(
        8,
        12
      )} ${onlyNums.slice(12)}`;
    }
    if (onlyNums.length > 12) {
      return `${onlyNums.slice(0, 4)} ${onlyNums.slice(4, 8)} ${onlyNums.slice(
        8,
        12
      )} ${onlyNums.slice(12, 16)}`;
    }
  }
};


export const normalizePhoneNumber = (value, previousValue) => {
  if (!value) {
    return value;
  }
  const onlyNums = value.replace(/[^\d]/g, '');
  if (!previousValue || value.length > previousValue.length) {
    // typing forward
    if (onlyNums.length === 4) {
      return `${onlyNums} `;
    }
    if (onlyNums.length === 7) {
      return `${onlyNums.slice(0, 4)} ${onlyNums.slice(4)} `;
    }
  }
  if (onlyNums.length <= 4) {
    return onlyNums;
  }
  if (onlyNums.length <= 7) {
    return `${onlyNums.slice(0, 4)} ${onlyNums.slice(4)}`;
  }
  return (
    `${onlyNums.slice(0, 4)
    } ${
      onlyNums.slice(4, 7)
    } ${
      onlyNums.slice(7, 10)}`
  );
};

export const normalizeCardExpireDate = (value, previousValue) => {
  if (!value) {
    return value;
  }

  const onlyNums = value.replace(/[^\d]/g, '');
  if (!previousValue || value.length > previousValue.length) {
    if (onlyNums.length === 2) {
      return `${onlyNums}/`;
    }
    if (onlyNums.length > 5) {
      return `${onlyNums.slice(0, 2)}/${onlyNums.slice(2, 6)}`;
    }
  }
  if (onlyNums.length <= 2) {
    return onlyNums;
  }
  if (onlyNums.length > 5) {
    return `${onlyNums.slice(0, 2)}/${onlyNums.slice(2, 6)}`;
  }

  return `${onlyNums.slice(0, 2)}/${onlyNums.slice(2)}`;
};

export const normalizeBsbNumber = (value, previousValue) => {
  if (!value) {
    return value;
  }
  const onlyNums = value.replace(/[^\d]/g, '');
  if (!previousValue || value.length > previousValue.length) {
    // typing forward
    if (onlyNums.length === 3) {
      return `${onlyNums} `;
    }
    if (onlyNums.length > 5) {
      return `${onlyNums.slice(0, 3)} ${onlyNums.slice(3, 6)}`;
    }
  }
  if (onlyNums.length <= 3) {
    return onlyNums;
  }
  if (onlyNums.length > 5) {
    return `${onlyNums.slice(0, 3)} ${onlyNums.slice(3, 6)}`;
  }

  return `${onlyNums.slice(0, 3)} ${onlyNums.slice(3)}`;
};

export const normalizeCcv = (value) => {
  if (!value) {
    return value;
  }
  return value.replace(/[^\d]/g, '').slice(0, 4);
};


export const normalizeCreditCard = (value, previousValue) => {
  if (!value) {
    return value;
  }
  const onlyNums = value.replace(/[^\d]/g, '');
  if (!previousValue || value.length > previousValue.length) {
    // typing forward
    if (onlyNums.length === 4) {
      return `${onlyNums} `;
    }
    if ((onlyNums.length > 4) && (onlyNums.length < 9)) {
      return `${onlyNums.slice(0, 4)} ${onlyNums.slice(4, 8)}`;
    }
    if ((onlyNums.length > 4) && (onlyNums.length < 13)) {
      return `${onlyNums.slice(0, 4)} ${onlyNums.slice(4, 8)} ${onlyNums.slice(8, 12)}`;
    }
    if (onlyNums.length > 12) {
      return `${onlyNums.slice(0, 4)} ${onlyNums.slice(4, 8)} ${onlyNums.slice(8, 12)} ${onlyNums.slice(12, 16)}`;
    }
  }
  if (onlyNums.length <= 4) {
    return onlyNums;
  }
  if ((onlyNums.length > 4) && (onlyNums.length < 9)) {
    return `${onlyNums.slice(0, 4)} ${onlyNums.slice(4, 8)}`;
  }
  if ((onlyNums.length > 4) && (onlyNums.length < 13)) {
    return `${onlyNums.slice(0, 4)} ${onlyNums.slice(4, 8)} ${onlyNums.slice(8, 12)}`;
  }
  if (onlyNums.length > 12) {
    return `${onlyNums.slice(0, 4)} ${onlyNums.slice(4, 8)} ${onlyNums.slice(8, 12)} ${onlyNums.slice(12, 16)}`;
  }

  return `${onlyNums.slice(0, 4)} ${onlyNums.slice(4)}`;
};

export const normalizeBankAccount = (value, previousValue) => {
  if (!value) {
    return value;
  }
  const onlyNums = value.replace(/[^\d]/g, '');
  if (!previousValue || value.length > previousValue.length) {
    // typing forward
    if (onlyNums.length === 4) {
      return `${onlyNums} `;
    }
    if (onlyNums.length > 4) {
      return `${onlyNums.slice(0, 4)} ${onlyNums.slice(4, 9)}`;
    }
  }
  if (onlyNums.length <= 4) {
    return onlyNums;
  }
  if (onlyNums.length > 4) {
    return `${onlyNums.slice(0, 4)} ${onlyNums.slice(4, 9)}`;
  }

  return `${onlyNums.slice(0, 4)} ${onlyNums.slice(4)}`;
};


// Validation functions
export const required = (value) => {
  if (value === null || value === undefined) {
    return 'This field can\'t be blank';
  }

  if (typeof value === 'string' && value.trim() === '') {
    return 'This field can\'t be blank';
  }
  return undefined;
};
export const arrayRequired = errorMessage => value =>
  (value && value.length > 0 ? undefined : errorMessage);

export const maxLength = max => value =>
  (value && value.length > max ? `Must be ${max} characters or less` : undefined);
export const minLength = min => value =>
  (value && value.length < min ? `Must be ${min} characters or more` : undefined);
export const fixedLength = fixedLength => value =>
  (value && value.length !== fixedLength
    ? `Must be ${fixedLength} characters`
    : undefined);

export const minLength8 = minLength(8);
export const maxLength9 = maxLength(9);
export const maxLength256 = maxLength(256);

export const fixedLength11 = fixedLength(11);
export const fixedLength14 = fixedLength(14);

export const fixedNumberLength = fixedLength => value =>
  (value && value.replace(/[^\d]/g, '').length !== fixedLength
    ? `Must be ${fixedLength} numbers`
    : undefined);

export const fixedNumberLength6 = fixedNumberLength(6);
export const fixedNumberLength8 = fixedNumberLength(8);
export const fixedNumberLength9 = fixedNumberLength(9);
export const fixedNumberLength10 = fixedNumberLength(10);
export const fixedNumberLength11 = fixedNumberLength(11);
export const fixedNumberLength16 = fixedNumberLength(16);

export const minNumberLength = min => value =>
  (value && value.replace(/[^\d]/g, '').length < min
    ? `Must be ${min} numbers or more`
    : undefined);

export const maxNumberLength = max => value =>
  (value && value.replace(/[^\d]/g, '').length > max
    ? `Must be ${max} numbers or less`
    : undefined);

export const decimal = (value) => {
  if (!value) {
    return undefined;
  }

  return (String(value).indexOf('.') === String(value).lastIndexOf('.')) ? undefined : 'Invaild';
};

export const number = value =>
  (value && isNaN(Number(value)) ? 'Must be a number' : undefined);
export const minValue = min => value =>
  (value && value < min ? `Must be at least ${min}` : undefined);
export const email = value =>
  (value &&
    (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(value) ||
      value.length > 640)
    ? 'Invalid email address'
    : undefined);
export const alphaNumeric = value =>
  (value && /[^a-zA-Z0-9 ]/i.test(value)
    ? 'Only alphanumeric characters'
    : undefined);
export const phoneNumber = value =>
  (value && !/^([0-9]{10})$/i.test(value.replace(/[^\d]/g, ''))
    ? 'Invalid phone number, must be 10 digits'
    : undefined);
export const cvvNumber = (value) =>
  value && !/^([0-9]{10})$/i.test(value.replace(/[^\d]/g, ""))
    ? "Must be a number"
    : undefined;
export const isDomainName = value =>
  (value &&
    !/^(http:\/\/|https:\/\/)?([a-z0-9][a-z0-9-]*\.)+[a-z0-9][a-z0-9-]*$/.test(value)
    ? 'Invalid domain name'
    : undefined);

export const cardIsNotExpired = (value, allValues) => {
  // won't check for validity if year and month are not selected
  let year;

  if (allValues.billing && allValues.billing.expiration) {
    year = allValues.billing.expiration.year;
  }

  if (!value || isNaN(Number(value)) || !year) {
    return undefined;
  }

  // return error if selected year is equal to current year and month is less than
  return value < new Date().getMonth() + 1 && year === new Date().getFullYear()
    ? 'Expired card'
    : undefined;
};

/**
 * Password need to contain at least 3/4 of: uppercase, lowercase, number, and symbol
 * http://www.passwordmeter.com/
 * @param {string} value
 */
export const password = (value) => {
  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumbers = /\d/.test(value);
  const hasNonAlphanumeric = /\W/.test(value);

  return hasUpperCase + hasLowerCase + hasNumbers + hasNonAlphanumeric < 3
    ? 'Passsword needs to contain lower case, upper case, number, and symbol characters'
    : undefined;
};

export const objectArrayUniqueByKey = key => (values = []) => {
  const data = values.map(item => item[key]);
  return Array.from(new Set(data)).length === data.length
    ? undefined
    : `${startCase(key)} should be unique`;
};

export const validateMaskedBSBNumber = (value) => {
  if (!value) {
    return undefined;
  }
  const sanitizedNumber = value.replace(/-/g, '');
  return !sanitizedNumber || (sanitizedNumber.length !== 6) || isNaN(Number(sanitizedNumber))
    ? 'Invalid BSB number'
    : undefined;
};

export const validateMaskedCardExpireDate = (value) => {
  if (!value) {
    return undefined;
  }
  const sanitizedNumber = value.replace(/\//g, '');
  if (!sanitizedNumber || (sanitizedNumber.length !== 6) || isNaN(Number(sanitizedNumber))) {
    return 'Invalid Expire Date';
  }

  const month = parseInt(value.slice(0, 2), 10);
  const year = parseInt(value.slice(3), 10);
  const date = new Date();
  const nowFullYear = date.getFullYear();
  const nowMonth = date.getMonth() + 1;

  if (year < nowFullYear) {
    return 'Expired card';
  } else if ((year === nowFullYear) && (month < nowMonth)) {
    return 'Expired card';
  }

  return undefined;
};

export const validateDriverDOB = (value) => {
  const inputDate = new Date(value);
  const date = new Date();

  if ((date.getFullYear() - inputDate.getFullYear()) < 17) {
    return 'Invalid DOB';
  }

  return undefined;
};

export const validatePastDate = (value) => {
  const inputDate = moment(value);
  const date = moment().endOf('date');

  if (inputDate >= date) {
    return 'You are not allowed to enter a date in the future';
  }

  return undefined;
};

export const validateFutureDate = (value) => {
  const inputDate = moment(value);
  const date = moment().startOf('date');

  if (inputDate <= date) {
    return 'You are not allowed to enter a date in the past';
  }

  return undefined;
};

export const validateExpiryDateIssueDate = (value, allValues) => {
  const { driver } = allValues;

  if (driver.license) {
    if (driver.license.dateOfIssued && driver.license.expiryDate) {
      const expiryDate = new Date(driver.license.expiryDate);
      const dateOfIssued = new Date(driver.license.dateOfIssued);
      const date = new Date();

      if ((expiryDate <= date) || (expiryDate < dateOfIssued)) {
        return 'Expiry Date Error';
      }
    }
  }

  return undefined;
};

export const validateStartEndDate = (value, allValues) => {
  const { startDate, endDate } = allValues;

  if (startDate && endDate) {
    if (endDate < startDate) {
      return 'End Date Error';
    }
  }

  return undefined;
};

// used in DumpsiteDetails
export const validateDayStartEndTime = index => (value, allValues) => {
  const { openDays } = allValues;

  if (value && openDays) {
    if (openDays.constructor === Array) {
      let errorCount = 0;
      openDays.forEach((o, i) => {
        if (!o.fromTime || !o.toTime || !(i === index)) {
          return;
        }
        if (o.fromTime.index > o.toTime.index) {
          errorCount += 1;
        }
      });
      if (errorCount) {
        return 'End Time error';
      }
    }
  }

  return undefined;
};

export const validateDayStartEndTimeSet = [
  validateDayStartEndTime(0),
  validateDayStartEndTime(1),
  validateDayStartEndTime(2),
  validateDayStartEndTime(3),
  validateDayStartEndTime(4),
  validateDayStartEndTime(5),
  validateDayStartEndTime(6),
];


export const maskedPhoneNumber = (value) => {
  if (!value) {
    return undefined;
  }
  const sanitizedNumber = value.replace(/(\+|\s)/g, '');
  return sanitizedNumber && isNaN(Number(sanitizedNumber))
    ? 'Invalid phone number'
    : undefined;
};

export const composeAsyncValidators = validatorFns => async (values, dispatch, props, field) => {
  let errors;
  for (const validatorFn of validatorFns) {
    try {
      await validatorFn(values, dispatch, props, field);
    } catch (err) {
      errors = Object.assign({}, errors, err);
    }
  }

  if (errors) throw errors;
};


// const Styles = {
//   input: {
//     backgroundColor: 'transparent',
//     boxShadow: '0 0 0',
//     borderWidth: 0,
//   },
//   inputBox: {
//     backgroundColor: '#F6F6F6',
//     borderRadius: '5px',
//   },
//   sizePrefix: {
//     fontSize: 16,
//   },
//   sizePostfix: {
//     fontSize: 14,
//   },
// };
export const renderInput = ({
  input,
  label,
  type,
  meta: { touched, error, warning },
  placeholder,
  required,
  disabled = false,
  style = { },
  children,
  icon = false,
  rightSide = false,
  checkboxTitle = '',
  defaultValue = '',
  dollar = false,
  className = '',
}) => {
  if (icon) {
    return (
      <div
        style={{ marginBottom: 15, paddingLeft: 10, ...style.outerBox }}
        className={className && className}
      >
        <label style={style.label}>
          {(required && label) ? `${label} *` : `${label}`}
        </label>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...style.inputBox }}>
          {
            !rightSide && (
              <span style={{
                  // fontSize: 20,
                  lineHeight: '31px',
                  marginRight: 10,
                  marginLeft: 10,
                  ...style.icon,
              }}
              >
                {children}
              </span>
            )
          }
          {
            dollar && (
              <span style={{
                // fontSize: 20,
                lineHeight: '39px',
                marginRight: 10,
                marginLeft: 10,
                ...style.icon,
              }}
              >
                $
              </span>
            )
          }

          <input
            className="form-control"
            {...input}
            placeholder={placeholder}
            type={type}
            defaultValue={defaultValue}
            disabled={disabled}
            style={{ display: 'inline-block', ...style.input }}
            onKeyPress={(e) => { if (e.which === 13) { e.preventDefault(); } }}
          />
          {
            rightSide && (
              <span style={{
                  // fontSize: 20,
                  lineHeight: '38px',
                  marginRight: 10,
                  marginLeft: 10,
              }}
              >
                {children}
              </span>
            )
          }
        </div>
        {
          touched &&
          ((error && <span className="text-danger" style={{ ...style.error }}>{error}</span>) ||
            (warning && <span>{warning}</span>))
        }
      </div>
    );
  }
  if (type === 'hidden') {
    return <input {...input} type={type} />;
  }
  if (type === 'checkbox') {
    return (
      <div
        className={className && className}
        style={{ marginBottom: 15, paddingLeft: 10, ...style.outerBox }}
      >
        {checkboxTitle && (
          <label style={style.label}>
            {required ? `${checkboxTitle} *` : `${checkboxTitle}`}
          </label>
        )}
        <div style={style.checkboxOuterBox}>
          <div className="checkbox">
            <label style={style.label}>
              <input
                {...input}
                placeholder={placeholder}
                type={type}
                disabled={disabled}
                style={style.checkbox}
              />
              {label || ''}
            </label>
          </div>

          {touched &&
            ((error && <span className="text-danger">{error}</span>) ||
              (warning && <span>{warning}</span>))}
        </div>
      </div>
    );
  }
  return (
    <div
      style={{ marginBottom: 15, paddingLeft: 10, ...style.outerBox }}
      className={className && className}
    >
      {label && (
        <label style={style.label}>
          {required ? `${label} *` : `${label}`}
        </label>
      )}
      <div style={style.inputBox}>
        <input
          className="form-control"
          {...input}
          placeholder={placeholder}
          type={type}
          defaultValue={defaultValue}
          disabled={disabled}
          style={style.input}
          onKeyPress={(e) => { if (e.which === 13) { e.preventDefault(); } }}
        />

      </div>
      <div>
        {touched &&
          ((error && <span className="text-danger">{error}</span>) ||
            (warning && <span>{warning}</span>))}
      </div>
    </div>
  );
};

export const renderStaticImage = ({ input: { value }, label, style }) => {
  const imgStyle = {
    objectFit: 'cover',
    ...style,
  };

  if (!label) {
    return (
      <img
        src={value}
        alt=""
        style={imgStyle}
      />
    );
  }

  return (
    <div className="form-group">
      <label className="control-label">{label}</label>
      <div className="form-control-static">
        <img
          src={value}
          alt=""
          style={imgStyle}
        />
      </div>
    </div>
  );
};

export const renderStaticImage2Rows = ({ input: { value }, label, style }) => (
  <div>
    <div className="form-group">
      <label className="control-label col-sm-12" htmlFor={label}>
        {required ? `${label} *` : `${label}`}
      </label>
      <div className="col-sm-12">
        <img
          src={value}
          alt="Avatar"
          style={style}
        />
      </div>
    </div>
  </div>
);


export const renderStaticText = ({ input: { value }, label, style }) => (label ? (
  <div>
    <div className="form-group">
      <label className="control-label col-sm-2" htmlFor="email">
        {label}
      </label>

      <div className="col-sm-10">
        <p className="form-control-static" style={style}>
          {value}
        </p>
      </div>
    </div>
  </div>
) : (
  <span style={style}>{value}</span>
));

export const renderSwitchButton = ({
  input: { value, onChange }, label, style,
}) => {
  let defaultCheckValue = false;
  if (value === 'Active') {
    defaultCheckValue = true;
  } else if (value === 'Inactive') {
    defaultCheckValue = false;
  } else if (value === true || value === false) {
    defaultCheckValue = value;
  }

  return (label ? (
    <div>
      <div className="form-group-container" style={{ marginLeft: '-10px' }}>
        <label className="control-label col-sm-2" htmlFor="email">
          {label}
        </label>

        <div className="col-sm-10">
          <span>Active </span>
          <Switch
            className="ant-switch-checked"
            defaultChecked={defaultCheckValue}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  ) : (
    <span style={style}>{value}</span>
  ));
};

export const renderStatusText2Rows = ({
  style, label, input: { value },
}) => (
  <div>
    <div className="form-group row">
      <label className="control-label col-sm-12" htmlFor={label} style={style}>
        {label}
      </label>
      <div className="col-sm-12" style={style}>
        <span className="form-control-static">
          {value ? 'Active' : 'Inactive'}
        </span>
      </div>
    </div>
  </div>
);

export const renderSizeText2Rows = ({
  input, style, label, labelStyle = {},
}) => (
  <div>
    <div className="form-group row">
      <label className="control-label col-sm-12" htmlFor={label} style={labelStyle}>
        {required ? `${label} *` : `${label}`}
      </label>
      <div className="col-sm-12">
        <span className="form-control-static" style={style}>
            (L) {input.value.length || 0} <span className="handel-cross" />
            (W) {input.value.width || 0} <span className="handel-cross" />
            (H) {input.value.height || 0} mm
        </span>
      </div>
    </div>
  </div>
);

export const renderStaticText2Rows = ({
  input, label, style, initialValue, required, date, datetime, refArray, children, icon = false,
  statusArrayName = '', phone = false, price = false, labelStyle = {}, rightSide = false,
  datetimeOneLine = false, arrayCount = false, showArray = false, textFieldName = '', valueFieldName = '',
  html = false, valueArray = false, data, prefix
}) => {
  let content = input.value || initialValue;
  let contentTime = '';
  if (date) {
    content = getFormattedDate(moment.utc(input.value).local().format('YYYY-MM-DD HH:mm:ss').substr(0, 10));
  }
  if (datetime) {
    content = getFormattedDate(moment.utc(input.value).local().format('YYYY-MM-DD HH:mm:ss').substr(0, 10));
    contentTime = getFormattedTime(moment.utc(input.value).local().format('YYYY-MM-DD HH:mm:ss').substr(11));
  }

  if (datetimeOneLine) {
    content = getFormattedDateTime(moment.utc(input.value).local().format('YYYY-MM-DD HH:mm:ss'));
  }

  if (arrayCount) {
    content = (input.value && input.value.constructor === Array) ? input.value.length : 0;
  }

  if (phone) {
    content = normalizePhoneNumber10(input.value);
  }

  if (price) {
    content = '0.00';
    if (input.value && parseFloat(input.value)) {
      content = (parseFloat(input.value).toFixed(2));
    } else if (initialValue && parseFloat(initialValue)) {
      content = parseFloat(initialValue).toFixed(2);
    }
  }

  if (showArray) {
    if (input.value.constructor === Array) {
      content = '';
      input.value.forEach((v) => {
        if (content !== '') {
          content += ', ';
        }
        content += textFieldName ? v[textFieldName] : v;
      });
    }
  }

  if (valueArray) {
    if (data && data.constructor === Array) {
      data.forEach((v) => {
        if (v[`${valueFieldName}`] === input.value) {
          content = v[`${textFieldName}`];
        }
      });
    }
  }

  if (refArray) {
    if (input.value.constructor === Array) {
      content = '';
      input.value.forEach((v) => {
        if (!refArray[`${v}`]) return false;
        if (content !== '') {
          content += ', ';
        }
        content += refArray[`${v}`] && refArray[`${v}`].uiLabel;
        return true;
      });
    } else {
      content = refArray[`${input.value}`] && refArray[`${input.value}`].uiLabel;
    }
  }

  let tmpStatusStyles = {};

  if (statusArrayName && content) {
    const index = statusRefArray[statusArrayName].findIndex(s => s.label === content.trim());
    if ((index >= 0) && (index < statusRefArray[statusArrayName].length)) {
      tmpStatusStyles = statusRefArray[statusArrayName][index].styles;
    } else {
      tmpStatusStyles = {
        ...statusStyles.common,
        color: '#4a4a4a',
        borderColor: '#4a4a4a',
      };
    }
    tmpStatusStyles = {
      ...tmpStatusStyles,
      minHeight: 'auto',
      padding: '0',
      lineHeight: '15px',
      margin: 'unset',
    };
  }

  if (icon) {
    return (label ? (
      <div>
        <div className="form-group row" style={{ marginLeft: 0 }}>
          <label className="control-label col-sm-12" htmlFor={label} style={labelStyle}>
            {required ? `${label} *` : `${label}`}
          </label>
          <div className="col-sm-12">
            {
              !rightSide ? (
                <span>
                  <span>{children}</span>
                  <span className="form-control-static" style={style}>
                    {content}
                  </span>
                </span>
              ) : (
                <span>
                  <span className="form-control-static" style={style}>
                    {content}
                  </span>
                  <span>{children}</span>
                </span>
              )
            }

          </div>
        </div>
      </div>
    ) : (
    // <span style={style}>{input.value || initialValue}</span>
      <div>
        <div className="form-group row" style={{ marginLeft: 0 }}>
          <div className="col-sm-12">
            {children}
            <span className="form-control-static" style={style}>
              {content}
            </span>
          </div>
        </div>
      </div>
    ));
  }

  if (prefix){
    content = initialValue
    if (!initialValue){
      switch (input.value) {
        case 'standard':
        content = 'Standard';
        break;
        case 'gc':
        content = 'Gold Coast';
        break;
      }
    }
  }

  if (!input.value && initialValue) {
    input.onChange(initialValue);
  }

  return (label ? (
    <div>
      <div className="form-group row" style={{ marginLeft: 0 }} >
        <label className="control-label col-sm-12" htmlFor={label} style={labelStyle}>
          {required ? `${label} *` : `${label}`}
        </label>
        <div className="col-sm-12">
          <div className="form-control-static" style={{ ...textStyles.truncate, ...style, ...tmpStatusStyles }}>
            { !html ? content : (
              <span dangerouslySetInnerHTML={{ __html: content }} />
            ) }
          </div>
          {
            datetime ? (
              <div className="form-control-static" style={style}>
                { contentTime }
              </div>
            ) : undefined
          }

        </div>
      </div>
    </div>
  ) : (
    <span style={style}>{input.value || initialValue}</span>
  ));
};

// const Styles = {
//   textarea: {
//     backgroundColor: '#F6F6F6',
//     borderRadius: '5px',
//   },
// };
export const renderTextArea = ({
  input,
  label,
  meta: { touched, error, warning },
  placeholder,
  required,
  rows = 5,
  style = {},
}) => (
  <div style={{ marginBottom: 15, paddingLeft: 10 }}>
    {label && (
    <label style={style.label}>
        {required ? `${label} *` : `${label}`}
    </label>
      )}
    <div>
      <textarea
        rows={rows}
        className="form-control"
        {...input}
        placeholder={placeholder}
        style={style.textarea}
      />
      {touched &&
          ((error && <span className="text-danger">{error}</span>) ||
            (warning && <span>{warning}</span>))}
    </div>
  </div>
);

export const renderDropdwonList = ({
  input,
  label,
  meta: { touched, error, warning },
  data,
  required,
  dropdownLabel,
  style = { dropdownOuter: {} },
  children,
  icon = false,
  className = '',
  selectedText,
}) => {
  if (icon) {
    return (
      <div style={{ marginBottom: 15, ...style.dropdownOuter }}>
        {label && (
          <label style={style.label}>
            {required ? `${label} *` : `${label}`}
          </label>
        )}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            ...style.listBox,
            }}
          className={className}
        >
          <span style={{
            fontSize: 20,
            lineHeight: '38px',
            marginRight: 10,
            ...style.icon,
          }}
          >
            {children}
          </span>
          <select style={style} {...input} >
            <option value="">{dropdownLabel}</option>
            {data.map(d => typeof d === 'object' ? (
              <option
                key={shortid.generate()}
                value={d.value}
              >
                {selectedText ? selectedText(d.title) : d.title}
              </option>
            ) : (
              <option
                key={shortid.generate()}
                value={d}
              >
                {selectedText ? selectedText(d) : d}
              </option>
            ))}
          </select>
        </div>
        <div>
          {touched &&
            ((error && <span className="text-danger">{error}</span>) ||
              (warning && <span>{warning}</span>))}
        </div>
      </div>

    );
  }

  return (
    <div style={{ marginBottom: 15, ...style.dropdownOuter }}>
      {label && (
      <label style={style.label}>
        {required ? `${label} *` : `${label}`}
      </label>
    )}
      <div className={className}>
        {/* <DropdownList {...input} data={data} defaultValue={`${data[0]}`} /> */}
        <select style={style} {...input} >
          <option value="">{dropdownLabel}</option>
          {data.map(d => typeof d === 'object' ? (
              <option
                key={shortid.generate()}
                value={d.value}
              >
                {selectedText ? selectedText(d.title) : d.title}
              </option>
            ) : (
                <option
                  key={shortid.generate()}
                  value={d}
                >
                  {selectedText ? selectedText(d) : d}
                </option>
              )
          )}
        </select>
        {touched &&
          ((error && <span className="text-danger">{error}</span>) ||
            (warning && <span>{warning}</span>))}
      </div>
    </div>
  );
};


export const renderRWDropdownList = ({
  input,
  label,
  meta: { touched, error, warning },
  data,
  required,
  style = {},
  className = '',
}) => (
  <div style={{ marginBottom: 15, paddingLeft: 10 }}>
    {label && (
      <label style={style.label}>
        {required ? `${label} *` : `${label}`}
      </label>
      )}
    <div className={className}>
      <DropdownList {...input} data={data} defaultValue={`${data[0]}`} />
      {touched &&
          ((error && <span className="text-danger">{error}</span>) ||
            (warning && <span>{warning}</span>))}
    </div>
  </div>
);

export const renderValueFieldDropdownList = ({
  input,
  label,
  meta: { touched, error, warning },
  data,
  required,
  valueFieldName,
  textFieldName,
  style = {},
  dropUpFlag = false,
  className = '',
}) => (
  <div style={{ marginBottom: 15, paddingLeft: 10 }}>
    {label && (
      <label style={style.label}>
        {required ? `${label} *` : `${label}`}
      </label>
      )}
    <div className={className}>
      <DropdownList
        {...input}
        data={data}
        defaultValue={`${data[0]}`}
        valueField={valueFieldName}
        textField={textFieldName}
        dropUp={dropUpFlag}
      />
      {touched &&
          ((error && <span className="text-danger">{error}</span>) ||
            (warning && <span>{warning}</span>))}
    </div>
  </div>
);

export const renderMultiSelect = ({
  input,
  label,
  meta: { touched, error, warning },
  data,
  required,
  valueFieldName,
  textFieldName,
  style = {},
  dropUpFlag = false,
}) => (
  <div style={{ marginBottom: 15, paddingLeft: 10 }}>
    {label && (
      <label style={style.label}>
        {required ? `${label} *` : `${label}`}
      </label>
    )}
    <div>
      <Multiselect
        {...input}
        onBlur={() => input.onBlur()}
        value={input.value || []}
        data={data}
        defaultValue={`${data[0]}`}
        valueField={valueFieldName}
        textField={textFieldName}
        dropUp={dropUpFlag}
      />
      {touched &&
        ((error && <span className="text-danger">{error}</span>) ||
          (warning && <span>{warning}</span>))}
    </div>
  </div>
);


export const renderInputMasked = ({
  input,
  label,
  type,
  meta: { touched, error, warning },
  placeholder,
  required,
  mask,
  style = {},
}) => (
  <div style={{ marginBottom: 15, paddingLeft: 10 }}>
    {label && (
      <label style={style.label}>
        {required ? `${label} *` : `${label}`}
      </label>
      )}
    <div>
      <MaskedInput
        className="form-control"
        {...input}
        placeholder={placeholder}
        type={type}
        mask={mask}
      />
      {touched &&
        ((error && <span className="text-danger">{error}</span>) ||
          (warning && <span>{warning}</span>))}
    </div>
  </div>
);

export const renderDatePicker = ({
  input: { onChange, value },
  meta: { touched, error, warning },

  required,
  showTime = false,
  format = 'DD/MMM/YYYY', // format='MMMM / DD / YYYY'
  label,
  style = {},
  placeholder = '',
  className = '',
}) => {
  // moment.locale();
  // moment().format('LL')
  // momentLocalizer();
  momentLocaliser(moment);

  return (
    <div style={{ marginBottom: 15, paddingLeft: 10, ...style.outerBox }}>
      {label && (
        <label style={style.label}>{required ? `${label} *` : `${label}`}</label>
      )}
      <div className={className}>
        <DateTimePicker
          value={!value ? null : new Date(value)}
          format={format}
          time={showTime}
          placeholder={placeholder}
          onChange={onChange}
        />
        {touched &&
          ((error && <span className="text-danger">{error}</span>) ||
            (warning && <span>{warning}</span>))}
      </div>
    </div>
  );
};

export const renderSelectList = ({
  input,
  meta: { touched, error, warning },

  required,
  data,
  label,
  type = 'radiobutton',
  style = {},
}) => (
  <div style={{ marginBottom: 15, paddingLeft: 10 }}>
    {label && (
    <label style={style.label}>{required ? `${label} *` : `${label}`}</label>
      )}
    <div className="selectlist-box">
      <SelectList
        {...input}
        onBlur={() => input.onBlur()}
        data={data}
        multiple={(type === 'checkbox')}
      />
      {touched &&
          ((error && <span className="text-danger">{error}</span>) ||
            (warning && <span>{warning}</span>))}
    </div>
  </div>
);

// This can use as a redux-form component or standalone component
// It requires prop input={{value: fileId}} to render image
export class RenderS3Image extends Component {
  static defaultProps = {
    width: 200,
    height: 200,
  }

  state = { url: null, alt: this.props.alt, title: this.props.title }

  async componentDidMount() {
    const fileId = this.props.input ? this.props.input.value : null;
    await this.getImageUrl(fileId);
  }

  async componentWillReceiveProps(nextProps) {
    const fileId = nextProps.input ? nextProps.input.value : null;
    await this.getImageUrl(fileId);
  }

  getImageUrl = async (fileId) => {
    const { width, height } = this.props;

    if (fileId) {
      try {
        const { data: { url } } = await axios.get(`/cm/files/${fileId}`);
        this.setState({ url });
      } catch (error) {
        this.setState({ url: `http://via.placeholder.com/${width}x${height}` });
      }
    } else {
      this.setState({
        url: `http://via.placeholder.com/${width}x${height}`,
        alt: 'There is no image provided, this is just a placeholder image',
      });
    }
  }


  render() {
    const { width, height } = this.props;
    const { url, alt, title } = this.state;
    return (
      <div>
        {url && (
          <img
            src={this.state.url}
            alt={alt}
            style={{ width, height }}
            title={title || alt}
          />
        )}
      </div>
    );
  }
}
// Validate address
export const geoAddress = (values, dispatch, props, blurredField) => {
  const geocoder = new google.maps.Geocoder();
  // get address if value of field is an object
  const fieldProps = blurredField.split('.');
  let address = values;
  fieldProps.forEach((propKey) => {
    address = address[propKey];
  });
  return new Promise((resolve, reject) => {
    geocoder.geocode({
      address,
    }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        /* Count the commas in the fomatted address */
        const numCommas = address.match(/,/g) ? address.match(/,/g).length : 0;
        if (numCommas < 2) {
          // reverse error object from blurredfield
          let error = 'Address is incorrect';
          const fieldProps = blurredField.split('.').slice(0).reverse();
          fieldProps.forEach((propKey) => {
            error = { [propKey]: error };
          });
          reject(error);
        } else {
          resolve();
        }
      }
      // reverse error object from blurredfield
      let error = 'Address is not found on Google Map';
      const fieldProps = blurredField.split('.').slice(0).reverse();
      fieldProps.forEach((propKey) => {
        error = { [propKey]: error };
      });
      reject(error);
    });
  });
};

// require 3 parts of address
export const validateAddress = (value) => {
  if (value) {
    const numCommas = value.match(/,/g) ? value.match(/,/g).length : 0;
    if (numCommas < 2) {
      // reverse error object from blurredfield
      return 'Address is incorrect';
    }
  }
  return undefined;
};
