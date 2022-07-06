import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';

import { request, buildQueryString } from '../../common/helpers';
import { setSuccess, setError } from '../../common/actions';

import {
  GET_CUSTOMERS_LIST,
  GET_CUSTOMER_DETAILS_BY_ID,
  UPDATE_CUSTOMER_DETAILS,
  DELETE_CUSTOMERS_LIST,
  DELETE_CUSTOMER_BY_ID,
  UPDATE_CUSTOMER_STATUS,
  UPDATE_CUSTOMERS_STATUS,
  UNMOUNT_CLEAR_CUSTOMER_DETAILS,
  ADM_RESET_CUSTOMER_PASSWORD,
  GET_DRIVER_RATINGS_BY_ID,
  CREATE_DRIVER,

  GET_UNASSIGNED_JOBS_LIST,
  ASSIGN_JOB_2DRIVER,
} from './constants/actionTypes';

import {
  setDriversList2State, setDriverDetails2State,
  clearDriverDetails2State, setDriverRatings2State,
  setUnassignedJobs2State,
} from './actions';

function* getDriverRatingsById(action) {
  const { resolve, reject, payload } = action;

  try {
    const response = yield call(request, {
      url: `contractor/drivers/${payload.uid}/ratings`,
      method: 'get',
      requestName: 'driverRatings',
    });
    yield put(setDriverRatings2State(response));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* getDriversList(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `contractor/drivers?${buildQueryString(payload)}`,
      method: 'get',
      requestName: 'customersList',
    });
    yield put(setDriversList2State(response));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* getDriverById(action) {
  const { resolve, reject, payload } = action;

  try {
    yield put(clearDriverDetails2State());
    const response = yield call(request, {
      url: `contractor/drivers/${payload.uid}`,
      method: 'get',
      requestName: 'customerDetails',
    });
    yield put(setDriverDetails2State(response));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* updateDriverDetailsById(action) {
  const { resolve, reject, payload } = action;

  if (!payload.data) {
    return;
  }

  const { phone, ...rest } = payload.data;
  const trimPhone = phone.replace(/[^\d]/g, '');

  try {
    const response = yield call(request, {
      url: `contractor/drivers/${payload.uid}`,
      data: { phone: trimPhone, ...rest },
      method: 'put',
    });
    yield put(setSuccess('Driver details have been updated successfully'));

    getDriverById(action);
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* deleteDriversList(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `contractor/${payload.url}`,
      data: payload.data,
      method: 'delete',
    });
    yield put(setSuccess('Those drivers have been deleted successfully'));
    getDriversList({ resolve, reject, payload: { limit: 10, page: 1, url: payload.url } });
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* deleteDriverById(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `contractor/drivers/${payload.uid}`,
      method: 'delete',
    });
    yield put(setSuccess('This driver has been deleted successfully'));
    yield getDriversList({ resolve, reject, payload: { limit: 10, page: 1, url: payload.url } });
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* updateDriverStatusById(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `contractor/${payload.uid}/status`,
      method: 'put',
      data: { status: payload.status },
    });
    yield put(setSuccess('This driver status has been updated successfully! '));
    yield getDriversList({ resolve, reject, payload: { limit: 10, page: 1, url: payload.url } });
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* updateDriversStatus(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: 'contractor/drivers/status',
      method: 'put',
      data: {
        status: payload.status,
        ids: payload.ids,
      },
    });

    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* unmountClearDriverDetails(action) {
  const { reject } = action;
  try {
    yield put(clearDriverDetails2State());
  } catch (error) {
    reject(error);
  }
}

function* resetDriverPasswordByAdmin(action) {
  const { reject, resolve, payload } = action;
  try {
    const response = yield call(request, {
      url: `contractor/drivers/${payload.uid}/reset-pwd-request`,
      method: 'POST',
      requestName: 'resetDriverPassword',

    });
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* createDriver(action) {
  const { resolve, reject, payload } = action;
  if (!payload.data) {
    return;
  }

  const { phone, ...rest } = payload.data;
  const trimPhone = phone.replace(/[^\d]/g, '');
  try {
    const response = yield call(request, {
      url: 'contractor/drivers',
      method: 'post',
      data: { phone: trimPhone, ...rest },
    });
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* getUnassignedJobsList(action) {
  const {
    resolve, reject,
    payload: {
      limit, s, page,
    },
  } = action;
  const payload = { limit, s, page };
  try {
    const response = yield call(request, {
      url: `contractor/unassigned-jobs?${buildQueryString(payload)}`,
      method: 'get',
      requestName: 'unassignedJobsList',
    });

    yield put(setUnassignedJobs2State(response));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* assignJobToDriver(action) {
  const { resolve, reject, payload } = action;
  const { driverId, jobId } = payload;
  try {
    const response = yield call(request, {
      url: `contractor/unassigned-jobs/${jobId}/assign-driver`,
      method: 'post',
      requestName: 'assignedJobToDriver',
      data: { driverId },
    });

    if (response.data.result) yield put(setSuccess('Assigned job to driver successfully'));
    else yield put(setError('Failed to assign job to driver'));
    yield call(getUnassignedJobsList, action);
    resolve(response);
  } catch (error) {
    yield put(setError('Driver details have been updated failed'));
    reject(error);
  }
}

export default function* accountsSaga() {
  yield takeEvery(GET_CUSTOMERS_LIST, getDriversList);
  yield takeEvery(GET_CUSTOMER_DETAILS_BY_ID, getDriverById);
  yield takeLatest(UPDATE_CUSTOMER_DETAILS, updateDriverDetailsById);
  yield takeLatest(DELETE_CUSTOMERS_LIST, deleteDriversList);
  yield takeLatest(DELETE_CUSTOMER_BY_ID, deleteDriverById);
  yield takeLatest(UPDATE_CUSTOMER_STATUS, updateDriverStatusById);
  yield takeLatest(UPDATE_CUSTOMERS_STATUS, updateDriversStatus);
  yield takeEvery(UNMOUNT_CLEAR_CUSTOMER_DETAILS, unmountClearDriverDetails);
  yield takeEvery(ADM_RESET_CUSTOMER_PASSWORD, resetDriverPasswordByAdmin);
  yield takeEvery(GET_DRIVER_RATINGS_BY_ID, getDriverRatingsById);
  yield takeEvery(CREATE_DRIVER, createDriver);

  yield takeEvery(GET_UNASSIGNED_JOBS_LIST, getUnassignedJobsList);
  yield takeEvery(ASSIGN_JOB_2DRIVER, assignJobToDriver);
}
