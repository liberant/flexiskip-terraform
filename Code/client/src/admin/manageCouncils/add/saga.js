import { call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { request } from '../../../common/helpers';
import * as actionTypes from './constants/actionTypes';
import { setSuccess } from '../../../common/actions';

function* addCouncil(action) {
  const { resolve, reject, payload } = action;
  const data = {
    ...payload,
    status: payload.isActive ? 'Active' : 'Inactive',
  };
  // submit data to server
  try {
    const response = yield call(request, {
      url: 'admin/councils',
      method: 'post',
      requestName: 'addCouncil',
      data,
    });
    yield put(push('/admin/manage-councils'));
    yield put(setSuccess('Data has been saved successfully.'));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

export default function* saga() {
  yield takeLatest(actionTypes.ADD_COUNCIL, addCouncil);
}
