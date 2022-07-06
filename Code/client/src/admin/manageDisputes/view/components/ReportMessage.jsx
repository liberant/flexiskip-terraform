import React from 'react';
import PropTypes from 'prop-types';

const DriverDetail = ({ dispute }) => (
  <div className="w-panel w-form">
    <div className="w-title">
      <h2>Report Message</h2>
    </div>

    {dispute.reason || (<p><em>There is no comment on this report.</em></p>)}
  </div>
);

DriverDetail.propTypes = {
  dispute: PropTypes.object.isRequired,
};

export default DriverDetail;
