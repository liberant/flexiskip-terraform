import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import { request, buildQueryString } from '../../common/helpers';
import { setSuccess } from '../../common/actions';

import {
  GET_VEHICLES_LIST,
  GET_VEHICLE_DETAILS_BY_ID,
  UPDATE_VEHICLE_DETAILS,
  DELETE_VEHICLES_LIST,
  DELETE_VEHICLE_BY_ID,
  UPDATE_VEHICLE_STATUS,
  UPDATE_VEHICLES_STATUS,
  UNMOUNT_CLEAR_VEHICLE_DETAILS,
  CREATE_VEHICLE,
  SUSPEND_VEHICLE_BY_ID,
} from './constants/actionTypes';

import { setVehiclesList2State, setVehicleDetails2State, clearVehicleDetails2State } from './actions';

function* getVehiclesList(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `contractor/vehicles?${buildQueryString(payload)}`,
      method: 'get',
      requestName: 'vehiclesList',
    });
    yield put(setVehiclesList2State(response));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* getVehicleById(action) {
  const { resolve, reject, payload } = action;

  try {
    yield put(clearVehicleDetails2State());
    const response = yield call(request, {
      // url: `admin/${payload.url}/${payload.uid}`,
      url: `contractor/vehicles/${payload.uid}`,
      method: 'get',
      requestName: 'vehicleDetails',
    });
    yield put(setVehicleDetails2State(response));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* updateVehicleDetailsById(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `contractor/vehicles/${payload.uid}`,
      data: payload.data,
      method: 'put',
    });
    yield put(setSuccess('Vehicle details have been updated successfully'));

    getVehicleById(action);
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* deleteVehiclesList(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `contractor/${payload.url}`,
      data: payload.data,
      method: 'delete',
    });
    yield put(setSuccess('Those vehicles have been deleted successfully'));
    getVehiclesList({ resolve, reject, payload: { limit: 10, page: 1, url: payload.url } });
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* deleteVehicleById(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `contractor/vehicles/${payload.uid}`,
      method: 'delete',
    });
    yield put(setSuccess('This vehicle has been deleted successfully'));
    yield getVehiclesList({ resolve, reject, payload: { limit: 10, page: 1, url: payload.url } });
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* updateVehicleStatusById(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `contractor/${payload.uid}/status`,
      method: 'put',
      data: { status: payload.status },
    });
    yield put(setSuccess('This vehicle status has been updated successfully! '));
    yield getVehiclesList({ resolve, reject, payload: { limit: 10, page: 1, url: payload.url } });
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* updateVehiclesStatus(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: 'contractor/vehicles/status',
      method: 'put',
      data: {
        status: payload.status,
        ids: payload.ids,
      },
    });
    // yield put(setSuccess('The vehicles status have been updated successfully! '));
    // yield getVehiclesList({
    //   resolve,
    //   reject,
    //   payload: {
    //     limit: 10,
    //     page: 1,
    //     url: payload.url,
    //     userType: payload.userType,
    //   },
    // });
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* unmountClearVehicleDetails(action) {
  const { reject } = action;
  try {
    yield put(clearVehicleDetails2State());
  } catch (error) {
    reject(error);
  }
}

function* createVehicle(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: 'contractor/vehicles',
      method: 'post',
      data: payload,
    });
    yield put(setSuccess('Vehicle has been created successfully! '));
    yield put(push('/contractor/vehicles'));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* suspendVehicleById(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `contractor/vehicles/${payload.uid}/status`,
      method: 'put',
      data: { status: payload.status },
    });
    yield put(setSuccess('This vehicle has been suspended successfully'));
    yield getVehiclesList({ resolve, reject, payload: { limit: 10, page: 1, url: payload.url } });
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

export default function* accountsSaga() {
  yield takeEvery(GET_VEHICLES_LIST, getVehiclesList);
  yield takeEvery(GET_VEHICLE_DETAILS_BY_ID, getVehicleById);
  yield takeLatest(UPDATE_VEHICLE_DETAILS, updateVehicleDetailsById);
  yield takeLatest(DELETE_VEHICLES_LIST, deleteVehiclesList);
  yield takeLatest(DELETE_VEHICLE_BY_ID, deleteVehicleById);
  yield takeLatest(UPDATE_VEHICLE_STATUS, updateVehicleStatusById);
  yield takeLatest(UPDATE_VEHICLES_STATUS, updateVehiclesStatus);
  yield takeEvery(UNMOUNT_CLEAR_VEHICLE_DETAILS, unmountClearVehicleDetails);
  yield takeLatest(CREATE_VEHICLE, createVehicle);
  yield takeLatest(SUSPEND_VEHICLE_BY_ID, suspendVehicleById);
}
