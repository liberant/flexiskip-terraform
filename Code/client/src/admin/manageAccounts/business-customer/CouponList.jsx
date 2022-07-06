
import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Table, Dropdown, Spin, Modal, Icon } from 'antd';
import SearchBox from '../../../common/components/form/SearchBox';
import SpinnerWrapper from '../../../common/components/SpinnerWrapper';
import { withRequest } from '../../../common/hocs';
import { formatDate, formatCouponValue, buildQueryString } from '../../../common/helpers';

import { dropdownStatus } from '../../../common/components/BSTableFormatters';

import {
  statusStyles,
  statusDiscountType2Styles,
} from '../../../common/constants/styles';


const statusList = statusDiscountType2Styles.filter(status => status.label !== 'Removed');

/* eslint react/sort-comp: 0 */
/* eslint no-param-reassign: 0 */

class CouponList extends React.Component {
  static propTypes = {
    customer: PropTypes.string.isRequired,
    coupons: PropTypes.array,
    fetchData: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    changeDiscountStatus: PropTypes.func.isRequired,
    couponUpdate: PropTypes.array,
    changeStatusLoading: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    coupons: null,
    couponUpdate: null,
  }

  state = {
    selectedRowKeys: [],
    search: '',
  }

  columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      onCell: this.getRowProps.bind(this),
    },
    {
      title: 'Discount',
      render: data => formatCouponValue(data),
      onCell: this.getRowProps.bind(this),
    },
    {
      title: 'Start On',
      dataIndex: 'dateStart',
      render: data => formatDate(data),
      onCell: this.getRowProps.bind(this),
    },
    {
      title: 'End On',
      dataIndex: 'dateEnd',
      render: data => formatDate(data),
      onCell: this.getRowProps.bind(this),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text, record) => {
        if (!text) {
          return (<div />);
        }
        let styles = {
          ...statusStyles.common,
          color: '#4a4a4a',
          borderColor: '#4a4a4a',
        };
        const index = statusList.findIndex(s => s.label.toLowerCase() === text.trim().toLowerCase());
        /* eslint prefer-destructuring:0 */
        if ((index >= 0) && (index < statusList.length)) {
          styles = statusList[index].styles;
        }
        const dropdownOverlay = dropdownStatus(statusList, ({ key }) => {
          this.handleOnSelected(key, record._id);
        });

        const { changeStatusLoading } = this.props;
        return (
          <Dropdown overlay={dropdownOverlay} trigger={['click']}>
            <div style={{ display: 'flex', alignItems: 'center', width: '118px' }}>
              <div style={styles}>
                {text}
              </div>
              <Spin spinning={record._id === this.updateId && changeStatusLoading}>
                <span className="handel-pencil" style={{ marginLeft: '5px', color: '#239dff' }} />
              </Spin>
            </div>
          </Dropdown>
        );
      },
    },
  ];

  componentDidMount() {
    this.fetchCoupons();
  }

  getRowProps(record) {
    return {
      onClick: () => {
        this.discountRow = record._id;
        this.setState({ showEditModal: !this.state.showEditModal });
      },
    };
  }

  setEditDiscountModalVisibility() {
    this.setState({ showEditModal: !this.state.showEditModal });
  }

  get dataSource() {
    const { coupons = [], couponUpdate } = this.props;
    if (couponUpdate) {
      coupons.forEach((coupon) => {
        if (couponUpdate._id === coupon._id) {
          coupon.status = couponUpdate.status;
        }
      });
    }
    return coupons;
  }

  handleSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }

  async handleOnSelected(status, id) {
    this.updateId = id;
    this.updateStatus = status;
    const dataSource = [...this.dataSource];
    const selectedItem = dataSource.find(item => item._id === id);
    if (selectedItem && selectedItem.status === status) {
      return;
    }

    if (['Active', 'active'].includes(status)) {
      const isExistOtherActive = (dataSource.filter(coupon => ['Active', 'active'].includes(coupon.status) && coupon._id !== id)).length;
      if (isExistOtherActive) {
        this.openWarningModal();
      } else {
        await this.updateDiscountStatus(status, id);
      }
    } else {
      await this.updateDiscountStatus(status, id);
    }
  }

  async updateDiscountStatus(status, id) {
    const { changeDiscountStatus, customer } = this.props;
    await changeDiscountStatus({
      url: `/admin/bus-customers/${customer}/coupons/status`,
      data: {
        id,
        status,
      },
    });
    this.updateId = null;
    this.updateStatus = null;
  }

  fetchCoupons() {
    const { fetchData, customer } = this.props;
    const { search } = this.state;
    fetchData({
      url: `admin/bus-customers/${customer}/coupons?${buildQueryString({ s: search })}`,
    });
  }

  handleSearch = (text) => {
    this.setState({ search: text }, this.fetchCoupons);
  }

  openWarningModal() {
    const modal = Modal.confirm({
      centered: true,
      iconType: 'none',
      content: (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          marginLeft: '-38px',
        }}
        >
          <div style={{ fontSize: '48px', color: '#faad14' }}>
            <Icon type="warning" />
          </div>
          <div style={{
            color: '#666',
            fontSize: '18px',
            fontWeight: 600,
            marginBottom: '20px',
            textAlign: 'center',
          }}
          >
            This may overwrite any active discounts. Do you wish to proceed?
          </div>
        </div>
      ),
      okButtonProps: {
        style: {
          position: 'absolute',
          bottom: 10,
          left: '60%',
          transform: 'translate(-50%)',
          marginBottom: 15,
        },
      },
      cancelButtonProps: {
        style: {
          position: 'absolute',
          bottom: 10,
          left: '45%',
          transform: 'translate(-50%)',
          marginBottom: 15,
        },
      },
      maskClosable: true,
      onOk: async () => {
        modal.destroy();
        if (this.updateStatus && this.updateId) {
          await this.updateDiscountStatus(this.updateStatus, this.updateId);
          // refresh list
          this.fetchCoupons();
        }
      },
      onCancel: () => {
        modal.destroy();
        this.formValues = null;
      },
    });
  }

  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleSelectChange,
    };
    const { loading } = this.props;

    return (
      <React.Fragment>
        <div className="w-panel">
          <div className="w-title">
            <h2>Discounts</h2>
            <SearchBox onSearch={this.handleSearch} />
          </div>

          <SpinnerWrapper loading={loading}>
            <Table
              rowSelection={rowSelection}
              className="row-clickable"
              dataSource={this.dataSource}
              columns={this.columns}
              loading={loading}
              rowKey="_id"
              pagination={false}
            />
          </SpinnerWrapper>
        </div>
      </React.Fragment>
    );
  }
}

export default compose(
  withRequest({
    autoExecute: false,
    requestOptions: {
      method: 'get',
    },
    mapProps: ({ execute, loading, response }) => ({
      fetchData: execute,
      coupons: response ? response.data : null,
      loading,
    }),
  }),
  withRequest({
    autoExecute: false,
    requestOptions: {
      method: 'put',
    },
    mapProps: ({ execute, response, loading }) => ({
      changeDiscountStatus: execute,
      couponUpdate: response ? response.data : null,
      changeStatusLoading: loading,
    }),
  }),
)(CouponList);
