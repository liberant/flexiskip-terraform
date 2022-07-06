import React, { Component } from 'react';
import { bool, func } from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { setTitle } from '../../../common/actions';
import {
  getVehiclesList,
  getVehicleDetailsById,
  updateVehicleDetails,
  deleteVehiclesList,
  deleteVehicleById,
  updateVehicleStatusById,
  updateVehiclesStatus,
} from '../actions';
import Spinner from '../../../common/components/Spinner';

import VehiclesTable from '../components/VehiclesTable';
import AdminLayout from '../../hoc/AdminLayout';

/* eslint react/require-default-props: 0 */
/* eslint react/prop-types: 0 */
/* eslint no-unused-expressions: 0 */
const xPanelStyle = {
  marginBottom: -20,
};

class VehiclesManagePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sizePerPage: 10,
      firstFetchFlag: true,
    };

    this.handleGetVehiclesList = this.handleGetVehiclesList.bind(this);
  }


  componentDidMount() {
    const { setTitle, getVehiclesList } = this.props;
    const { sizePerPage } = this.state;

    setTitle('');
    getVehiclesList({
      limit: sizePerPage, page: 1,
    });
  }

  // shouldComponentUpdate(nextProps) {
  //   if (!nextProps.vehiclesListLoaded && !this.state.firstFetchFlag) {
  //     return false;
  //   }

  //   return true;
  // }

  handleGetVehiclesList(limit, page, s) {
    const { getVehiclesList } = this.props;
    const { firstFetchFlag } = this.state;

    firstFetchFlag && this.setState({ firstFetchFlag: false });
    getVehiclesList({
      limit, page, s,
    });
  }

  render() {
    const {
      vehiclesListLoaded,
      vehicles,
      deleteVehicleById,
      updateVehicleStatusById,
      updateVehiclesStatus,
    } = this.props;
    const { firstFetchFlag } = this.state;

    if (firstFetchFlag && !vehiclesListLoaded) {
      return (
        <Spinner />
      );
    }

    return (
      <div className="x_panel_" style={xPanelStyle}>
        <VehiclesTable
          vehicles={vehicles}
          getData={this.handleGetVehiclesList}
          deleteVehicleById={deleteVehicleById}
          updateVehicleStatusById={updateVehicleStatusById}
          updateVehiclesStatus={updateVehiclesStatus}
        />
      </div>
    );
  }
}

VehiclesManagePage.propTypes = {
  vehiclesListLoaded: bool,
  getVehiclesList: func.isRequired,
  // getVehicleDetailsById: func.isRequired,
  // updateVehicleDetails: func.isRequired,
  // deleteVehiclesList: func.isRequired,
  deleteVehicleById: func.isRequired,
  updateVehicleStatusById: func.isRequired,
  setTitle: func.isRequired,
};

VehiclesManagePage.defaultProps = {
  vehiclesListLoaded: false,
};

export default compose(
  AdminLayout,
  connect(
    state => ({
      vehiclesListLoaded: state.common.requestFinished.vehiclesList,
      vehicles: state.contractor.vehicles,
    }),
    dispatch => ({
      // set page title
      setTitle: title => dispatch(setTitle(title)),

      getVehiclesList: (data) => {
        const action = getVehiclesList(data);
        dispatch(action);
        return action.promise;
      },

      getVehicleDetailsById: (data) => {
        const action = getVehicleDetailsById(data);
        dispatch(action);
        return action.promise;
      },

      updateVehicleDetails: (data) => {
        const action = updateVehicleDetails(data);
        dispatch(action);
        return action.promise;
      },

      deleteVehiclesList: (data) => {
        const action = deleteVehiclesList(data);
        dispatch(action);
        return action.promise;
      },

      deleteVehicleById: (data) => {
        const action = deleteVehicleById(data);
        dispatch(action);
        return action.promise;
      },

      updateVehicleStatusById: (data) => {
        const action = updateVehicleStatusById(data);
        dispatch(action);
        return action.promise;
      },

      updateVehiclesStatus: (data) => {
        const action = updateVehiclesStatus(data);
        dispatch(action);
        return action.promise;
      },

    }),
  ),
)(VehiclesManagePage);
