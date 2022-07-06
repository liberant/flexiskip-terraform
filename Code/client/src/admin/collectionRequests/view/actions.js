import { createAsyncAction, createAction } from '../../../common/helpers';
import * as actionTypes from './constants/actionTypes';

export const fetchItem = createAsyncAction(actionTypes.FETCH_ITEM);
export const setItem = createAction(actionTypes.SET_ITEM);
