import {
  takeLatest,
  put,
  call,
  select,
} from 'redux-saga/effects';
import {
  getFormValues,
  stopSubmit,
} from 'redux-form';
import * as actions from './actions';
import { request } from '../../common/helpers';
import {
  GET_VEHICLE_DETAIL,
  SUBMIT_VEHICLE_DETAIL,
  GET_CONTRACTOR_LIST,
} from './constants/actionTypes';
import { VEHICLE_DETAIL_FORM } from './constants';

/* eslint prefer-destructuring: 0 */

export function* executeGetVehicleDetail(action) {
  const {
    payload,
  } = action;
  try {
    yield put(actions.getVehicleDetailStart());
    const response = yield call(request, {
      url: `/admin/vehicles/${payload}`,
      method: 'get',
    });
    response.data.userCreated = response.data.createdBy;
    response.data.createdBy = response.data.createdBy._id;
    yield put(actions.getVehicleDetailSuccessed(response.data));

    /**
     * Get contractor after get vehicle detail
     */
    yield put(actions.getContractorList(response.data.organisation));
  } catch (error) {
    yield put(actions.getVehicleDetailFailed(error));
  }
}

export function* executeSubmitVehicleDetail(action) {
  const {
    payload,
  } = action;
  try {
    const formData = yield select(getFormValues(VEHICLE_DETAIL_FORM));
    yield put(actions.submitVehicleDetailStart());
    const response = yield call(request, {
      url: `/admin/vehicles/${payload}`,
      method: 'put',
      data: formData,
    });

    yield put(actions.submitVehicleDetailSuccessed(response.data));
    yield put(actions.toggleEditMode());

    yield put(actions.getVehicleDetail(payload));
  } catch (error) {
    const {
      response: {
        data: {
          errors,
        },
      },
    } = error;
    yield put(actions.submitVehicleDetailFailed(error));

    const asynFormError = {};
    Object.keys(errors).forEach((errorKey) => {
      asynFormError[errorKey] = errors[errorKey][0];
    });
    yield put(stopSubmit(VEHICLE_DETAIL_FORM, asynFormError));
  }
}

function* executeGetContractorList(action) {
  const { payload } = action;
  try {
    yield put(actions.getContractorListStart());
    const response = yield call(request, {
      url: `/admin/users/contractor/${payload}`,
      method: 'get',
    });
    yield put(actions.getContractorListSuccessed(response.data));
  } catch (error) {
    yield put(actions.getContractorListFailed(error));
  }
}

export default function* watchFetchData() {
  yield takeLatest(GET_VEHICLE_DETAIL, executeGetVehicleDetail);
  yield takeLatest(SUBMIT_VEHICLE_DETAIL, executeSubmitVehicleDetail);
  yield takeLatest(GET_CONTRACTOR_LIST, executeGetContractorList);
}
