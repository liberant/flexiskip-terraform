import React from 'react';
import { any, bool, func, string } from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm, formValueSelector } from 'redux-form';

import { setTitle, clearIdentity } from '../../../common/actions';


import { withPreventingCheckHOC } from '../../../common/hocs';
import BusinessContractorForm from '../components/BusinessContractorForm';
import AdminLayout from '../../hoc/AdminLayout';

import {
  Spinner,
  CommonConfirmDlg,
} from '../../../common/components';

import {
  modalContentsDeletion,
  modalContentsSuspend,
  modalContentsUnsuspend,
  modalContentsInactive,
  // modalContentsSuspendUsers,
  modalContentsAdminsSuspend,
} from '../constants/modalDlgParams';

import {
  getAdminsList,
  getAdminDetails,
  updateAdminDetails,
  unmountClearAdminDetails,
  updateAdminsStatus,
  updateContractorStatus,
  updateBankInformation,
  updatePaymentInformation,
} from '../actions';
import { geoAddress } from '../../../common/components/form/reduxFormComponents';

const BUSINESS_CONTRACTOR_FORM = 'contractor/customerBusiness';

const BusinessContractorEditForm = compose(
  reduxForm({
    form: BUSINESS_CONTRACTOR_FORM,
    forceUnregisterOnUnmount: true,
    enableReinitialize: true,
  }),
  withPreventingCheckHOC,
)(BusinessContractorForm);

const selector = formValueSelector(BUSINESS_CONTRACTOR_FORM);

class BusinessContractorPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      userType: 'businessContractor',
      firstFetchFlag: true,
      customerId: this.props.match.params.id,

      modalIsOpen: false,
      modalContents: {
        start: {},
        success: {},
        fail: {},
      },
    };

    this.selectedAdmins = [];

    this.onHandleAdminSubmit = this.onHandleAdminSubmit.bind(this);
    this.onHandleToggleEdit = this.onHandleToggleEdit.bind(this);

    this.handleCloseModal = this.handleCloseModal.bind(this);

    // this.onHandleDeletion = this.onHandleDeletion.bind(this);
    // this.handleProcessDeletion = this.handleProcessDeletion.bind(this);
    // this.handleSuccessDeletion = this.handleSuccessDeletion.bind(this);

    this.onHandleSuspend = this.onHandleSuspend.bind(this);
    this.handleProcessSuspend = this.handleProcessSuspend.bind(this);
    this.handleSuccessSuspend = this.handleSuccessSuspend.bind(this);

    this.onHandleUnsuspend = this.onHandleUnsuspend.bind(this);
    this.handleProcessUnsuspend = this.handleProcessUnsuspend.bind(this);
    this.handleSuccessUnsuspend = this.handleSuccessUnsuspend.bind(this);

    this.onHandleInactive = this.onHandleInactive.bind(this);
    this.handleProcessInactive = this.handleProcessInactive.bind(this);
    this.handleSuccessInactive = this.handleSuccessInactive.bind(this);

    // this.onHandleSuspendUsers = this.onHandleSuspendUsers.bind(this);
    // this.handleProcessSuspendUsers = this.handleProcessSuspendUsers.bind(this);
    // this.handleSuccessSuspendUsers = this.handleSuccessSuspendUsers.bind(this);

    // hadle Admins
    this.onHandleAdminsDeletion = this.onHandleAdminsDeletion.bind(this);
    this.handleProcessAdminsDeletion = this.handleProcessAdminsDeletion.bind(this);
    this.handleSuccessAdminsDeletion = this.handleSuccessAdminsDeletion.bind(this);

    this.onHandleAdminsSuspend = this.onHandleAdminsSuspend.bind(this);
    this.handleProcessAdminsSuspend = this.handleProcessAdminsSuspend.bind(this);
    this.handleSuccessAdminsSuspend = this.handleSuccessAdminsSuspend.bind(this);

    this.onHandleAdminsSelect = this.onHandleAdminsSelect.bind(this);
  }

  async componentDidMount() {
    const { setTitle, getAdminDetails, getAdminsList } = this.props;

    setTitle('');
    await getAdminsList({ limit: 1000, page: 1 });

    await getAdminDetails();
  }

  // shouldComponentUpdate(nextProps) {
  //   if (!nextProps.customerDetailsFetchFlag && !this.state.firstFetchFlag) {
  //     return false;
  //   }

  //   return true;
  // }

  componentWillUnmount() {
    this.props.unmountClearAdminDetails();
  }

  onHandleAdminsSelect(selectedAdmins) {
    this.selectedAdmins = selectedAdmins;
  }

  onHandleSuspend() {
    const tmpModalContents = {
      ...modalContentsSuspend,
      func: {
        handleProcess: this.handleProcessSuspend,
        handleSuccess: this.handleSuccessSuspend,
      },
    };

    this.setState({
      modalIsOpen: true,
      modalContents: tmpModalContents,
    });
  }

  // Admins Deletion
  onHandleAdminsDeletion() {
    if (this.selectedAdmins.length < 1) {
      return;
    }
    const tmpModalContents = {
      ...modalContentsDeletion,
      func: {
        handleProcess: this.handleProcessAdminsDeletion,
        handleSuccess: this.handleSuccessAdminsDeletion,
      },
    };

    this.setState({
      modalIsOpen: true,
      modalContents: tmpModalContents,
    });
  }

  // Admins Suspend
  onHandleAdminsSuspend() {
    if (this.selectedAdmins.length < 1) {
      return;
    }
    const tmpModalContents = {
      ...modalContentsAdminsSuspend,
      func: {
        handleProcess: this.handleProcessAdminsSuspend,
        handleSuccess: this.handleSuccessAdminsSuspend,
      },
    };

    this.setState({
      modalIsOpen: true,
      modalContents: tmpModalContents,
    });
  }


  onHandleUnsuspend() {
    const tmpModalContents = {
      ...modalContentsUnsuspend,
      func: {
        handleProcess: this.handleProcessUnsuspend,
        handleSuccess: this.handleSuccessUnsuspend,
      },
    };

    this.setState({
      modalIsOpen: true,
      modalContents: tmpModalContents,
    });
  }

  onHandleInactive() {
    const tmpModalContents = {
      ...modalContentsInactive,
      func: {
        handleProcess: this.handleProcessInactive,
        handleSuccess: this.handleSuccessInactive,
      },
    };

    this.setState({
      modalIsOpen: true,
      modalContents: tmpModalContents,
    });
  }

  async onHandleAdminSubmit(values) {
    if (!values) {
      return;
    }

    const {
      avatar,
    } = values;
    const {
      address, name,
      phone, contact,
    } = values.organisation;
    if (contact && contact.phone) {
      contact.phone = (contact.phone).replace(/[^\d]/g, '');
    }

    await this.props.updateAdminDetails({
      url: 'contractors',
      data: {
        company: {
          address,
          name,
          phone: `${phone.replace(/[^\d]/g, '')}`,
        },
        contact,
        avatar: avatar && avatar.constructor === Array ? avatar[0] : avatar,
      },
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

  // suspend
  handleProcessSuspend() {
    const { updateContractorStatus } = this.props;
    const { userType, customerId } = this.state;

    return updateContractorStatus({
      ids: [customerId],
      url: 'users',
      status: 'Suspended',
      userType,
    });
  }

  handleSuccessSuspend() {
    this.props.history.push('/contractor/dashboard');
  }


  // delete Admins
  handleProcessAdminsDeletion() {
    const { updateAdminsStatus } = this.props;

    return updateAdminsStatus({
      ids: this.selectedAdmins,
      status: 'Removed',
    });
  }

  async handleSuccessAdminsDeletion() {
    await getAdminsList({ limit: 1000, page: 1 });
    await this.setState({
      modalIsOpen: false,
    });
  }

  // suspend Admins
  handleProcessAdminsSuspend() {
    const { updateAdminsStatus } = this.props;

    return updateAdminsStatus({
      ids: this.selectedAdmins,
      status: 'Suspended',
    });
  }

  async handleSuccessAdminsSuspend() {
    await getAdminsList({ limit: 1000, page: 1 });
    await this.setState({
      modalIsOpen: false,
    });
  }


  // unsuspend
  handleProcessUnsuspend() {
    const { updateContractorStatus } = this.props;
    const { userType, customerId } = this.state;

    return updateContractorStatus({
      ids: [customerId],
      url: 'users',
      status: 'Avaliable',
      userType,
    });
  }

  handleSuccessUnsuspend() {
    this.props.history.push('/contractor/dashboard');
  }

  // inactive
  handleProcessInactive() {
    const { updateContractorStatus } = this.props;
    const { userType, customerId } = this.state;

    return updateContractorStatus({
      ids: [customerId],
      url: 'users',
      status: 'Inactive',
      userType,
    });
  }

  handleSuccessInactive() {
    const { logout, history } = this.props;
    logout();
    history.push('/contractor/dashboard');
  }

  render() {
    const {
      customerDetailsFetchFlag, profile, admins, getAdminsList,
      updateBankInformation, updatePaymentInformation, status,
      /* , form: { dirty, submitSucceeded } */ } = this.props;
    const {
      firstFetchFlag, isEdit,
      modalIsOpen, modalContents,
    } = this.state;

    if ((firstFetchFlag && !customerDetailsFetchFlag) || (JSON.stringify(profile) === '{}')) {
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
        >
          <div
            style={{
              textAlign: 'right',
              fontSize: 36,
            }}
          >
            <span
              className="handel-cross"
              style={{ cursor: 'pointer' }}
              onClick={this.handleCloseModal}
            />
          </div>
        </CommonConfirmDlg>

        <BusinessContractorEditForm
          data={profile}
          initialValues={profile}
          isEdit={isEdit}
          admins={admins}
          status={status}
          getData={getAdminsList}
          onSubmit={this.onHandleAdminSubmit}
          onToggleEdit={this.onHandleToggleEdit}
          // onDelete={this.onHandleDeletion}
          onHandleSuspend={this.onHandleSuspend}
          onHandleUnsuspend={this.onHandleUnsuspend}
          onHandleInactive={this.onHandleInactive}
          // onHandleSuspendUsers={this.onHandleSuspendUsers}
          onHandleAdminsSuspend={this.onHandleAdminsSuspend}
          onHandleAdminsDeletion={this.onHandleAdminsDeletion}
          onHandleAdminsSelect={this.onHandleAdminsSelect}
          onUpdateBankInformation={updateBankInformation}
          onUpdatePaymentInformation={updatePaymentInformation}
        />
      </div>
    );
  }
}

BusinessContractorPage.propTypes = {
  customerDetailsFetchFlag: bool,
  profile: any.isRequired,
  admins: any.isRequired,
  // form: any.isRequired,
  setTitle: func.isRequired,
  getAdminsList: func.isRequired,
  getAdminDetails: func.isRequired,
  updateAdminDetails: func.isRequired,
  match: any.isRequired,
  unmountClearAdminDetails: func.isRequired,
  updateAdminsStatus: func.isRequired,
  updateContractorStatus: func.isRequired,
  updateBankInformation: func.isRequired,
  updatePaymentInformation: func.isRequired,
  history: any.isRequired,
  logout: func.isRequired,
  status: string.isRequired,
};

BusinessContractorPage.defaultProps = {
  customerDetailsFetchFlag: true,
};

function mapStateToProps(state) {
  const myEmail = (state && state.common && state.common.identity && state.common.identity.user
    && state.common.identity.user.email) ? state.common.identity.user.email : '';
  const tmpAdmins = (state && state.contractor && state.contractor.admins &&
    state.contractor.admins.admins && state.contractor.admins.admins.list) ?
    state.contractor.admins.admins.list : {};
  const admins = {};
  if (myEmail && (JSON.stringify(tmpAdmins) !== '{}')) {
    admins.pagination = tmpAdmins.pagination;
    if (tmpAdmins.data && tmpAdmins.data.constructor === Array) {
      admins.data = tmpAdmins.data.filter(d => d.email !== myEmail);
    } else {
      admins.data = [];
    }
  }
  return ({
    customerDetailsFetchFlag: state.common.requestFinished.customerDetails,
    profile: state.contractor.admins.admins.details || {},
    form: state.form[BUSINESS_CONTRACTOR_FORM] || {},
    admins,
    status: selector(state, 'status') || 'Active',
  });
}

function mapDispatchToProps(dispatch) {
  return ({
    setTitle: title => dispatch(setTitle(title)),
    getAdminsList: (data) => {
      const action = getAdminsList(data);
      dispatch(action);
      return action.promise;
    },
    getAdminDetails: () => {
      const action = getAdminDetails();
      dispatch(action);
      return action.promise;
    },
    updateAdminDetails: (data) => {
      const action = updateAdminDetails(data);
      dispatch(action);
      return action.promise;
    },
    unmountClearAdminDetails: () => {
      const action = unmountClearAdminDetails();
      dispatch(action);
      return action.promise;
    },
    updateAdminsStatus: (data) => {
      const action = updateAdminsStatus(data);
      dispatch(action);
      return action.promise;
    },
    updateContractorStatus: (data) => {
      const action = updateContractorStatus(data);
      dispatch(action);
      return action.promise;
    },
    updateBankInformation: (data) => {
      const action = updateBankInformation(data);
      dispatch(action);
      return action.promise;
    },
    updatePaymentInformation: (data) => {
      const action = updatePaymentInformation(data);
      dispatch(action);
      return action.promise;
    },

    logout: () => dispatch(clearIdentity()),
  });
}

export default compose(
  AdminLayout,
  connect(mapStateToProps, mapDispatchToProps),
)(BusinessContractorPage);
