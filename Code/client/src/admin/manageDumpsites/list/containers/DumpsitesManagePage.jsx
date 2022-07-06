import React, { Component } from 'react';
import { any, bool, func } from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { setTitle } from '../../../../common/actions';
import { withPermission } from '../../../../common/hocs/PermissionRequired';
import {
  getDumpsitesList,
  getDumpsiteDetailsById,
  updateDumpsiteDetails,
  updateDumpsiteStatus,
  deleteDumpsitesList,
  deleteDumpsiteById,
} from '../actions';
import Spinner from '../../../../common/components/Spinner';

import DumpsitesTable from '../components/DumpsitesTable';
import AdminLayout from '../../../hoc/AdminLayout';

class DumpsitesManagePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sizePerPage: 10,
      firstFetchFlag: true,
    };

    this.handleGetDumpsitesList = this.handleGetDumpsitesList.bind(this);
  }


  componentDidMount() {
    const { setTitle, getDumpsitesList } = this.props;
    const { sizePerPage } = this.state;

    setTitle('');
    getDumpsitesList({
      limit: sizePerPage, page: 1,
    });
  }

  // shouldComponentUpdate(nextProps) {
  //   if (!nextProps.dumpsitesListLoaded && !this.state.firstFetchFlag) {
  //     return false;
  //   }

  //   return true;
  // }

  handleGetDumpsitesList(limit, page, s) {
    const { getDumpsitesList } = this.props;
    const { firstFetchFlag } = this.state;

    if (firstFetchFlag) {
      this.setState({ firstFetchFlag: false });
    }

    getDumpsitesList({
      limit, page, s,
    });
  }

  render() {
    const {
      dumpsitesListLoaded,
      dumpsites,
      updateDumpsiteStatus, deleteDumpsitesList,
    } = this.props;
    const { firstFetchFlag } = this.state;

    if (firstFetchFlag && !dumpsitesListLoaded) {
      return (
        <Spinner />
      );
    }

    return (
      <div className="x_panel_">
        <DumpsitesTable
          dataset={{ dumpsites }}
          getData={this.handleGetDumpsitesList}
          updateDumpsiteStatus={updateDumpsiteStatus}
          deleteDumpsitesList={deleteDumpsitesList}
        />
      </div>
    );
  }
}

DumpsitesManagePage.propTypes = {
  dumpsitesListLoaded: bool,
  dumpsites: any,
  getDumpsitesList: func.isRequired,
  // getDumpsiteDetailsById: func.isRequired,
  // updateDumpsiteDetails: func.isRequired,
  deleteDumpsitesList: func.isRequired,
  // deleteDumpsiteById: func.isRequired,
  updateDumpsiteStatus: func.isRequired,
  setTitle: func.isRequired,
};

DumpsitesManagePage.defaultProps = {
  dumpsitesListLoaded: false,
  dumpsites: {},
};

export default compose(
  AdminLayout,
  connect(
    state => ({
      dumpsitesListLoaded: state.common.requestFinished.dumpsitesList,
      dumpsites: state.admin.dumpsites.list || {},
    }),
    dispatch => ({
      // set page title
      setTitle: title => dispatch(setTitle(title)),

      getDumpsitesList: (data) => {
        const action = getDumpsitesList(data);
        dispatch(action);
        return action.promise;
      },

      getDumpsiteDetailsById: (data) => {
        const action = getDumpsiteDetailsById(data);
        dispatch(action);
        return action.promise;
      },

      updateDumpsiteDetails: (data) => {
        const action = updateDumpsiteDetails(data);
        dispatch(action);
        return action.promise;
      },

      deleteDumpsitesList: (data) => {
        const action = deleteDumpsitesList(data);
        dispatch(action);
        return action.promise;
      },

      deleteDumpsiteById: (data) => {
        const action = deleteDumpsiteById(data);
        dispatch(action);
        return action.promise;
      },

      updateDumpsiteStatus: (data) => {
        const action = updateDumpsiteStatus(data);
        dispatch(action);
        return action.promise;
      },

    }),
  ),
  withPermission('listDumpsite'),
)(DumpsitesManagePage);
