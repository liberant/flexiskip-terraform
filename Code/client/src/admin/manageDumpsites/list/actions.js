import { createAsyncAction } from '../../../common/helpers';
import {
  GET_DUMPSITES_LIST,
  GET_DUMPSITE_DETAILS_BY_ID,
  UPDATE_DUMPSITE_DETAILS,
  DELETE_DUMPSITES_LIST,
  DELETE_DUMPSITE_BY_ID,
  SET_DUMPSITES_LIST2STATE,
  SET_DUMPSITE_DETAILS2STATE,
  UPDATE_DUMPSITE_STATUS,
  CREATE_DUMPSITE,
  PUT_DUMPSITE_DETAIL2STATE,
  CLEAR_DUMPSITE_DETAIL2STATE,
  UNMOUNT_CLEAR_DUMPSITE_DETAILS,
  GET_DUMPSITE_COUNCILS_DEFINATIONS,
  PUT_DUMPSITE_COUNCILS_DEFINATIONS,
  GET_DUMPSITE_WASTETYPES_LIST,
  SET_DUMPSITE_WASTETYPES_LIST2STATE,
} from './constants/actionTypes';

export const getDumpsitesList = createAsyncAction(GET_DUMPSITES_LIST);
export const getDumpsiteDetailsById = createAsyncAction(GET_DUMPSITE_DETAILS_BY_ID);
export const updateDumpsiteDetails = createAsyncAction(UPDATE_DUMPSITE_DETAILS);
export const deleteDumpsitesList = createAsyncAction(DELETE_DUMPSITES_LIST);
export const deleteDumpsiteById = createAsyncAction(DELETE_DUMPSITE_BY_ID);
export const updateDumpsiteStatus = createAsyncAction(UPDATE_DUMPSITE_STATUS);

export const setDumpsitesList2State = createAsyncAction(SET_DUMPSITES_LIST2STATE);
export const setDumpsiteDetails2State = createAsyncAction(SET_DUMPSITE_DETAILS2STATE);
export const clearDumpsiteDetails2State = createAsyncAction(CLEAR_DUMPSITE_DETAIL2STATE);

export const createDumpsite = createAsyncAction(CREATE_DUMPSITE);
export const putDumpsiteDetails2State = createAsyncAction(PUT_DUMPSITE_DETAIL2STATE);

export const unmountClearDumpsiteDetails = createAsyncAction(UNMOUNT_CLEAR_DUMPSITE_DETAILS);

export const getDumpsiteCouncilDefinations = createAsyncAction(GET_DUMPSITE_COUNCILS_DEFINATIONS);
export const putDumpsiteCouncilDefinations2State
  = createAsyncAction(PUT_DUMPSITE_COUNCILS_DEFINATIONS);

export const getDumpsiteWastTypesList = createAsyncAction(GET_DUMPSITE_WASTETYPES_LIST);
export const putDumpsiteWasteTypesList2State =
  createAsyncAction(SET_DUMPSITE_WASTETYPES_LIST2STATE);
