
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import CalendarSelectCardLayout from './subcomponents/CalendarSelectCardLayout';

import RateBar from './subcomponents/RateBar';
// import BarChart from './subcomponents/BarChart';

const LayoutStyles = {
  box: {
    height: 702,
    borderRadius: 3,
    border: 'solid 1px #e2eaf0',
  },
};

const ChartTimeRange = {
  MONTHLY: 'Month',
  WEEKLY: 'Week',
  DAILY: 'Day',
};

class RateDetailsSubPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: '',
      endDate: '',
      timeRange: ChartTimeRange.MONTHLY,
    };

    this.handleFilterData = this.handleFilterData.bind(this);
  }

  handleFilterData(data) {
    const { startDate, endDate } = data;
    if (!startDate || !endDate) {
      return;
    }
    const duration = moment.duration(moment(endDate).diff(moment(startDate)));
    const days = duration.asDays();

    let timeRange;

    if (days > 56) {
      timeRange = ChartTimeRange.MONTHLY;
    } else if (days > 13) {
      timeRange = ChartTimeRange.WEEKLY;
    } else {
      timeRange = ChartTimeRange.DAILY;
    }

    const { filterData } = this.props;

    this.setState({ startDate, endDate, timeRange });

    if (filterData) {
      filterData({
        startDate,
        endDate,
      });
    }
  }

  prepareBarData(data, timeRange) {
    if (!data || (data.constructor !== Array) || (data.length < 1)) {
      return ([]);
    }

    const formats = {
      Month: d => moment(d.from).local().format('MMM'),
      Week: d => `Week #${moment(d.from).isoWeek()}`,
      Day: d => moment(d.from).local().format('MMM DD'),
    };

    const dataResult = data.map(d => ({
      label: formats[timeRange](d),
      order: Math.ceil(d.binReq),
      collection: Math.ceil(d.colReq),
    }));

    return dataResult;
  }


  render() {
    const { data } = this.props;
    const { timeRange } = this.state;

    const preparedData = this.prepareBarData(data, timeRange);

    return (
      <div>
        <CalendarSelectCardLayout
          styles={LayoutStyles}
          title="Rate"
          filterData={this.handleFilterData}
        >
          <div>
            <RateBar
              currencies={preparedData}
              graphTitle={this.state.timeRange}
            />
          </div>
        </CalendarSelectCardLayout>
      </div>
    );
  }
}

RateDetailsSubPage.propTypes = {
  filterData: PropTypes.func.isRequired,
  data: PropTypes.any.isRequired,
};

RateDetailsSubPage.defaultProps = {

};

export default RateDetailsSubPage;
