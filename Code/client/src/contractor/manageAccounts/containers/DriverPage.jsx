import React from 'react';
import { any, array, bool, func } from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm, formValueSelector } from 'redux-form';

import { setTitle } from '../../../common/actions';


import { withPreventingCheckHOC } from '../../../common/hocs';
import DriverForm from '../components/DriverForm';
import AdminLayout from '../../hoc/AdminLayout';

import {
  Spinner,
  CommonConfirmDlg,
} from '../../../common/components';

import {
  modalContentsDeletion,
  modalContentsResetPassword,
} from '../constants/modalDlgParams';

import {
  getDriverDetailsById,
  updateDriverDetailsById,
  unmountClearDriverDetails,
  resetDriverPasswordByAdmin,
  updateDriversStatus,
  getDriverRatingsById,
} from '../actions';

const DRIVER_FORM = 'contractor/driver';

const DriverEditForm = compose(
  reduxForm({
    form: DRIVER_FORM,
    forceUnregisterOnUnmount: true,
    enableReinitialize: true,
    touchOnChange: true,
    touchOnBlur: true,
  }),
  withPreventingCheckHOC,
)(DriverForm);

const selector = formValueSelector(DRIVER_FORM);

class DriverPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      userType: 'drivers',
      firstFetchFlag: true,
      customerId: this.props.match.params.id,

      modalIsOpen: false,
      modalContents: {
        start: {},
        success: {},
        fail: {},
      },
    };

    this.onHandleDriverSubmit = this.onHandleDriverSubmit.bind(this);
    this.onHandleResetPassword = this.onHandleResetPassword.bind(this);
    this.onHandleToggleEdit = this.onHandleToggleEdit.bind(this);

    this.handleCloseModal = this.handleCloseModal.bind(this);

    this.onHandleDeletion = this.onHandleDeletion.bind(this);
    this.handleProcessDeletion = this.handleProcessDeletion.bind(this);
    this.handleSuccessDeletion = this.handleSuccessDeletion.bind(this);

    this.handleProcessResetPassword = this.handleProcessResetPassword.bind(this);
  }

  componentDidMount() {
    const { setTitle, getDriverDetailsById, getDriverRatingsById } = this.props;
    const { userType, customerId } = this.state;

    setTitle('');
    getDriverDetailsById({
      userType,
      url: 'driver',
      uid: customerId,
    });
    getDriverRatingsById({
      uid: customerId,
    });
  }

  // shouldComponentUpdate(nextProps) {
  //   if (!nextProps.customerDetailsFetchFlag && !this.state.firstFetchFlag) {
  //     return false;
  //   }

  //   return true;
  // }

  componentWillUnmount() {
    this.props.unmountClearDriverDetails();
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


  async onHandleDriverSubmit(values) {
    if (!values) {
      return;
    }

    const {
      roles, avatar, ...rest
    } = values;
    // if (isAdmin && !roles.includes('admin')) {
    //   roles.push('admin');
    // }

    const { userType, customerId } = this.state;

    await this.props.updateDriverDetailsById({
      url: userType,
      uid: customerId,
      data: { ...rest, roles, avatar: avatar && avatar.constructor === Array ? avatar[0] : avatar },
    });

    this.setState({ isEdit: false });
  }

  // async onHandleResetPassword() {
  //   const { customer } = this.props;
  //   const { userType, customerId } = this.state;
  //   const tmpModalContent = this.state.modalContent;
  //   tmpModalContent.subTitle =
  //    `Password reset instructions is sent to <strong>${customer.email}</strong>`;

  //   try {
  //     await this.props.resetDriverPasswordByAdmin({
  //       url: userType,
  //       uid: customerId,
  //       email: customer.email,
  //     });
  //     this.setState({ isReset: true, modalContent: tmpModalContent });
  //   } catch (error) {
  //     throw new SubmissionError({
  //       ...error.errors,
  //       _error: error.message,
  //     });
  //   }
  // }

  onHandleToggleEdit() {
    const { isEdit } = this.state;
    this.setState({
      isEdit: !isEdit,
    });
  }

  handleCloseModal() {
    this.setState({
      modalIsOpen: false,
    });
  }

  handleProcessResetPassword() {
    const { customer, resetDriverPasswordByAdmin } = this.props;
    const { userType, customerId } = this.state;

    return resetDriverPasswordByAdmin({
      url: userType,
      uid: customerId,
      email: customer.email,
    });
  }

  handleProcessDeletion() {
    const { updateDriversStatus } = this.props;
    const { userType, customerId } = this.state;

    return updateDriversStatus({
      ids: [customerId],
      url: 'users',
      status: 'Removed',
      userType,
    });
  }

  handleSuccessDeletion() {
    this.props.history.push('/contractor/drivers');
  }


  render() {
    const {
      customerDetailsFetchFlag, customer,
      isAdmin, ratings,
      /* form: { dirty, submitSucceeded } */ } = this.props;
    const {
      firstFetchFlag, isEdit,
      modalIsOpen, modalContents,
    } = this.state;

    if ((firstFetchFlag && !customerDetailsFetchFlag)) {
      return (
        <Spinner />
      );
    }

    if (JSON.stringify(customer) === '{}') {
      return (
        <Spinner />
      );
    }

    // if (!dirty && submitSucceeded) {
    //   console.warn('update succeeded!');
    // }

    return (
      <div className="x_panel_">
        <CommonConfirmDlg
          modalIsOpen={modalIsOpen}
          modalContents={modalContents}
          handleCloseModal={this.handleCloseModal}
        />

        <DriverEditForm
          data={customer}
          ratings={ratings}
          initialValues={customer}
          isEdit={isEdit}
          isAdmin={isAdmin}
          onResetPassword={this.onHandleResetPassword}
          onSubmit={this.onHandleDriverSubmit}
          onToggleEdit={this.onHandleToggleEdit}
          onDelete={this.onHandleDeletion}
        />
      </div>
    );
  }
}

DriverPage.propTypes = {
  customerDetailsFetchFlag: bool,
  customer: any.isRequired,
  // form: any.isRequired,
  setTitle: func.isRequired,
  getDriverDetailsById: func.isRequired,
  updateDriverDetailsById: func.isRequired,
  match: any.isRequired,
  unmountClearDriverDetails: func.isRequired,
  resetDriverPasswordByAdmin: func.isRequired,
  updateDriversStatus: func.isRequired,
  history: any.isRequired,
  isAdmin: bool,
  ratings: array.isRequired,
  getDriverRatingsById: func.isRequired,
};

DriverPage.defaultProps = {
  customerDetailsFetchFlag: true,
  isAdmin: false,
};

function mapStateToProps(state) {
  return ({
    customerDetailsFetchFlag: state.common.requestFinished.customerDetails,
    customer: state.contractor.drivers.customers.details || {},
    ratings: state.contractor.drivers.customers.ratings || [],
    form: state.form[DRIVER_FORM] || {},
    isAdmin: selector(state, 'isAdmin'),
  });
}

function mapDispatchToProps(dispatch) {
  return ({
    setTitle: title => dispatch(setTitle(title)),
    getDriverDetailsById: (id) => {
      const action = getDriverDetailsById(id);
      dispatch(action);
      return action.promise;
    },
    updateDriverDetailsById: (data) => {
      const action = updateDriverDetailsById(data);
      dispatch(action);
      return action.promise;
    },
    unmountClearDriverDetails: () => {
      const action = unmountClearDriverDetails();
      dispatch(action);
      return action.promise;
    },
    resetDriverPasswordByAdmin: (data) => {
      const action = resetDriverPasswordByAdmin(data);
      dispatch(action);
      return action.promise;
    },
    updateDriversStatus: (data) => {
      const action = updateDriversStatus(data);
      dispatch(action);
      return action.promise;
    },
    getDriverRatingsById: (data) => {
      const action = getDriverRatingsById(data);
      dispatch(action);
      return action.promise;
    },
  });
}

export default compose(
  AdminLayout,
  connect(mapStateToProps, mapDispatchToProps),
)(DriverPage);
