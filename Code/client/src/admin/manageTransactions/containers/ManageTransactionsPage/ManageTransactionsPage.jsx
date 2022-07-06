import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Table, Pagination, Icon } from 'antd';

import { API_URL } from '../../../../common/constants/params';
import { HandelButton } from '../../../../common/components';
import Calendar from '../../../../common/components/Calendar';
import SearchBox from '../../../../common/components/form/SearchBox';
import PageSelector from '../../../../common/components/form/PageSelector';
import { withPermission } from '../../../../common/hocs/PermissionRequired';
import AdminLayout from '../../../hoc/AdminLayout';
import { getEndOfDay, getStartOfDay } from '../../../../common/utils';
import * as actions from '../../actions';
import internalStyles from './ManageTransactionsPage.m.css';
import { pageSizes, columns } from './constants';
import ContractorSelect from '../../components/ContractorSelect/ContractorSelect';

class ManageTransactionsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: 'bin', // collection
      search: '',
      startDate: null,
      endDate: null,
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handlePageSizeChange = this.handlePageSizeChange.bind(this);
    this.handleCalendarChange = this.handleCalendarChange.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
    this.handleDownloadURL = this.handleDownloadURL.bind(this);
  }
  componentDidMount() {
    this.fetchData();
  }

  handleDownloadURL() {
    const {
      currentTab, search,
      startDate, endDate,
    } = this.state;
    const { apiAccessToken } = this.props;
    const from = startDate || moment().subtract(5, 'months').startOf('month');
    const to = endDate || moment().endOf('month');
    const paramStartDate = `&startDate=${encodeURIComponent(getStartOfDay(from))}`;
    const paramEndDate = `&endDate=${encodeURIComponent(getEndOfDay(to))}`;
    const paramSearch = `&s=${search || ''}`;
    const url = `/admin/transactions-csv?&type=${currentTab}${paramStartDate}${paramEndDate}${paramSearch}`;
    window.location = `${API_URL}/${url.replace('?', `?token=${apiAccessToken}&`)}`;
  }

  fetchData(page = 1, pageSize) {
    const {
      getManageTransactionsList,
      pagination,
    } = this.props;
    const {
      search, currentTab, startDate,
      endDate,
    } = this.state;
    getManageTransactionsList({
      limit: pageSize || pagination.pageSize,
      page: page || 1,
      name: currentTab,
      startDate: (startDate && startDate.substr(0, 10)) || '',
      endDate: (endDate && endDate.substr(0, 10)) || '',
      search: search || '',
    });
  }

  handleSearch(text) {
    this.setState({ search: text }, () => {
      this.fetchData();
    });
  }

  handlePageChange(page) {
    this.fetchData(page);
  }

  handlePageSizeChange(value) {
    this.fetchData(1, value);
  }

  handleCalendarChange(data) {
    const { startDate, endDate } = data;
    if (!startDate || !endDate) {
      return;
    }

    this.setState({
      startDate,
      endDate,
    }, () => {
      this.fetchData();
    });
  }

  handleTabClick(tab) {
    return () => {
      this.setState({
        currentTab: tab,
      }, () => {
        this.fetchData();
      });
    };
  }

  render() {
    const {
      loading, transactions, pagination,
    } = this.props;
    const { currentTab } = this.state;
    return (
      <React.Fragment>
        <h1 className="p-title">Transactions</h1>

        <div className={internalStyles.tabGroup}>
          <div
            className={`${internalStyles.tabTransaction} ${currentTab === 'bin' ? internalStyles.tabSelected : ''}`}
            onClick={this.handleTabClick('bin')}
          >
            Bin Transactions
          </div>
          <div
            className={`${internalStyles.tabTransaction} ${currentTab === 'collection' ? internalStyles.tabSelected : ''}`}
            onClick={this.handleTabClick('collection')}
          >
            Collection Transactions
          </div>
          <div
            className={`${internalStyles.tabTransaction} ${currentTab === 'activity' ? internalStyles.tabSelected : ''}`}
            // onClick={this.handleTabClick('activity')}
          >
            Contractor's Activity
          </div>
        </div>

        <div className={internalStyles.filterSection}>
          <div>Filter</div>
          <div className={internalStyles.contractors}>
            <ContractorSelect
              prefixIcon={(<Icon type="usergroup-add" />)}
              value=""
              options={[
                {
                  value: '',
                  label: 'All Contractors',
                },
              ]}
            />
          </div>
          <div className={internalStyles.calendarControl}>
            <Calendar
              filterData={this.handleCalendarChange}
            />
          </div>
          <div className={internalStyles.downloadButton}>
            <HandelButton
              onClick={this.handleDownloadURL}
              iconColor="white"
              bgColor="blue"
              borderColor="blue"
              shadowColor="blue"
            >
              <span className="handel-download" />
            </HandelButton>
            <span
              className={internalStyles.downloadButtonText}
              onClick={this.handleDownloadURL}
            >
              Download.CSV
            </span>
          </div>
        </div>
        <div className={`w-panel ${internalStyles.orderTransactions}`}>
          <div className="w-title">
            <h2>Order Transactions</h2>
            <SearchBox onSearch={this.handleSearch} />
          </div>

          <Table
            className={`row-clickable ${internalStyles.transactionTable}`}
            dataSource={transactions}
            columns={columns(currentTab)}
            loading={loading}
            rowKey="_id"
            pagination={false}
            onRow={this.getRowProps}
          />
        </div>

        <div className="bottom-toolbar">
          <PageSelector
            pageSizes={pageSizes}
            value={pagination.pageSize}
            onChange={this.handlePageSizeChange}
          />
          <Pagination
            className="w-pagination"
            {...pagination}
            onChange={this.handlePageChange}
          />
        </div>

      </React.Fragment>
    );
  }
}

ManageTransactionsPage.propTypes = {
  getManageTransactionsList: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  transactions: PropTypes.array.isRequired,
  pagination: PropTypes.object.isRequired,
  setManageTransactionsListState: PropTypes.func.isRequired,
  apiAccessToken: PropTypes.string.isRequired,
};

export default compose(
  AdminLayout,
  connect(
    state => ({
      apiAccessToken: state.common.identity.token.value,
      loading: !state.common.requestFinished.manageTransactionsList,
      pagination: state.admin.manageTransactions.manageTransactions.pagination,
      transactions: state.admin.manageTransactions.manageTransactions.data,
    }),
    dispatch => bindActionCreators(actions, dispatch),
  ),
  withPermission('listTransaction'),
)(ManageTransactionsPage);
