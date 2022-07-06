import { createAsyncAction } from '../../common/helpers';
import {
  GET_ADVERTISING_LIST,
  GET_ADVERTISING_DETAILS_BY_ID,
  UPDATE_ADVERTISING_DETAILS,
  DELETE_ADVERTISING_LIST,
  DELETE_ADVERTISING_BY_ID,
  SET_ADVERTISING_LIST2STATE,
  SET_ADVERTISING_DETAILS2STATE,
  UPDATE_ADVERTISING_STATUS,
  CREATE_ADVERTISING,
  PUT_ADVERTISING_DETAIL2STATE,
  CLEAR_ADVERTISING_DETAIL2STATE,
  UNMOUNT_CLEAR_ADVERTISING_DETAILS,
  GET_ADVERTISING_COUNCILS_DEFINATIONS,
  PUT_ADVERTISING_COUNCILS_DEFINATIONS,
  GET_ADVERTISING_WASTETYPES_LIST,
  SET_ADVERTISING_WASTETYPES_LIST2STATE,
  PUBLISH_ADVERTISING_ITEM,
} from './constants/actionTypes';

export const getAdvertisingList = createAsyncAction(GET_ADVERTISING_LIST);
export const getAdvertisingDetailsById = createAsyncAction(GET_ADVERTISING_DETAILS_BY_ID);
export const updateAdvertisingDetails = createAsyncAction(UPDATE_ADVERTISING_DETAILS);
export const deleteAdvertisingList = createAsyncAction(DELETE_ADVERTISING_LIST);
export const deleteAdvertisingById = createAsyncAction(DELETE_ADVERTISING_BY_ID);
export const updateAdvertisingStatus = createAsyncAction(UPDATE_ADVERTISING_STATUS);

export const setAdvertisingList2State = createAsyncAction(SET_ADVERTISING_LIST2STATE);
export const setAdvertisingDetails2State = createAsyncAction(SET_ADVERTISING_DETAILS2STATE);
export const clearAdvertisingDetails2State = createAsyncAction(CLEAR_ADVERTISING_DETAIL2STATE);

export const createAdvertising = createAsyncAction(CREATE_ADVERTISING);
export const putAdvertisingDetails2State = createAsyncAction(PUT_ADVERTISING_DETAIL2STATE);

export const unmountClearAdvertisingDetails = createAsyncAction(UNMOUNT_CLEAR_ADVERTISING_DETAILS);

export const getAdvertisingCouncilDefinations =
  createAsyncAction(GET_ADVERTISING_COUNCILS_DEFINATIONS);
export const putAdvertisingCouncilDefinations2State
  = createAsyncAction(PUT_ADVERTISING_COUNCILS_DEFINATIONS);

export const getAdvertisingWastTypesList = createAsyncAction(GET_ADVERTISING_WASTETYPES_LIST);
export const putAdvertisingWasteTypesList2State =
  createAsyncAction(SET_ADVERTISING_WASTETYPES_LIST2STATE);

export const publishAdvertising = createAsyncAction(PUBLISH_ADVERTISING_ITEM);
