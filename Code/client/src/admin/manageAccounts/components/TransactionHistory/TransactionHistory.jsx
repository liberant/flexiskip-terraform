import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Pagination } from 'antd';
import { withRouter } from 'react-router-dom';

import {
  dateFormatter,
  collectionRequestFormatter,
} from '../../../../common/components/BSTableFormatters';

import SearchBox from '../../../../common/components/form/SearchBox';
import PageSelector from '../../../../common/components/form/PageSelector';
import styles from './TransactionHistory.m.css';

/* eslint react/no-did-mount-set-state: 0 */
/* eslint react/no-did-update-set-state: 0 */
/* eslint react/sort-comp: 0 */
/* eslint no-param-reassign: 0 */

const pageSizes = [
  { label: '10 records', value: 10 },
  { label: '20 records', value: 20 },
  { label: '50 records', value: 50 },
  { label: '100 records', value: 100 },
];

const controlButtons = [
  {
    label: 'All Requests',
    key: 'all',
  },
  {
    label: 'Bin Requests',
    key: 'bin',
  },
  {
    label: 'Collection Requests',
    key: 'collection',
  },
];

class TransactionHistory extends Component {
  columns = [
    {
      title: 'Order Ref',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      render: (text, { customer }) => customer && `${customer.firstname} ${customer.lastname}`,
    },
    {
      title: 'Date Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: createdAt => dateFormatter(createdAt),
      sorter: true,
      onHeaderCell: this.getHeaderCellProps.bind(this),
      sortOrder: true,
    },
    {
      title: 'Payment Type',
      dataIndex: 'paymentType',
      key: 'paymentType',
    },
    {
      title: 'Total Amount',
      dataIndex: 'total',
      key: 'total',
      render: (text, { total, discount }) => `$ ${total} ($${discount})`,
      sorter: true,
      onHeaderCell: this.getHeaderCellProps.bind(this),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => collectionRequestFormatter(status),
      sorter: true,
      onHeaderCell: this.getHeaderCellProps.bind(this),
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      currentTab: 'all',
      perPage: 10,
      s: '',
      sortedInfo: {
        column: 'createdAt',
        direction: 'descend',
      },
    };

    this.getRowProps = this.getRowProps.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handlePageSizeChange = this.handlePageSizeChange.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
    this.getHeaderCellProps = this.getHeaderCellProps.bind(this);
  }

  componentDidMount() {
    // load data for first time init
    this.fetchData(1);
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }

  get rowSelection() {
    const { selectedRowKeys } = this.state;
    return {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
  }

  getRowProps(record) {
    const { history } = this.props;
    const { currentTab } = this.state;
    return {
      onClick: () => {
        if (record.requestType === 'collectionRequest' || currentTab === 'collection') {
          history.push(`/admin/collection-requests-view/${record._id}`);
        } else {
          history.push(`/admin/product-requests-edit/${record._id}`);
        }
      },
    };
  }

  getHeaderCellProps({ key }) {
    return {
      onMouseDown: () => {
        const { userTransactionHistory } = this.props;
        const { pagination } = userTransactionHistory;
        let { sortedInfo } = this.state;
        if (sortedInfo) {
          if (sortedInfo.column === key) {
            sortedInfo.direction = sortedInfo.direction === 'ascend' ? 'descend' : 'ascend';
          } else {
            sortedInfo = {
              column: key,
              direction: 'descend',
            };
          }
        } else {
          sortedInfo = {
            column: key,
            direction: 'descend',
          };
        }
        this.setState({ sortedInfo }, () => {
          this.fetchData(pagination.current);
          this.columns.forEach((column) => {
            delete column.sortOrder;
            if (column.key === key) {
              column.sortOrder = sortedInfo.direction;
            }
          });
        });
      },
    };
  }

  fetchData(page) {
    const {
      getUserTransactionHistory,
      match: {
        params: {
          id,
        },
      },
    } = this.props;
    const {
      perPage, s, currentTab,
      sortedInfo,
    } = this.state;

    getUserTransactionHistory({
      userId: id,
      search: s,
      limit: perPage,
      page,
      name: currentTab,
      sortedInfo,
    });
  }

  handleSearch(text) {
    this.setState(() => ({ s: text }), () => {
      this.fetchData(1);
    });
  }

  handlePageChange(page) {
    this.fetchData(page);
  }

  handlePageSizeChange(val) {
    this.setState(() => ({ perPage: val }), () => {
      this.fetchData(1);
    });
  }

  handleTabClick(e, tab) {
    e.preventDefault();
    this.setState({ currentTab: tab }, () => {
      this.fetchData(1);
    });
  }

  render() {
    const {
      userTransactionHistory,
    } = this.props;

    const { pagination, loading, data } = userTransactionHistory;
    return (
      <React.Fragment>
        <div className="w-panel">
          <div className="w-title">
            <h2>All Transactions</h2>
            <SearchBox onSearch={this.handleSearch} />
          </div>

          <div className={styles.controlFilterButtons}>
            {
              controlButtons.map(button => (
                <div
                  className={`${styles.controlButton} ${button.key === this.state.currentTab && styles.controlActiveButton}`}
                  key={button.key}
                  onClick={e => this.handleTabClick(e, button.key)}
                >
                  {button.label}
                </div>
              ))
            }
          </div>

          <Table
            rowSelection={this.rowSelection}
            className="row-clickable"
            dataSource={data}
            columns={this.columns}
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

TransactionHistory.propTypes = {
  history: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  getUserTransactionHistory: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  userTransactionHistory: PropTypes.object.isRequired,
};

TransactionHistory.defaultProps = {};

export default withRouter(TransactionHistory);
