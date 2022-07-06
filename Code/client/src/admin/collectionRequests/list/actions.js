import { createAsyncAction, createAction } from '../../../common/helpers';
import * as actionTypes from './constants/actionTypes';

export const getCollectionRequestsList =
  createAsyncAction(actionTypes.GET_COLLECTION_REQUESTS_LIST);
export const getCollectionRequestsDetailsById =
  createAsyncAction(actionTypes.GET_COLLECTION_REQUESTS_DETAILS_BY_ID);
export const updateCollectionRequestsDetails =
  createAsyncAction(actionTypes.UPDATE_COLLECTION_REQUESTS_DETAILS);
export const deleteCollectionRequestsList =
  createAsyncAction(actionTypes.DELETE_COLLECTION_REQUESTS_LIST);
export const deleteCollectionRequestsById =
  createAsyncAction(actionTypes.DELETE_COLLECTION_REQUESTS_BY_ID);
export const updateCollectionRequestsStatusById =
  createAsyncAction(actionTypes.UPDATE_COLLECTION_REQUESTS_STATUS);

export const setCollectionRequestsList2State =
  createAsyncAction(actionTypes.SET_COLLECTION_REQUESTS_LIST2STATE);
export const setCollectionRequestsDetails2State =
  createAsyncAction(actionTypes.SET_COLLECTION_REQUESTS_DETAILS2STATE);
export const clearCollectionRequestsDetails2State =
  createAsyncAction(actionTypes.CLEAR_COLLECTION_REQUESTS_DETAIL2STATE);

export const putCollectionRequestsDetails2State =
  createAsyncAction(actionTypes.PUT_COLLECTION_REQUESTS_DETAIL2STATE);

export const unmountClearCollectionRequestsDetails =
  createAsyncAction(actionTypes.UNMOUNT_CLEAR_COLLECTION_REQUESTS_DETAILS);

export const putBinStatus = createAsyncAction(actionTypes.UPDATE_BIN_STATUS);
export const putBinCollectionRequestStatus =
    createAsyncAction(actionTypes.UPDATE_BIN_COLLECTION_REQUEST_STATUS);
