import { call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { request } from '../../../common/helpers';
import * as actionTypes from './constants/actionTypes';
import { setSuccess } from '../../../common/actions';

function* updateDispute(action) {
  const { resolve, reject, payload: dispute } = action;

  try {
    const response = yield call(request, {
      url: `admin/disputes/${dispute._id}`,
      method: 'put',
      requestName: 'updateDispute',
      data: {
        status: dispute.status,
      },
    });
    yield put(push(`/admin/disputes/${dispute._id}/view`));
    yield put(setSuccess('Data has been updated successfully.'));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

export default function* collectionRequestsSaga() {
  yield takeLatest(actionTypes.UPDATE_DISPUTE, updateDispute);
}
