import { createAsyncAction } from '../../common/helpers';
import {
  LOAD_CUSTOMER_LIST,
  LOAD_CUSTOMER_DETAIL,
  UPDATE_CUSTOMER_DETAIL,
  DELETE_CUSTOMER_RECORD,
} from './constants/actionTypes';

export const loadCustomerList = createAsyncAction(LOAD_CUSTOMER_LIST);
export const loadCustomerDetail = createAsyncAction(LOAD_CUSTOMER_DETAIL);
export const updateCustomerDetail = createAsyncAction(UPDATE_CUSTOMER_DETAIL);
export const deleteCustomerDetail = createAsyncAction(DELETE_CUSTOMER_RECORD);
