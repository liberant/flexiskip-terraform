import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import Statistic from './Statistic';
import styles from './styles.m.css';

const TotalProdRequest = ({ value, pendingCount }) => {
  const title = {
    iconClass: 'handel-bin-request',
    text: 'Total Product Requests',
  };
  const footer = {
    iconClass: 'handel-clock',
    iconTextClass: styles.orange,
    iconText: `${numeral(pendingCount).format('0,0')}`,
    text: 'Pending Requests',
  };
  return (
    <Statistic title={title} footer={footer}>
      {numeral(value).format('0,0')}
    </Statistic>
  );
};

TotalProdRequest.propTypes = {
  value: PropTypes.number,
  pendingCount: PropTypes.number,
};

TotalProdRequest.defaultProps = {
  value: 0,
  pendingCount: 0,
};

export default TotalProdRequest;
