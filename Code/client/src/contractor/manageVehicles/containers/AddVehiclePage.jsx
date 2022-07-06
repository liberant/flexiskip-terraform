import React from 'react';
import { any, func } from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { SubmissionError } from 'redux-form';

import * as actions from '../actions';
import { bindActionCreators } from '../../../common/helpers';
import BackButton from '../../../common/components/BackButton';
import AddVehicleForm from '../components/AddVehicleForm';
import AdminLayout from '../../hoc/AdminLayout';

class VehiclePage extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  async onSubmit(data) {
    try {
      await this.props.createVehicle(data);
    } catch (error) {
      throw new SubmissionError({
        ...error.errors,
        _error: error.message,
      });
    }
  }

  goBack() {
    this.props.history.goBack();
  }

  render() {
    return (
      <div>
        <div className="top-toolbar">
          <BackButton link="/contractor/vehicles" label="Add Vehicle" />
        </div>
        <AddVehicleForm
          onSubmit={this.onSubmit}
          handleCancel={this.goBack}
        />
      </div>
    );
  }
}

VehiclePage.propTypes = {
  history: any.isRequired,
  createVehicle: func.isRequired,
};

export default compose(
  AdminLayout,
  connect(
    undefined,
    dispatch => bindActionCreators(actions, dispatch),
  ),
)(VehiclePage);
