/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import WasteTypeSelectField from './WasteTypeSelectField';
import InputField from '../../../common/components/form/InputField';

/**
 * bootstrap form group component to be used with redux-form
 */
class WasteTypesField extends React.Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    label: PropTypes.string,
    viewOnly: PropTypes.bool,
  }

  static defaultProps = {
    viewOnly: false,
    label: '',
  }

  handleAdd = () => {
    this.props.fields.push({});
  }

  render() {
    const {
      fields,
      meta: { error, submitFailed },
      viewOnly,
      label,
      ...otherProps
    } = this.props;
    const removeBtnStyle = {
      fontSize: '26px',
      color: '#f06666',
      cursor: 'pointer',
      marginTop: '29px',
      display: 'block',
    };
    const className = submitFailed && error ? 'has-error' : '';
    return (
      <div className={`form-group ${className}`}>
        <label className="control-label">{label}</label>
        {fields.map((fieldName, index) => (
          <div key={index} className="row">
            <div className="col-md-6">
              <Field
                name={`${fieldName}.wasteType`}
                label={index === 0 ? 'Type' : ''}
                component={WasteTypeSelectField}
                viewOnly={viewOnly}
                {...otherProps}
              />
            </div>
            <div className="col-md-4">
              <Field
                name={`${fieldName}.price`}
                label={index === 0 ? 'Price ($/ton)' : ''}
                component={InputField}
                viewOnly={viewOnly}
                {...otherProps}
              />
            </div>
            <div className="col-md-2">
              {!viewOnly && (
                <span
                  className="handel-cross"
                  style={{ ...removeBtnStyle, marginTop: index === 0 ? '29px' : '7px' }}
                  onClick={() => fields.remove(index)}
                />
              )}
            </div>
          </div>
        ))}
        {submitFailed && error && <span className="help-block">{error}</span>}
        {!viewOnly && (
          <p>
            <a onClick={this.handleAdd} style={{ color: '#239dff' }}>
              <strong>+ Add more Waste Type</strong>
            </a>
          </p>
        )}
      </div>
    );
  }
}

export default WasteTypesField;
