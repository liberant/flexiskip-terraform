import { call, put, takeLatest } from 'redux-saga/effects';

import { request } from '../../common/helpers';
import { saveIdentity } from '../../common/actions';
import { LOGIN } from './constants/actionTypes';
import { UserTypeEnum } from '../../common/constants/routesConfig';

function* login(action) {
  const { payload, resolve, reject } = action;
  try {
    const response = yield call(request, {
      url: '/contractor/account/sessions',
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

export default function* loginSaga() {
  yield takeLatest(LOGIN, login);
}
