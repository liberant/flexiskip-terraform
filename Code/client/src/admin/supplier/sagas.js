import { call, put, takeLatest } from 'redux-saga/effects';

import { request } from '../../common/helpers';
import { setSuccess } from '../../common/actions';
import {
  GET_SUPPLIERS,
} from './constants/actionTypes';

import {setSuppliers} from './actions';


function* getSupplersList(action) {
  const { resolve, reject } = action;
  try {
    const response = yield call(request, {
      url: `admin/organisations`,
      method: 'get',
    });
    yield put(setSuppliers(response));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

export default function* supplierSaga() {
  yield takeLatest(GET_SUPPLIERS, getSupplersList);
}
