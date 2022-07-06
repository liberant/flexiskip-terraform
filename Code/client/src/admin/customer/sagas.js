import { call, put, takeLatest } from 'redux-saga/effects';

import { request } from '../../common/helpers';
import { setSuccess } from '../../common/actions';
import {
  LOAD_CUSTOMER_LIST,
  LOAD_CUSTOMER_DETAIL,
  UPDATE_CUSTOMER_DETAIL,
  DELETE_CUSTOMER_RECORD,
} from './constants/actionTypes';

function* loadCustomerList(action) {
  const { resolve, reject, payload: data } = action;
  try {
    const response = yield call(request, {
      url: `admin/customers/${data.limit}/${data.page}`,
      method: 'get',
    });
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* loadCustomerDetail(action) {
  const { resolve, reject, payload: data } = action;
  try {
    const response = yield call(request, {
      url: `admin/customers/${data.id}`,
      method: 'get',
    });
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* updateCustomerDetail(action) {
  const { resolve, reject, payload: data } = action;
  try {
    const response = yield call(request, {
      url: `admin/customers/${data.id}`,
      method: 'put',
      data: data.details,
    });
    yield put(setSuccess('Update the customer details successfully!'));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* deleteCustomerRecord(action) {
  const { resolve, reject, payload: data } = action;
  try {
    const response = yield call(request, {
      url: `admin/customers/${data.id}`,
      method: 'delete',
    });
    yield put(setSuccess('Delete the current customer record successfully!'));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

export default function* profileSaga() {
  yield takeLatest(LOAD_CUSTOMER_LIST, loadCustomerList);
  yield takeLatest(LOAD_CUSTOMER_DETAIL, loadCustomerDetail);
  yield takeLatest(UPDATE_CUSTOMER_DETAIL, updateCustomerDetail);
  yield takeLatest(DELETE_CUSTOMER_RECORD, deleteCustomerRecord);
}
