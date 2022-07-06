import React from 'react';
import PropTypes from 'prop-types';

import Rate from '../../../../common/components/form/Rate';
import ImageGallery from '../../../../common/components/ImageGallery';
import Avatar from '../../../../common/components/Avatar';

const DriverDetail = ({ collectionRequest }) => {
  const { driver: user } = collectionRequest;

  return (
    <div className="w-panel">
      <div className="w-title">
        <h2>Driver Details</h2>
      </div>

      {user && (
      <React.Fragment>
        <div className="row">
          <div className="col-md-2">
            <Avatar src={user.avatar} />
          </div>
          <div className="col-md-5">
            <div className="form-group">
              <label className="control-label">First Name</label>
              <p className="form-control-static">{user.firstname}</p>
            </div>
            <div className="form-group">
              <label className="control-label">Email</label>
              <p className="form-control-static">{user.email}</p>
            </div>
            <div className="form-group">
              <label className="control-label">Phone</label>
              <p className="form-control-static">{user.phone}</p>
            </div>
            {user.rate && (
              <div className="form-group">
                <label className="control-label">Client&apos;s Rate</label>
                <div className="form-control-static">
                  <Rate allowHalf disabled value={user.rate.point} style={{ color: '#239dff', fontSize: '12px' }} />
                  <p>{user.rate.comment ? user.rate.comment : 'There&apos;s no comment'}</p>
                </div>
              </div>
            )}
          </div>
          <div className="col-md-5">
            <div className="form-group">
              <label className="control-label">Last Name</label>
              <p className="form-control-static">{user.lastname}</p>
            </div>
          </div>
        </div>
        {user.rate && (
          <ImageGallery items={user.rate.images.map(item => ({ original: item, thumbnail: item }))} />
        )}
      </React.Fragment>
      )}

      {!user && (
        <p><em>No driver accepted this request yet.</em></p>
      )}
    </div>
  );
};

DriverDetail.propTypes = {
  collectionRequest: PropTypes.object.isRequired,
};

export default DriverDetail;
