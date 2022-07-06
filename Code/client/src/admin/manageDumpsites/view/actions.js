import { createAsyncAction, createAction } from '../../../common/helpers';
import * as actionTypes from './constants/actionTypes';

export const fetchDumpsiteDetail = createAsyncAction(actionTypes.FETCH_DUMPSITE_DETAIL);
export const setDumpsiteDetail = createAction(actionTypes.SET_DUMPSITE_DETAIL);
export const deleteDumpsite = createAsyncAction(actionTypes.DELETE_DUMPSITE);
