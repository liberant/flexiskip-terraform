import React from 'react';
import { any, bool, func } from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import validate from 'validate.js';

import { setTitle } from '../../../common/actions';


import { withPreventingCheckHOC } from '../../../common/hocs';
import VehicleForm from '../components/VehicleForm';
import AdminLayout from '../../hoc/AdminLayout';

import {
  Spinner,
  CommonConfirmDlg,
} from '../../../common/components';

import { modalContentsDeletion, modalContentsSuspension } from '../constants/modalDlgParams';

import {
  getVehicleDetailsById,
  updateVehicleDetailsById,
  unmountClearVehicleDetails,
  updateVehiclesStatus,
  deleteVehicleById,
  suspendVehicleById,
} from '../actions';

const VEHICLE_FORM = 'contractor/vehicle';

const VehicleEditForm = compose(
  withPreventingCheckHOC,
  reduxForm({
    form: VEHICLE_FORM,
    forceUnregisterOnUnmount: true,
    enableReinitialize: true,
    validate: (data) => {
      const constraints = {
        regNo: {
          presence: { message: '^Vehicle registration no. can\'t be blank', allowEmpty: false },
        },
        wasteTypes: {
          presence: { message: '^Product types must be selected', allowEmpty: false },
        },
      };
      return validate(data, constraints) || {};
    },
  }),
)(VehicleForm);

class VehiclePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      userType: 'vehicles',
      firstFetchFlag: true,
      vehicleId: this.props.match.params.id,

      modalIsOpen: false,
      modalContents: {
        start: {},
        success: {},
        fail: {},
      },
    };

    this.onHandleVehicleSubmit = this.onHandleVehicleSubmit.bind(this);
    this.onHandleToggleEdit = this.onHandleToggleEdit.bind(this);

    this.handleCloseModal = this.handleCloseModal.bind(this);

    this.onHandleDeletion = this.onHandleDeletion.bind(this);
    this.handleProcessDeletion = this.handleProcessDeletion.bind(this);
    this.handleSuccessDeletion = this.handleSuccessDeletion.bind(this);
  }

  componentDidMount() {
    const { setTitle, getVehicleDetailsById } = this.props;
    const { userType, vehicleId } = this.state;

    setTitle('');
    getVehicleDetailsById({
      userType,
      url: 'vehicles',
      uid: vehicleId,
    });
  }

  componentWillUnmount() {
    this.props.unmountClearVehicleDetails();
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

  onHandleSuspension = () => {
    const tmpModalContents = {
      ...modalContentsSuspension,
      func: {
        handleProcess: this.handleProcessSuspension,
        handleSuccess: this.handleSuccessSuspension,
      },
    };

    this.setState({
      modalIsOpen: true,
      modalContents: tmpModalContents,
    });
  }

  async onHandleVehicleSubmit(values) {
    if (!values) {
      return;
    }

    const { userType, vehicleId } = this.state;

    await this.props.updateVehicleDetailsById({
      url: userType,
      uid: vehicleId,
      data: values,
    });

    this.setState({ isEdit: false });
    this.props.getVehicleDetailsById({
      userType,
      url: 'vehicles',
      uid: vehicleId,
    });
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

  handleProcessDeletion() {
    const { deleteVehicleById } = this.props;
    const { vehicleId } = this.state;

    // return updateVehiclesStatus({
    //   ids: [vehicleId],
    //   url: 'vehicles',
    //   status: 'Removed',
    //   userType,
    // });

    return deleteVehicleById({
      uid: vehicleId,
    });
  }

  handleSuccessDeletion() {
    this.props.history.push('/contractor/vehicles');
  }

  handleProcessSuspension = () => {
    const { suspendVehicleById } = this.props;
    const { vehicleId } = this.state;
    return suspendVehicleById({
      uid: vehicleId,
      status: 'Unavailable',
    });
  }

  handleSuccessSuspension = () => {
    this.props.history.push('/contractor/vehicles');
  }

  render() {
    const {
      vehicleDetailsFetchFlag, vehicle,
      /* form: { dirty, submitSucceeded } */ } = this.props;
    const {
      firstFetchFlag, isEdit,
      modalIsOpen, modalContents,
    } = this.state;

    if ((firstFetchFlag && !vehicleDetailsFetchFlag)) {
      return (
        <Spinner />
      );
    }

    if (JSON.stringify(vehicle) === '{}') {
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

        <VehicleEditForm
          data={vehicle}
          initialValues={vehicle}
          isEdit={isEdit}
          onResetPassword={this.onHandleResetPassword}
          onSubmit={this.onHandleVehicleSubmit}
          onToggleEdit={this.onHandleToggleEdit}
          onDelete={this.onHandleDeletion}
          onSuspend={this.onHandleSuspension}
        />
      </div>
    );
  }
}

VehiclePage.propTypes = {
  vehicleDetailsFetchFlag: bool,
  vehicle: any.isRequired,
  // form: any.isRequired,
  setTitle: func.isRequired,
  getVehicleDetailsById: func.isRequired,
  updateVehicleDetailsById: func.isRequired,
  match: any.isRequired,
  unmountClearVehicleDetails: func.isRequired,
  deleteVehicleById: func.isRequired,
  history: any.isRequired,
  suspendVehicleById: func.isRequired,
};

VehiclePage.defaultProps = {
  vehicleDetailsFetchFlag: true,
};

function mapStateToProps(state) {
  return ({
    vehicleDetailsFetchFlag: state.common.requestFinished.vehicleDetails,
    vehicle: state.contractor.vehicles.vehicles.details || {},
    form: state.form[VEHICLE_FORM] || {},
  });
}

function mapDispatchToProps(dispatch) {
  return ({
    setTitle: title => dispatch(setTitle(title)),
    getVehicleDetailsById: (id) => {
      const action = getVehicleDetailsById(id);
      dispatch(action);
      return action.promise;
    },
    updateVehicleDetailsById: (data) => {
      const action = updateVehicleDetailsById(data);
      dispatch(action);
      return action.promise;
    },
    unmountClearVehicleDetails: () => {
      const action = unmountClearVehicleDetails();
      dispatch(action);
      return action.promise;
    },
    updateVehiclesStatus: (data) => {
      const action = updateVehiclesStatus(data);
      dispatch(action);
      return action.promise;
    },
    deleteVehicleById: (data) => {
      const action = deleteVehicleById(data);
      dispatch(action);
      return action.promise;
    },
    suspendVehicleById: (data) => {
      const action = suspendVehicleById(data);
      dispatch(action);
      return action.promise;
    },
  });
}

export default compose(
  AdminLayout,
  connect(mapStateToProps, mapDispatchToProps),
)(VehiclePage);
