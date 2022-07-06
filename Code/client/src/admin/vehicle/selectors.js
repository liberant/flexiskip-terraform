const selectVehicleDetailState = state => state.admin.vehicle.vehicle;

/**
 * Get user detail
 */

export const selectVehicleDetail = state => selectVehicleDetailState(state).vehicleData.data;

export const selectVehicleDetailRequesting =
  state => selectVehicleDetailState(state).vehicleData.requesting;

export const selectVehicleDetailError = state => selectVehicleDetailState(state).vehicleData.error;

/**
 * Get contractor list
 */
export const selectContractorList = state => selectVehicleDetailState(state).contractorList.data;

export const selectContractorListRequesting =
  state => selectVehicleDetailState(state).contractorList.requesting;

export const selectContractorListError =
  state => selectVehicleDetailState(state).contractorList.error;

/**
 * UI
 */
export const selectViewMode = state => selectVehicleDetailState(state).ui.editMode;
