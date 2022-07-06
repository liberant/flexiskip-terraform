import React from 'react';
import PropTypes from 'prop-types';

import DisputeStatus from '../../../../common/components/DisputeStatus';

const ReportDetail = ({ dispute }) => (
  <div className="w-panel w-form">
    <div className="w-title">
      <h2>Report Details</h2>
    </div>
    <div className="form-group">
      <label className="control-label">Status</label>
      <div className="form-control-static"><DisputeStatus value={dispute.status} /></div>
    </div>
    <div className="form-group">
      <label className="control-label">Collection Reference</label>
      <p className="form-control-static">{dispute.collectionRequest.code}</p>
    </div>
  </div>
);

ReportDetail.propTypes = {
  dispute: PropTypes.object.isRequired,
};

export default ReportDetail;
