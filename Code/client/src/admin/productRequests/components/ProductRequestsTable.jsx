import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Table, Pagination } from 'antd';
import _, { noop, findIndex } from 'lodash';
import SearchBox from '../../../common/components/form/SearchBox';
import PageSelector from '../../../common/components/form/PageSelector';
import { ActionButton, HandelButton } from '../../../common/components';
import PermissionRequired from '../../../common/hocs/PermissionRequired';
import styles from './Styles';
import { columns, columnDefs } from './columnsDef';
import ProductRequestChildTable from './ProductRequestChildTable';
/* eslint no-underscore-dangle: 0 */
/* eslint react/no-did-update-set-state: 0 */

const expandDetailStyle = {
  cursor: 'pointer',
  padding: '0',
  textAlign: 'center',
  userSelect: 'none',
  width: 100,
  color: '#239dff',
  fontWeight: '600',
  marginTop: 7,
};


class ProductRequestsTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      expandedRowKeys: [],
      selectedSet: [],
    };

    this.selectedBinSet = [];

    this.handleTableChange = this.handleTableChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handlePerPageChange = this.handlePerPageChange.bind(this);

    this.onToggleFlexiskipFilter = this.onToggleFlexiskipFilter.bind(this);
    this.onTogglePartnerDeliveredFilter = this.onTogglePartnerDeliveredFilter.bind(this);


    this.onHandleExpandAll = this.onHandleExpandAll.bind(this);
    this.onHandleCollapseAll = this.onHandleCollapseAll.bind(this);

    this.onHandlePrintQRCode = this.onHandlePrintQRCode.bind(this);

    this.handleSearch = this.handleSearch.bind(this);
    this.onHandleShowFollowMode = this.onHandleShowFollowMode.bind(this);
    this.handleOnSelect = this.handleOnSelect.bind(this);

    this.handleDetailClick = this.handleDetailClick.bind(this);
    this.updateChildBinSet = this.updateChildBinSet.bind(this);

    this.handleImport = this.handleImport.bind(this);
    this.setUploadFileInput = this.setUploadFileInput.bind(this);
    this.handleFileUploadChange = this.handleFileUploadChange.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.dataset !== this.props.dataset) {
      this.setState({
        selectedSet: [],
      });
    }

    return true;
  }

  componentDidUpdate(prevProps) {
    const { dataset } = this.props;

    if ((dataset.data !== prevProps.dataset.data)) {
      this.setState({ loading: false });
    }
  }

  onHandleExpandAll() {
    const { dataset: { data } } = this.props;
    this.setState({
      expandedRowKeys: data.map(d => d._id),
    });
  }

  onHandleCollapseAll() {
    this.setState({
      expandedRowKeys: [],
    });
  }

  async onToggleFlexiskipFilter() {
    await this.setState({ loading: true });

    const {
      changeViewMode,
      dataset: {
        viewMode,
        search,
        filters,
        pagination: {
          perPage,
        },
        currentTab,
      },
      updateFilterState
    } = this.props;

    const newValue = !filters.flexiskipFilter;

    let updateFilters = {
      flexiskipFilter: newValue,
      partnerDeliveredFilter: newValue ? false : filters.partnerDeliveredFilter
    }
    updateFilterState(updateFilters)

    this.props.getData(
      perPage, 1,
      columns[currentTab].name,
      columns[currentTab].url,
      search,
      this.status,
      updateFilters,
    );
  }

  async onTogglePartnerDeliveredFilter() {
    await this.setState({ loading: true });

    const { flexiskipFilter, partnerDeliveredFilter } = this.state;
    const {
      changeViewMode,
      dataset: {
        viewMode,
        search,
        filters,
        pagination: {
          perPage,
        },
        currentTab,
      },
      updateFilterState
    } = this.props;

    const newValue = !filters.partnerDeliveredFilter;

    const updateFilters = {
      flexiskipFilter: newValue ? false : filters.flexiskipFilter,
      partnerDeliveredFilter: newValue
    }

    updateFilterState(updateFilters)

    this.props.getData(
      perPage, 1,
      columns[currentTab].name,
      columns[currentTab].url,
      search,
      this.status,
      updateFilters,
    );
  }

  onHandleShowFollowMode() {
    const {
      changeViewMode,
      dataset: {
        viewMode,
        search,
        filters,
        pagination: {
          perPage,
        },
        currentTab,
      },
    } = this.props;
    const updateViewMode = viewMode === 0 ? 1 : 0;
    changeViewMode(updateViewMode);

    const status = updateViewMode ? 'Pending,In Progress' : '';

    this.setState(() => ({ loading: true }));
    this.props.getData(
      perPage,
      1,
      columns[currentTab].name,
      columns[currentTab].url,
      search,
      status,
      filters,
    );
  }

  onHandlePrintQRCode() {
    this.props.onHandlePrintQRCode(this.state.selectedSet, this.selectedBinSet);
  }

  get status() {
    const {
      dataset: {
        viewMode,
      },
    } = this.props;
    return viewMode ? 'Pending,In Progress' : '';
  }

  setUploadFileInput(uploadInput) {
    this.uploadInput = uploadInput;
  }

  combineBinItem(record) {
    if (record.bins && record.items) {
      return record.items.map((item) => {
        const productItem = record.bins.find(bin => bin.product === item.product);
        return { ...item, ...productItem };
      });
    }
    return [];
  }

  handlePerPageChange(val) {
    const { dataset: { currentTab, search, filters }, changePerPage } = this.props;
    changePerPage(val);

    this.setState(() => ({ loading: true }));
    this.props.getData(
      val,
      1,
      columns[currentTab].name,
      columns[currentTab].url,
      search,
      this.status,
      filters,
    );
  }

  handleTableChange(type, {
    page, /* , sizePerPage, filters, sortField, sortOrder, */
  }) {
    const {
      dataset: {
        currentTab,
        search,
        filters,
        pagination: {
          perPage,
        },
      },
    } = this.props;
    this.setState(() => ({ loading: true }));
    this.props.getData(
      perPage,
      page,
      columns[currentTab].name,
      columns[currentTab].url,
      search,
      this.status,
      filters,
    );
  }

  handlePageChange(page) {
    const {
      dataset: {
        search,
        currentTab,
        filters,
        pagination: {
          perPage,
        },
      },
    } = this.props;
    this.setState(() => ({ loading: true }));
    this.props.getData(
      perPage,
      page,
      columns[currentTab].name,
      columns[currentTab].url,
      search,
      this.status,
      filters
    );
  }

  handleOnSelect(selectedRowKeys) {
    this.setState({
      selectedSet: selectedRowKeys,
    });
  }

  handleSearch(text) {
    const {
      dataset: {
        currentTab,
        filters,
        pagination: {
          perPage,
        },
      },
      updateSearchValue,
    } = this.props;
    updateSearchValue(text);
    this.setState(() => ({ loading: true }));
    this.props.getData(
      perPage, 1,
      columns[currentTab].name,
      columns[currentTab].url,
      text,
      this.status,
      filters,
    );
  }

  handelRowClick(record) {
    this.props.history.push(`/admin/product-requests-edit/${record._id}`);
  }

  handleDetailClick(record) {
    return {
      onClick: () => {
        const { expandedRowKeys } = this.state;
        const index = findIndex(expandedRowKeys, key => key === record._id);
        if (index < 0) {
          expandedRowKeys.push(record._id);
        } else if (index !== -1) {
          expandedRowKeys.splice(index, 1);
        }
        this.setState({ expandedRowKeys });
      },
    };
  }

  handleImport() {
    if (this.uploadInput && this.uploadInput.click) {
      this.uploadInput.value = '';
      this.uploadInput.click();
    }
  }

  updateChildBinSet(binSet, isRemove, checkall, parentId) {
    if (isRemove) {
      _.remove(this.selectedBinSet, bin => _.indexOf(binSet, bin) !== -1);
    } else {
      const { selectedSet } = this.state;
      // need to update the current parent checked
      const index = findIndex(selectedSet, key => key === parentId);
      if (index !== -1) {
        selectedSet.splice(index, 1);
      }
      if (checkall) {
        selectedSet.push(parentId);
      }

      this.setState({
        selectedSet,
      });

      // store the selection into variable of this instance
      this.selectedBinSet = this.selectedBinSet.concat(binSet);
    }
  }

  handleFileUploadChange(event) {
    // const fileExtensions = 'csv';
    const { importProductOrder } = this.props;
    if (event.target && event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fileData = new FormData();
      fileData.append('file', file);
      importProductOrder(fileData);
      // show dialog
    }
  }

  render() {
    const {
      dataset,
      dataset: {
        viewMode,
        filters,
        search
      },
      importProductOrderData,
      onCreateProductRequest,
      isLoadingPrintQrCode
    } = this.props;

    const {
      loading,
    } = this.state;

    const pagination = {
      current: dataset.pagination.currentPage,
      pageSize: dataset.pagination.perPage,
      total: dataset.pagination.totalCount,
    };

    const pageSizes = [
      { label: '10 records', value: 10 },
      { label: '20 records', value: 20 },
      { label: '50 records', value: 50 },
      { label: '100 records', value: 100 },
    ];

    columnDefs[5].onCell = this.handleDetailClick;
    columnDefs[5].render = (text, { _id }) => {
      const isExpanded = this.state.expandedRowKeys.includes(_id);
      return (
        <div style={expandDetailStyle}>
          {!isExpanded ? (
            <div>
              Details <i className="fa fa-caret-down" />
            </div>
          ) : (
            <div>
              Collapse <i className="fa fa-caret-up" />
            </div>
          )}
        </div>
      );
    };

    return (
      <React.Fragment>
        <h1 className="p-title">Product Requests</h1>
        <div style={{ ...styles.usersTabBoxOuter, marginTop: 30 }}>
          <div className="row">
            <div className="col-md-6">
              <div className="top-toolbar">
                <PermissionRequired permission="printQRCode">
                  <ActionButton
                    isLoadingPrintQrCode={isLoadingPrintQrCode}
                    title="Print QR Code"
                    spanName="handel-printer"
                    stylesExtra={{
                      btnStyles: {
                        backgroundColor: '#72c814',
                        boxShadow: '0 4px 8px 0 rgba(114, 200, 20, 0.3)',
                      },
                    }}
                    handleClick={this.onHandlePrintQRCode}
                  />
                </PermissionRequired>
              </div>
            </div>
            <div className="col-md-6">
              <PermissionRequired permission="createBinRequest">
                <div className="top-toolbar text-right">
                  <HandelButton
                    onClick={onCreateProductRequest}
                    iconColor="white"
                    bgColor="blue"
                    borderColor="blue"
                    shadowColor="blue"
                    label="Create Request"
                  >
                    <span className="handel-bin-request" />
                  </HandelButton>
                </div>
              </PermissionRequired>
            </div>
          </div>
        </div>

        <div className="w-panel">
          <div className="w-title" style={{ justifyContent: 'flex-start' }}>
            <h2>Product Category</h2>
            <div
              style={{
                marginLeft: 20,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: '#239dff',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fiexDirection: 'row',
                  }}
                >
                  <div
                    className={`order-table-product-type-button ${filters.flexiskipFilter ? "active" : ""}` }
                    onClick={this.onToggleFlexiskipFilter}
                  >
                    FLEXiSKiP
                  </div>
                  <div
                    className={`order-table-product-type-button ${filters.partnerDeliveredFilter ? "active" : ""}` }
                    onClick={this.onTogglePartnerDeliveredFilter}
                  >
                    Partner Delivered
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-title" style={{ justifyContent: 'flex-start' }}>
            <h2>Request</h2>
            <div
              style={{
                marginLeft: 20,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: '#239dff',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fiexDirection: 'row',
                  }}
                >
                  <div
                    className="order-table-expdand-button"
                    onClick={this.onHandleExpandAll}
                  >
                    Expand All
                  </div>
                  <div
                    className="order-table-expdand-button"
                    onClick={this.onHandleCollapseAll}
                  >
                    Collapse All
                  </div>
                  <div
                    className="order-table-expdand-button"
                    style={{
                      width: 'auto',
                      paddingLeft: 15,
                      paddingRight: 15,
                    }}
                    onClick={this.onHandleShowFollowMode}
                  >
                    {viewMode ? 'All' : 'Pending/In progress'}
                  </div>
                </div>
              </div>
            </div>
            <SearchBox
              onSearch={this.handleSearch}
              style={{ marginLeft: 'auto' }}
              defaultValue={search}
            />
          </div>

          <Table
            rowSelection={{
              selectedRowKeys: this.state.selectedSet,
              onChange: this.handleOnSelect,
            }}
            className="row-clickable councils-table components-table-demo-nested"
            dataSource={dataset.data}
            columns={columnDefs}
            loading={loading}
            rowKey="_id"
            pagination={false}
            expandIconAsCell={false}
            expandIconColumnIndex={-1}
            expandedRowKeys={this.state.expandedRowKeys}
            onExpand={this.onExpand}
            expandedRowRender={record => (
              <ProductRequestChildTable
                data={this.combineBinItem(record)}
                updateChildBinSet={this.updateChildBinSet}
                checkall={this.state.selectedSet.includes(record._id)}
                parentId={record._id}
                updateBinDeliveryStatusById={
                  this.props.updateBinDeliveryStatusById
                }
              />
            )}
          />
        </div>

        <div className="bottom-toolbar">
          <PageSelector
            pageSizes={pageSizes}
            value={pagination.pageSize}
            onChange={this.handlePerPageChange}
          />
          <Pagination
            className="w-pagination"
            {...pagination}
            onChange={this.handlePageChange}
          />
        </div>

        <input
          type="file"
          id="file"
          ref={this.setUploadFileInput}
          style={{ display: 'none' }}
          onChange={this.handleFileUploadChange}
        />
      </React.Fragment>
    );
  }
}

ProductRequestsTable.defaultProps = {
  updateSearchValue: noop,
  changePerPage: noop,
  changeViewMode: noop,
  changeUploadFileData: noop,
};

ProductRequestsTable.propTypes = {
  importProductOrderData: PropTypes.object.isRequired,
  history: PropTypes.any.isRequired,
  dataset: PropTypes.any.isRequired,

  // deleteList: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,
  onHandlePrintQRCode: PropTypes.func.isRequired,
  updateSearchValue: PropTypes.func,
  changePerPage: PropTypes.func,
  changeViewMode: PropTypes.func,
  updateBinDeliveryStatusById: PropTypes.func.isRequired,
  changeUploadFileData: PropTypes.func,
  importProductOrder: PropTypes.func.isRequired,
  onCreateProductRequest: PropTypes.func.isRequired,
};

export default withRouter(ProductRequestsTable);
