import React from 'react';
import PropTypes from 'prop-types';
import ErrorList from './ErrorList';

/**
 * Form group field for textarea
 * Used with Field component of redux-form
 */
const TextAreaField = (props) => {
  const {
    input,
    meta: { touched, error },
    label,
    ...otherProps
  } = props;
  const className = touched && error ? 'has-error' : '';
  return (
    <div className={`form-group ${className}`}>
      {label && <label className="control-label">{label}</label>}
      <textarea {...input} {...otherProps} className="form-control" />
      {touched && <ErrorList errors={error} />}
    </div>
  );
};

TextAreaField.propTypes = {
  label: PropTypes.string,
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
};

TextAreaField.defaultProps = {
  label: '',
};

export default TextAreaField;
