import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import { Bar } from 'react-chartjs-2';

import './RevenueBar.css';
import { formatPrice } from '../../../../../common/helpers';

class RevenueBar extends React.PureComponent {
  get labels() {
    const {
      data: {
        binReqRevenue,
      },
      timeRange,
    } = this.props;
    return binReqRevenue.map(d => this.formats[timeRange](d));
  }

  getBar(type) {
    const {
      data: {
        binReqRevenue,
        colReqRevenue,
      },
    } = this.props;
    if (type === 'Bin') {
      return binReqRevenue.map(d => d.total);
    }

    if (type === 'Collection') {
      return colReqRevenue.map(d => d.total);
    }

    if (type === 'Total') {
      return _.map(binReqRevenue, (item) => {
        const collectionTotal = _.find(
          colReqRevenue,
          colItem => colItem.from === item.from && colItem.to === item.to,
        );
        return item.total + (collectionTotal ? collectionTotal.total : 0);
      });
    }

    return [];
  }

  formats = {
    Month: d => moment(d.from).local().format('MMM'),
    Week: d => `Week #${moment(d.from).isoWeek()}`,
    Day: d => moment(d.from).local().format('MMM DD'),
  };

  render() {
    const barData = {
      labels: this.labels,
      datasets: [
        {
          backgroundColor: 'rgb(244, 95, 66)',
          borderColor: 'rgb(244, 83, 65)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(244, 95, 66, 0.5)',
          hoverBorderColor: 'rgba(244, 83, 65, 0.5)',
          label: 'Bin Request',
          data: this.getBar('Bin'),
        },
        {
          backgroundColor: 'rgb(65, 136, 244)',
          borderColor: 'rgb(65, 70, 244)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(65, 136, 244, 0.5)',
          hoverBorderColor: 'rgba(65, 70, 244, 0.5)',
          label: 'Collection Request',
          data: this.getBar('Collection'),
        },
        {
          backgroundColor: 'rgb(6, 122, 42)',
          borderColor: 'rgb(5, 142, 48)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(6, 122, 42, 0.5)',
          hoverBorderColor: 'rgba(5, 142, 48, 0.5)',
          label: 'Total',
          data: this.getBar('Total'),
        },
      ],
    };
    return (
      <div className="bar-revenue-chart">
        <Bar
          data={barData}
          options={{
            animation: false,
            maintainAspectRatio: false,
            legend: {
              display: true,
            },
            scales: {
              xAxes: [{
                barPercentage: 1.0,
              }],
            },
            tooltips: {
              callbacks: {
                label: (tooltipItem, data) => formatPrice(tooltipItem.yLabel),
              },
            },
          }}
        />
      </div>
    );
  }
}

RevenueBar.propTypes = {
  data: PropTypes.any.isRequired,
  timeRange: PropTypes.any,
};

RevenueBar.defaultProps = {
  timeRange: 'month',
};

export default RevenueBar;
