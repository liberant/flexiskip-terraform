import { call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { request } from '../../../common/helpers';
import * as actionTypes from './constants/actionTypes';
import { setSuccess } from '../../../common/actions';

function* addDiscount(action) {
  const { resolve, reject, payload } = action;

  try {
    const response = yield call(request, {
      url: 'admin/coupons',
      method: 'post',
      requestName: 'addDiscount',
      data: payload,
    });
    yield put(push('/admin/manage-discounts'));
    yield put(setSuccess('Data has been saved successfully.'));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

export default function* saga() {
  yield takeLatest(actionTypes.ADD_DISCOUNT, addDiscount);
}
