import React from 'react';
import PropTypes from 'prop-types';
import DropdownList from 'react-widgets/lib/DropdownList';

import 'react-widgets/dist/css/react-widgets.css';


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
    width: '230px',
    marginTop: 5,
    borderRadius: 3,
    height: 132,
    overflow: 'auto',
    letterSpacing: 2,
  },
  unMatched: {
    color: '#666666',
    fontSize: 19,
    display: 'none',
    marginRight: 12,
  },
  matched: {
    color: '#239dff',
    fontSize: 19,
    display: 'inline-block',
    marginLeft: 12,
  },
  title: {
    cursor: 'pointer',
  },
};

const matchedIcon = 'handel-check-circle-fulfill';

const ListItem = (props) => {
  const { text, item } = props;

  return (
    <div>
      <span
        style={item.selected ? { fontWeight: 600 } : {}}
      >
        {text}
      </span>
      <span
        className={item.selected ? matchedIcon : ''}
        style={item.selected ? widgetStyles.matched : null}
      />
    </div>
  );
};
ListItem.propTypes = {
  text: PropTypes.string.isRequired,
  item: PropTypes.any.isRequired,
};

class InputOpenTimeField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timeSet: [
        {
          text: '08:30 AM',
          value: '08:30 AM',
          selected: false,
          index: 0,
        },
        {
          text: '09:00 AM',
          value: '09:00 AM',
          selected: false,
          index: 1,
        },
        {
          text: '09:30 AM',
          value: '09:30 AM',
          selected: false,
          index: 2,
        },
        {
          text: '10:00 AM',
          value: '10:00 AM',
          selected: false,
          index: 3,
        },
        {
          text: '10:30 AM',
          value: '10:30 AM',
          selected: false,
          index: 4,
        },
        {
          text: '11:00 AM',
          value: '11:00 AM',
          selected: false,
          index: 5,
        },
        {
          text: '11:30 AM',
          value: '11:30 AM',
          selected: false,
          index: 6,
        },
        {
          text: '12:00 PM',
          value: '12:00 PM',
          selected: false,
          index: 7,
        },
        {
          text: '12:30 PM',
          value: '12:30 PM',
          selected: false,
          index: 8,
        },
        {
          text: '01:00 PM',
          value: '01:00 PM',
          selected: false,
          index: 9,
        },
        {
          text: '01:30 PM',
          value: '01:30 PM',
          selected: false,
          index: 10,
        },
        {
          text: '02:00 PM',
          value: '02:00 PM',
          selected: false,
          index: 11,
        },
        {
          text: '02:30 PM',
          value: '02:30 PM',
          selected: false,
          index: 12,
        },
        {
          text: '03:00 PM',
          value: '03:00 PM',
          selected: false,
          index: 13,
        },
        {
          text: '03:30 PM',
          value: '03:30 PM',
          selected: false,
          index: 14,
        },
        {
          text: '04:00 PM',
          value: '04:00 PM',
          selected: false,
          index: 15,
        },
        {
          text: '04:30 PM',
          value: '04:30 PM',
          selected: false,
          index: 16,
        },
        {
          text: '05:00 PM',
          value: '05:00 PM',
          selected: false,
          index: 17,
        },
        {
          text: '05:30 PM',
          value: '05:30 PM',
          selected: false,
          index: 18,
        },

      ],
    };

    this.onHandleSelect = this.onHandleSelect.bind(this);
  }

  // onHandleKeyPress(e) {
  //   if (e.which === 13) {
  //     e.preventDefault();
  //   }
  // }

  onHandleSelect(time) {
    const { text } = time;
    const tmpTimeSet = this.state.timeSet.map((t) => {
      const tmpTime = t;
      tmpTime.selected = false;
      if (text.includes(tmpTime.text)) {
        tmpTime.selected = true;
      }

      return tmpTime;
    });

    this.setState(() => ({ timeSet: tmpTimeSet }));
  }

  render() {
    const {
      input, meta: { touched, error, warning },
      label, required,
      style,
      className = '',
    } = this.props;
    const { timeSet } = this.state;

    return (
      <div style={{ marginBottom: 15, ...style.outerBox }}>
        <label style={style.label}>
          {(required && label) ? `${label} *` : `${label}`}
        </label>
        <div
          className={className}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            ...style.inputBox,
          }}
        >
          <DropdownList
            {...input}
            data={timeSet}
            textField="text"
            valueField="value"
            // onChange={this.onHandleSelect}
            onSelect={this.onHandleSelect}
            itemComponent={ListItem}
          />
        </div>
        <div>
          {
            touched &&
            ((error && <span className="text-danger" style={{ ...style.error }}>{error}</span>) ||
              (warning && <span>{warning}</span>))
          }
        </div>
      </div>
    );
  }
}

InputOpenTimeField.propTypes = {
  input: PropTypes.any.isRequired,
  label: PropTypes.string,
  meta: PropTypes.any.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  style: PropTypes.any,
  className: PropTypes.string,
};

InputOpenTimeField.defaultProps = {
  label: '',
  placeholder: '',
  required: false,
  disabled: false,
  style: {},
  className: '',
};

export default InputOpenTimeField;
