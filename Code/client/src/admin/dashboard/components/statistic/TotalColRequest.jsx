import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import Statistic from './Statistic';
import styles from './styles.m.css';

const TotalColRequest = ({ value, pendingCount }) => {
  const title = {
    iconClass: 'handel-collection-request',
    text: 'Total Collection Requests',
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

TotalColRequest.propTypes = {
  value: PropTypes.number,
  pendingCount: PropTypes.number,
};

TotalColRequest.defaultProps = {
  value: 0,
  pendingCount: 0,
};

export default TotalColRequest;
