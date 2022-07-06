import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import { Field } from 'redux-form';

import {
  // email,
  renderInput,
  required,
  renderStaticText2Rows,
  number,
  decimalAllowed,
} from '../../../../common/components/form/reduxFormComponents';
import { paymentOptions } from '../../../../common/constants/payment-options';

import './PaymentMethod.css';

const cssName = 'payment-method';
const APP_BACKGROUND_COLOR = '#F6F6F6';

const Styles = {
  input: {
    backgroundColor: 'transparent',
    boxShadow: '0 0 0',
    borderWidth: 0,
  },
  inputBox: {
    backgroundColor: APP_BACKGROUND_COLOR,
    borderRadius: '5px',
  },
};

const STRIPE_METHOD = 'stripe';

class PaymentMethod extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleValueChange = this.handleValueChange.bind(this);
  }
  componentDidMount() {
    const {
      input: {
        value = [],
      },
      initialize,
      customer,
      path,
    } = this.props;
    if (value.length === 0) {
      // need to initialize entire form data
      // help to keep the original
      this.updateObject(customer, path, [{
        type: STRIPE_METHOD,
      }]);
      initialize(customer);
    }
    // else if (this.isChecked('invoice')) {
    // change('maximumInvoice', this.getMaximumInvoice());
    // }
  }
  getMaximumInvoice() {
    if (this.isChecked('invoice')) {
      const {
        input: {
          value = [],
        },
      } = this.props;
      return (value.find(val => val.type === 'invoice') || {}).maximumInvoice;
    }
    return '';
  }
  getInvoiceIndex = () => {
    const {
      input: {
        value = [],
      },
    } = this.props;
    if (value) {
      return value.findIndex(val => val.type === 'invoice');
    }
    return -1;
  }
  isChecked(type) {
    const {
      input: {
        value = [],
      },
    } = this.props;
    if (value) {
      return value.find(val => val.type === type) || false;
    }
    return false;
  }
  handleValueChange(type) {
    return () => {
      if (type !== STRIPE_METHOD) {
        const {
          input: {
            onChange,
            value,
          },
        } = this.props;
        if (!this.isChecked(type)) {
          value.push({
            type,
          });
          onChange([...value]);
        } else {
          const index = value.findIndex(val => val.type === type);
          value.splice(index, 1);
          onChange([...value]);
        }
        // need to forceUpdate help to update the array value
        this.forceUpdate();
      }
    };
  }
  updateObject(object, path, newValue) {
    /* eslint no-param-reassign: 0 */
    const stack = path.split('.');
    while (stack.length > 1) {
      object = object[stack.shift()];
    }
    object[stack.shift()] = newValue;
  }
  renderOptionRequire() {
    const {
      isEdit,
    } = this.props;
    if (this.isChecked('invoice')) {
      const invoiceIndex = this.getInvoiceIndex();
      return (
        <Field
          className="maximum-invoice"
          name={`organisation.paymentTypes[${invoiceIndex}].maximumInvoice`}
          label="Maximum Spend per Order"
          component={
            isEdit ? renderInput : renderStaticText2Rows
          }
          style={isEdit ? Styles : {}}
          required={isEdit}
          validate={[required, number]}
          normalize={decimalAllowed}
          price
        />
      );
    }
    return null;
  }
  renderEditForm() {
    const {
      cardLast4Digits,
      isEdit,
      input: {
        value = [],
      },
    } = this.props;
    const emptyValue = (!value) || (value && value.length === 0);
    return paymentOptions.map(option => (
      <React.Fragment key={option.value}>
        <div className={`${cssName}_option`}>
          {
            isEdit && (
              <div className={`${cssName}_option--checkbox`}>
                <Checkbox
                  checked={this.isChecked(option.value)}
                  onChange={this.handleValueChange(option.value)}
                />
              </div>
            )
          }
          <div
            className={`${cssName}_option--control ${emptyValue && 'payment-method--invalid-form'}`}
            onClick={isEdit ? this.handleValueChange(option.value) : () => {}}
            style={isEdit ? { cursor: 'pointer' } : {}}
          >
            <span className="method-label" style={option.labelStyle}>
              {
                option.leftIcon && <i className={`method-icon ${option.leftIcon}`} />
              }<b>{option.label}</b>
            </span>
            <div className="method-optional">
              {
                option.value === STRIPE_METHOD && (
                  <div>
                    ****&nbsp;****&nbsp;****&nbsp;{cardLast4Digits && cardLast4Digits}
                  </div>
                )
              }
              {
                this.isChecked(option.value) && (
                  <i className="optional-checked fa fa-check-circle" aria-hidden="true" />
                )
              }
            </div>
          </div>
        </div>
        {option.value === 'invoice' && this.renderOptionRequire()}
      </React.Fragment>
    ));
  }
  renderReadForm() {
    const {
      cardLast4Digits,
    } = this.props;
    return paymentOptions.map(option => (
      <React.Fragment key={option.value}>
        <div className={`${cssName}_option ${cssName}_option--view`}>
          <div className={`${cssName}_option--checkbox`}>
            <Checkbox checked={this.isChecked(option.value)} />
          </div>
          <div className={`${cssName}_option--control`}>
            <span className="method-label" style={option.labelStyle}>
              {
                option.leftIcon && <i className={`method-icon ${option.leftIcon}`} />
              }<b>{option.label}</b>
            </span>
            <div className="method-optional">
              {
                option.value === STRIPE_METHOD && (
                  <div>
                    ****&nbsp;****&nbsp;****&nbsp;{cardLast4Digits && cardLast4Digits}
                  </div>
                )
              }
              {
                this.isChecked(option.value) && (
                  <i className="optional-checked fa fa-check-circle" aria-hidden="true" />
                )
              }
            </div>
          </div>
        </div>
        {option.value === 'invoice' && this.renderOptionRequire()}
      </React.Fragment>
    ));
  }
  render() {
    const {
      isEdit,
    } = this.props;
    return (
      <div className={cssName}>
        {isEdit ? this.renderEditForm() : this.renderReadForm()}
      </div>
    );
  }
}

PaymentMethod.propTypes = {
  cardLast4Digits: PropTypes.string,
  input: PropTypes.shape({
    value: PropTypes.array,
    onChange: PropTypes.func,
  }),
  isEdit: PropTypes.bool,
  path: PropTypes.string.isRequired,
  customer: PropTypes.object.isRequired,
  initialize: PropTypes.func.isRequired,
};

PaymentMethod.defaultProps = {
  cardLast4Digits: null,
  input: {
    value: [{
      type: STRIPE_METHOD,
    }],
    onChange: () => {},
  },
  isEdit: false,
};

export default PaymentMethod;
