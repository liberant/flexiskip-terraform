import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import Statistic from './Statistic';

const TotalPartner = ({ value }) => {
  const title = {
    iconClass: 'handel-product',
    text: 'Total Supply Partners',
  };

  return (
    <Statistic title={title}>
      {numeral(value).format('0,0')}
    </Statistic>
  );
};

TotalPartner.propTypes = {
  value: PropTypes.number,
};

TotalPartner.defaultProps = {
  value: 0,
};

export default TotalPartner;
