import { createAsyncAction, createAction } from '../../../common/helpers';
import * as actionTypes from './constants/actionTypes';

export const fetchCouncilDetail = createAsyncAction(actionTypes.FETCH_COUNCIL_DETAIL);
export const setCouncilDetail = createAction(actionTypes.SET_COUNCIL_DETAIL);
export const deleteCouncil = createAsyncAction(actionTypes.DELETE_COUNCIL);
export const fetchDumpsites = createAsyncAction(actionTypes.FETCH_DUMPSITES);
export const setDumpsiteListState = createAction(actionTypes.SET_DUMPSITE_LIST_STATE);
