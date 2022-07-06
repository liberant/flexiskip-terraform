import { call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { request } from '../../../common/helpers';
import * as actionTypes from './constants/actionTypes';
import { setSuccess } from '../../../common/actions';

function* updateDiscount(action) {
  const { resolve, reject, payload: dispute } = action;

  try {
    const response = yield call(request, {
      url: `admin/coupons/${dispute._id}`,
      method: 'put',
      requestName: 'updateDiscount',
      data: dispute,
    });
    yield put(push(`/admin/discounts/${dispute._id}/view`));
    yield put(setSuccess('Data has been updated successfully.'));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

export default function* saga() {
  yield takeLatest(actionTypes.UPDATE_DISCOUNT, updateDiscount);
}
