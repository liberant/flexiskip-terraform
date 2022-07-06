/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import * as viewActions from '../../view/actions';
import * as updateActions from '../actions';
import { bindActionCreators } from '../../../../common/helpers';
import { withPermission } from '../../../../common/hocs/PermissionRequired';

import AdminLayout from '../../../hoc/AdminLayout';
import BackButton from '../../../../common/components/BackButton';
import HandelButton from '../../../../common/components/HandelButton';
import Spinner from '../../../../common/components/Spinner';
import BinList from '../../view/components/BinList';
import CollectionDetail from '../components/CollectionDetail';
import DriverDetail from '../../view/components/DriverDetail';
import CustomerDetail from '../../view/components/CustomerDetail';
import StatusHistory from '../../view/components/StatusHistory';
import { getDumpsitesList } from '../../../manageDumpsites/list/actions';

class CollectionRequestDetailPage extends Component {
  constructor(props) {
     super(props);
     this.state = {
       binUpdates: {}
     };
  }
  static propTypes = {
    match: PropTypes.object.isRequired,
    fetchItem: PropTypes.func.isRequired,
    updateItem: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
    collectionRequest: PropTypes.object,
  }

  static defaultProps = {
    collectionRequest: null,
    binUpdates:{}
  }

  componentDidMount() {
    const {
      fetchItem,
      match,
    } = this.props;
    const { id } = match.params;
    fetchItem(id);
    this.props.getDumpsitesList({ limit: 1000, page: 1 });
  }

  onWeightChange = (id, value) => {
    let binUpdates = {...this.state.binUpdates}
    binUpdates[id] = value
    this.setState({ binUpdates: binUpdates });
  }

  render() {
    const {
      collectionRequest, isLoading, updateItem, isSaving, dumpsites, binUpdates
    } = this.props;
    if (isLoading || collectionRequest === null) return <Spinner />;
    collectionRequest.items.forEach((item) => {
      item.disposalAddress = collectionRequest.disposalAddress;
    });

    return (
      <React.Fragment>
        <BackButton link="/admin/collection-requests" label={collectionRequest.code} />
        <div className="top-toolbar text-right">
          <HandelButton
            label="Cancel Edit"
            href={`/admin/collection-requests-view/${collectionRequest._id}`}
            borderColor="red"
            iconColor="red"
            shadowColor="red"
            bgColor="white"
          >
            <span className="handel-cross" />
          </HandelButton>
          <HandelButton
            label="Save"
            form="editColReqForm"
            htmlType="submit"
            iconColor="white"
            bgColor="blue"
            borderColor="blue"
            shadowColor="blue"
            loading={isSaving}
          >
            <span className="handel-floppy-disk" />
          </HandelButton>
        </div>
        <div className="row">
          <div className="col-md-6">
            <CollectionDetail collectionRequest={collectionRequest} onSubmit={updateItem} dumpsites={dumpsites} binUpdates={this.state.binUpdates}/>
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
          <div className="col-md-6">
            <DriverDetail collectionRequest={collectionRequest} />
          </div>
          <div className="col-md-6">
            <CustomerDetail collectionRequest={collectionRequest} />
          </div>
        </div>

        <BinList collectionRequest={collectionRequest} onWeightChange={this.onWeightChange} />
      </React.Fragment>
    );
  }
}

export default compose(
  AdminLayout,
  connect(
    state => ({
      collectionRequest: state.admin.collectionRequests.view.item,
      isLoading: state.common.loading.fetchCollectionRequest || false,
      isSaving: state.common.loading.updateCollectionRequest || false,
      dumpsites: state.admin.dumpsites.list.data,
    }),
    dispatch => ({
      ...bindActionCreators({
        fetchItem: viewActions.fetchItem,
        updateItem: updateActions.updateItem,
      }, dispatch),

      getDumpsitesList: (key) => {
        const action = getDumpsitesList(key);
        dispatch(action);
        return action.promise;
      },
    })
  ),
  withPermission('editCollectionRequest'),
)(CollectionRequestDetailPage);
