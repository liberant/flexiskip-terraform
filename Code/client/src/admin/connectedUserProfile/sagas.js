import { takeLatest, put, call, select } from 'redux-saga/effects';
import { getFormValues, stopSubmit } from 'redux-form';
import * as actions from './actions';
import { request } from '../../common/helpers';
import {
  GET_USER_PROFILE,
  SUBMIT_USER_PROFILE,
} from './constants/actionTypes';
import { USER_PROFILE_FORM } from './constants';

/* eslint prefer-destructuring: 0 */

export function* executeGetUserProfile(action) {
  const { payload } = action;
  try {
    yield put(actions.getUserProfileStart());
    const response = yield call(request, {
      url: `admin/users/${payload}`,
      method: 'get',
    });
    yield put(actions.getUserProfileSuccessed(response.data));
  } catch (error) {
    yield put(actions.getUserProfileFailed(error));
  }
}

export function* executeSubmitUser(action) {
  const { payload } = action;
  try {
    const formData = yield select(getFormValues(USER_PROFILE_FORM));
    let tmpPhone = '';
    if (formData.phone) {
      tmpPhone = formData.phone.replace(/[^\d]/g, '');
    }
    yield put(actions.submitUserProfileStart());
    const response = yield call(request, {
      url: `admin/bus-customers/connected-user/${payload}`,
      method: 'put',
      data: { ...formData, phone: tmpPhone },
    });

    yield put(actions.submitUserProfileSuccessed(response.data));
    yield put(actions.toggleEditMode());
    yield put(actions.getUserProfileSuccessed(response.data));
  } catch (error) {
    const {
      response: {
        data: {
          errors,
        },
      },
    } = error;
    yield put(actions.submitUserProfileFailed(error));

    const asynFormError = {};
    Object.keys(errors).forEach((errorKey) => {
      asynFormError[errorKey] = errors[errorKey][0];
    });
    yield put(stopSubmit(USER_PROFILE_FORM, asynFormError));
  }
}

export default function* watchFetchData() {
  yield takeLatest(GET_USER_PROFILE, executeGetUserProfile);
  yield takeLatest(SUBMIT_USER_PROFILE, executeSubmitUser);
}

