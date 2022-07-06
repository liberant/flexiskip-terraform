import React from 'react';
import PropTypes from 'prop-types';
import * as statuses from '../constants/dispute-statuses';

/**
 * Component to display dispute's status
 */
const DisputeStatus = ({ value }) => {
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
    fontSize: '12px',
  };

  switch (value) {
    case statuses.STATUS_REPORTED:
      style = {
        ...style,
        borderColor: '#f06666',
        color: '#f06666',
      };
      break;

    case statuses.STATUS_ACTIONED:
      style = {
        ...style,
        borderColor: '#72c814',
        color: '#72c814',
      };
      break;

    case statuses.STATUS_RESOLVED:
      style = {
        ...style,
        backgroundColor: '#72c814',
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

DisputeStatus.propTypes = {
  value: PropTypes.string.isRequired,
};

export default DisputeStatus;
