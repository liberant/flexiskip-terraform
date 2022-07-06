import React, { Component } from 'react';
import { any, func } from 'prop-types';

/* eslint react/prop-types: 0 */
/* eslint react/require-default-props: 0 */

const Styles = {
  icon: {
    fontSize: 16,
    cursor: 'pointer',
  },
};

class CounterInputField extends Component {
  static propTypes = {
    value: any,
    onChange: func,
  };

  constructor(props) {
    super(props);

    this.handleAddCounter = this.handleAddCounter.bind(this);
    this.handleSubtractCounter = this.handleSubtractCounter.bind(this);
  }

  handleAddCounter(input) {
    let value = parseInt(input.value || '0', 10);
    value += 1;
    input.onChange(`${value}`);
  }

  handleSubtractCounter(input) {
    let value = parseInt(input.value || '0', 10);
    value -= 1;
    if (value < 0) {
      value = 0;
    }
    input.onChange(`${value}`);
  }

  render() {
    const {
      input,
      label,
      required,
      style,
      placeholder,
      disabled,
      meta: { touched, error, warning },
    } = this.props;

    return (
      <div style={{ marginBottom: 15 }}>
        <label style={style.label}>
          {required ? `${label} *` : `${label}`}
        </label>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...style.inputBox }}>
          {
            (
              <span style={{
                  fontSize: 20,
                  lineHeight: '38px',
                  marginRight: 10,
                  marginLeft: 10,
              }}
              >
                <span style={Styles.icon} onClick={() => this.handleSubtractCounter(input)}><i className="fa fa-minus" /></span>
              </span>
            )
          }

          <input
            className="form-control"
            {...input}
            placeholder={placeholder}
            disabled={disabled}
            style={{ display: 'inline-block', ...style.input }}
          />
          {
            touched &&
            ((error && <span className="text-danger">{error}</span>) ||
              (warning && <span>{warning}</span>))
          }

          {
            (
              <span style={{
                  fontSize: 20,
                  lineHeight: '38px',
                  marginRight: 10,
                  marginLeft: 10,
              }}
              >
                <span style={Styles.icon} onClick={() => this.handleAddCounter(input)}><i className="fa fa-plus" /></span>
              </span>
            )
          }
        </div>
      </div>
    );
  }
}

export default CounterInputField;
