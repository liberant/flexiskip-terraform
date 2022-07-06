export * from './actionTypes';

/**
 * Form names
 */
export const VEHICLE_DETAIL_FORM = 'vehicle/vehicleDetailForm';

/**
 * Default state
 */
export const initialState = {
  vehicleData: {
    requesting: false,
    error: null,
    data: null,
  },
  submitVehicleData: {
    requesting: false,
    error: null,
    data: null,
  },
  contractorList: {
    requesting: false,
    error: null,
    data: null,
  },
  ui: {
    editMode: false,
  },
};
