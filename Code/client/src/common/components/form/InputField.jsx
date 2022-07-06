import React from 'react';
import PropTypes from 'prop-types';
import ErrorList from './ErrorList';
import { normalizePhoneNumber10 } from '../../../common/components/form/reduxFormComponents';

/**
 * Form group field for input tag
 * Used with Field component of redux-form
 */
const InputField = (props) => {
  const {
    input,
    meta: { touched, error },
    label,
    type,
    viewOnly,
    required,
    style,
    styleLabel,
    phone,
    className,
    prefixIcon,
    ...otherProps
  } = props;
  const errorName = touched && error ? 'has-error' : '';
  const requireMark = <span style={{ color: '#a94442' }}>*</span>;
  return (
    <div className={`form-group ${errorName} ${className}`} style={style}>
      {label && <label className="control-label" style={styleLabel}>{label} {required ? requireMark : null}</label>}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: 'rgb(246, 246, 246)',
        }}
      >
        {prefixIcon && (
          <span
            style={{
              lineHeight: '40px',
              marginRight: 10,
              marginLeft: 10,
              ...style.icon,
            }}
          >
            {prefixIcon}
          </span>
        )}
        {viewOnly ? (
          <p className="form-control-static">
            {
              phone ? normalizePhoneNumber10(input.value) : input.value
            }
          </p>
        ) : (
          <input {...input} {...otherProps} className="form-control" type={type} />
        )}
      </div>
      {touched && <ErrorList errors={error} />}
    </div>
  );
};

InputField.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  viewOnly: PropTypes.bool,
  required: PropTypes.bool,
  style: PropTypes.object,
  styleLabel: PropTypes.object,
  phone: PropTypes.bool,
  className: PropTypes.string,
  prefixIcon: PropTypes.object,
};

InputField.defaultProps = {
  label: '',
  type: '',
  viewOnly: false,
  required: false,
  style: {},
  styleLabel: {},
  phone: false,
  className: '',
  prefixIcon: null,
};


export default InputField;
