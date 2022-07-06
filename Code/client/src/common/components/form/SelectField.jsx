import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select as AntSelect } from 'antd';
import ErrorList from './ErrorList';

function getLabelFromValue(value, options) {
  const item = options.find(o => o.value.toString() === value.toString());
  return item ? item.label : '';
}

/**
 * Select component
 */
export class Select extends Component {
  render() {
    const {
      options,
      ...passThroughProps
    } = this.props;
    return (
      <AntSelect {...passThroughProps}>
        {options.map(item => (
          item &&
          <AntSelect.Option
            value={item.value}
            key={item.value}
            disabled={item.disabled}
          >{item.label}
          </AntSelect.Option>
        ))}
      </AntSelect>
    );
  }
}

Select.propTypes = {
  options: PropTypes.array.isRequired,
};

/**
 * bootstrap form group component to be used with redux-form
 */
const SelectField = ({
  input: { value, ...inputRest },
  meta,
  label,
  viewOnly,
  style,
  styleLabel,
  required,
  multiple,
  className,
  ...otherProps
}) => {
  const { touched, error } = meta;
  const errorName = touched && error ? 'has-error' : '';
  let displayText = '';
  const val = (value === '' && multiple) ? [] : value;
  if (viewOnly) {
    displayText = Array.isArray(value)
      ? value.map((v) => getLabelFromValue(v, otherProps.options)).join(", ")
      : getLabelFromValue(val, otherProps.options);
  }
  const requireMark = <span style={{ color: '#a94442' }}>*</span>;
  return (
    <div className={`form-group ${errorName} ${className}`}>
      {label && <label className="control-label" style={styleLabel}>{label} {required ? requireMark : null}</label>}
      {viewOnly ? (<p className="form-control-static">{displayText}</p>) : (
        <Select
          value={val}
          mode={multiple ? 'multiple' : 'default'}
          className="form-control"
          {...inputRest}
          {...otherProps}
        />
      )}
      {touched && <ErrorList errors={error} />}
    </div>
  );
};

SelectField.propTypes = {
  label: PropTypes.string,
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  viewOnly: PropTypes.bool,
  multiple: PropTypes.bool,
  style: PropTypes.object,
  styleLabel: PropTypes.object,
  required: PropTypes.bool,
  className: PropTypes.string,
};

SelectField.defaultProps = {
  label: '',
  viewOnly: false,
  multiple: false,
  style: {},
  styleLabel: {},
  required: false,
  className: '',
};

export default SelectField;
