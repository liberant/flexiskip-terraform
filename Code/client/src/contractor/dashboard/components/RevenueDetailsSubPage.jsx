
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import RevenueLine from '../../../admin/dashboard/components/subcomponents/RevenueLine';
import CalendarSelectCardLayout from './subcomponents/CalendarSelectCardLayout';
import { calculateUnitDisplayedByNumber } from '../../../common/utils/common';

const LayoutStyles = {
  box: {
    height: 800,
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
      startDate: '',
      endDate: '',
      timeRange: ChartTimeRange.MONTHLY,
    };

    this.handleFilterData = this.handleFilterData.bind(this);
    this.handleRevenueUnit = this.handleRevenueUnit.bind(this);
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

  handleRevenueUnit(data) {
    const maxRevenue = Math.max(...data);
    const revenueUnit = calculateUnitDisplayedByNumber(maxRevenue);
    return revenueUnit;
  }

  render() {
    const { data } = this.props;
    const {
      timeRange,
    } = this.state;

    const dataSet = data.colReqRevenue ? [] : data;
    const revenueUnit = this.handleRevenueUnit(dataSet.map(d => d.total));

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
              Revenue ($ {revenueUnit.unit})
            </div>
            <div className="revenue-chart-grid-item" />
            <div className="revenue-chart-grid-item">
              <RevenueLine
                dataset={dataSet}
                timeRange={timeRange}
                revenueTickMax={revenueUnit}
              />
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
