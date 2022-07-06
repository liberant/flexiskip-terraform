import React, { Component } from 'react';
import { bool, func } from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { setTitle } from '../../../common/actions';
import {
  getManageTransactionsList,
  // updateManageTransactionsDetails,
  // deleteManageTransactionsList,
  // deleteManageTransactionsById,
  // updateManageTransactionsStatusById,
} from '../actions';
import Spinner from '../../../common/components/Spinner';

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
  }

  componentDidMount() {
    const { setTitle, getManageTransactionsList } = this.props;
    const { sizePerPage } = this.state;

    setTitle('');
    getManageTransactionsList({
      limit: sizePerPage, page: 1, name: 'collection',
    });
  }

  // shouldComponentUpdate(nextProps) {
  //   if (!nextProps.collectionsListLoaded && !this.state.firstFetchFlag) {
  //     return false;
  //   }

  //   return true;
  // }

  handleGetManageTransactionsList(limit, page, s) {
    const { getManageTransactionsList } = this.props;
    const { firstFetchFlag } = this.state;

    firstFetchFlag && this.setState({ firstFetchFlag: false });
    getManageTransactionsList({
      limit, page, s,
    });
  }

  render() {
    const {
      manageTransactionsListLoaded,
      manageTransactions,
      // deleteManageTransactionsById,
      // updateManageTransactionsStatusById,
      // deleteManageTransactionsList,
    } = this.props;
    const { firstFetchFlag } = this.state;

    if (firstFetchFlag && !manageTransactionsListLoaded) {
      return (
        <Spinner />
      );
    }

    return (
      <div className="x_panel_">
        <ManageTransactionsTable
          dataset={manageTransactions}
          getData={this.handleGetManageTransactionsList}
        />
      </div>
    );
  }
}

ManageTransactionsPage.propTypes = {
  manageTransactionsListLoaded: bool,
  getManageTransactionsList: func.isRequired,
  // getCollectionDetailsById: func.isRequired,
  // updateCollectionDetails: func.isRequired,
  // deleteManageTransactionsList: func.isRequired,
  // deleteManageTransactionsById: func.isRequired,
  // updateManageTransactionsStatusById: func.isRequired,
  setTitle: func.isRequired,
};

ManageTransactionsPage.defaultProps = {
  manageTransactionsListLoaded: false,
};

export default compose(
  AdminLayout,
  connect(
    state => ({
      manageTransactionsListLoaded: state.common.requestFinished.manageTransactionsList,
      manageTransactions: state.contractor.transactions.transactions,
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
)(ManageTransactionsPage);
