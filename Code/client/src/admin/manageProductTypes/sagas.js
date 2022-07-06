import { call, put, takeEvery } from 'redux-saga/effects';

import { request } from '../../common/helpers';
import { setSuccess } from '../../common/actions';

import {
  GET_WASTE_TYPE_LIST,
  UPDATE_WASTE_TYPE_IMAGE,
} from './constants/actionTypes';

import { putWasteTypeList2State } from './actions';

function* getWasteTypeList(action) {
  const { resolve, reject } = action;

  try {
    const response = yield call(request, {
      url: '/admin/waste-types',
      method: 'get',
      requestName: 'wasteTypeList',
    });
    yield put(putWasteTypeList2State(response));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* updateProductTypeImage(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `admin/waste-types/${payload.uid}/image`,
      data: payload.data,
      method: 'put',
    });
    yield put(setSuccess('Product Type image has been updated successfully'));

    resolve(response);
  } catch (error) {
    reject(error);
  }
}

export default function* productsSaga() {
  yield takeEvery(GET_WASTE_TYPE_LIST, getWasteTypeList);
  yield takeEvery(UPDATE_WASTE_TYPE_IMAGE, updateProductTypeImage);
}
