import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * The button used in detail page
 */
const BackButton = ({ link, label }) => (
  <div className="back-btn">
    <Link to={link} className="btn-wrapper">
      <span className="handel-chevron-circle-left" />
    </Link>
    <span className="btn-label">{label}</span>
  </div>
);

BackButton.propTypes = {
  link: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default BackButton;
