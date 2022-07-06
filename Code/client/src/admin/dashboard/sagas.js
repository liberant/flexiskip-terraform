import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import moment from 'moment';

import { getHttpErrorMessages } from '../../common/utils/common';
import { request } from '../../common/helpers';
import { getEndOfDay, getStartOfDay } from '../../common/utils';
import { setSuccess, setError } from '../../common/actions';

import {
  GET_DASHBOARD_SUMMARY,
  GET_DASHBOARD_REVENUE,
  GET_DASHBOARD_RATE,
  GET_DASHBOARD_AVERAGETIME,
  GET_DASHBOARD_JOBS,
  GET_DASHBOARD_RISK,
  GET_DASHBOARD_INACTIVE,
  GET_DASHBOARD_DRIVERLIST_BY_JOBID,
  SET_DASHBOARD_JOB_DRIVER,
  EXPORT_TO_GOOGLESHEET,
} from './constants/actionTypes';

import {
  putDashboardSummary2State,
  putDashboardRevenue2State,
  putDashboardRate2State,
  putDashboardAverageTime2State,

  putDashboardJobs2State,
  putDashboardRisk2State,
  putDashboardInactive2State,
} from './actions';

function* getJobDriverList(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `admin/dashboard/jobs/${payload.jobId}/drivers`,
      method: 'get',
      requestName: 'summaryData',
    });
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

function* getDashboardSummary(action) {
  const { resolve, reject } = action;

  try {
    const response = yield call(request, {
      url: 'admin/dashboard/summary',
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
  const from = (payload && payload.from) ? payload.from : moment().subtract(5, 'months').startOf('month');
  const to = (payload && payload.to) ? payload.to : moment().endOf('month');

  try {
    const response = yield call(request, {
      url: `admin/dashboard/revenue?from=${encodeURIComponent(getStartOfDay(from))}&to=${encodeURIComponent(getEndOfDay(to))}`,
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

function* getDashboardRate(action) {
  const { resolve, reject, payload } = action;
  const from = (payload && payload.from) ? payload.from : moment().subtract(5, 'months').startOf('month');
  const to = (payload && payload.to) ? payload.to : moment().endOf('month');

  try {
    const response = yield call(request, {
      url: `admin/dashboard/rate?from=${encodeURIComponent(getStartOfDay(from))}&to=${encodeURIComponent(getEndOfDay(to))}`,
      method: 'get',
      requestName: 'rateData',
    });
    yield put(putDashboardRate2State(response));
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

function* getDashboardAverageTime(action) {
  const { resolve, reject, payload } = action;

  const from = (payload && payload.from) ? payload.from : moment().subtract(5, 'months').startOf('month');
  const to = (payload && payload.to) ? payload.to : moment().endOf('month');
  try {
    const response = yield call(request, {
      url: `admin/dashboard/map?from=${encodeURIComponent(getStartOfDay(from))}&to=${encodeURIComponent(getEndOfDay(to))}`,
      method: 'get',
      requestName: 'averageTimeData',
    });
    yield put(putDashboardAverageTime2State(response));
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

function* getDashboardJobs(action) {
  const { resolve, reject, payload } = action;

  const searchString = payload.search ? `&s=${payload.search}` : '';

  try {
    const response = yield call(request, {
      url: `admin/dashboard/jobs?limit=${payload.limit}&page=${payload.page}${searchString}`,
      method: 'get',
      requestName: 'jobList',
    });
    yield put(putDashboardJobs2State(response));
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

function* getDashboardRisk(action) {
  const { resolve, reject, payload } = action;

  const searchString = payload.search ? `&s=${payload.search}` : '';

  try {
    const response = yield call(request, {
      url: `admin/dashboard/risk?limit=${payload.limit}&page=${payload.page}${searchString}`,
      method: 'get',
      requestName: 'riskList',
    });
    yield put(putDashboardRisk2State(response));
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

function* getDashboardInactive(action) {
  const { resolve, reject, payload } = action;

  const searchString = payload.search ? `&s=${payload.search}` : '';

  try {
    const response = yield call(request, {
      url: `admin/dashboard/inactive?limit=${payload.limit}&page=${payload.page}${searchString}`,
      method: 'get',
      requestName: 'inactiveList',
    });
    yield put(putDashboardInactive2State(response));
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

function* setDashboardJobDriver(action) {
  const { resolve, reject, payload } = action;

  try {
    const response = yield call(request, {
      url: `admin/dashboard/jobs/${payload.jobId}/driver`,
      method: 'put',
      requestName: 'setDashboardJobDriver',
      data: {
        driver: payload.driver,
      },
    });
    resolve(response);
  } catch (error) {
    const errorMessages = getHttpErrorMessages(error);

    if (errorMessages) {
      reject({
        message: errorMessages,
      });
    } else {
      reject(error);
    }
  }
}

function* getExportToGoogleSheet(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `admin/reports/export-to-google-sheet`,
      method: 'get',
      requestName: 'getExportToGoogleSheet',
    });
    yield put(setSuccess(response.data.message));
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
  yield takeEvery(GET_DASHBOARD_RATE, getDashboardRate);
  yield takeEvery(GET_DASHBOARD_AVERAGETIME, getDashboardAverageTime);
  yield takeEvery(GET_DASHBOARD_JOBS, getDashboardJobs);
  yield takeEvery(GET_DASHBOARD_RISK, getDashboardRisk);
  yield takeEvery(GET_DASHBOARD_INACTIVE, getDashboardInactive);
  yield takeEvery(GET_DASHBOARD_DRIVERLIST_BY_JOBID, getJobDriverList);
  yield takeEvery(SET_DASHBOARD_JOB_DRIVER, setDashboardJobDriver);
  yield takeEvery(EXPORT_TO_GOOGLESHEET, getExportToGoogleSheet);
}
