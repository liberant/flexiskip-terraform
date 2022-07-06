import { call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { request } from '../../../common/helpers';
import * as actionTypes from './constants/actionTypes';
import { setSuccess } from '../../../common/actions';

function* updateCouncil(action) {
  const { resolve, reject, payload } = action;
  const data = {
    ...payload,
    status: payload.isActive ? 'Active' : 'Inactive',
  };

  try {
    const response = yield call(request, {
      url: `admin/councils/${data._id}`,
      method: 'put',
      requestName: 'updateCouncil',
      data,
    });
    yield put(push(`/admin/councils/${data._id}/view`));
    yield put(setSuccess('Data has been updated successfully.'));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

export default function* saga() {
  yield takeLatest(actionTypes.UPDATE_COUNCIL, updateCouncil);
}
