import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Table, Pagination } from 'antd';

import SearchBox from '../../../../common/components/form/SearchBox';
import PageSelector from '../../../../common/components/form/PageSelector';

/* eslint react/no-did-update-set-state: 0 */

class DataDetailsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      perPage: 10,
      search: '',
    };
    this.handleTableChange = this.handleTableChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handlePerPageChange = this.handlePerPageChange.bind(this);

    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { dataset } = this.props;

    if ((dataset.data !== prevProps.dataset.data)) {
      this.setState({ loading: false });
    }
  }

  handlePerPageChange(val) {
    const { search } = this.state;
    this.setState(() => ({ perPage: val }));
    this.props.getData(val, 1, search);
  }

  handleTableChange(type, { page }) {
    const { perPage, search } = this.state;
    this.setState(() => ({ loading: true }));
    this.props.getData(perPage, page, search);
  }

  handlePageChange(page) {
    const { perPage, search } = this.state;
    this.setState(() => ({ loading: true }));
    this.props.getData(perPage, page, search);
  }

  handleSearch(text) {
    const { perPage } = this.state;
    this.setState(() => ({ loading: true, search: text }));
    this.props.getData(perPage, 1, text);
  }

  render() {
    const { dataset, columnDefs, title } = this.props;
    const { loading } = this.state;

    const pageSizes = [
      { label: '10 records', value: 10 },
      { label: '20 records', value: 20 },
      { label: '50 records', value: 50 },
      { label: '100 records', value: 100 },
    ];

    const pagination = {
      current: dataset.pagination.currentPage,
      pageSize: dataset.pagination.perPage,
      total: dataset.pagination.totalCount,
    };

    return (
      <React.Fragment>
        <div className="w-panel">
          <div className="w-title">
            <h2>{title}</h2>
            <SearchBox onSearch={this.handleSearch} />
          </div>

          <Table
            className="row-clickable councils-table"
            dataSource={dataset.data}
            columns={columnDefs}
            loading={loading}
            rowKey="_id"
            pagination={false}
            expandIconAsCell={false}
          />
        </div>

        <div className="bottom-toolbar">
          <PageSelector
            pageSizes={pageSizes}
            value={pagination.pageSize}
            onChange={this.handlePerPageChange}
          />
          <Pagination className="w-pagination" {...pagination} onChange={this.handlePageChange} />
        </div>
      </React.Fragment>
    );
  }
}

DataDetailsTable.propTypes = {
  title: PropTypes.string.isRequired,
  columnDefs: PropTypes.any.isRequired,
  dataset: PropTypes.any.isRequired,
  getData: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(DataDetailsTable);
