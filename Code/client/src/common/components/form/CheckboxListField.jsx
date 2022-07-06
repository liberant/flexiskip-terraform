/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
import { Checkbox } from 'antd';
import PropTypes from 'prop-types';
import ErrorList from './ErrorList';

const CheckboxGroup = Checkbox.Group;

function getLabelFromValue(value, options) {
  const item = options.find(o => o.value === value);
  return item ? item.label : '';
}

const CheckboxListField = (props) => {
  const {
    input: { value, onChange },
    meta: { touched, error },
    label,
    enable,
    viewOnly,
    options,
  } = props;
  const className = touched && error ? 'has-error' : '';
  const val = value === '' ? [] : value;
  const displayText = val.map(v => getLabelFromValue(v, options)).join(', ');
  return (
    <div className={`form-group ${className}`}>
      {label && <label className="control-label">{label}</label>}
      {viewOnly ? (<p className="form-control-static">{displayText}</p>) : (
        <div>
          <CheckboxGroup
            value={val}
            options={options}
            onChange={onChange}
            disabled={!enable}
          />
        </div>
      )}
      {touched && <ErrorList errors={error} />}
    </div>
  );
};

CheckboxListField.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  enable: PropTypes.bool,
  viewOnly: PropTypes.bool,
};

CheckboxListField.defaultProps = {
  enable: true,
  viewOnly: false,
};

export default CheckboxListField;
