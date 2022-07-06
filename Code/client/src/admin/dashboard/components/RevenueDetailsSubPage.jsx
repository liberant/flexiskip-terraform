
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import RevenueBar from './subcomponents/RevenueBar/RevenueBar';
import CalendarSelectCardLayout from './subcomponents/CalendarSelectCardLayout';

const LayoutStyles = {
  box: {
    height: 600,
    borderRadius: 3,
    border: 'solid 1px #e2eaf0',
  },
};
const ChartTimeRange = {
  MONTHLY: 'Month',
  WEEKLY: 'Week',
  DAILY: 'Day',
};

class RevenueDetailsSubPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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

    this.setState({ timeRange });

    if (filterData) {
      filterData({
        startDate,
        endDate,
      });
    }
  }

  render() {
    const { data } = this.props;
    const { timeRange } = this.state;
    return (
      <div>
        <CalendarSelectCardLayout
          styles={LayoutStyles}
          title="Revenue"
          filterData={this.handleFilterData}
        >
          <div className="revenue-chart-grid-container">
            <div
              className="revenue-chart-grid-item"
              style={{
                fontWeight: 'bold',
                fontSize: '20px',
                color: 'black',
              }}
            >
              Revenue ($)
            </div>
            <div className="revenue-chart-grid-item" />
            <div className="revenue-chart-grid-item">
              <RevenueBar data={data} timeRange={timeRange} />
            </div>
            <div className="revenue-chart-grid-item" />
            <div className="revenue-chart-grid-item" />
            <div
              className="revenue-chart-grid-item"
              style={{
                fontWeight: 'bold',
                fontSize: '20px',
                color: 'black',
                marginTop: '-50%',
              }}
            >
              {timeRange}
            </div>
          </div>
        </CalendarSelectCardLayout>
      </div>
    );
  }
}

RevenueDetailsSubPage.propTypes = {
  filterData: PropTypes.func.isRequired,
  data: PropTypes.any.isRequired,
};

RevenueDetailsSubPage.defaultProps = {

};

export default RevenueDetailsSubPage;
