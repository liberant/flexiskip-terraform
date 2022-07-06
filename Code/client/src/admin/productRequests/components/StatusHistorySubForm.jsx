import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import shortid from 'shortid';

import { statusOrderType2Styles } from '../../../common/constants/styles';
import { getFormattedDate, getFormattedTime } from '../../../common/utils/common';
import { productRequestFormatter } from '../../../common/components/BSTableFormatters';

/* eslint no-plusplus: 0 */
const styles = {
  line: {
    display: 'inline-block',
    borderWidth: 1,
    borderStyle: 'solid',
    marginBottom: 8,
  },
};

class StatusHistorySubForm extends React.Component {
  constructor(props) {
    super(props);
    this.orderStatus = [
      {
        name: 'Pending',
        flag: false,
        color: '#e2eaf0',
        date: '',
        datetime: '',
        width: 'calc(50% - 65px)',
      },
      {
        name: 'In Progress',
        flag: false,
        color: '#e2eaf0',
        date: '',
        datetime: '',
        width: 'calc(50% - 71px)',
      },
      {
        name: 'Completed',
        flag: false,
        color: '#e2eaf0',
        date: '',
        datetime: '',
      },
    ];

    this.prepareData = this.prepareData.bind(this);
    this.renderUnfinishedStatus = this.renderUnfinishedStatus.bind(this);
  }

  prepareData(data) {
    if (data && data.constructor === Array && (data.length > 0)) {
      if (data[0].status && (data[0].status.constructor === String) &&
        (data[0].status.trim().toLowerCase() ===
         this.orderStatus[0].name.toLocaleLowerCase())) {
        this.orderStatus[0].flag = true;
        this.orderStatus[0].color = statusOrderType2Styles[0].styles.color;
        this.orderStatus[0].date = getFormattedDate(moment.utc(data[0].updatedAt).local().format('YYYY-MM-DD HH:mm:ss').substr(0, 10));
        this.orderStatus[0].datetime = getFormattedTime(moment.utc(data[0].updatedAt).local().format('YYYY-MM-DD HH:mm:ss').substr(11));
      }
      for (let i = 1; (i < data.length); i++) {
        if (data[i].status && (data[i].status.constructor === String)) {
          if (data[i].status.trim().toLowerCase() === 'in progress') {
            this.orderStatus[1].flag = true;
            this.orderStatus[1].color = statusOrderType2Styles[1].styles.color;
            this.orderStatus[1].date = getFormattedDate(moment.utc(data[i].updatedAt).local().format('YYYY-MM-DD HH:mm:ss').substr(0, 10));
            this.orderStatus[1].datetime = getFormattedTime(moment.utc(data[i].updatedAt).local().format('YYYY-MM-DD HH:mm:ss').substr(11));
          }
          if (data[i].status.trim().toLowerCase() === 'completed') {
            this.orderStatus[2].name = statusOrderType2Styles[2].label;
            this.orderStatus[2].flag = true;
            this.orderStatus[2].color = statusOrderType2Styles[2].styles.borderColor;
            this.orderStatus[2].date = getFormattedDate(moment.utc(data[i].updatedAt).local().format('YYYY-MM-DD HH:mm:ss').substr(0, 10));
            this.orderStatus[2].datetime = getFormattedTime(moment.utc(data[i].updatedAt).local().format('YYYY-MM-DD HH:mm:ss').substr(11));
          }
          if (data[i].status.trim().toLowerCase() === 'cancelled') {
            this.orderStatus[2].name = statusOrderType2Styles[3].label;
            this.orderStatus[2].flag = true;
            this.orderStatus[2].color = statusOrderType2Styles[3].styles.borderColor;
            this.orderStatus[2].date = getFormattedDate(moment.utc(data[i].updatedAt).local().format('YYYY-MM-DD HH:mm:ss').substr(0, 10));
            this.orderStatus[2].datetime = getFormattedTime(moment.utc(data[i].updatedAt).local().format('YYYY-MM-DD HH:mm:ss').substr(11));
          }
        }
      }
    }
  }

  renderUnfinishedStatus(cell) {
    return (
      <div style={
        {
          width: 98,
          height: 18,
          borderRadius: 3,
          textAlign: 'center',
          border: '1px solid #4a4a4a',
          fontWeight: '600',
          lineHeight: '15px',
          opacity: '0.5',
          color: '#4a4a4a',
        }
      }
      >
        {cell}
      </div>
    );
  }

  render() {
    const { orderStatus } = this;
    const { data } = this.props;
    // const testData = [
    //   {
    //     status: 'Pending',
    //   },
    //   {
    //     status: 'In Progress',
    //   },
    //   {
    //     status: 'Completed',
    //   },
    //   {
    //     status: 'Cancelled',
    //   },
    // ];
    // this.prepareData(testData);
    this.prepareData(data);

    return (
      <div style={{
        height: 150,
      }}
      >
        <div>
          <div style={{ marginBottom: 27, padding: '0 35px' }}>
            <span
              className="handel-radio-btn"
              style={{
                  fontSize: 28,
                  color: orderStatus[0].color,
                }}
            />
            <span
              style={{
                ...styles.line,
                width: 'calc(50% - 63px)',
                borderColor: orderStatus[0].color,
              }}
            />
            <span
              className="handel-radio-btn"
              style={{
                  fontSize: 28,
                  color: orderStatus[1].color,
                }}
            />
            <span
              style={{
                ...styles.line,
                width: 'calc((50% - 63px)*2/3)',
                borderColor: orderStatus[1].color,
              }}
            />
            <span
              style={{
                ...styles.line,
                width: 'calc((50% - 63px)*1/3)',
                borderColor: orderStatus[2].color,
              }}
            />
            <span
              className="handel-radio-btn"
              style={{
                  fontSize: 28,
                  color: orderStatus[2].color,
                  backgroundColor: orderStatus[2].color,
                  borderRadius: '25px',
                }}
            />
          </div>
        </div>
        {
          orderStatus.map(o => (
            <div
              key={shortid.generate()}
              style={{
                width: o.width,
                display: 'inline-block',
              }}
            >
              <div style={{ marginBottom: 10 }}>
                {
                  o.flag ? productRequestFormatter(o.name) : this.renderUnfinishedStatus(o.name)
                }
              </div>
              <div style={{ paddingLeft: 10 }}>{o.date}&nbsp;</div>
              <div style={{ paddingLeft: 10 }}>{o.datetime}&nbsp;</div>
            </div>
          ))
        }
      </div>
    );
  }
}

StatusHistorySubForm.propTypes = {
  data: PropTypes.any.isRequired,
};

StatusHistorySubForm.defaultProps = {

};

export default StatusHistorySubForm;
