import React from 'react';
import PropTypes from 'prop-types';

/**
 * Bootstrap submit button with loading state integrated
 */
const SubmitButton = (props) => {
  const {
    submitting,
    children,
    submitLabel = 'Loading...',
    ...otherProps
  } = props;
  if (submitting) {
    return (
      <button disabled {...otherProps}>
        <i className="fa fa-circle-o-notch fa-spin" />&nbsp;{submitLabel}
      </button>
    );
  }
  return (
    <button {...otherProps}>
      {children}
    </button>
  );
};

SubmitButton.propTypes = {
  submitting: PropTypes.bool,
  submitLabel: PropTypes.string,
  children: PropTypes.any.isRequired,
};

SubmitButton.defaultProps = {
  submitting: false,
  submitLabel: '',
};

export default SubmitButton;
