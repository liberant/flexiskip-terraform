import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { DatePicker } from 'antd';
import ErrorList from './ErrorList';

/**
 * bootstrap form group component to be used with redux-form
 */
const DatePickerField = ({
  input,
  meta,
  label,
  format,
  viewOnly,
  ...otherProps
}) => {
  const { touched, error } = meta;
  const { value, ...inputProps } = input;
  const className = touched && error ? 'has-error' : '';
  const val = value ? moment(value) : null;
  return (
    <div className={`form-group ${className}`}>
      {label && <label className="control-label">{label}</label>}
      {viewOnly ? (<p className="form-control-static">{val && val.format(format)}</p>) : (
        <DatePicker
          value={val}
          format={format}
          className="form-control"
          {...inputProps}
          {...otherProps}
        />
      )}
      {touched && <ErrorList errors={error} />}
    </div>
  );
};

DatePickerField.propTypes = {
  label: PropTypes.string,
  format: PropTypes.string,
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  viewOnly: PropTypes.bool,
};

DatePickerField.defaultProps = {
  label: '',
  format: 'DD/MMM/YYYY',
  viewOnly: false,
};

export default DatePickerField;
