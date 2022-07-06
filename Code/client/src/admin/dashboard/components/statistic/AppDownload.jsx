import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import Statistic from './Statistic';
import styles from './styles.m.css';

const AppDownload = ({ value, percent }) => {
  const title = {
    iconClass: 'handel-download',
    text: 'App Downloads',
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

AppDownload.propTypes = {
  value: PropTypes.number,
  percent: PropTypes.number,
};

AppDownload.defaultProps = {
  value: 0,
  percent: 0,
};

export default AppDownload;
