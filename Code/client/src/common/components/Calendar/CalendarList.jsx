import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
import enUS from 'rc-calendar/lib/locale/en_US';
// import TimePickerPanel from 'rc-time-picker/lib/Panel';

import moment from 'moment';
import 'moment/locale/en-gb';

import 'rc-calendar/assets/index.css';

moment.locale('en-gb');
const now = moment();
// now.utcOffset(10);
const defaultCalendarValue = now.clone();
defaultCalendarValue.add(-1, 'month');
const timePickerElement = (
  // <TimePickerPanel
  //   defaultValue={[moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]}
  // />
  <div />
);

const listStyles = {
  outerBox: {
    marginTop: 2,
    position: 'absolute',
    minWidth: 242,
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
    border: 'solid 1px #e2eaf0',
    borderRadius: 3,
    // padding: 30,
    zIndex: 10,
    background: 'white',
    // display: 'flex',
    // right: 272,
    fontSize: 14,
  },
  outerBoxSmall: {
    width: 180,
    padding: '30px 30px',
    borderLeft: '1px solid #e2eaf0',
  },
  box: {
    borderRadius: 3,
    lineHeight: '34px',
    marginTop: 2,
    textAlign: 'center',
    cursor: 'pointer',
  },
  boxActive: {
    background: '#239dff',
    color: 'white',
    border: '1px solid #239dff',
  },
  boxInactive: {
    color: '#666666',
    background: 'white',
    border: '1px solid #dce1e6',
  },
  btnSubmit: {
    display: 'inline-block',
    background: '#239dff',
    width: 120,
    textAlign: 'center',
    color: 'white',
    lineHeight: '34px',
    borderRadius: 3,
    marginRight: 15,
    border: '1px solid #239dff',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnClear: {
    display: 'inline-block',
    background: '#ffffff',
    width: 120,
    textAlign: 'center',
    color: '#239dff',
    lineHeight: '34px',
    borderRadius: 3,
    marginRight: 15,
    border: '1px solid #239dff',
    fontWeight: '600',
    cursor: 'pointer',
  },

};

const lists = [
  {
    label: 'Custom',
    interval: -1,
  },
  {
    label: 'Last 7 Days',
    interval: 7,
  },
  {
    label: 'Last 30 Days',
    interval: 30,
  },
  {
    label: 'This Month',
    interval: -2,
  },
  {
    label: 'Last Month',
    interval: -3,
  },
];

const formatStr = 'YYYY-MM-DD HH:mm:ss';

function format(v) {
  return v ? v.format(formatStr) : '';
}

class CalendarList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // activeIndex: -1,
      activeIndex: this.props.activeIndex,
      customShowFlag: false,
      startDate: this.props.startDate,
      endDate: this.props.endDate,
    };
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onItemClick = this.onItemClick.bind(this);
    // this.onStandaloneChange = this.onStandaloneChange.bind(this);
    this.onStandaloneSelect = this.onStandaloneSelect.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onDateRangeSubmit = this.onDateRangeSubmit.bind(this);
    this.onDateRangeClear = this.onDateRangeClear.bind(this);
  }

  onDateRangeClear() {
    const { startDate, endDate } = this.props;
    this.setState({
      startDate,
      endDate,
    });
  }

  onDateRangeSubmit() {
    const { startDate, endDate } = this.state;

    if (!startDate || !endDate) {
      return;
    }

    this.props.handleDateRangClick(startDate, endDate);
    this.setState({ customShowFlag: false });
  }

  onItemClick(activeIndex) {
    if (activeIndex < 0 || activeIndex >= lists.length) {
      return;
    }

    const { handleClick, startDate, endDate } = this.props;

    if (handleClick && activeIndex) {
      this.props.handleClick(activeIndex, lists[activeIndex].interval);
      this.setState({ customShowFlag: false });
    } else if (!activeIndex) {
      this.setState({
        customShowFlag: true,
        startDate,
        endDate,
      });
    }
  }

  onMouseEnter(activeIndex) {
    if (activeIndex < 0 || activeIndex >= lists.length) {
      return;
    }

    this.setState({ activeIndex });
  }

  async onMouseLeave() {
    const { customShowFlag } = this.state;
    if (customShowFlag) {
      this.setState({ activeIndex: 0 });
    }
  }

  onStandaloneSelect(value) {
    this.setState({
      startDate: format(value[0]),
      endDate: format(value[1]),
    });
  }

  render() {
    const {
      activeIndex, customShowFlag,
      startDate, endDate,
    } = this.state;
    const { rightStyle } = this.props;

    return (
      <div style={{
        ...listStyles.outerBox,
        right: customShowFlag ? rightStyle.custom || 0 : rightStyle.normal || 0,
        }}
      >
        <div style={{ display: 'flex' }}>
          {
            customShowFlag ? (
              <div style={{ margin: 10 }}>
                <RangeCalendar
                  showToday={false}
                  showWeekNumber
                  dateInputPlaceholder={['start', 'end']}
                  selectedValue={[
                    moment(startDate),
                    moment(endDate),
                  ]}
                  locale={enUS}
                  showOk={false}
                  showClear
                  format="DD MMM YYYY"
                  onChange={this.onStandaloneChange}
                  onSelect={this.onStandaloneSelect}
                  // disabledDate={disabledDate}
                  timePicker={timePickerElement}
                  // disabledTime={disabledTime}
                />
              </div>
            ) : null
          }
          <div
            style={customShowFlag ? listStyles.outerBoxSmall : { padding: 30, width: '100%' }}

          >
            <div onMouseLeave={() => this.onMouseLeave()}>
              {
                lists.map((l, i) => {
                  const tmpStyle =
                    activeIndex === i ? listStyles.boxActive : listStyles.boxInactive;

                  return (
                    <div
                      key={shortid.generate()}
                      style={{ ...listStyles.box, ...tmpStyle }}
                      onClick={() => this.onItemClick(i)}
                      onMouseEnter={() => this.onMouseEnter(i)}
                    >
                      {l.label}
                    </div>
                  );
                })
              }
            </div>

          </div>
        </div>
        {
          customShowFlag ? (
            <div style={{
                textAlign: 'right',
                padding: '30px 30px',
                borderTop: '1px solid #e2eaf0',
              }}
            >
              <span style={listStyles.btnSubmit} onClick={this.onDateRangeSubmit}>
                SUBMIT
              </span>
              <span style={listStyles.btnClear} onClick={this.onDateRangeClear}>
                CLEAR
              </span>
            </div>
          ) : null
        }

      </div>
    );
  }
}

CalendarList.propTypes = {
  rightStyle: PropTypes.any,
  activeIndex: PropTypes.number.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleDateRangClick: PropTypes.func.isRequired,
};

CalendarList.defaultProps = {
  rightStyle: {
    custom: 0,
    normal: 0,
  },
};

export default CalendarList;
