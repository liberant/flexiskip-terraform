import { createAsyncAction, createAction } from '../../common/helpers';
import {
  GET_CUSTOMERS_LIST,
  GET_CUSTOMER_DETAILS_BY_ID,
  UPDATE_CUSTOMER_DETAILS,
  DELETE_CUSTOMERS_LIST,
  DELETE_CUSTOMER_BY_ID,
  SET_CUSTOMERS_LIST2STATE,
  SET_CUSTOMER_DETAILS2STATE,
  CLEAR_CUSTOMER_DETAILS2STATE,
  UPDATE_CUSTOMER_STATUS,
  UPDATE_CUSTOMERS_STATUS,
  ADD_NEW_CUSTOMER,

  GET_COUNCIL_LIST,
  SET_COUNCIL_LIST2STATE,

  UNMOUNT_CLEAR_CUSTOMER_DETAILS,
  ADM_RESET_CUSTOMER_PASSWORD,
  SET_CONTRACTOR_LIST2STATE,
  SET_TAB,
  SET_BUSINESS_CUSTOMER_LIST2STATE,

  GET_USER_TRANSACTION_HISTORY,
  SET_USER_TRANSACTION_HISTORY_LOADING,
  SET_USER_TRANSACTION_HISTORY,

  CREATE_NEW_CONNECTED_USER,
  CREATE_NEW_CONNECTED_USER_START,
  CREATE_NEW_CONNECTED_USER_COMPLETED,
  CREATE_NEW_CONNECTED_USER_FAILED,
  CLEAR_CREATE_NEW_CONNECTED_USER,
} from './constants/actionTypes';

export const getCustomersList = createAsyncAction(GET_CUSTOMERS_LIST);
export const getCustomerDetailsById = createAsyncAction(GET_CUSTOMER_DETAILS_BY_ID);
export const updateCustomerDetailsById = createAsyncAction(UPDATE_CUSTOMER_DETAILS);
export const deleteCustomersList = createAsyncAction(DELETE_CUSTOMERS_LIST);
export const deleteCustomerById = createAsyncAction(DELETE_CUSTOMER_BY_ID);
export const updateCustomerStatusById = createAsyncAction(UPDATE_CUSTOMER_STATUS);
export const getCouncilList = createAsyncAction(GET_COUNCIL_LIST);
export const setCouncilList2State = createAsyncAction(SET_COUNCIL_LIST2STATE);

export const setCustomersList2State = createAsyncAction(SET_CUSTOMERS_LIST2STATE);
export const setCustomerDetails2State = createAsyncAction(SET_CUSTOMER_DETAILS2STATE);
export const clearCustomerDetails2State = createAsyncAction(CLEAR_CUSTOMER_DETAILS2STATE);

export const updateCustomersStatus = createAsyncAction(UPDATE_CUSTOMERS_STATUS);

export const createNewCustomer = createAsyncAction(ADD_NEW_CUSTOMER);

export const unmountClearCustomerDetails = createAsyncAction(UNMOUNT_CLEAR_CUSTOMER_DETAILS);
export const resetCustomerPasswordByAdmin = createAsyncAction(ADM_RESET_CUSTOMER_PASSWORD);

export const setContractorList2State = createAsyncAction(SET_CONTRACTOR_LIST2STATE);
export const setTab = createAction(SET_TAB);

export const getUserTransactionHistory = createAsyncAction(GET_USER_TRANSACTION_HISTORY);
export const setUserTransactionHistoryLoading =
  createAsyncAction(SET_USER_TRANSACTION_HISTORY_LOADING);
export const setUserTransactionHistory = createAsyncAction(SET_USER_TRANSACTION_HISTORY);

export const createNewConnectedUser = createAsyncAction(CREATE_NEW_CONNECTED_USER);
export const createNewConnectedUserStart = createAsyncAction(CREATE_NEW_CONNECTED_USER_START);
export const createNewConnectedUserCompleted =
  createAsyncAction(CREATE_NEW_CONNECTED_USER_COMPLETED);
export const createNewConnectedUserFailed = createAsyncAction(CREATE_NEW_CONNECTED_USER_FAILED);
export const clearCreateNewConnectedUser = createAsyncAction(CLEAR_CREATE_NEW_CONNECTED_USER);
