import React from 'react';
import { any, bool, func, object } from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm, getFormValues } from 'redux-form';

import { setTitle } from '../../../common/actions';

import { withPreventingCheckHOC } from '../../../common/hocs';
import CustomerBusinessForm from '../components/CustomerBusinessForm';
import AdminLayout from '../../hoc/AdminLayout';

import {
  Spinner,
  CommonConfirmDlg,
  HandelButton,
} from '../../../common/components';

import {
  modalContentsDeletion,
  modalContentsResetPassword,
} from '../constants/modalDlgParams';
import PageContext from '../business-customer/context';

import {
  getCustomerDetailsById,
  updateCustomerDetailsById,
  unmountClearCustomerDetails,
  resetCustomerPasswordByAdmin,
  updateCustomersStatus,
  getUserTransactionHistory,
} from '../actions';
import AddDiscountModal from '../business-customer/AddDiscountModal';

const CUSTOMER_BUSINESS_FORM = 'admin/customerBusiness';

const CustomerBusinessEditForm = compose(
  reduxForm({
    form: CUSTOMER_BUSINESS_FORM,
    forceUnregisterOnUnmount: true,
    enableReinitialize: true,
    touchOnChange: true,
  }),
  withPreventingCheckHOC,
)(CustomerBusinessForm);

class CustomerBusinessPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      userType: 'bus-customers',
      firstFetchFlag: true,
      customerId: this.props.match.params.id,
      modalIsOpen: false,
      modalContents: {
        start: {},
        success: {},
        fail: {},
      },
      showDiscountModal: false,
    };

    this.onHandleCustomerSubmit = this.onHandleCustomerSubmit.bind(this);
    this.onHandleResetPassword = this.onHandleResetPassword.bind(this);
    this.onHandleToggleEdit = this.onHandleToggleEdit.bind(this);

    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.onHandleDeletion = this.onHandleDeletion.bind(this);
    this.handleProcessDeletion = this.handleProcessDeletion.bind(this);
    this.handleSuccessDeletion = this.handleSuccessDeletion.bind(this);

    this.handleProcessResetPassword = this.handleProcessResetPassword.bind(this);
  }

  componentDidMount() {
    this.fetchDetail();
  }

  componentWillUnmount() {
    this.props.unmountClearCustomerDetails();
  }

  onHandleDeletion() {
    const tmpModalContents = {
      ...modalContentsDeletion,
      func: {
        handleProcess: this.handleProcessDeletion,
        handleSuccess: this.handleSuccessDeletion,
      },
    };

    this.setState({
      modalIsOpen: true,
      modalContents: tmpModalContents,
    });
  }

  onHandleResetPassword() {
    const { customer } = this.props;

    const tmpModalContents = {
      ...modalContentsResetPassword,
      func: {
        handleProcess: this.handleProcessResetPassword,
      },
    };
    tmpModalContents.success.subTitle = `Password reset instructions is sent to <strong>${customer.email}</strong>`;

    this.setState({
      modalIsOpen: true,
      modalContents: tmpModalContents,
    });
  }

  async onHandleCustomerSubmit() {
    const { formValues } = this.props;
    const { userType, customerId } = this.state;
    const {
      status, phone, avatar, email, note,
    } = formValues;
    const {
      abn, address, name, paymentTypes,
    } = formValues.organisation;

    let productPricingRemoved = [];
    if (formValues.productPricingRemoved) {
      productPricingRemoved = [...formValues.productPricingRemoved];
    }

    let productPricing = [];
    if (formValues.productPricing) {
      productPricing = [...formValues.productPricing];
    }

    // const invoice = paymentTypes.find(value => value.type === 'invoice');
    // if (invoice) {
    //   invoice.maximumInvoice = values.maximumInvoice;
    // }

    await this.props.updateCustomerDetailsById({
      url: userType,
      uid: customerId,
      data: {
        status,
        phone,
        avatar,
        email,
        abn,
        address,
        businessName: name,
        note,
        paymentTypes,
        productPricing: [...productPricing, ...productPricingRemoved],
      },
    });

    this.setState({ isEdit: false }, () => {
      // need refresh
      this.fetchDetail();
    });
  }

  onHandleToggleEdit() {
    const { isEdit } = this.state;
    this.setState({
      isEdit: !isEdit,
    });
  }

  setDiscountModalVisibility = (show) => {
    this.setState({ showDiscountModal: show });
  }

  fetchDetail() {
    const { setTitle, getCustomerDetailsById } = this.props;
    const { userType, customerId } = this.state;

    setTitle('');
    getCustomerDetailsById({
      userType,
      url: 'bus-customers',
      uid: customerId,
    });
  }

  handleCloseModal() {
    this.setState({
      modalIsOpen: false,
    });
  }

  handleProcessResetPassword() {
    const { customer, resetCustomerPasswordByAdmin } = this.props;
    const { userType, customerId } = this.state;

    return resetCustomerPasswordByAdmin({
      url: userType,
      uid: customerId,
      email: customer.email,
    });
  }

  handleProcessDeletion() {
    const { updateCustomersStatus } = this.props;
    const { userType, customerId } = this.state;

    return updateCustomersStatus({
      ids: [customerId],
      url: 'users',
      status: 'Removed',
      userType,
    });
  }

  handleSuccessDeletion() {
    this.props.history.push('/admin/manage-accounts');
  }

  handleShowDiscountModal = () => {
    this.setDiscountModalVisibility(true);
  }

  render() {
    const {
      customerDetailsFetchFlag, customer,
      getUserTransactionHistory,
      userTransactionHistory,
      /* , form: { dirty, submitSucceeded } */ } = this.props;
    const {
      firstFetchFlag, isEdit,
      modalIsOpen, modalContents,
      showDiscountModal,
    } = this.state;

    if ((firstFetchFlag && !customerDetailsFetchFlag) || (JSON.stringify(customer) === '{}')) {
      return (
        <Spinner />
      );
    }

    const context = {
      value: this.state,
      setDiscountModalVisibility: this.setDiscountModalVisibility,
    };

    /* eslint prefer-destructuring: 0 */
    customer.role = customer.roles[0];
    return (
      <div className="x_panel_">
        <PageContext.Provider value={context}>
          <CommonConfirmDlg
            modalIsOpen={modalIsOpen}
            modalContents={modalContents}
            handleCloseModal={this.handleCloseModal}
          />

          <CustomerBusinessEditForm
            data={customer}
            initialValues={customer}
            isEdit={isEdit}
            onResetPassword={this.onHandleResetPassword}
            onSubmit={this.onHandleCustomerSubmit}
            onToggleEdit={this.onHandleToggleEdit}
            onDelete={this.onHandleDeletion}
            getUserTransactionHistory={getUserTransactionHistory}
            userTransactionHistory={userTransactionHistory}
          />

          <AddDiscountModal
            customer={customer._id}
            open={showDiscountModal}
            openModal={this.setDiscountModalVisibility}
          />
        </PageContext.Provider>
      </div>
    );
  }
}

CustomerBusinessPage.propTypes = {
  customerDetailsFetchFlag: bool,
  customer: any.isRequired,
  // form: any.isRequired,
  setTitle: func.isRequired,
  getCustomerDetailsById: func.isRequired,
  updateCustomerDetailsById: func.isRequired,
  match: any.isRequired,
  unmountClearCustomerDetails: func.isRequired,
  resetCustomerPasswordByAdmin: func.isRequired,
  updateCustomersStatus: func.isRequired,
  history: any.isRequired,
  getUserTransactionHistory: func.isRequired,
  userTransactionHistory: object.isRequired,
};

CustomerBusinessPage.defaultProps = {
  customerDetailsFetchFlag: true,
};

function mapStateToProps(state) {
  return ({
    formValues: getFormValues('admin/customerBusiness')(state),
    customerDetailsFetchFlag: state.common.requestFinished.customerDetails,
    customer: state.admin.accounts.customers.details || {},
    form: state.form[CUSTOMER_BUSINESS_FORM] || {},
    userTransactionHistory: state.admin.accounts.customers.userTransactionHistory,
  });
}

function mapDispatchToProps(dispatch) {
  return ({
    setTitle: title => dispatch(setTitle(title)),
    getCustomerDetailsById: (id) => {
      const action = getCustomerDetailsById(id);
      dispatch(action);
      return action.promise;
    },
    updateCustomerDetailsById: (data) => {
      const action = updateCustomerDetailsById(data);
      dispatch(action);
      return action.promise;
    },
    unmountClearCustomerDetails: () => {
      const action = unmountClearCustomerDetails();
      dispatch(action);
      return action.promise;
    },
    resetCustomerPasswordByAdmin: (data) => {
      const action = resetCustomerPasswordByAdmin(data);
      dispatch(action);
      return action.promise;
    },
    updateCustomersStatus: (data) => {
      const action = updateCustomersStatus(data);
      dispatch(action);
      return action.promise;
    },
    getUserTransactionHistory: (data) => {
      const action = getUserTransactionHistory(data);
      dispatch(action);
      return action.promise;
    },
  });
}

export default compose(
  AdminLayout,
  connect(mapStateToProps, mapDispatchToProps),
)(CustomerBusinessPage);
