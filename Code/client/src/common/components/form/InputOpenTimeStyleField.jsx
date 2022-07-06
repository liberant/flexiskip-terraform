import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';

import { timeSet } from '../../constants/commonTypes';

const widgetStyles = {
  box: {
    backgroundColor: '#FFFFFF',
    boxShadow: '0 2px 4px 0 rgba(102, 102, 102, 0.5)',
    color: '#666666',
    fontSize: 14,
    padding: '2px 0 2px 16px',
    lineHeight: '28px',
    position: 'absolute',
    zIndex: 12,
    width: '150px',
    marginTop: 4,
    borderRadius: 3,
    height: 100,
    overflow: 'auto',
  },
  unSelectedText: {
    fontWeight: 400,
    paddingRight: 15,
  },
  selectedText: {
    fontWeight: 600,
    paddingRight: 15,
  },
  unSelectedIcon: {
    display: 'none',
  },
  selectedIcon: {
    display: 'initial',
    color: '#239dff',
  },
};

class InputOpenTimeStyleField extends React.Component {
  constructor(props) {
    super(props);

    const index = props.input.value ? timeSet.findIndex(t => t.text === props.input.value.text) : 0;

    this.state = {
      isRulesShow: false,
      currentTimeIndex: index >= 0 ? index : 0,
    };

    this.onHandleClick = this.onHandleClick.bind(this);
    this.onHandleSelectTime = this.onHandleSelectTime.bind(this);
  }

  componentDidMount() {
    const { input } = this.props;
    const { currentTimeIndex } = this.state;

    let valueIndex = -1;
    if (input.value && !input.value.text) {
      valueIndex = timeSet.findIndex(t => input.value === t.text);
      if (valueIndex >= 0) {
        this.state.currentTimeIndex = valueIndex;
        // this.setState({ currentTimeIndex: valueIndex });
        input.onChange(timeSet[valueIndex]);
      }
    }

    if (valueIndex < 0) {
      input.onChange(timeSet[currentTimeIndex]);
    }
  }

  onHandleSelectTime(i) {
    const { input } = this.props;

    input.onChange(timeSet[i]);

    this.setState({
      currentTimeIndex: i,
      isRulesShow: false,
    });
  }

  onHandleClick() {
    const { isRulesShow } = this.state;
    this.setState({ isRulesShow: !isRulesShow });
  }

  render() {
    const {
      meta: { touched, error, warning },
      label,
      required,
      style,
      input,
    } = this.props;

    const {
      isRulesShow,
      currentTimeIndex,
    } = this.state;
    const {
      box, selectedText, selectedIcon, unSelectedIcon, unSelectedText,
    } = widgetStyles;

    const { value } = input;
    let timeContent = '';
    if (value) {
      if (value.text) {
        timeContent = value.text;
      } else {
        timeContent = value;
      }
    } else {
      timeContent = timeSet[currentTimeIndex] && timeSet[currentTimeIndex].text;
    }

    return (
      <div style={{ marginBottom: 15, marginTop: 1, ...style.outerBox }}>
        {label && (
          <label style={{ paddingLeft: 10, ...style.label }}>
            {required ? `${label} *` : `${label}`}
          </label>
        )}
        <div style={{ marginTop: 9, ...style.inputBox }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: 5,
              cursor: 'pointer',
            }}
            onClick={this.onHandleClick}
          >
            <div>
              {timeContent}
            </div>
            <div>
              <i className="fa fa-caret-down" />
            </div>
          </div>
          {
            isRulesShow && (
              <div style={box}>
                {
                  timeSet.map((t, i) => (
                    <div
                      style={{ cursor: 'pointer' }}
                      key={shortid.generate()}
                    >
                      <span
                        style={
                          i === currentTimeIndex ? selectedText : unSelectedText
                        }
                        onClick={() => this.onHandleSelectTime(i)}
                      >
                        {t.text}
                      </span>
                      <i
                        className="fa fa-check-circle"
                        style={
                          i === currentTimeIndex ? selectedIcon : unSelectedIcon
                        }
                      />
                    </div>
                  ))
                }
              </div>
            )
          }
        </div>

        {touched &&
          ((error && <span className="text-danger">{error}</span>) ||
            (warning && <span>{warning}</span>))}
      </div>
    );
  }
}

InputOpenTimeStyleField.propTypes = {
  input: PropTypes.any.isRequired,
  label: PropTypes.string,
  meta: PropTypes.any.isRequired,
  required: PropTypes.bool,
  style: PropTypes.any,
};

InputOpenTimeStyleField.defaultProps = {
  label: '',
  required: false,
  style: {},
};

export default InputOpenTimeStyleField;
