import { call, put, takeLatest } from 'redux-saga/effects';

import { request } from '../../common/helpers';
import { setSuccess } from '../../common/actions';

import { RESET_PASSWORD, UPDATE_PASSWORD } from './constants/actionTypes';

function* resetPassword(action) {
  const { payload, resolve, reject } = action;
  try {
    const response = yield call(request, {
      url: '/admin/account/password-reset/requests',
      method: 'post',
      data: payload,
    });

    // yield put(setSuccess('Your password has been reset successfully, please check your email!'));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* updatePassword(action) {
  const { payload, resolve, reject } = action;
  try {
    const response = yield call(request, {
      url: '/admin/account/password',
      method: 'put',
      data: payload,
    });

    // yield put(setSuccess('Your password has been reset successfully, please Sign In!'));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}


export default function* resetPasswordSaga() {
  yield takeLatest(UPDATE_PASSWORD, updatePassword);
  yield takeLatest(RESET_PASSWORD, resetPassword);
}
