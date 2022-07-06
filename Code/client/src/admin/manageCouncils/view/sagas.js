import { call, put, takeLatest, select } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { request, buildQueryString } from '../../../common/helpers';
import * as actionTypes from './constants/actionTypes';
import * as actions from './actions';

function* fetchCouncilDetail(action) {
  const { resolve, reject, payload } = action;

  try {
    const response = yield call(request, {
      url: `admin/councils/${payload}`,
      method: 'get',
      requestName: 'fetchCouncilDetail',
    });

    yield put(actions.setCouncilDetail(response.data));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* deleteCouncil(action) {
  const { resolve, reject, payload: discountId } = action;

  try {
    const response = yield call(request, {
      url: `admin/councils/${discountId}`,
      method: 'delete',
      requestName: 'deleteCouncil',
    });
    yield put(push('/admin/manage-councils'));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* fetchDumpsites(action) {
  const { resolve, reject, payload } = action;
  const { pagination, search } = yield select(state => state.admin.councils.view);
  const { current: page, pageSize: limit } = pagination;
  try {
    const response = yield call(request, {
      url: `admin/dumpsites?${buildQueryString({
        council: payload, page, limit, s: search,
      })}`,
      method: 'get',
      requestName: 'fetchDumpsites',
    });
    const newPag = { ...pagination };
    newPag.total = parseInt(response.headers['x-pagination-total-count'], 10);
    yield put(actions.setDumpsiteListState({
      dumpsites: response.data,
      pagination: newPag,
    }));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

export default function* saga() {
  yield takeLatest(actionTypes.FETCH_COUNCIL_DETAIL, fetchCouncilDetail);
  yield takeLatest(actionTypes.DELETE_COUNCIL, deleteCouncil);
  yield takeLatest(actionTypes.FETCH_DUMPSITES, fetchDumpsites);
}
