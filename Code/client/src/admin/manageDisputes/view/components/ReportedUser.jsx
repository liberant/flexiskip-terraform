import React from 'react';
import PropTypes from 'prop-types';

import Avatar from '../../../../common/components/Avatar';
import { getResizeUrl, formatUserType } from '../../../../common/helpers';

function isCustomer(user) {
  return user.roles.includes('residentialCustomer') ||
    user.roles.includes('businessCustomer');
}

const UserDetail = ({ dispute }) => {
  const { user } = dispute;
  return (
    <div className="w-panel w-form">
      <div className="w-title">
        <h2>Reported User</h2>
      </div>
      <div className="row">
        <div className="col-md-2">
          <Avatar src={user.avatar} />
        </div>
        <div className="col-md-5">
          <div className="form-group">
            <label className="control-label">First Name</label>
            <p className="form-control-static">{user.firstname}</p>
          </div>
          {isCustomer(user) && (
            <div className="form-group">
              <label className="control-label">Customer Type</label>
              <p className="form-control-static">{formatUserType(user.roles)}</p>
            </div>
          )}
          <div className="form-group">
            <label className="control-label">Email</label>
            <p className="form-control-static">{user.email}</p>
          </div>
          <div className="form-group">
            <label className="control-label">Phone</label>
            <p className="form-control-static">{user.phone}</p>
          </div>
        </div>
        <div className="col-md-5">
          <div className="form-group">
            <label className="control-label">Last Name</label>
            <p className="form-control-static">{user.lastname}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

UserDetail.propTypes = {
  dispute: PropTypes.object.isRequired,
};

export default UserDetail;
