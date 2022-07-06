import React, { Component } from 'react';
import { bool, func } from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { setTitle } from '../../../common/actions';
import {
  getDriversList,
  getDriverDetailsById,
  updateDriverDetails,
  deleteDriversList,
  deleteDriverById,
  updateDriverStatusById,
  updateDriversStatus,

  getUnassignedJobsList,
  assignJobToDriver,
} from '../actions';
import Spinner from '../../../common/components/Spinner';

import AccountsTable from '../components/AccountsTable/AccountsTable';
import AdminLayout from '../../hoc/AdminLayout';

import JobsTable from '../components/JobsTable';

/* eslint react/require-default-props: 0 */
/* eslint react/prop-types: 0 */
/* eslint no-unused-expressions: 0 */

const xPanelStyle = {
  marginBottom: -20,
};

class AccountsManagePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      s: '',
      sizePerPage: 10,
      firstFetchFlag: true,
    };

    this.handleGetDriversList = this.handleGetDriversList.bind(this);
    this.handleUnassignedJobsList = this.handleUnassignedJobsList.bind(this);
  }


  componentDidMount() {
    const { setTitle, getDriversList, getUnassignedJobsList } = this.props;
    const { sizePerPage, s } = this.state;

    setTitle('');
    getDriversList({
      limit: sizePerPage, page: 1, s,
    });
    getUnassignedJobsList({
      limit: sizePerPage, page: 1, s,
    });
  }

  // shouldComponentUpdate(nextProps) {
  //   if (!nextProps.customersListLoaded && !this.state.firstFetchFlag) {
  //     return false;
  //   }

  //   return true;
  // }

  handleGetDriversList(limit, page, s) {
    const { getDriversList } = this.props;
    const { firstFetchFlag } = this.state;

    firstFetchFlag && this.setState({ firstFetchFlag: false });
    getDriversList({
      limit, page, s,
    });
  }

  handleUnassignedJobsList(limit, page, s) {
    const { getUnassignedJobsList } = this.props;
    const { firstFetchFlag } = this.state;

    firstFetchFlag && this.setState({ firstFetchFlag: false });
    getUnassignedJobsList({
      limit, page, s,
    });
  }
  render() {
    const {
      customersListLoaded,
      accounts,
      deleteDriverById,
      updateDriverStatusById,
      updateDriversStatus,
      unassignedJobs,
      assignJobToDriver,
    } = this.props;

    const driverList = accounts.customers.data.map((acc) => {
      return { id: acc._id, name: acc.fullname };
    });

    const { firstFetchFlag } = this.state;

    if (firstFetchFlag && !customersListLoaded) {
      return (
        <Spinner />
      );
    }

    return (
      <div className="x_panel_" style={xPanelStyle}>
        <AccountsTable
          accounts={accounts}
          getData={this.handleGetDriversList}
          deleteCustomerById={deleteDriverById}
          updateCustomerStatusById={updateDriverStatusById}
          updateCustomersStatus={updateDriversStatus}
        />
        <JobsTable
          title="Job Assignment"
          unassignedJobs={unassignedJobs}
          driverList={driverList}
          getData={this.handleUnassignedJobsList}
          assignJobHandler={assignJobToDriver}
        />
      </div>
    );
  }
}

AccountsManagePage.propTypes = {
  customersListLoaded: bool,
  getDriversList: func.isRequired,
  // getDriverDetailsById: func.isRequired,
  // updateDriverDetails: func.isRequired,
  // deleteDriversList: func.isRequired,
  deleteDriverById: func.isRequired,
  updateDriverStatusById: func.isRequired,
  setTitle: func.isRequired,
};

AccountsManagePage.defaultProps = {
  customersListLoaded: false,
};

export default compose(
  AdminLayout,
  connect(
    state => ({
      customersListLoaded: state.common.requestFinished.customersList,
      accounts: state.contractor.drivers,
      unassignedJobs: state.contractor.drivers.customers.unassignedJobs,
    }),
    dispatch => ({
      // set page title
      setTitle: title => dispatch(setTitle(title)),

      getDriversList: (data) => {
        const action = getDriversList(data);
        dispatch(action);
        return action.promise;
      },

      getDriverDetailsById: (data) => {
        const action = getDriverDetailsById(data);
        dispatch(action);
        return action.promise;
      },

      updateDriverDetails: (data) => {
        const action = updateDriverDetails(data);
        dispatch(action);
        return action.promise;
      },

      deleteDriversList: (data) => {
        const action = deleteDriversList(data);
        dispatch(action);
        return action.promise;
      },

      deleteDriverById: (data) => {
        const action = deleteDriverById(data);
        dispatch(action);
        return action.promise;
      },

      updateDriverStatusById: (data) => {
        const action = updateDriverStatusById(data);
        dispatch(action);
        return action.promise;
      },

      updateDriversStatus: (data) => {
        const action = updateDriversStatus(data);
        dispatch(action);
        return action.promise;
      },

      getUnassignedJobsList: (data) => {
        const action = getUnassignedJobsList(data);
        dispatch(action);
        return action.promise;
      },

      assignJobToDriver: (data) => {
        const action = assignJobToDriver(data);
        dispatch(action);
        return action.promise;
      },
    }),
  ),
)(AccountsManagePage);
