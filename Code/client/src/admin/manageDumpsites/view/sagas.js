import { call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { request } from '../../../common/helpers';
import * as actionTypes from './constants/actionTypes';
import * as actions from './actions';
import { weekdayMap } from '../constants/enum';

function* fetchDumpsiteDetail(action) {
  const { resolve, reject, payload } = action;

  try {
    const response = yield call(request, {
      url: `admin/dumpsites/${payload}`,
      method: 'get',
      requestName: 'fetchDumpsiteDetail',
    });
    const { data } = response;

    // convert api response to form data
    const openDays = weekdayMap.map((wd) => {
      const od = data.openDays.find(d => d.weekDay === wd);
      return {
        isOpen: !!od,
        fromTime: od ? od.fromTime : '',
        toTime: od ? od.toTime : '',
      };
    });
    yield put(actions.setDumpsiteDetail({
      ...data,
      openDays,
    }));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* deleteDumpsite(action) {
  const { resolve, reject, payload: discountId } = action;

  try {
    const response = yield call(request, {
      url: `admin/dumpsites/${discountId}`,
      method: 'delete',
      requestName: 'deleteDumpsite',
    });
    yield put(push('/admin/manage-dumpsites'));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

export default function* saga() {
  yield takeLatest(actionTypes.FETCH_DUMPSITE_DETAIL, fetchDumpsiteDetail);
  yield takeLatest(actionTypes.DELETE_DUMPSITE, deleteDumpsite);
}
