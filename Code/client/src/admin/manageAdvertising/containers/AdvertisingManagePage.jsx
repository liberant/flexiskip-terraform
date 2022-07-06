import React, { Component } from 'react';
import { any, bool, func } from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { setTitle } from '../../../common/actions';
import { withPermission } from '../../../common/hocs/PermissionRequired';
import {
  getAdvertisingList,
  getAdvertisingDetailsById,
  updateAdvertisingDetails,
  updateAdvertisingStatus,
  deleteAdvertisingList,
  deleteAdvertisingById,
} from '../actions';
import Spinner from '../../../common/components/Spinner';

import AdvertisingTable from '../components/AdvertisingTable';
import AdminLayout from '../../hoc/AdminLayout';

class AdvertisingManagePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userType: 'advertising',
      sizePerPage: 10,
      firstFetchFlag: true,
    };

    this.handleGetAdvertisingList = this.handleGetAdvertisingList.bind(this);
  }


  componentDidMount() {
    const { setTitle, getAdvertisingList } = this.props;
    const { userType, sizePerPage } = this.state;

    setTitle('');
    getAdvertisingList({
      limit: sizePerPage, page: 1, userType, url: 'advertising',
    });
  }

  // shouldComponentUpdate(nextProps) {
  //   if (!nextProps.advertisingListLoaded && !this.state.firstFetchFlag) {
  //     return false;
  //   }

  //   return true;
  // }

  handleGetAdvertisingList(limit, page, userType, url, search) {
    const { getAdvertisingList } = this.props;
    const { firstFetchFlag } = this.state;

    if (firstFetchFlag) {
      this.setState({ firstFetchFlag: false });
    }

    getAdvertisingList({
      limit, page, userType, url, search,
    });
  }

  render() {
    const {
      advertisingListLoaded,
      advertising,
      updateAdvertisingStatus, deleteAdvertisingList,
    } = this.props;
    const { firstFetchFlag } = this.state;

    if (firstFetchFlag && !advertisingListLoaded) {
      return (
        <Spinner />
      );
    }

    return (
      <div className="x_panel_">
        <AdvertisingTable
          dataset={advertising}
          getData={this.handleGetAdvertisingList}
          updateAdvertisingStatus={updateAdvertisingStatus}
          deleteAdvertisingList={deleteAdvertisingList}
        />
      </div>
    );
  }
}

AdvertisingManagePage.propTypes = {
  advertisingListLoaded: bool,
  advertising: any,
  getAdvertisingList: func.isRequired,
  // getAdvertisingDetailsById: func.isRequired,
  // updateAdvertisingDetails: func.isRequired,
  deleteAdvertisingList: func.isRequired,
  // deleteAdvertisingById: func.isRequired,
  updateAdvertisingStatus: func.isRequired,
  setTitle: func.isRequired,
};

AdvertisingManagePage.defaultProps = {
  advertisingListLoaded: false,
  advertising: {},
};

export default compose(
  AdminLayout,
  connect(
    state => ({
      advertisingListLoaded: state.common.requestFinished.advertisingList,
      advertising: state.admin.advertising || {},
    }),
    dispatch => ({
      // set page title
      setTitle: title => dispatch(setTitle(title)),

      getAdvertisingList: (data) => {
        const action = getAdvertisingList(data);
        dispatch(action);
        return action.promise;
      },

      getAdvertisingDetailsById: (data) => {
        const action = getAdvertisingDetailsById(data);
        dispatch(action);
        return action.promise;
      },

      updateAdvertisingDetails: (data) => {
        const action = updateAdvertisingDetails(data);
        dispatch(action);
        return action.promise;
      },

      deleteAdvertisingList: (data) => {
        const action = deleteAdvertisingList(data);
        dispatch(action);
        return action.promise;
      },

      deleteAdvertisingById: (data) => {
        const action = deleteAdvertisingById(data);
        dispatch(action);
        return action.promise;
      },

      updateAdvertisingStatus: (data) => {
        const action = updateAdvertisingStatus(data);
        dispatch(action);
        return action.promise;
      },

    }),
  ),
  withPermission('listAdvertising'),
)(AdvertisingManagePage);
