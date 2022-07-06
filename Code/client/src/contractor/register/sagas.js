import { call, put, takeLatest } from 'redux-saga/effects';

import { request } from '../../common/helpers';
import { saveIdentity } from '../../common/actions';
import { REGISTER } from './constants/actionTypes';
import { UserTypeEnum } from '../../common/constants/routesConfig';

function* register(action) {
  const { payload, resolve, reject } = action;
  try {
    const response = yield call(request, {
      url: '/contractor/account/registrations',
      method: 'post',
      data: payload,
    });

    yield put(saveIdentity({
      ...response.data,
      isLoggedIn: true,
      userType: UserTypeEnum.CONTRACTOR,
    }));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

export default function* registerSaga() {
  yield takeLatest(REGISTER, register);
}
