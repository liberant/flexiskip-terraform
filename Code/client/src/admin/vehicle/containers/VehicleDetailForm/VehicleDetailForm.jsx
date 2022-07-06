import React from 'react';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';

import { withPreventingCheckHOC } from '../../../../common/hocs';
import VehicleTitle from '../../components/VehicleTitle/VehicleTitle';
import GroupButtons from '../../components/GroupButtons/GroupButtons';

import { SimpleCardLayout } from '../../../../common/components';

import VehicleDetailsSubForm from '../../components/VehicleDetailsSubForm/VehicleDetailsSubForm';
import VehicleInformationSubForm from '../../../../contractor/manageVehicles/components/VehicleInformationSubForm';

import { VEHICLE_DETAIL_FORM } from '../../constants';

/* eslint no-underscore-dangle:0 */

class VehicleDetailForm extends React.Component {
  render() {
    const {
      editMode, handleSubmit, vehicle, contractorList,
    } = this.props;
    return (
      <form onSubmit={handleSubmit(this.props.handleSaveOnClick)}>
        <VehicleTitle
          vehicle={vehicle}
        />
        <GroupButtons
          editMode={editMode}
          handleEditOnclick={this.props.handleEditOnclick}
          handleCancelOnClick={this.props.handleCancelOnClick}
        />
        <div className="row">
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <SimpleCardLayout title="Vehicle Details">
              <VehicleDetailsSubForm
                isEdit={editMode}
                contractorList={contractorList}
              />
            </SimpleCardLayout>

          </div>
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <SimpleCardLayout title="Vehicle Information">
              <VehicleInformationSubForm
                isEdit={editMode}
              />
            </SimpleCardLayout>
          </div>
        </div>
      </form>
    );
  }
}

VehicleDetailForm.propTypes = {
  editMode: PropTypes.bool.isRequired,
  handleEditOnclick: PropTypes.func.isRequired,
  handleCancelOnClick: PropTypes.func.isRequired,
  handleSaveOnClick: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  vehicle: PropTypes.object.isRequired,

  contractorList: PropTypes.array.isRequired,
};

VehicleDetailForm.defaultProps = {};

export default compose(
  reduxForm({
    form: VEHICLE_DETAIL_FORM,
    forceUnregisterOnUnmount: true,
    enableReinitialize: true,
  }),
  withPreventingCheckHOC,
)(VehicleDetailForm);
