import { combineReducers } from 'redux';

import {
  GET_VEHICLE_DETAIL_REQUESTING,
  GET_VEHICLE_DETAIL_SUCCESSED,
  GET_VEHICLE_DETAIL_FAILED,

  TOGGLE_EDIT_MODE,
  RESET_DATA,

  SUBMIT_VEHICLE_DETAIL_REQUESTING,
  SUBMIT_VEHICLE_DETAIL_SUCCESSED,
  SUBMIT_VEHICLE_DETAIL_FAILED,

  GET_CONTRACTOR_LIST_REQUESTING,
  GET_CONTRACTOR_LIST_SUCCESSED,
  GET_CONTRACTOR_LIST_FAILED,
} from './constants/actionTypes';

import { initialState } from './constants';

function vehicle(state = initialState, action) {
  switch (action.type) {
    /**
     * Get vehicle detail
     */
    case GET_VEHICLE_DETAIL_REQUESTING:
      return {
        ...state,
        vehicleData: {
          ...initialState.vehicleData,
          requesting: true,
        },
      };

    case GET_VEHICLE_DETAIL_SUCCESSED:
      return {
        ...state,
        vehicleData: {
          ...initialState.vehicleData,
          requesting: false,
          data: action.data,
        },
      };

    case GET_VEHICLE_DETAIL_FAILED:
      return {
        ...state,
        vehicleData: {
          ...initialState.vehicleData,
          requesting: false,
          data: null,
          error: action.error,
        },
      };

      /**
       * Ui
       */
    case TOGGLE_EDIT_MODE:
      return {
        ...state,
        ui: {
          editMode: !state.ui.editMode,
        },
      };

    case RESET_DATA:
      return {
        ...initialState,
      };

      /**
       * Submit vehicle
       */
    case SUBMIT_VEHICLE_DETAIL_REQUESTING:
      return {
        ...state,
        submitVehicleData: {
          ...initialState.submitVehicleData,
          requesting: true,
        },
      };

    case SUBMIT_VEHICLE_DETAIL_SUCCESSED:
      return {
        ...state,
        submitVehicleData: {
          ...initialState.submitVehicleData,
          requesting: false,
          data: action.data,
        },
      };

    case SUBMIT_VEHICLE_DETAIL_FAILED:
      return {
        ...state,
        submitVehicleData: {
          ...initialState.submitVehicleData,
          requesting: false,
          data: null,
          error: action.error,
        },
      };

      /**
     * Get contractor list
     */
    case GET_CONTRACTOR_LIST_REQUESTING:
      return {
        ...state,
        contractorList: {
          ...initialState.contractorList,
          requesting: true,
        },
      };

    case GET_CONTRACTOR_LIST_SUCCESSED:
      return {
        ...state,
        contractorList: {
          ...initialState.contractorList,
          requesting: false,
          data: action.data,
        },
      };

    case GET_CONTRACTOR_LIST_FAILED:
      return {
        ...state,
        contractorList: {
          ...initialState.contractorList,
          requesting: false,
          data: null,
          error: action.error,
        },
      };
    default:
      return state;
  }
}

export default combineReducers({
  vehicle,
});
