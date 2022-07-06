import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Table, Pagination } from 'antd';
import { withRouter } from 'react-router-dom';

import * as actions from '../actions';
import { bindActionCreators, formatDateTime, truncate } from '../../../../common/helpers';
import SearchBox from '../../../../common/components/form/SearchBox';
import PageSelector from '../../../../common/components/form/PageSelector';
import DisputeStatus from '../../../../common/components/DisputeStatus';
import { withPermission } from '../../../../common/hocs/PermissionRequired';

const columns = [
  {
    title: 'Collection ID',
    dataIndex: 'collectionRequest.code',
    key: '_id',
  },
  {
    title: 'User Name',
    dataIndex: 'user',
    key: 'user',
    render: user => `${user.firstname} ${user.lastname}`,
  },
  {
    title: 'Reported By',
    dataIndex: 'reporter',
    key: 'reporter',
    render: user => `${user.firstname} ${user.lastname}`,
  },
  {
    title: 'Date & Time',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: time => formatDateTime(time),
  },
  {
    title: 'Reason',
    dataIndex: 'reason',
    key: 'reason',
    render: reason => truncate(reason, 50),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: status => (<DisputeStatus value={status} />),
  },
];

class DisputeListTableView extends Component {
  static propTypes = {
    titleInside: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    fetchDisputes: PropTypes.func.isRequired,
    setState: PropTypes.func.isRequired,
    disputes: PropTypes.array.isRequired,
    pagination: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const {
      fetchDisputes, setState, pagination,
    } = this.props;
    setState({
      search: '',
      pagination: {
        ...pagination,
        current: 1,
      },
    });
    fetchDisputes();
  }

  getRowProps = record => ({
    onClick: this.handelRowClick.bind(this, record),
  })

  handlePageChange = (page) => {
    const {
      fetchDisputes, setState, pagination,
    } = this.props;
    const newPag = {
      ...pagination,
      current: page,
    };
    setState({ pagination: newPag });
    fetchDisputes();
  }

  handleSearch = (text) => {
    const { setState, fetchDisputes, pagination } = this.props;
    const newPag = {
      ...pagination,
      current: 1,
    };
    setState({ search: text, pagination: newPag });
    fetchDisputes();
  }

  handlePageSizeChange = (value) => {
    const {
      fetchDisputes, setState, pagination,
    } = this.props;
    const newPag = {
      ...pagination,
      current: 1,
      pageSize: parseInt(value, 10),
    };
    setState({ pagination: newPag });
    fetchDisputes();
  }

  handelRowClick(record) {
    this.props.history.push(`/admin/disputes/${record._id}/view`);
  }

  render() {
    const {
      loading, disputes, pagination,
      titleInside,
    } = this.props;
    const pageSizes = [
      { label: '10 records', value: 10 },
      { label: '20 records', value: 20 },
      { label: '50 records', value: 50 },
      { label: '100 records', value: 100 },
    ];

    return (
      <React.Fragment>
        <div className="w-panel">
          <div className="w-title">
            <h2>{titleInside}</h2>
            <SearchBox onSearch={this.handleSearch} />
          </div>

          <Table
            className="row-clickable"
            dataSource={disputes}
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
  connect(
    state => ({
      loading: !state.common.requestFinished.fetchDisputes,
      disputes: state.admin.manageDisputes.list.disputes,
      pagination: state.admin.manageDisputes.list.pagination,
    }),
    dispatch => bindActionCreators(actions, dispatch),
  ),
  withRouter,
  withPermission('listDispute'),
)(DisputeListTableView);
