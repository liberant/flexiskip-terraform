import React from 'react';
import PropTypes from 'prop-types';
import { AutoComplete } from 'antd';
import ErrorList from './ErrorList';

/**
 * Form group field for auto complete input
 * Used with Field component of redux-form
 */
const AutoCompleteInput = (props) => {
  const {
    input,
    meta: { touched, error },
    label,
    required,
    style,
    styleLabel,
    errorMatch,
    ...otherProps
  } = props;
  const className = touched && error ? 'has-error' : '';
  const requireMark = <span style={{ color: '#a94442' }}>*</span>;
  return (
    <div className={`form-group ${className}`} style={style}>
      {label && (
        <label className="control-label" style={styleLabel}>
          {label} {required ? requireMark : null}
        </label>
      )}
      <AutoComplete
        className="form-control"
        style={{ height: "40px" }}
        {...otherProps}
      >
        <input {...input} className="form-control" autoComplete="nope" />
      </AutoComplete>
      {touched && <ErrorList errors={error} />}
      {touched && errorMatch && errorMatch.length > 0 && (
        <span className="text-danger">{errorMatch}</span>
      )}
    </div>
  );
};

AutoCompleteInput.propTypes = {
  label: PropTypes.string,
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  required: PropTypes.bool,
  style: PropTypes.object,
  styleLabel: PropTypes.object,
};

AutoCompleteInput.defaultProps = {
  label: '',
  required: false,
  style: {},
  styleLabel: {},
};


export default AutoCompleteInput;
