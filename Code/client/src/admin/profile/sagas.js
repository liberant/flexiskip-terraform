import { call, put, takeLatest } from 'redux-saga/effects';

import { request } from '../../common/helpers';
import { setSuccess } from '../../common/actions';
import { LOAD_PROFILE, SAVE_PROFILE } from './constants/actionTypes';

function* loadProfile(action) {
  const { resolve, reject } = action;
  try {
    const response = yield call(request, {
      url: 'admin/account/profile',
      method: 'get',
      requestName: 'loadProfile',
    });
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* saveProfile(action) {
  const { resolve, reject, payload: data } = action;
  try {
    const response = yield call(request, {
      url: 'admin/account/profile',
      method: 'put',
      data,
    });
    yield put(setSuccess('Your profile has been updated successfully'));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

export default function* profileSaga() {
  yield takeLatest(LOAD_PROFILE, loadProfile);
  yield takeLatest(SAVE_PROFILE, saveProfile);
}
