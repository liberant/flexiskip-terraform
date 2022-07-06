/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';

import * as actions from '../actions';
import { bindActionCreators } from '../../../../common/helpers';

import AdminLayout from '../../../hoc/AdminLayout';
import BackButton from '../../../../common/components/BackButton';
import HandelButton from '../../../../common/components/HandelButton';
import Spinner from '../../../../common/components/Spinner';
import BinList from '../components/BinList';
import CollectionDetail from '../components/CollectionDetail';
import DriverDetail from '../components/DriverDetail';
import CustomerDetail from '../components/CustomerDetail';
import SupplierDetail from "../components/SupplierDetail";
import StatusHistory from '../components/StatusHistory';
import PermissionRequired from '../../../../common/hocs/PermissionRequired';

class CollectionRequestDetailPage extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    fetchItem: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    collectionRequest: PropTypes.object,
    location: PropTypes.object.isRequired,
  }

  static defaultProps = {
    collectionRequest: null,
  }

  componentDidMount() {
    const {
      fetchItem,
      match,
    } = this.props;
    const { id } = match.params;
    fetchItem(id);
  }

  render() {
    const { collectionRequest, isLoading, location } = this.props;
    const backLink = (location.state && location.state.fromDashboard) ? '/admin/dashboard' : '/admin/collection-requests';
    if (isLoading || collectionRequest === null) return <Spinner />;
    collectionRequest.items.forEach((item) => {
      item.disposalAddress = collectionRequest.disposalAddress;
    });

    return (
      <React.Fragment>
        <BackButton link={backLink} label={collectionRequest.code} />
        <PermissionRequired permission="editCollectionRequest">
          <div className="top-toolbar text-right">
            <HandelButton
              label="Edit"
              href={`/admin/collection-requests-edit/${collectionRequest._id}`}
              borderColor="blue"
              iconColor="white"
              shadowColor="blue"
              bgColor="blue"
            >
              <span className="handel-pencil" />
            </HandelButton>
          </div>
        </PermissionRequired>
        <div className="row">
          <div className="col-md-6">
            <CollectionDetail collectionRequest={collectionRequest} />
          </div>
          <div className="col-md-6">
            <div className="w-panel">
              <div className="w-title">
                <h2>Status History</h2>
              </div>
              <StatusHistory collectionRequest={collectionRequest} />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            <SupplierDetail collectionRequest={collectionRequest} />
          </div>
          <div className="col-md-4">
            <DriverDetail collectionRequest={collectionRequest} />
          </div>
          <div className="col-md-4">
            <CustomerDetail collectionRequest={collectionRequest} />
          </div>
        </div>

        <BinList collectionRequest={collectionRequest} />
      </React.Fragment>
    );
  }
}

export default compose(
  AdminLayout,
  connect(
    state => ({
      collectionRequest: state.admin.collectionRequests.view.item,
      isLoading: !state.common.requestFinished.fetchCollectionRequest,
    }),
    dispatch => bindActionCreators({
      fetchItem: actions.fetchItem,
    }, dispatch),
  ),
  withRouter,
)(CollectionRequestDetailPage);
