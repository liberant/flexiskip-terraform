import React, { Component } from 'react';
import { func } from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { setTitle } from '../../../common/actions';
import { withPermission } from '../../../common/hocs/PermissionRequired';
import { getManageTransactionsList } from '../actions';

import ManageTransactionsTable from '../components/ManageTransactionsTable';
import AdminLayout from '../../hoc/AdminLayout';

/* eslint react/require-default-props: 0 */
/* eslint react/prop-types: 0 */
/* eslint no-unused-expressions: 0 */

class ManageTransactionsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sizePerPage: 10,
      firstFetchFlag: true,
    };

    this.handleGetManageTransactionsList = this.handleGetManageTransactionsList.bind(this);
    this.handleFilterData = this.handleFilterData.bind(this);
  }

  componentDidMount() {
    const { setTitle, getManageTransactionsList } = this.props;
    const { sizePerPage } = this.state;

    setTitle('');
    getManageTransactionsList({
      limit: sizePerPage, page: 1, name: 'bin',
    });
  }

  // shouldComponentUpdate(nextProps) {
  //   if (!nextProps.collectionsListLoaded && !this.state.firstFetchFlag) {
  //     return false;
  //   }

  //   return true;
  // }

  handleGetManageTransactionsList(limit, page, name, url, startDate, endDate, search = '') {
    const { getManageTransactionsList } = this.props;
    const { firstFetchFlag } = this.state;

    firstFetchFlag && this.setState({ firstFetchFlag: false });
    getManageTransactionsList({
      limit, page, name, url, startDate, endDate, search,
    });
  }

  handleFilterData(data) {
    const { getManageTransactionsList } = this.props;
    const {
      perPage, page, name,
      startDate, endDate,
      search,
    } = data;

    getManageTransactionsList({
      limit: perPage || 10,
      page: page || 1,
      name: name || 'bin',
      url: 'transaction',
      startDate: (startDate && startDate.substr(0, 10)) || '',
      endDate: (endDate && endDate.substr(0, 10)) || '',
      search: search || '',
    });
  }

  render() {
    const {
      manageTransactions,
    } = this.props;

    return (
      <div className="x_panel_">
        <ManageTransactionsTable
          dataset={manageTransactions}
          getData={this.handleGetManageTransactionsList}
          filterData={this.handleFilterData}
        />
      </div>
    );
  }
}

ManageTransactionsPage.propTypes = {
  getManageTransactionsList: func.isRequired,
  // getCollectionDetailsById: func.isRequired,
  // updateCollectionDetails: func.isRequired,
  // deleteManageTransactionsList: func.isRequired,
  // deleteManageTransactionsById: func.isRequired,
  // updateManageTransactionsStatusById: func.isRequired,
  setTitle: func.isRequired,
};

export default compose(
  AdminLayout,
  connect(
    state => ({
      manageTransactionsListLoaded: state.common.requestFinished.manageTransactionsList,
      manageTransactions: state.admin.manageTransactions.manageTransactions,
    }),
    dispatch => ({
      // set page title
      setTitle: title => dispatch(setTitle(title)),

      getManageTransactionsList: (data) => {
        const action = getManageTransactionsList(data);
        dispatch(action);
        return action.promise;
      },
    }),
  ),
  withPermission('listTransaction'),
)(ManageTransactionsPage);
