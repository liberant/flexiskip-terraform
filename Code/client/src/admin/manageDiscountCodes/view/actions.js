import { createAsyncAction, createAction } from '../../../common/helpers';
import * as actionTypes from './constants/actionTypes';

export const fetchDiscountDetail = createAsyncAction(actionTypes.FETCH_DISCOUNT_DETAIL);
export const setDiscountDetail = createAction(actionTypes.SET_DISCOUNT_DETAIL);
export const deleteDiscount = createAsyncAction(actionTypes.DELETE_DISCOUNT);
