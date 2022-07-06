import { createAsyncAction, createAction } from '../../../common/helpers';
import * as actionTypes from './constants/actionTypes';

export const fetchDisputeDetail = createAsyncAction(actionTypes.FETCH_DISPUTE_DETAIL);
export const setDisputeDetail = createAction(actionTypes.SET_DISPUTE_DETAIL);
export const addDisputeNote = createAsyncAction(actionTypes.ADD_DISPUTE_NOTE);
export const fetchDisputeNotes = createAsyncAction(actionTypes.FETCH_DISPUTE_NOTES);
export const setNoteState = createAsyncAction(actionTypes.SET_NOTE_STATE);
export const deleteDisputeNote = createAsyncAction(actionTypes.DELETE_DISPUTE_NOTE);
export const updateDisputeNote = createAsyncAction(actionTypes.UPDATE_DISPUTE_NOTE);
