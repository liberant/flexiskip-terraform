import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import Statistic from './Statistic';
import styles from './styles.m.css';

const TotalRevenue = ({ value, percent }) => {
  const prefixStyle = {
    fontSize: '20px',
    marginRight: '5px',
  };
  const title = {
    iconClass: `${styles.green} handel-money`,
    text: 'Total Revenue',
  };
  const footer = {
    iconClass: percent > 0 ? 'handel-caret-up' : 'handel-caret-down',
    iconText: `${numeral(percent).format('0,0')}%`,
    iconTextClass: percent >= 0 ? styles.green : styles.red,
    text: 'Since Last Month',
  };

  return (
    <Statistic title={title} footer={footer}>
      <sup className={styles.green} style={prefixStyle}>$</sup>
      <span className={styles.green}>{numeral(value).format('0,0[.]0[0]')}</span>
    </Statistic>
  );
};

TotalRevenue.propTypes = {
  value: PropTypes.number,
  percent: PropTypes.number,
};

TotalRevenue.defaultProps = {
  value: 0,
  percent: 0,
};
export default TotalRevenue;
