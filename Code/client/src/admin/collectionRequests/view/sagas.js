import { call, put, takeLatest } from 'redux-saga/effects';
import { request } from '../../../common/helpers';
import * as actionTypes from './constants/actionTypes';
import * as actions from './actions';

function* getCollectionRequestDetail(action) {
  const { resolve, reject, payload } = action;

  try {
    const response = yield call(request, {
      url: `admin/collection-requests/${payload}`,
      method: 'get',
      requestName: 'fetchCollectionRequest',
    });
    yield put(actions.setItem(response.data));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

export default function* collectionRequestsSaga() {
  yield takeLatest(actionTypes.FETCH_ITEM, getCollectionRequestDetail);
}
