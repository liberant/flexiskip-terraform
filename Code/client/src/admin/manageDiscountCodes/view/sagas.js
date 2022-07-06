import { call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { request } from '../../../common/helpers';
import * as actionTypes from './constants/actionTypes';
import * as actions from './actions';

function* fetchDiscountDetail(action) {
  const { resolve, reject, payload } = action;

  try {
    const response = yield call(request, {
      url: `admin/coupons/${payload}`,
      method: 'get',
      requestName: 'fetchDiscountDetail',
    });
    yield put(actions.setDiscountDetail(response.data));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* deleteDiscount(action) {
  const { resolve, reject, payload: discountId } = action;

  try {
    const response = yield call(request, {
      url: `admin/coupons/${discountId}`,
      method: 'delete',
      requestName: 'deleteDiscount',
    });
    yield put(push('/admin/manage-discounts'));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

export default function* saga() {
  yield takeLatest(actionTypes.FETCH_DISCOUNT_DETAIL, fetchDiscountDetail);
  yield takeLatest(actionTypes.DELETE_DISCOUNT, deleteDiscount);
}
