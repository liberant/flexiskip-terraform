/* eslint-disable prefer-destructuring */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component that display validation error
 */
const ErrorList = ({ errors }) => {
  let msg = '';
  if (Array.isArray(errors)) {
    if (errors.length > 0) {
      msg = errors[0];
    }
  } else {
    msg = errors;
  }
  return msg.length > 0 ? (<span className="help-block">{msg}</span>) : null;
};

ErrorList.propTypes = {
  errors: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
};

ErrorList.defaultProps = {
  errors: [],
};

export default ErrorList;
