import { createAsyncAction, createAction } from '../../../common/helpers';
import {
  GET_COUNCILS_LIST,
  GET_COUNCIL_DETAILS_BY_ID,
  UPDATE_COUNCIL_DETAILS,
  DELETE_COUNCILS_LIST,
  DELETE_COUNCIL_BY_ID,
  SET_COUNCILS_LIST2STATE,
  SET_COUNCIL_DETAILS2STATE,
  UPDATE_COUNCIL_STATUS,
  CREATE_COUNCIL,
  PUT_COUNCIL_DETAIL2STATE,
  CLEAR_COUNCIL_DETAIL2STATE,
  UNMOUNT_CLEAR_COUNCIL_DETAILS,
  GET_COUNCIL_REGIONS_DEFINATIONS,
  PUT_COUNCIL_REGIONS_DEFINATIONS2STATE,
  GET_COUNCIL_PRODUCTS_LIST,
  SET_COUNCIL_PRODUCTS_LIST2STATE,
  GET_COUNCIL_STATES_DEFINATIONS,
  PUT_COUNCIL_STATES_DEFINATIONS2STATE,
  FETCH_ALL_COUNCILS,
  SET_COUNCIL_OPTIONS,
} from './constants/actionTypes';

export const getCouncilsList = createAsyncAction(GET_COUNCILS_LIST);
export const getCouncilDetailsById = createAsyncAction(GET_COUNCIL_DETAILS_BY_ID);
export const updateCouncilDetails = createAsyncAction(UPDATE_COUNCIL_DETAILS);
export const deleteCouncilsList = createAsyncAction(DELETE_COUNCILS_LIST);
export const deleteCouncilById = createAsyncAction(DELETE_COUNCIL_BY_ID);
export const updateCouncilStatus = createAsyncAction(UPDATE_COUNCIL_STATUS);

export const setCouncilsList2State = createAsyncAction(SET_COUNCILS_LIST2STATE);
export const setCouncilDetails2State = createAsyncAction(SET_COUNCIL_DETAILS2STATE);
export const clearCouncilDetails2State = createAsyncAction(CLEAR_COUNCIL_DETAIL2STATE);

export const createCouncil = createAsyncAction(CREATE_COUNCIL);
export const putCouncilDetails2State = createAsyncAction(PUT_COUNCIL_DETAIL2STATE);

export const unmountClearCouncilDetails = createAsyncAction(UNMOUNT_CLEAR_COUNCIL_DETAILS);

export const getCouncilRegionDefinations = createAsyncAction(GET_COUNCIL_REGIONS_DEFINATIONS);
export const putCouncilRegionDefinations2State
  = createAsyncAction(PUT_COUNCIL_REGIONS_DEFINATIONS2STATE);

export const getCouncilStatesDefinations = createAsyncAction(GET_COUNCIL_STATES_DEFINATIONS);
export const putCouncilStatesDefinations2State
  = createAsyncAction(PUT_COUNCIL_STATES_DEFINATIONS2STATE);

export const getCouncilProductsList = createAsyncAction(GET_COUNCIL_PRODUCTS_LIST);
export const putCouncilProductsList2State = createAsyncAction(SET_COUNCIL_PRODUCTS_LIST2STATE);

export const fetchAllCouncils = createAsyncAction(FETCH_ALL_COUNCILS);
export const setCouncilOptions = createAction(SET_COUNCIL_OPTIONS);

