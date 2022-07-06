import { createAsyncAction } from '../../../common/helpers';
import {
  GET_DISCOUNTS_LIST,
  GET_DISCOUNT_DETAILS_BY_ID,
  UPDATE_DISCOUNT_DETAILS,
  DELETE_DISCOUNTS_LIST,
  DELETE_DISCOUNT_BY_ID,
  SET_DISCOUNTS_LIST2STATE,
  SET_DISCOUNT_DETAILS2STATE,
  UPDATE_DISCOUNT_STATUS,
  CREATE_DISCOUNT,
  PUT_DISCOUNT_DETAIL2STATE,
  CLEAR_CUSTOMER_DETAIL2STATE,
  UNMOUNT_CLEAR_DISCOUNT_DETAILS,
  GET_DISCOUNT_REGIONS_DEFINATIONS,
  PUT_DISCOUNT_REGIONS_DEFINATIONS,
  GET_DISCOUNT_PRODUCTS_LIST,
  SET_DISCOUNT_PRODUCTS_LIST2STATE,
} from './constants/actionTypes';

export const getDiscountsList = createAsyncAction(GET_DISCOUNTS_LIST);
export const getDiscountDetailsById = createAsyncAction(GET_DISCOUNT_DETAILS_BY_ID);
export const updateDiscountDetails = createAsyncAction(UPDATE_DISCOUNT_DETAILS);
export const deleteDiscountsList = createAsyncAction(DELETE_DISCOUNTS_LIST);
export const deleteDiscountById = createAsyncAction(DELETE_DISCOUNT_BY_ID);
export const updateDiscountStatus = createAsyncAction(UPDATE_DISCOUNT_STATUS);

export const setDiscountsList2State = createAsyncAction(SET_DISCOUNTS_LIST2STATE);
export const setDiscountDetails2State = createAsyncAction(SET_DISCOUNT_DETAILS2STATE);
export const clearDiscountDetails2State = createAsyncAction(CLEAR_CUSTOMER_DETAIL2STATE);

export const createDiscount = createAsyncAction(CREATE_DISCOUNT);
export const putDiscountDetails2State = createAsyncAction(PUT_DISCOUNT_DETAIL2STATE);

export const unmountClearDiscountDetails = createAsyncAction(UNMOUNT_CLEAR_DISCOUNT_DETAILS);

export const getDiscountRegionDefinations = createAsyncAction(GET_DISCOUNT_REGIONS_DEFINATIONS);
export const putDiscountRegionDefinations2State
  = createAsyncAction(PUT_DISCOUNT_REGIONS_DEFINATIONS);

export const getDiscountProductsList = createAsyncAction(GET_DISCOUNT_PRODUCTS_LIST);
export const putDiscountProductsList2State = createAsyncAction(SET_DISCOUNT_PRODUCTS_LIST2STATE);
