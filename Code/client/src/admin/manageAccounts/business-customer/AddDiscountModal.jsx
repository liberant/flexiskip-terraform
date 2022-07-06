import React, { Component } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { SubmissionError } from 'redux-form';
import { Modal, Icon } from 'antd';
import { withRequest } from '../../../common/hocs';
import DiscountForm from './DiscountForm';

const ACTIVE_STATUS = 'Active';

class AddDiscountModal extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    openModal: PropTypes.func.isRequired,
    customer: PropTypes.string.isRequired,
    runAjax: PropTypes.func.isRequired,
    coupons: PropTypes.array,
    fetchData: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    coupons: null,
  }

  componentDidMount() {
    this.fetchCoupons();
  }

  findActiveCouponOnList() {
    const { coupons } = this.props;
    if (coupons && coupons.length) {
      return !!coupons.find(coupon => coupon.status === ACTIVE_STATUS);
    }
    return false;
  }

  fetchCoupons() {
    const { fetchData, customer } = this.props;
    fetchData({
      url: `admin/bus-customers/${customer}/coupons`,
    });
  }

  handleSubmit = async (values) => {
    this.formValues = values;
    if (
      values &&
      values.status === ACTIVE_STATUS &&
      this.findActiveCouponOnList()
    ) {
      this.openWarningModal();
    } else {
      this.createNewCoupon();
    }
  }

  handleCancel = () => {
    const { openModal } = this.props;
    openModal(false);
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
        this.createNewCoupon();
      },
      onCancel: () => {
        modal.destroy();
        this.formValues = null;
      },
    });
  }

  async createNewCoupon() {
    if (this.formValues) {
      const { customer, runAjax, openModal } = this.props;
      try {
        await runAjax({
          url: `/admin/bus-customers/${customer}/coupons`,
          data: this.formValues,
        });
        openModal(false);
        window.location.reload();
      } catch (error) {
        throw new SubmissionError({
          ...error.errors,
          _error: error.message,
        });
      }
      this.formValues = null;
    }
  }

  render() {
    const { open, loading } = this.props;
    const initVals = {};
    const style = {
      maxWidth: 880,
    };
    return (
      <Modal
        title="Add Discount Code"
        visible={open}
        onCancel={this.handleCancel}
        footer={null}
        width="80%"
        style={style}
        className="w-modal"
      >
        {open && (
          <DiscountForm
            onSubmit={this.handleSubmit}
            initialValues={initVals}
            loading={loading}
          />
        )}
      </Modal >
    );
  }
}

export default compose(
  withRequest({
    autoExecute: false,
    requestOptions: {
      method: 'post',
    },
    mapProps: ({ execute, loading }) => ({
      runAjax: execute,
      loading,
    }),
  }),
  // get coupons
  withRequest({
    autoExecute: false,
    requestOptions: {
      method: 'get',
    },
    mapProps: ({ execute, response }) => ({
      fetchData: execute,
      coupons: response ? response.data : null,
    }),
  }),
)(AddDiscountModal);
