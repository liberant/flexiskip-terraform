import React, { Component } from 'react';
import { any, bool, func } from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { setTitle } from '../../../../common/actions';
import { withPermission } from '../../../../common/hocs/PermissionRequired';
import {
  getCouncilsList,
  getCouncilDetailsById,
  updateCouncilDetails,
  updateCouncilStatus,
  deleteCouncilsList,
  deleteCouncilById,
} from '../actions';
import Spinner from '../../../../common/components/Spinner';

import CouncilsTable from '../components/CouncilsTable';
import AdminLayout from '../../../hoc/AdminLayout';

class CouncilsManagePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sizePerPage: 10,
      firstFetchFlag: true,
    };

    this.handleGetCouncilsList = this.handleGetCouncilsList.bind(this);
  }


  componentDidMount() {
    const { setTitle, getCouncilsList } = this.props;
    const { sizePerPage } = this.state;

    setTitle('');
    getCouncilsList({
      limit: sizePerPage, page: 1, s: '',
    });
  }

  // shouldComponentUpdate(nextProps) {
  //   if (!nextProps.councilsListLoaded && !this.state.firstFetchFlag) {
  //     return false;
  //   }

  //   return true;
  // }

  handleGetCouncilsList(limit, page, s, status) {
    const { getCouncilsList } = this.props;
    const { firstFetchFlag } = this.state;

    if (firstFetchFlag) {
      this.setState({ firstFetchFlag: false });
    }

    getCouncilsList({
      limit, page, s, status,
    });
  }

  render() {
    const {
      councilsListLoaded,
      councils,
      updateCouncilStatus, deleteCouncilsList,
    } = this.props;
    const { firstFetchFlag } = this.state;

    if (firstFetchFlag && !councilsListLoaded) {
      return (
        <Spinner />
      );
    }

    return (
      <div className="x_panel_">
        <CouncilsTable
          dataset={councils}
          getData={this.handleGetCouncilsList}
          updateCouncilStatus={updateCouncilStatus}
          deleteCouncilsList={deleteCouncilsList}
        />
      </div>
    );
  }
}

CouncilsManagePage.propTypes = {
  councilsListLoaded: bool,
  councils: any,
  getCouncilsList: func.isRequired,
  // getCouncilDetailsById: func.isRequired,
  // updateCouncilDetails: func.isRequired,
  deleteCouncilsList: func.isRequired,
  // deleteCouncilById: func.isRequired,
  updateCouncilStatus: func.isRequired,
  setTitle: func.isRequired,
};

CouncilsManagePage.defaultProps = {
  councilsListLoaded: false,
  councils: {},
};

export default compose(
  AdminLayout,
  connect(
    state => ({
      councilsListLoaded: state.common.requestFinished.councilsList,
      councils: { councils: state.admin.councils.list },
    }),
    dispatch => ({
      // set page title
      setTitle: title => dispatch(setTitle(title)),

      getCouncilsList: (data) => {
        const action = getCouncilsList(data);
        dispatch(action);
        return action.promise;
      },

      getCouncilDetailsById: (data) => {
        const action = getCouncilDetailsById(data);
        dispatch(action);
        return action.promise;
      },

      updateCouncilDetails: (data) => {
        const action = updateCouncilDetails(data);
        dispatch(action);
        return action.promise;
      },

      deleteCouncilsList: (data) => {
        const action = deleteCouncilsList(data);
        dispatch(action);
        return action.promise;
      },

      deleteCouncilById: (data) => {
        const action = deleteCouncilById(data);
        dispatch(action);
        return action.promise;
      },

      updateCouncilStatus: (data) => {
        const action = updateCouncilStatus(data);
        dispatch(action);
        return action.promise;
      },

    }),
  ),
  withPermission('listCouncil'),
)(CouncilsManagePage);
