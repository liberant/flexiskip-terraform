import { call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import { request } from '../../common/helpers';
import { saveIdentity } from '../../common/actions';
import { LOGIN } from './constants/actionTypes';
import { UserTypeEnum } from '../../common/constants/routesConfig';
import { menuItems } from '../hoc/AdminLayout/Sidebar';

function* login(action) {
  const { payload, resolve, reject } = action;
  try {
    const response = yield call(request, {
      url: '/admin/account/sessions',
      method: 'post',
      data: payload,
    });

    yield put(saveIdentity({
      ...response.data,
      isLoggedIn: true,
      userType: UserTypeEnum.SUPERADMIN,
    }));

    const { user } = response.data;
    const menu = menuItems.find(item => user.roles.includes(item.permission));
    const redirectUrl = menu ? menu.link : '/';
    yield put(push(redirectUrl));

    resolve(response);
  } catch (error) {
    reject(error);
  }
}

export default function* loginSaga() {
  yield takeLatest(LOGIN, login);
}
