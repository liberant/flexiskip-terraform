import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import moment from 'moment';

import { getHttpErrorMessages } from '../../common/utils/common';
import { request } from '../../common/helpers';

import {
  GET_DASHBOARD_SUMMARY,
  GET_DASHBOARD_REVENUE,
} from './constants/actionTypes';

import {
  putDashboardSummary2State,
  putDashboardRevenue2State,
} from './actions';

function* getDashboardSummary(action) {
  const { resolve, reject } = action;

  try {
    const response = yield call(request, {
      url: 'contractor/dashboard/summary',
      method: 'get',
      requestName: 'summaryData',
    });
    yield put(putDashboardSummary2State(response));
    resolve(response);
  } catch (error) {
    const errorMessages = getHttpErrorMessages(error);

    if (errorMessages) {
      reject({ message: errorMessages });
    } else {
      reject(error);
    }
  }
}

function* getDashboardRevenue(action) {
  const { resolve, reject, payload } = action;
  const from = (payload && payload.from) ? payload.from : moment.utc(moment().subtract(5, 'months').startOf('month')).local().format('YYYY-MM-DD');
  const to = (payload && payload.to) ? payload.to : moment.utc(moment().endOf('month')).local().format('YYYY-MM-DD');

  try {
    const response = yield call(request, {
      url: `contractor/dashboard/revenue?from=${from}&to=${to}`,
      method: 'get',
      requestName: 'revenueData',
    });
    yield put(putDashboardRevenue2State(response));
    resolve(response);
  } catch (error) {
    const errorMessages = getHttpErrorMessages(error);

    if (errorMessages) {
      reject({ message: errorMessages });
    } else {
      reject(error);
    }
  }
}


export default function* dashboardSaga() {
  yield takeLatest(GET_DASHBOARD_SUMMARY, getDashboardSummary);
  yield takeEvery(GET_DASHBOARD_REVENUE, getDashboardRevenue);
}
