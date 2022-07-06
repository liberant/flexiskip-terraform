import { call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { request } from '../../../common/helpers';
import * as actionTypes from './constants/actionTypes';
import { setSuccess } from '../../../common/actions';
import { weekdayMap } from '../constants/enum';

function* addDumpsite(action) {
  const { resolve, reject, payload } = action;
  // convert from data to api request
  const openDays = payload.openDays
    .map((d, index) => ({ ...d, weekDay: weekdayMap[index] }))
    .filter(d => d.isOpen);
  const data = {
    ...payload,
    openDays,
  };

  // submit data to server
  try {
    const response = yield call(request, {
      url: 'admin/dumpsites',
      method: 'post',
      requestName: 'addDumpsite',
      data,
    });
    yield put(push('/admin/manage-dumpsites'));
    yield put(setSuccess('Data has been saved successfully.'));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

export default function* saga() {
  yield takeLatest(actionTypes.ADD_DUMPSITE, addDumpsite);
}
