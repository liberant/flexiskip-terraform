import { call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { request } from '../../../common/helpers';
import * as actionTypes from './constants/actionTypes';
import { setSuccess } from '../../../common/actions';
import { weekdayMap } from '../constants/enum';

function* updateDumpsite(action) {
  const { resolve, reject, payload } = action;
  // convert from data to api request
  const openDays = payload.openDays
    .map((d, index) => ({ ...d, weekDay: weekdayMap[index] }))
    .filter(d => d.isOpen);
  const data = {
    ...payload,
    openDays,
  };

  try {
    const response = yield call(request, {
      url: `admin/dumpsites/${data._id}`,
      method: 'put',
      requestName: 'updateDumpsite',
      data,
    });
    yield put(push(`/admin/dumpsites/${data._id}/view`));
    yield put(setSuccess('Data has been updated successfully.'));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

export default function* saga() {
  yield takeLatest(actionTypes.UPDATE_DUMPSITE, updateDumpsite);
}
