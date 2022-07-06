import { createAsyncAction } from '../../common/helpers';
import * as actionTypes from './constants/actionTypes';

export const getManageTransactionsList =
  createAsyncAction(actionTypes.GET_MANAGE_TRANSACTIONS_LIST);
export const getManageTransactionsDetailsById =
  createAsyncAction(actionTypes.GET_MANAGE_TRANSACTIONS_DETAILS_BY_ID);
export const updateManageTransactionsDetails =
  createAsyncAction(actionTypes.UPDATE_MANAGE_TRANSACTIONS_DETAILS);
export const deleteManageTransactionsList =
  createAsyncAction(actionTypes.DELETE_MANAGE_TRANSACTIONS_LIST);
export const deleteManageTransactionsById =
  createAsyncAction(actionTypes.DELETE_MANAGE_TRANSACTIONS_BY_ID);
export const updateManageTransactionsStatusById =
  createAsyncAction(actionTypes.UPDATE_MANAGE_TRANSACTIONS_STATUS);

export const setManageTransactionsList2State =
  createAsyncAction(actionTypes.SET_MANAGE_TRANSACTIONS_LIST2STATE);
export const setManageTransactionsDetails2State =
  createAsyncAction(actionTypes.SET_MANAGE_TRANSACTIONS_DETAILS2STATE);
export const clearManageTransactionsDetails2State =
  createAsyncAction(actionTypes.CLEAR_MANAGE_TRANSACTIONS_DETAIL2STATE);

export const putManageTransactionsDetails2State =
  createAsyncAction(actionTypes.PUT_MANAGE_TRANSACTIONS_DETAIL2STATE);

export const unmountClearManageTransactionsDetails =
  createAsyncAction(actionTypes.UNMOUNT_CLEAR_MANAGE_TRANSACTIONS_DETAILS);

