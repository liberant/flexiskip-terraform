import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { clearAlert } from '../actions';

/**
 * Display an alert in bootstrap style
 */
const Alert = ({ message, onDismiss, type }) => {
  const style = type === 'success' ? 'success' : 'danger';
  return message.length > 0 ? (
    <div className={`alert alert-${style} alert-dismissible`} role="alert">
      <button type="button" className="close" onClick={onDismiss}>
        <span aria-hidden="true">&times;</span>
      </button>
      {message}
    </div>
  ) : null;
};

Alert.propTypes = {
  type: PropTypes.oneOf(['success', 'error']),
  message: PropTypes.string,
  onDismiss: PropTypes.func,
};

Alert.defaultProps = {
  type: 'success',
  message: '',
  onDismiss: null,
};

export default connect(
  state => ({
    type: state.common.alert.type,
    message: state.common.alert.message,
  }),
  dispatch => ({
    onDismiss: () => dispatch(clearAlert()),
  }),
)(Alert);
