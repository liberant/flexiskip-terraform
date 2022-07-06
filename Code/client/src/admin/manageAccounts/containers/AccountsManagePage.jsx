import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { withPermission } from '../../../common/hocs/PermissionRequired';
import {
  deleteCustomerById,
  updateCustomerStatusById,
  updateCustomersStatus,
} from '../actions';

import AccountsTable from '../components/AccountsTable';
import AdminLayout from '../../hoc/AdminLayout';

class AccountsManagePage extends Component {
  render() {
    const {
      deleteCustomerById,
      updateCustomerStatusById,
      updateCustomersStatus,
    } = this.props;

    return (
      <div className="x_panel_">
        <AccountsTable
          deleteCustomerById={deleteCustomerById}
          updateCustomerStatusById={updateCustomerStatusById}
          updateCustomersStatus={updateCustomersStatus}
        />
      </div>
    );
  }
}

AccountsManagePage.propTypes = {
  deleteCustomerById: PropTypes.func.isRequired,
  updateCustomerStatusById: PropTypes.func.isRequired,
  updateCustomersStatus: PropTypes.func.isRequired,
};

AccountsManagePage.defaultProps = {
};

export default compose(
  AdminLayout,
  connect(
    undefined,
    dispatch => ({
      deleteCustomerById: (data) => {
        const action = deleteCustomerById(data);
        dispatch(action);
        return action.promise;
      },
      updateCustomerStatusById: (data) => {
        const action = updateCustomerStatusById(data);
        dispatch(action);
        return action.promise;
      },
      updateCustomersStatus: (data) => {
        const action = updateCustomersStatus(data);
        dispatch(action);
        return action.promise;
      },
    }),
  ),
  withPermission('listAccount'),
)(AccountsManagePage);
