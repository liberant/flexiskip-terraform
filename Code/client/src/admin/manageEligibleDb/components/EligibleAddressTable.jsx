import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Table, Pagination } from 'antd';
import _, { noop, findIndex } from 'lodash';
import SearchBox from '../../../common/components/form/SearchBox';
import PageSelector from '../../../common/components/form/PageSelector';
import { ActionButton, HandelButton } from '../../../common/components';
import PermissionRequired from '../../../common/hocs/PermissionRequired';

import { columns } from './columnsDef';


/* eslint no-underscore-dangle: 0 */
/* eslint react/no-did-update-set-state: 0 */

class EligibleAddressTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { dataset } = this.props;

    if ((dataset.data !== prevProps.dataset.data)) {
      this.setState({ loading: false });
    }
  }

  render() {
    const {
      loading,

      dataset,
      onPerPageChange,
      onPageChange,
      onSearch,

      selectedRowKeys,
    } = this.props;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.props.onRowSelect,
    };

    const { data } = dataset
    const pagination = {
      current: dataset.pagination.currentPage,
      pageSize: dataset.pagination.perPage,
      total: dataset.pagination.totalCount,
    };

    return (
      <div>
        <div className="w-panel">
          <div className="w-title" style={{ justifyContent: 'flex-start' }}>
            <SearchBox
              onSearch={onSearch}
              style={{ marginLeft: 'auto' }}
              startLength={3}
            />
          </div>

          <Table
            className="row-clickable councils-table components-table-demo-nested"
            rowSelection={rowSelection}
            dataSource={data}
            columns={columns}
            loading={loading}
            rowKey="_id"
            pagination={false}
          />
        </div>

        <div className="bottom-toolbar">
          <PageSelector
            pageSizes={[
              { label: '10 records', value: 10 },
              { label: '20 records', value: 20 },
              { label: '50 records', value: 50 },
              { label: '100 records', value: 100 },
            ]}
            value={pagination.pageSize}
            onChange={onPerPageChange}
          />
          <Pagination
            className="w-pagination"
            {...pagination}
            onChange={onPageChange}
          />
        </div>
      </div>
    )
  }
}

EligibleAddressTable.defaultProps = {
  onPerPageChange: noop,
  onPageChange: noop,
  onSearch: noop,
  onRowSelect: noop,
  selectedRowKeys: [],
};

EligibleAddressTable.propTypes = {
  dataset: PropTypes.any.isRequired,
  onPerPageChange: PropTypes.func,
  onPageChange: PropTypes.func,
  onSearch: PropTypes.func,
  onRowSelect: PropTypes.func,
  selectedRowKeys: PropTypes.array,
};

export default withRouter(EligibleAddressTable);
