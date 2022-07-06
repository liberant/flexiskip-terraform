import React from 'react';
import PropTypes from 'prop-types';

import Rate from '../../../../common/components/form/Rate';
import ImageGallery from '../../../../common/components/ImageGallery';

const SupplierDetail = ({ collectionRequest }) => {
  const { contractorOrganisation: supplier } = collectionRequest;

  return (
    <div className="w-panel">
      <div className="w-title">
        <h2>Supplier Details</h2>
      </div>

      {supplier && (
      <React.Fragment>
        <div className="row">
          <div className="col-md-12">
            <div className="form-group">
              <label className="control-label">Name</label>
              <p className="form-control-static">{supplier.name}</p>
            </div>
            <div className="form-group">
              <label className="control-label">Address</label>
              <p className="form-control-static">{supplier.address}</p>
            </div>
            {supplier.rate && (
              <div className="form-group">
                <label className="control-label">Client&apos;s Rate</label>
                <div className="form-control-static">
                  <Rate allowHalf disabled value={supplier.rate.point} style={{ color: '#239dff', fontSize: '12px' }} />
                  <p>{supplier.rate.comment ? supplier.rate.comment : 'There&apos;s no comment'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        {supplier.rate && (
          <ImageGallery items={supplier.rate.images.map(item => ({ original: item, thumbnail: item }))} />
        )}
      </React.Fragment>
      )}

      {!supplier && (
        <p><em>No supplier accepted this request yet.</em></p>
      )}
    </div>
  );
};

SupplierDetail.propTypes = {
  collectionRequest: PropTypes.object.isRequired,
};

export default SupplierDetail;
