import { createAsyncAction, createAction } from '../../common/helpers';
import * as actionTypes from './constants/action-types';

export const fetchItems = createAsyncAction(actionTypes.FETCH_ITEMS);
export const setState = createAction(actionTypes.SET_STATE);
