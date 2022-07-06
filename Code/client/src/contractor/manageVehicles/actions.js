import { createAsyncAction } from '../../common/helpers';
import {
  GET_VEHICLES_LIST,
  GET_VEHICLE_DETAILS_BY_ID,
  UPDATE_VEHICLE_DETAILS,
  DELETE_VEHICLES_LIST,
  DELETE_VEHICLE_BY_ID,
  SET_VEHICLES_LIST2STATE,
  SET_VEHICLE_DETAILS2STATE,
  CLEAR_VEHICLE_DETAILS2STATE,
  UPDATE_VEHICLE_STATUS,
  UPDATE_VEHICLES_STATUS,
  UNMOUNT_CLEAR_VEHICLE_DETAILS,
  CREATE_VEHICLE,
  SUSPEND_VEHICLE_BY_ID,
} from './constants/actionTypes';

export const getVehiclesList = createAsyncAction(GET_VEHICLES_LIST);
export const getVehicleDetailsById = createAsyncAction(GET_VEHICLE_DETAILS_BY_ID);
export const updateVehicleDetailsById = createAsyncAction(UPDATE_VEHICLE_DETAILS);
export const deleteVehiclesList = createAsyncAction(DELETE_VEHICLES_LIST);
export const deleteVehicleById = createAsyncAction(DELETE_VEHICLE_BY_ID);
export const updateVehicleStatusById = createAsyncAction(UPDATE_VEHICLE_STATUS);

export const setVehiclesList2State = createAsyncAction(SET_VEHICLES_LIST2STATE);
export const setVehicleDetails2State = createAsyncAction(SET_VEHICLE_DETAILS2STATE);
export const clearVehicleDetails2State = createAsyncAction(CLEAR_VEHICLE_DETAILS2STATE);

export const updateVehiclesStatus = createAsyncAction(UPDATE_VEHICLES_STATUS);

export const unmountClearVehicleDetails = createAsyncAction(UNMOUNT_CLEAR_VEHICLE_DETAILS);
export const createVehicle = createAsyncAction(CREATE_VEHICLE);
export const suspendVehicleById = createAsyncAction(SUSPEND_VEHICLE_BY_ID);
