import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import moment from 'moment';

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Revenue Bin',
      fill: false,
      lineTension: 0,
      backgroundColor: 'rgba(35,157,255,0.4)',
      borderColor: 'rgba(35,157,255,1)',
      // borderCapStyle: 'butt',
      // borderDash: [],
      // borderDashOffset: 0.0,
      // borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(35,157,255,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 2,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(35,157,255,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 4,
      pointHitRadius: 10,
      pointStyle: 'circle',
      data: [65, 59, 80, 81, 56, 55, 40],
    },
  ],
};

const options = {
  responsive: true,
  scales: {
    yAxes: [{
      ticks: {
        max: 100,
        min: 0,
        stepSize: 10,
        // callback(value, index, values) {
        //   return '$' + value;
        // },
      },
    }],
  },
  legend: {
    display: false,
  },
  tooltips: {
    position: 'average',
    mode: 'index',
    intersect: false,
    width: 460,
    yPadding: 5,
    xPadding: 15,
    caretSize: 8,
    backgroundColor: 'rgba(35,157,255, 1)',
    titleFontColor: 'white',
    bodyFontColor: 'white',
    borderColor: 'rgba(0,0,0, 0.2)',
    borderWidth: 4,
    callbacks: {
      label: tooltipItem => (` $${tooltipItem.yLabel * 100}  `),
      labelColor: () => ({
        backgroundColor: '#239dff',
      }),
      labelTextColor: () => ('#fff'),
    },
    displayColors: false,
  },
};

class RevenueLine extends React.Component {
  prepareLineData(data) {
    if (!data || (data.constructor !== Array) || (data.length < 1)) {
      return ({
        labels: [],
        data: [],
      });
    }

    const labelResult = [];
    const dataResult = [];

    data.forEach((d) => {
      labelResult.push(moment.utc(d.from).local().format('MMM'));
      dataResult.push(d.total / 100);
    });

    return ({
      labels: labelResult,
      data: dataResult,
    });
  }
  render() {
    const { dataset } = this.props;

    const preapredData = this.prepareLineData(dataset);
    data.labels = preapredData.labels;
    data.datasets[0].data = preapredData.data;

    return (
      <div>
        <div>
          <Line
            data={data}
            options={options}
          />
        </div>
      </div>
    );
  }
}

RevenueLine.propTypes = {
  dataset: PropTypes.any,
};

RevenueLine.defaultProps = {
  dataset: [],
};

export default RevenueLine;
