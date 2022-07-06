import React from 'react';
import { any, bool, func } from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';

import { setTitle } from '../../../common/actions';


import { withPreventingCheckHOC } from '../../../common/hocs';
import EditAdminsDetailsForm from '../components/EditAdminsDetailsForm';
import AdminLayout from '../../hoc/AdminLayout';

import {
  Spinner,
  CommonConfirmDlg,
} from '../../../common/components';

import {
  getContractorAdminDetails,
  updateContractorAdminDetails,
} from '../actions';

const ADMIN_FORM = 'contractor/admin';

const AdminEditForm = compose(
  reduxForm({
    form: ADMIN_FORM,
    forceUnregisterOnUnmount: true,
    enableReinitialize: true,
  }),
  withPreventingCheckHOC,
)(EditAdminsDetailsForm);


class EditAdminUserPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      firstFetchFlag: true,
      adminId: this.props.match.params.id,

      modalIsOpen: false,
      modalContents: {
        start: {},
        success: {},
        fail: {},
      },
    };

    this.onHandleAdminSubmit = this.onHandleAdminSubmit.bind(this);
    this.onHandleToggleEdit = this.onHandleToggleEdit.bind(this);

    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  componentDidMount() {
    const { setTitle, getContractorAdminDetails } = this.props;
    const { adminId } = this.state;

    setTitle('');
    getContractorAdminDetails({
      uid: adminId,
    });
  }

  // shouldComponentUpdate(nextProps) {
  //   if (!nextProps.adminDetailsFetchFlag && !this.state.firstFetchFlag) {
  //     return false;
  //   }

  //   return true;
  // }

  async onHandleAdminSubmit(values) {
    if (!values) {
      return;
    }

    const {
      roles, avatar, ...rest
    } = values;
    // if (isAdmin && !roles.includes('admin')) {
    //   roles.push('admin');
    // }

    const { adminId } = this.state;

    await this.props.updateContractorAdminDetails({
      uid: adminId,
      data: { ...rest, roles, avatar: avatar && avatar.constructor === Array ? avatar[0] : avatar },
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

  render() {
    const {
      adminDetailsFetchFlag, admin,
      /* form: { dirty, submitSucceeded } */ } = this.props;
    const {
      firstFetchFlag, isEdit,
      modalIsOpen, modalContents,
    } = this.state;

    if ((firstFetchFlag && !adminDetailsFetchFlag)) {
      return (
        <Spinner />
      );
    }

    if (JSON.stringify(admin) === '{}') {
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

        <AdminEditForm
          data={admin}
          initialValues={admin}
          isEdit={isEdit}
          onResetPassword={this.onHandleResetPassword}
          onSubmit={this.onHandleAdminSubmit}
          onToggleEdit={this.onHandleToggleEdit}
          onDelete={this.onHandleDeletion}
        />
      </div>
    );
  }
}

EditAdminUserPage.propTypes = {
  adminDetailsFetchFlag: bool,
  admin: any.isRequired,
  // form: any.isRequired,
  setTitle: func.isRequired,
  getContractorAdminDetails: func.isRequired,
  updateContractorAdminDetails: func.isRequired,
  match: any.isRequired,
};

EditAdminUserPage.defaultProps = {
  adminDetailsFetchFlag: true,
};

function mapStateToProps(state) {
  return ({
    adminDetailsFetchFlag: state.common.requestFinished.contractorAdminDetails,
    admin: state.contractor.admins.admins.list.details || {},
    form: state.form[ADMIN_FORM] || {},
  });
}

function mapDispatchToProps(dispatch) {
  return ({
    setTitle: title => dispatch(setTitle(title)),
    getContractorAdminDetails: (id) => {
      const action = getContractorAdminDetails(id);
      dispatch(action);
      return action.promise;
    },
    updateContractorAdminDetails: (data) => {
      const action = updateContractorAdminDetails(data);
      dispatch(action);
      return action.promise;
    },
  });
}

export default compose(
  AdminLayout,
  connect(mapStateToProps, mapDispatchToProps),
)(EditAdminUserPage);
