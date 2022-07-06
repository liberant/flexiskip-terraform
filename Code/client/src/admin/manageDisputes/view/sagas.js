import { call, put, takeLatest, select } from 'redux-saga/effects';
import { request, buildQueryString } from '../../../common/helpers';
import { setSuccess } from '../../../common/actions';
import * as actionTypes from './constants/actionTypes';
import * as actions from './actions';

function* fetchDisputeDetail(action) {
  const { resolve, reject, payload } = action;

  try {
    const response = yield call(request, {
      url: `admin/disputes/${payload}`,
      method: 'get',
      requestName: 'fetchDisputeDetail',
    });
    yield put(actions.setDisputeDetail(response.data));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* addDisputeNote(action) {
  const { resolve, reject, payload } = action;
  const disputeId = payload.dispute;
  try {
    const response = yield call(request, {
      url: `admin/disputes/${disputeId}/notes`,
      method: 'post',
      data: payload,
      requestName: 'addDisputeNote',
    });
    yield put(setSuccess('Note added successfully.'));
    yield put(actions.fetchDisputeNotes(disputeId));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* fetchDisputeNotes(action) {
  const { resolve, reject, payload: disputeId } = action;
  const { notePagination } = yield select(state => state.admin.manageDisputes.view);
  const { current: page, pageSize: limit } = notePagination;
  try {
    const response = yield call(request, {
      url: `admin/disputes/${disputeId}/notes?${buildQueryString({ page, limit })}`,
      method: 'get',
      requestName: 'fetchDisputeNotes',
    });
    const newPag = { ...notePagination };
    newPag.total = parseInt(response.headers['x-pagination-total-count'], 10);
    yield put(actions.setNoteState({
      notes: response.data,
      notePagination: newPag,
    }));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* deleteDisputeNote(action) {
  const { resolve, reject, payload: note } = action;
  try {
    const response = yield call(request, {
      url: `admin/disputes/notes/${note._id}`,
      method: 'delete',
      requestName: 'deleteDisputeNote',
    });
    yield put(setSuccess('Note removed successfully.'));
    yield put(actions.fetchDisputeNotes(note.dispute));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* updateDisputeNote(action) {
  const { resolve, reject, payload: note } = action;
  try {
    const response = yield call(request, {
      url: `admin/disputes/notes/${note._id}`,
      method: 'put',
      requestName: 'updateDisputeNote',
      data: note,
    });
    yield put(setSuccess('Note updated successfully.'));
    yield put(actions.fetchDisputeNotes(note.dispute));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

export default function* DisputeDetailsSaga() {
  yield takeLatest(actionTypes.FETCH_DISPUTE_DETAIL, fetchDisputeDetail);
  yield takeLatest(actionTypes.ADD_DISPUTE_NOTE, addDisputeNote);
  yield takeLatest(actionTypes.FETCH_DISPUTE_NOTES, fetchDisputeNotes);
  yield takeLatest(actionTypes.DELETE_DISPUTE_NOTE, deleteDisputeNote);
  yield takeLatest(actionTypes.UPDATE_DISPUTE_NOTE, updateDisputeNote);
}
