import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Table, Pagination } from 'antd';
import { withRouter } from 'react-router-dom';

import * as actions from '../actions';
import { bindActionCreators } from '../../../../common/helpers';
import SearchBox from '../../../../common/components/form/SearchBox';
import PageSelector from '../../../../common/components/form/PageSelector';

const columns = [
  {
    title: 'ID',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Waste Type',
    dataIndex: 'charges',
    key: 'charges',
    render: charges => charges.map(ch => ch.wasteType).join(', '),
  },
];

class DumpsiteList extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    fetchDumpsites: PropTypes.func.isRequired,
    setState: PropTypes.func.isRequired,
    dumpsites: PropTypes.array,
    pagination: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    councilId: PropTypes.string.isRequired,
  }

  static defaultProps = {
    dumpsites: undefined,
  }

  componentDidMount() {
    this.props.fetchDumpsites(this.props.councilId);
  }

  getRowProps = record => ({
    onClick: this.handelRowClick.bind(this, record),
  })

  handlePageChange = (page) => {
    const {
      fetchDumpsites, setState, pagination, councilId,
    } = this.props;
    const newPag = {
      ...pagination,
      current: page,
    };
    setState({ pagination: newPag });
    fetchDumpsites(councilId);
  }

  handleSearch = (text) => {
    const {
      setState, fetchDumpsites, pagination, councilId,
    } = this.props;
    const newPag = {
      ...pagination,
      current: 1,
    };
    setState({ search: text, pagination: newPag });
    fetchDumpsites(councilId);
  }

  handlePageSizeChange = (value) => {
    const {
      fetchDumpsites, setState, pagination, councilId,
    } = this.props;
    const newPag = {
      ...pagination,
      current: 1,
      pageSize: parseInt(value, 10),
    };
    setState({ pagination: newPag });
    fetchDumpsites(councilId);
  }

  handelRowClick(record) {
    this.props.history.push(`/admin/dumpsites/${record._id}/view`);
  }

  render() {
    const {
      loading, dumpsites, pagination,
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
            <h2>Dumpsites</h2>
            <SearchBox onSearch={this.handleSearch} />
          </div>

          <Table
            className="row-clickable"
            dataSource={dumpsites}
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
      loading: !state.common.requestFinished.fetchDumpsites,
      dumpsites: state.admin.councils.view.dumpsites,
      pagination: state.admin.councils.view.pagination,
    }),
    dispatch => bindActionCreators({
      fetchDumpsites: actions.fetchDumpsites,
      setState: actions.setDumpsiteListState,
    }, dispatch),
  ),
  withRouter,
)(DumpsiteList);
