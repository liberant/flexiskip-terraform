import { createAsyncAction } from '../../common/helpers';
import * as actionTypes from './constants/actionTypes';

export const getProductRequestsList =
  createAsyncAction(actionTypes.GET_PRODUCT_REQUESTS_LIST);
export const getProductRequestsDetailsById =
  createAsyncAction(actionTypes.GET_PRODUCT_REQUESTS_DETAILS_BY_ID);
export const updateProductRequestsDetails =
  createAsyncAction(actionTypes.UPDATE_PRODUCT_REQUESTS_DETAILS);
export const deleteProductRequestsList =
  createAsyncAction(actionTypes.DELETE_PRODUCT_REQUESTS_LIST);
export const deleteProductRequestsById =
  createAsyncAction(actionTypes.DELETE_PRODUCT_REQUESTS_BY_ID);
export const updateBinDeliveryStatusById =
  createAsyncAction(actionTypes.UPDATE_PRODUCT_REQUESTS_STATUS);

export const setProductRequestsList2State =
  createAsyncAction(actionTypes.SET_PRODUCT_REQUESTS_LIST2STATE);
export const setProductRequestsDetails2State =
  createAsyncAction(actionTypes.SET_PRODUCT_REQUESTS_DETAILS2STATE);
export const clearProductRequestsDetails2State =
  createAsyncAction(actionTypes.CLEAR_PRODUCT_REQUESTS_DETAIL2STATE);

export const putProductRequestsDetails2State =
  createAsyncAction(actionTypes.PUT_PRODUCT_REQUESTS_DETAIL2STATE);

export const unmountClearProductRequestsDetails =
  createAsyncAction(actionTypes.UNMOUNT_CLEAR_PRODUCT_REQUESTS_DETAILS);

export const changeCurrentTab =
  createAsyncAction(actionTypes.CHANGE_CURRENT_TAB);
export const changePerPage =
  createAsyncAction(actionTypes.CHANGE_PER_PAGE);

export const updateSearchValue =
  createAsyncAction(actionTypes.UPDATE_SEARCH_VALUE);
export const updateLocationKey =
  createAsyncAction(actionTypes.UPDATE_LOCATION_KEY);
export const changeViewMode =
  createAsyncAction(actionTypes.CHANGE_VIEW_MODE);
export const updateProductRequestDeliveryStatus =
  createAsyncAction(actionTypes.UPDATE_PRODUCT_REQUESTS_DELIVERY_STATUS);
export const updateFilterState =
  createAsyncAction(actionTypes.UPDATE_FILTER_STATE);

/**
 * Create product request
 */
export const updateProductRequestDraft =
  createAsyncAction(actionTypes.UPDATE_PRODUCT_REQUEST_DRAFT);
export const updateProductRequestDraftSuccess =
  createAsyncAction(actionTypes.UPDATE_PRODUCT_REQUEST_DRAFT_SUCCESS);
export const createProductRequest =
  createAsyncAction(actionTypes.CREATE_PRODUCT_REQUEST);
export const createProductRequestSuccess =
  createAsyncAction(actionTypes.CREATE_PRODUCT_REQUEST_SUCCESS);
export const createProductRequestFailure =
  createAsyncAction(actionTypes.CREATE_PRODUCT_REQUEST_FAILURE);


/**
 * create import product actions
 */
/**
 * Submit Profile
 */
export const importProductOrder = createAsyncAction(actionTypes.IMPORT_PRODUCT_ORDER);
export const importProductOrderStart =
  createAsyncAction(actionTypes.IMPORT_PRODUCT_ORDER_REQUESTING);
export const importProductOrderSuccessed =
  createAsyncAction(actionTypes.IMPORT_PRODUCT_ORDER_SUCCESSED);
export const importProductOrderFailed =
  createAsyncAction(actionTypes.IMPORT_PRODUCT_ORDER_FAILED);

/**
 * Download QR Code
 */
export const downloadQRCode = createAsyncAction(actionTypes.DOWNLOAD_QR_CODE);
export const downloadQRCodeStart = createAsyncAction(actionTypes.DOWNLOAD_QR_CODE_REQUESTING);
export const downloadQRCodeSuccessed = createAsyncAction(actionTypes.DOWNLOAD_QR_CODE_SUCCESSED);
export const downloadQRCodeFailed = createAsyncAction(actionTypes.DOWNLOAD_QR_CODE_FAILED);

/**
 * Product Request notes
 */
export const addBinRequestNote = createAsyncAction(actionTypes.ADD_PRODUCT_REQUEST_NOTE);
export const fetchBinRequestNotes = createAsyncAction(actionTypes.FETCH_PRODUCT_REQUEST_NOTES);
export const setNoteState = createAsyncAction(actionTypes.SET_PRODUCT_REQUEST_NOTE_STATE);
export const deleteBinRequestNote = createAsyncAction(actionTypes.DELETE_PRODUCT_REQUEST_NOTE);
export const updateBinRequestNote = createAsyncAction(actionTypes.UPDATE_PRODUCT_REQUEST_NOTE);
