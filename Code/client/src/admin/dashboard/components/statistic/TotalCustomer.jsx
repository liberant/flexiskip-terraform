import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import Statistic from './Statistic';
import styles from './styles.m.css';

const TotalCustomer = ({ value, percent }) => {
  const title = {
    iconClass: 'handel-users',
    text: 'Total Customers',
  };
  const footer = {
    iconClass: percent > 0 ? 'handel-caret-up' : 'handel-caret-down',
    iconText: `${numeral(percent).format('0,0')}%`,
    iconTextClass: percent >= 0 ? styles.green : styles.red,
    text: 'Since Last Month',
  };

  return (
    <Statistic title={title} footer={footer}>
      {numeral(value).format('0,0')}
    </Statistic>
  );
};

TotalCustomer.propTypes = {
  value: PropTypes.number,
  percent: PropTypes.number,
};

TotalCustomer.defaultProps = {
  value: 0,
  percent: 0,
};

export default TotalCustomer;
