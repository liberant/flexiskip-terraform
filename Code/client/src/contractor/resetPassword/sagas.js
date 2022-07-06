import { call, put, takeLatest } from 'redux-saga/effects';

import { request } from '../../common/helpers';
// import { setSuccess } from '../../common/actions';
import { saveIdentity } from '../../common/actions';
import { UserTypeEnum } from '../../common/constants/routesConfig';


import { CONTRACTOR_RESET_PASSWORD, CONTRACTOR_UPDATE_PASSWORD } from './constants/actionTypes';

function* resetContractorPassword(action) {
  const { payload, resolve, reject } = action;
  try {
    const response = yield call(request, {
      url: '/contractor/account/password-reset/requests',
      method: 'post',
      data: payload,
    });

    // yield put(setSuccess('Your password has been reset successfully, please check your email!'));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* updateContractorPassword(action) {
  const { payload, resolve, reject } = action;
  try {
    const response = yield call(request, {
      url: '/contractor/account/password',
      method: 'put',
      data: payload,
    });

    // yield put(setSuccess('Your password has been reset successfully, please Sign In!'));
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


export default function* resetPasswordSaga() {
  yield takeLatest(CONTRACTOR_UPDATE_PASSWORD, updateContractorPassword);
  yield takeLatest(CONTRACTOR_RESET_PASSWORD, resetContractorPassword);
}
