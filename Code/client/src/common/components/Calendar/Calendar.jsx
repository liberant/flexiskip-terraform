import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { getFormattedDate, afterDate } from '../../../common/utils/common';
import CalendarList from './CalendarList';

const calendarStyles = {
  showMe: {
    display: 'initial',
  },
  hideMe: {
    display: 'none',
  },
  dateBox: {
    border: '1px solid #dce1e6',
    lineHeight: '44px',
    padding: '0 15px',
    cursor: 'pointer',
    borderRadius: 3,
    // marginTop: 15,
    fontSize: 14,
  },
  trangleIcon: {
    color: '#666666',
    paddingLeft: 12,
  },
  calendar: {
    fontSize: 18,
    color: '#239dff',
    paddingRight: 10,
  },
};


class Calendar extends React.Component {
  constructor(props) {
    super(props);

    const date = new Date();

    const defaultStartDate = moment(date).subtract(5, 'month').toDate();

    this.state = {
      startDate: moment.utc(defaultStartDate).local().format('YYYY-MM-DD HH:mm:ss'),
      endDate: moment.utc(date).local().format('YYYY-MM-DD HH:mm:ss'),
      listShowFlag: false,
      activeIndex: -1,
    };

    this.handleDateBoxClick = this.handleDateBoxClick.bind(this);
    this.handleCalendarListClick = this.handleCalendarListClick.bind(this);
    this.handleDateRangClick = this.handleDateRangClick.bind(this);
  }

  handleDateRangClick(startDate, endDate) {
    if (!startDate || !endDate) {
      return;
    }

    const { filterData } = this.props;

    this.setState({ startDate, endDate, listShowFlag: false });
    if (filterData) {
      filterData({
        startDate, endDate,
      });
    }
  }

  handleCalendarListClick(activeIndex, interval) {
    const { filterData } = this.props;

    const date = new Date();
    let tmpEndDate = date;
    let tmpStartDate = date;
    if (interval > 0) {
      tmpStartDate = afterDate(date, -interval);
      if (interval === 1) {
        tmpEndDate = tmpStartDate;
      }
    } else if (interval === -2) {
      tmpStartDate = new Date(date.getFullYear(), date.getMonth(), 1);
    } else if (interval === -3) {
      tmpStartDate = moment(date).subtract(1, 'month').startOf('month');
      tmpEndDate = moment(date).subtract(1, 'month').endOf('month');
    }

    this.setState({
      activeIndex,
      listShowFlag: false,
      startDate: moment.utc(tmpStartDate).local().format('YYYY-MM-DD HH:mm:ss'),
      endDate: moment.utc(tmpEndDate).local().format('YYYY-MM-DD HH:mm:ss'),
    });

    filterData({
      startDate: moment.utc(tmpStartDate).local().format('YYYY-MM-DD HH:mm:ss'),
      endDate: moment.utc(tmpEndDate).local().format('YYYY-MM-DD HH:mm:ss'),
    });
  }

  handleDateBoxClick() {
    const { listShowFlag } = this.state;

    this.setState({
      listShowFlag: !listShowFlag,
    });
  }

  render() {
    const {
      startDate, endDate, listShowFlag, activeIndex,
    } = this.state;
    const { rightStyle } = this.props;

    return (
      <div style={{ position: 'relative' }}>
        <div
          style={calendarStyles.dateBox}
          onClick={this.handleDateBoxClick}
        >
          <span className="handel-calendar" style={calendarStyles.calendar} />
          <span style={{ fontSize: 14, color: '#666666' }}>
            {`${getFormattedDate(startDate.substr(0, 10))} - ${getFormattedDate(endDate.substr(0, 10))}`}
          </span>
          <span>
            {
              !listShowFlag ? (<i className="fa fa-caret-down" style={calendarStyles.trangleIcon} />) : (<i className="fa fa-caret-up" style={calendarStyles.trangleIcon} />)
            }
          </span>
        </div>
        <div>
          <div
            style={listShowFlag ? calendarStyles.showMe : calendarStyles.hideMe}
          >
            <CalendarList
              activeIndex={activeIndex}
              startDate={startDate}
              endDate={endDate}
              rightStyle={rightStyle}
              handleClick={this.handleCalendarListClick}
              handleDateRangClick={this.handleDateRangClick}
            />
          </div>
        </div>
      </div>
    );
  }
}

Calendar.propTypes = {
  rightStyle: PropTypes.any,
  filterData: PropTypes.func.isRequired,
};

Calendar.defaultProps = {
  rightStyle: {
    custom: 0,
    normal: 0,
  },
};

export default Calendar;
