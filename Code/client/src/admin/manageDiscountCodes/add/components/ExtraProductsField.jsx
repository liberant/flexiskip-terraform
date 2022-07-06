/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import ProductsSelectField from './ProductsSelectField';
import InputField from '../../../../common/components/form/InputField';

/**
 * bootstrap form group component to be used with redux-form
 */
class ExtraProductField extends React.Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    viewOnly: PropTypes.bool,
  }

  static defaultProps = {
    viewOnly: false,
  }

  handleAdd = () => {
    this.props.fields.push({});
  }

  render() {
    const {
      fields,
      meta: { error, submitFailed },
      viewOnly,
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
        {!viewOnly && (
          <p>
            <a onClick={this.handleAdd} style={{ color: '#239dff' }}>
              <strong>+ Add more Product</strong>
            </a>
          </p>
        )}
        {fields.map((fieldName, index) => (
          <div key={index} className="row">
            <div className="col-md-6">
              <Field
                name={`${fieldName}.product`}
                label="Bonus Product"
                component={ProductsSelectField}
                viewOnly={viewOnly}
                {...otherProps}
              />
            </div>
            <div className="col-md-4">
              <Field
                name={`${fieldName}.quantity`}
                label="Quantity"
                component={InputField}
                viewOnly={viewOnly}
                {...otherProps}
              />
            </div>
            <div className="col-md-2">
              {!viewOnly && (
                <span
                  className="handel-cross"
                  style={removeBtnStyle}
                  onClick={() => fields.remove(index)}
                />
              )}
            </div>
          </div>
        ))}
        {submitFailed && error && <span className="help-block">{error}</span>}
      </div>
    );
  }
}

export default ExtraProductField;
