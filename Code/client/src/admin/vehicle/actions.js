import {
  GET_VEHICLE_DETAIL,
  GET_VEHICLE_DETAIL_REQUESTING,
  GET_VEHICLE_DETAIL_SUCCESSED,
  GET_VEHICLE_DETAIL_FAILED,

  TOGGLE_EDIT_MODE,
  RESET_DATA,

  SUBMIT_VEHICLE_DETAIL,
  SUBMIT_VEHICLE_DETAIL_REQUESTING,
  SUBMIT_VEHICLE_DETAIL_SUCCESSED,
  SUBMIT_VEHICLE_DETAIL_FAILED,

  GET_CONTRACTOR_LIST,
  GET_CONTRACTOR_LIST_REQUESTING,
  GET_CONTRACTOR_LIST_SUCCESSED,
  GET_CONTRACTOR_LIST_FAILED,
} from './constants/actionTypes';

/**
 * Define action get vehicle profile
 */
export function getVehicleDetail(payload) {
  return {
    type: GET_VEHICLE_DETAIL,
    payload,
  };
}

export function getVehicleDetailStart() {
  return {
    type: GET_VEHICLE_DETAIL_REQUESTING,
  };
}

export function getVehicleDetailSuccessed(data) {
  return {
    type: GET_VEHICLE_DETAIL_SUCCESSED,
    data,
  };
}

export function getVehicleDetailFailed(error) {
  return {
    type: GET_VEHICLE_DETAIL_FAILED,
    error,
  };
}


/**
 * Define UI action
 */
export function toggleEditMode() {
  return {
    type: TOGGLE_EDIT_MODE,
  };
}

export function resetData() {
  return {
    type: RESET_DATA,
  };
}

/**
 * Submit Profile
 */
export function submitVehicleDetail(payload) {
  return {
    type: SUBMIT_VEHICLE_DETAIL,
    payload,
  };
}

export function submitVehicleDetailStart() {
  return {
    type: SUBMIT_VEHICLE_DETAIL_REQUESTING,
  };
}

export function submitVehicleDetailSuccessed(data) {
  return {
    type: SUBMIT_VEHICLE_DETAIL_SUCCESSED,
    data,
  };
}

export function submitVehicleDetailFailed(error) {
  return {
    type: SUBMIT_VEHICLE_DETAIL_FAILED,
    error,
  };
}

/**
 * Define action get contractor
 */
export function getContractorList(payload) {
  return {
    type: GET_CONTRACTOR_LIST,
    payload,
  };
}

export function getContractorListStart() {
  return {
    type: GET_CONTRACTOR_LIST_REQUESTING,
  };
}

export function getContractorListSuccessed(data) {
  return {
    type: GET_CONTRACTOR_LIST_SUCCESSED,
    data,
  };
}

export function getContractorListFailed(error) {
  return {
    type: GET_CONTRACTOR_LIST_FAILED,
    error,
  };
}
