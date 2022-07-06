import React from 'react';
import PropTypes from 'prop-types';
import * as statuses from '../constants/discount-statuses';

/**
 * Component to display collection request's status
 */
const DiscountStatus = ({ value }) => {
  const label = value;
  let style = {
    width: 98,
    borderRadius: 3,
    textAlign: 'center',
    borderWidth: '1px',
    borderStyle: 'solid',
    fontWeight: '600',
    display: 'inline-block',
    fontSize: '12px',
    padding: '2px 0',
  };

  switch (value) {
    case statuses.STATUS_ACTIVE:
      style = {
        ...style,
        borderColor: '#72c814',
        color: '#72c814',
      };
      break;

    case statuses.STATUS_INACTIVE:
      style = {
        ...style,
        borderColor: '#4a4a4a',
        color: '#4a4a4a',
      };
      break;

    case statuses.STATUS_REMOVED:
      style = {
        ...style,
        backgroundColor: '#666666',
        color: '#fff',
      };
      break;

    default:
      break;
  }

  return (
    <div style={style}>{label}</div>
  );
};

DiscountStatus.propTypes = {
  value: PropTypes.string.isRequired,
};

export default DiscountStatus;
