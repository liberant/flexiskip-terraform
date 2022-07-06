import React from 'react';
import PropTypes from 'prop-types';
import * as statuses from '../constants/col-req-statuses';

/**
 * Component to display bin's status
 */
const BinStatus = ({ value }) => {
  const label = value;
  let style = {
    width: 98,
    height: 18,
    borderRadius: 3,
    textAlign: 'center',
    borderWidth: '1px',
    borderStyle: 'solid',
    fontWeight: '600',
    lineHeight: '15px',
    display: 'inline-block',
  };

  switch (value) {
    case statuses.STATUS_REQUESTED:
      style = {
        ...style,
        borderColor: '#ff9a00',
        color: '#ff9a00',
      };
      break;

    case statuses.STATUS_ACCEPTED:
      style = {
        ...style,
        borderColor: '#ff9a00',
        color: '#ff9a00',
      };
      break;

    case statuses.STATUS_IN_PROGRESS:
      style = {
        ...style,
        borderColor: '#72c814',
        color: '#fff',
        backgroundColor: '#72c814',
      };
      break;

    case statuses.STATUS_COMPLETED:
      style = {
        ...style,
        borderColor: '#72c814',
        color: '#fff',
        backgroundColor: '#72c814',
      };
      break;

    case statuses.STATUS_CANCELLED:
      style = {
        ...style,
        borderColor: '#666666',
        color: '#fff',
        backgroundColor: '#666666',
      };
      break;

    default:
      break;
  }

  return (
    <div style={style}>{label}</div>
  );
};

BinStatus.propTypes = {
  value: PropTypes.string.isRequired,
};

export default BinStatus;
