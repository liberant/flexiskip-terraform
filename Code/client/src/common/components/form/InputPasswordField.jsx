import React from 'react';
import PropTypes from 'prop-types';

const widgetStyles = {
  box: {
    backgroundColor: '#FFFFFF',
    boxShadow: '0 2px 4px 0 rgba(102, 102, 102, 0.5)',
    color: '#666666',
    fontSize: 14,
    padding: '21px 0 18px 16px',
    lineHeight: '28px',
    position: 'absolute',
    zIndex: 12,
    width: '350px',
    marginTop: 2,
    borderRadius: 3,
  },
  unMatched: {
    color: '#666666',
    fontSize: 19,
    display: 'inline-block',
    marginRight: 12,
  },
  matched: {
    color: '#239dff',
    fontSize: 19,
    display: 'inline-block',
    marginRight: 12,
  },
};

const unMatchedIcon = 'handel-check-circle';
const matchedIcon = 'handel-check-circle-fulfill';

class InputPasswordField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isRulesShow: false,
      ruleMatchStatus: [
        {
          icon: unMatchedIcon,
          style: widgetStyles.unMatched,
        },
        {
          icon: unMatchedIcon,
          style: widgetStyles.unMatched,
        },
        {
          icon: unMatchedIcon,
          style: widgetStyles.unMatched,
        },
        {
          icon: unMatchedIcon,
          style: widgetStyles.unMatched,
        },
      ],
    };

    this.onHandleKeyPress = this.onHandleKeyPress.bind(this);
    this.onHandleChange = this.onHandleChange.bind(this);
    this.onHandleFocus = this.onHandleFocus.bind(this);
    this.onHandleBlur = this.onHandleBlur.bind(this);
  }

  onHandleFocus(e) {
    const { input } = this.props;
    this.setState({ isRulesShow: true });
    input.onFocus(e);
  }

  onHandleBlur(e) {
    const { input } = this.props;

    this.setState({ isRulesShow: false });

    input.onBlur(e);
  }

  onHandleKeyPress(e) {
    if (e.which === 13) {
      this.setState({ isRulesShow: false });
      e.preventDefault();
    }
  }

  onHandleChange(e) {
    const { input } = this.props;
    const { value } = e.target;

    const tmpRuleMatch = [
      {
        icon: unMatchedIcon,
        style: widgetStyles.unMatched,
      },
      {
        icon: unMatchedIcon,
        style: widgetStyles.unMatched,
      },
      {
        icon: unMatchedIcon,
        style: widgetStyles.unMatched,
      },
      {
        icon: unMatchedIcon,
        style: widgetStyles.unMatched,
      },
    ];

    input.onChange(e);

    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) {
      tmpRuleMatch[0] = {
        icon: matchedIcon,
        style: widgetStyles.matched,
      };
    }

    if (/\d/.test(value)) {
      tmpRuleMatch[1] = {
        icon: matchedIcon,
        style: widgetStyles.matched,
      };
    }

    if (/\W/.test(value)) {
      tmpRuleMatch[2] = {
        icon: matchedIcon,
        style: widgetStyles.matched,
      };
    }

    if ((value.length >= 8) && (value.length <= 256)) {
      tmpRuleMatch[3] = {
        icon: matchedIcon,
        style: widgetStyles.matched,
      };
    }

    this.setState({
      isRulesShow: true,
      ruleMatchStatus: tmpRuleMatch,
    });
  }

  render() {
    const {
      input, meta: { touched, error, warning },
      label, type,
      required, disabled, icon, rightSide,
      placeholder, style, children, showRules
    } = this.props;

    const { isRulesShow, ruleMatchStatus } = this.state;

    if (icon) {
      return (
        <div style={{ marginBottom: 15, ...style.outerBox }}>
          <label style={style.label}>
            {(required && label) ? `${label} *` : `${label}`}
          </label>
          <div style={{ display: 'flex', justifyContent: 'space-between', ...style.inputBox }}>
            {
              !rightSide && (
                <span style={{
                  fontSize: 20,
                  lineHeight: '38px',
                  marginRight: 10,
                  marginLeft: 10,
                  ...style.icon,
                }}
                >
                  {children}
                </span>
              )
            }
            <input
              className="form-control"
              // {...input}
              placeholder={placeholder}
              type={type}
              disabled={disabled}
              style={{ display: 'inline-block', ...style.input }}
              onKeyPress={this.onHandleKeyPress}
              onChange={this.onHandleChange}
              onFocus={this.onHandleFocus}
              onBlur={this.onHandleBlur}
            />


            {
              rightSide && (
                <span style={{
                  fontSize: 20,
                  lineHeight: '38px',
                  marginRight: 10,
                  marginLeft: 10,
                }}
                >
                  {children}
                </span>
              )
            }
          </div>

          {
            touched &&
            ((error && <span className="text-danger" style={{ ...style.error }}>{error}</span>) ||
              (warning && <span>{warning}</span>))
          }
          {
            showRules && isRulesShow && (
              <div style={widgetStyles.box} className="triangle-tip-up">
                <div>
                  <span className={ruleMatchStatus[0].icon} style={ruleMatchStatus[0].style} />
                  <span>Use letters [a-z, A-Z]</span>
                </div>
                <div>
                  <span className={ruleMatchStatus[1].icon} style={ruleMatchStatus[1].style} />
                  <span>Use numbers [0-9]</span>
                </div>
                <div>
                  <span className={ruleMatchStatus[2].icon} style={ruleMatchStatus[2].style} />
                  <span>Use symbols like ^%$&</span>
                </div>
                <div>
                  <span className={ruleMatchStatus[3].icon} style={ruleMatchStatus[3].style} />
                  <span>Must be at least 8 characters</span>
                </div>
              </div>
            )
          }

        </div>
      );
    }
    if (type === 'hidden') {
      return <input {...input} type={type} />;
    }
    return (
      <div style={{ marginBottom: 15, ...style.outerBox }}>
        {label && (
          <label style={style.label}>
            {required ? `${label} *` : `${label}`}
          </label>
        )}
        <div style={style.inputBox}>
          <input
            className="form-control"
            {...input}
            placeholder={placeholder}
            type={type}
            disabled={disabled}
            style={style.input}
            onKeyPress={this.onHandleKeyPress}
            onChange={this.onHandleChange}
            onFocus={this.onHandleFocus}
            onBlur={this.onHandleBlur}
          />
          {
            showRules && isRulesShow && (
              <div style={widgetStyles.box}>
                <div>
                  <span className={ruleMatchStatus[0].icon} style={ruleMatchStatus[0].style} />
                  <span>Use letters [a-z, A-Z]</span>
                </div>
                <div>
                  <span className={ruleMatchStatus[1].icon} style={ruleMatchStatus[1].style} />
                  <span>Use numbers [0-9]</span>
                </div>
                <div>
                  <span className={ruleMatchStatus[2].icon} style={ruleMatchStatus[2].style} />
                  <span>Use symbols like ^%$&</span>
                </div>
                <div>
                  <span className={ruleMatchStatus[3].icon} style={ruleMatchStatus[3].style} />
                  <span>Must be at least 8 characters</span>
                </div>
              </div>
            )
          }
          {touched &&
            ((error && <span className="text-danger">{error}</span>) ||
              (warning && <span>{warning}</span>))}
        </div>
      </div>
    );
  }
}

InputPasswordField.propTypes = {
  input: PropTypes.any.isRequired,
  label: PropTypes.string,
  type: PropTypes.string.isRequired,
  meta: PropTypes.any.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  style: PropTypes.any,
  children: PropTypes.node,
  icon: PropTypes.bool,
  rightSide: PropTypes.bool,
  showRules: PropTypes.bool
};

InputPasswordField.defaultProps = {
  label: '',
  placeholder: '',
  required: false,
  disabled: false,
  style: {},
  children: undefined,
  icon: false,
  rightSide: false,
  showRules: true
};

export default InputPasswordField;
