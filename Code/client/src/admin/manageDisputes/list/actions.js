import { createAsyncAction, createAction } from '../../../common/helpers';
import * as actionTypes from './constants/action-types';

export const fetchDisputes = createAsyncAction(actionTypes.FETCH_DISPUTES);
export const setState = createAction(actionTypes.SET_STATE);
