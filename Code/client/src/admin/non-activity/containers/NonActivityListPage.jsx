import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Table, Pagination } from 'antd';
import { withRouter } from 'react-router-dom';

import * as actions from '../actions';
import { bindActionCreators, formatDateTime } from '../../../common/helpers';
import SearchBox from '../../../common/components/form/SearchBox';
import PageSelector from '../../../common/components/form/PageSelector';
import { withPermission } from '../../../common/hocs/PermissionRequired';
import { DownloadButton } from '../../../common/components';

import AdminLayout from '../../hoc/AdminLayout';

const columns = [
  {
    title: 'ID',
    dataIndex: 'uId',
    key: 'uId',
  },
  {
    title: 'Name',
    dataIndex: 'fullname',
    key: 'fullname',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Last active date',
    key: 'lastActiveDate',
    render: row => formatDateTime(row.driverProfile.lastJobAt),
  },
];

class NonActivityListPage extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    fetchItems: PropTypes.func.isRequired,
    setState: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    pagination: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const {
      fetchItems, setState, pagination,
    } = this.props;
    setState({
      search: '',
      pagination: {
        ...pagination,
        current: 1,
      },
    });
    fetchItems();
  }

  getRowProps = record => ({
    onClick: this.handelRowClick.bind(this, record),
  })

  handlePageChange = (page) => {
    const {
      fetchItems, setState, pagination,
    } = this.props;
    const newPag = {
      ...pagination,
      current: page,
    };
    setState({ pagination: newPag });
    fetchItems();
  }

  handleSearch = (text) => {
    const { setState, fetchItems, pagination } = this.props;
    const newPag = {
      ...pagination,
      current: 1,
    };
    setState({ search: text, pagination: newPag });
    fetchItems();
  }

  handlePageSizeChange = (value) => {
    const {
      fetchItems, setState, pagination,
    } = this.props;
    const newPag = {
      ...pagination,
      current: 1,
      pageSize: parseInt(value, 10),
    };
    setState({ pagination: newPag });
    fetchItems();
  }

  handelRowClick(record) {
    this.props.history.push(`/admin/manage-accounts/driver/${record._id}`);
  }

  render() {
    const {
      loading, items, pagination,
    } = this.props;
    const pageSizes = [
      { label: '10 records', value: 10 },
      { label: '20 records', value: 20 },
      { label: '50 records', value: 50 },
      { label: '100 records', value: 100 },
    ];

    return (
      <React.Fragment>
        <h1 className="p-title">Non Activity Drivers</h1>

        <div className="top-toolbar text-right">
          <DownloadButton
            label="Download"
            href="/admin/drivers/non-activity/csv"
          />
        </div>
        <div className="w-panel">
          <div className="w-title">
            &nbsp;
            <SearchBox onSearch={this.handleSearch} />
          </div>

          <Table
            className="row-clickable"
            dataSource={items}
            columns={columns}
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
          <Pagination className="w-pagination" {...pagination} onChange={this.handlePageChange} />
        </div>

      </React.Fragment>
    );
  }
}

export default compose(
  AdminLayout,
  connect(
    state => ({
      loading: !state.common.requestFinished.fetchNonActivityDrivers,
      items: state.admin.nonActivity.items,
      pagination: state.admin.nonActivity.pagination,
    }),
    dispatch => bindActionCreators(actions, dispatch),
  ),
  withRouter,
  withPermission('listDispute'),
)(NonActivityListPage);
