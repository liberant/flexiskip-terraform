import React from 'react';
import { any, bool, func } from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';

import { setTitle } from '../../../common/actions';

import { withPreventingCheckHOC } from '../../../common/hocs';
import CouncilOfficerForm from '../components/CouncilOfficerForm';
import AdminLayout from '../../hoc/AdminLayout';

import {
  Spinner,
  CommonConfirmDlg,
} from '../../../common/components';
import { geoAddress } from '../../../common/components/form/reduxFormComponents';

import {
  modalContentsDeletion,
  modalContentsResetPassword,
} from '../constants/modalDlgParams';

import {
  getCustomerDetailsById,
  updateCustomerDetailsById,
  unmountClearCustomerDetails,
  resetCustomerPasswordByAdmin,
  updateCustomersStatus,
  getCouncilList,
} from '../actions';


const COUNCIL_OFFICER_FORM = 'admin/councilOfficer';

const CouncilOfficerEditForm = compose(
  reduxForm({
    form: COUNCIL_OFFICER_FORM,
    forceUnregisterOnUnmount: true,
    enableReinitialize: true,
  }),
  withPreventingCheckHOC,
)(CouncilOfficerForm);

class CouncilOfficerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      userType: 'admins',
      firstFetchFlag: true,
      customerId: this.props.match.params.id,

      modalIsOpen: false,
      modalContents: {
        start: {},
        success: {},
        fail: {},
      },
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
    const { setTitle, getCustomerDetailsById, fetchCouncilList } = this.props;
    const { userType, customerId } = this.state;

    setTitle('');
    getCustomerDetailsById({
      userType,
      url: 'council-officers',
      uid: customerId,
    });
    fetchCouncilList();
  }
  componentDidUpdate(prevProps, prevState) {
    const { userType, customerId } = this.state;
    const { statusUpdate } = this.props;

    const { getCustomerDetailsById } = this.props;

    if (this.state.isEdit !== prevState.isEdit) {
      if (statusUpdate) {
        getCustomerDetailsById({
          userType,
          url: "council-officers",
          uid: customerId,
        });
      }
    }
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


  async onHandleCustomerSubmit(values) {
    if (!values) {
      return;
    }

    const { customerId } = this.state;


    await this.props.updateCustomerDetailsById({
      url: 'council-officers',
      uid: customerId,
      data: values,
    });

    this.setState({ isEdit: false });
  }

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

  render() {
    const {
      customerDetailsFetchFlag, customer, councilList
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

    // transform the roles array to a single field for updating
    customer.role = customer.roles[0];

    return (
      <div className="x_panel_">
        <CommonConfirmDlg
          modalIsOpen={modalIsOpen}
          modalContents={modalContents}
          handleCloseModal={this.handleCloseModal}
        />

        <CouncilOfficerEditForm
          data={customer}
          councilList={councilList}
          initialValues={customer}
          isEdit={isEdit}
          onResetPassword={this.onHandleResetPassword}
          onSubmit={this.onHandleCustomerSubmit}
          onToggleEdit={this.onHandleToggleEdit}
          onDelete={this.onHandleDeletion}
        />
      </div>
    );
  }
}

CouncilOfficerPage.propTypes = {
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
};

CouncilOfficerPage.defaultProps = {
  customerDetailsFetchFlag: true,
};

function mapStateToProps(state) {
  return ({
    customerDetailsFetchFlag: state.common.requestFinished.customerDetails,
    customer: state.admin.accounts.customers.details || {},
    statusUpdate: state.common.alert.statusUpdate,
    councilList: state.admin.accounts.customers.councilList || [],
    form: state.form[COUNCIL_OFFICER_FORM] || {},
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
    fetchCouncilList: () => {
      const action = getCouncilList();
      dispatch(action);
      return action.promise;
    },
  });
}

export default compose(
  AdminLayout,
  connect(mapStateToProps, mapDispatchToProps),
)(CouncilOfficerPage);
