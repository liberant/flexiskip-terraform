import React from 'react';
import PropTypes from 'prop-types';

import { notCollectedItems } from '../../helpers';
import { formatPrice } from '../../../../common/helpers';
import CollectionRequestStatus from '../../../../common/components/CollectionRequestStatus';

const CollectionDetail = ({ collectionRequest }) => {
  /**
   * verify the product before show drop off
   */
  const { items } = collectionRequest;

  return (
    <div className="w-panel">
      <div className="w-title">
        <h2>Collection Details</h2>
        <span style={{ fontSize: '18px' }}>Total <strong>{formatPrice(collectionRequest.total)}</strong></span>
      </div>
      <div className="form-group">
        <label className="control-label">Status</label>
        <div className="form-control-static"><CollectionRequestStatus value={collectionRequest.status} /></div>
      </div>
      <div className="form-group">
        <label className="control-label">Collection Address</label>
        <p className="form-control-static">{collectionRequest.collectionAddress}</p>
      </div>
      <div className="form-group">
        <label className="control-label">Comment</label>
        <p className="form-control-static">{collectionRequest.comment}</p>
      </div>
      {
        notCollectedItems(items).length > 0 && (
          <div className="form-group">
            <label className="control-label">Drop-off Location</label>
            <p className="form-control-static">{collectionRequest.disposalSite}</p>
            <p className="form-control-static">{collectionRequest.disposalAddress}</p>
          </div>
        )
      }
    </div>
  );
};

CollectionDetail.propTypes = {
  collectionRequest: PropTypes.object.isRequired,
};

export default CollectionDetail;
