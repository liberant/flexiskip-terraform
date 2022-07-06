import React from 'react';
import PropTypes from 'prop-types';
import { Table, Pagination, Dropdown, Menu } from 'antd';
import { statusOrderedProductType2Styles } from '../../../common/constants/styles';
import { columnsEditProductItems } from './columnsDef';

import { SimpleCardLayout } from '../../../common/components';
import { orderedProductFormatterWithDropdown } from '../../../common/components/BSTableFormatters';

const styles = {
  rightHeader: {
    fontSize: 14,
    cursor: 'pointer',
  },
  rightHeaderIcon: {
    backgroundColor: '#239DFF',
    boxShadow: '0 4px 8px 0 rgba(35, 157, 255, 0.3)',
    padding: '5px',
    borderRadius: '36px',
    color: 'white',
  },
};

class RequestedProductDetailTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
    };
    this.onDeliveryStatusChange = this.onDeliveryStatusChange.bind(this);
    this.renderOrderProduct = this.renderOrderProduct.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }
  // Update delivery status
  onDeliveryStatusChange = async (status, id) => {
    this.props.updateBinDeliveryStatusById({
      uid: id,
      productRequest:
        this.props.data._id,
      status,
    });
  }
  onChangeAllDeliveryStatus = ({ key }) => {
    const params = {
      uid: this.props.data._id,
      data: { status: key },
    };
    this.props.updateProductRequestDeliveryStatus(params);
  }
  get pagination() {
    const { data } = this.props;
    const { page } = this.state;
    const productRequestPagination = {
      total: 1,
      pageSize: 5,
      current: page,
    };
    if (data && data.bins) {
      productRequestPagination.total = data.bins.length;
    }
    return productRequestPagination;
  }
  get dataRender() {
    const { data } = this.props;
    if (data && data.bins) {
      const start = (this.pagination.current - 1) * this.pagination.pageSize;
      const end = this.pagination.current * this.pagination.pageSize;
      return data.bins.slice(start, end);
    }
    return [];
  }
  handlePageChange(page) {
    this.setState({ page });
  }
  renderOrderProduct(text, record) {
    return orderedProductFormatterWithDropdown(text, record, this.onDeliveryStatusChange);
  }
  render() {
    const { selectedBinSet } = this.props;

    const statusMenu = (
      <Menu onClick={this.onChangeAllDeliveryStatus}>
        {statusOrderedProductType2Styles.map(status => (
          <Menu.Item key={status.label}>
            <div style={{ ...status.styles, width: '100%' }}>
              {status.label}
            </div>
          </Menu.Item>
        ))}
      </Menu>
    );
    const changeAllStatusDropdown = (
      <Dropdown overlay={statusMenu} trigger={['click']} overlayStyle={{ minWidth: '0px' }}>
        <div style={styles.rightHeader}>
          <span className="handel-pencil" style={styles.rightHeaderIcon} /> Update All Product Status
        </div>
      </Dropdown>
    );

    return (
      <React.Fragment>
        <SimpleCardLayout title="Requested Products" rightHeader={changeAllStatusDropdown}>
          <Table
            rowSelection={{
              selectedRowKeys: selectedBinSet,
              onChange: this.props.handleOnSelect,
              getCheckboxProps: (record) => {
                return {
                  disabled: record.deliveryDate
                };
              }
            }}
            className="row-clickable councils-table"
            dataSource={this.dataRender}
            columns={columnsEditProductItems.map((colItem) => {
              if (colItem.key === 'status') {
                return {
                  ...colItem,
                  render: this.renderOrderProduct,
                };
              }
              return colItem;
            })}
            rowKey="_id"
            pagination={false}
          />
        </SimpleCardLayout>
        <div className="bottom-toolbar">
          <div />
          <Pagination
            className="w-pagination"
            {...this.pagination}
            onChange={this.handlePageChange}
          />
        </div>
      </React.Fragment>
    );
  }
}

RequestedProductDetailTable.propTypes = {
  selectedBinSet: PropTypes.any.isRequired,
  data: PropTypes.any.isRequired,
  updateBinDeliveryStatusById: PropTypes.func.isRequired,
  updateProductRequestDeliveryStatus: PropTypes.func.isRequired,
  handleOnSelect: PropTypes.func.isRequired,
};

export default RequestedProductDetailTable;
