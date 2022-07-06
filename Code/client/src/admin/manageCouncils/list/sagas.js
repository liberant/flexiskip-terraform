import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';

import { getHttpErrorMessages } from '../../../common/utils/common';
import { request, buildQueryString } from '../../../common/helpers';
import { setSuccess } from '../../../common/actions';

import {
  GET_COUNCILS_LIST,
  GET_COUNCIL_DETAILS_BY_ID,
  UPDATE_COUNCIL_DETAILS,
  DELETE_COUNCILS_LIST,
  DELETE_COUNCIL_BY_ID,
  UPDATE_COUNCIL_STATUS,
  CREATE_COUNCIL,
  GET_COUNCIL_REGIONS_DEFINATIONS,
  UNMOUNT_CLEAR_COUNCIL_DETAILS,
  GET_COUNCIL_STATES_DEFINATIONS,
  FETCH_ALL_COUNCILS,
} from './constants/actionTypes';

import {
  setCouncilsList2State,
  putCouncilDetails2State,
  clearCouncilDetails2State,
  putCouncilRegionDefinations2State,
  putCouncilStatesDefinations2State,
  setCouncilOptions,
} from './actions';

function* getCouncilRegionDefinations(action) {
  const { resolve, reject } = action;

  try {
    const response = yield call(request, {
      url: '/options/regions?limit=10000&page=1',
      method: 'get',
      requestName: 'regions',
    });
    yield put(putCouncilRegionDefinations2State(response));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* getCouncilStatesDefinations(action) {
  const { resolve, reject } = action;

  try {
    const response = yield call(request, {
      url: '/options/states?limit=10000&page=1',
      method: 'get',
      requestName: 'states',
    });
    yield put(putCouncilStatesDefinations2State(response));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* getCouncilsList(action) {
  const { resolve, reject, payload } = action;

  try {
    const response = yield call(request, {
      url: `admin/councils?${buildQueryString(payload)}`,
      method: 'get',
      requestName: 'councilsList',
    });
    yield put(setCouncilsList2State(response));
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

function* getCouncilById(action) {
  const { resolve, reject, payload } = action;

  try {
    yield put(clearCouncilDetails2State());

    const response = yield call(request, {
      url: `admin/${payload.url}/${payload.uid}`,
      method: 'get',
      requestName: 'councilDetails',
    });

    yield put(putCouncilDetails2State(response));
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

function* updateCouncilDetails(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `admin/councils/${payload.uid}`,
      data: payload.data,
      method: 'put',
    });
    yield put(setSuccess('Council details have been updated successfully'));

    // getCouncilById(action);
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

function* deleteCouncilsList(action) {
  const { resolve, reject, payload } = action;

  try {
    const response = yield call(request, {
      url: 'admin/councils',
      data: {
        status: payload.status,
        ids: payload.ids,
      },
      method: 'put',
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

function* deleteCouncilById(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `admin/councils/${payload.uid}`,
      method: 'delete',
    });
    yield put(setSuccess('This council has been deleted successfully'));
    yield getCouncilsList({ resolve, reject, payload: { limit: 10, page: 1, url: payload.url } });
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

function* updateCouncilStatus(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: 'admin/councils/status',
      method: 'put',
      data: { status: payload.status, ids: payload.ids },
    });
    // yield put(setSuccess('The council(s) has been updated successfully'));
    // yield getCouncilsList({ resolve, reject, payload: { limit: 10, page: 1 } });
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

function* createCouncil(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `admin/${payload.url}`,
      method: 'post',
      data: payload.data,
    });

    yield put(setSuccess('New council has been created successfully!'));
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

function* unmountClearCouncilDetails(action) {
  const { reject } = action;
  try {
    yield put(clearCouncilDetails2State());
  } catch (error) {
    const errorMessages = getHttpErrorMessages(error);

    if (errorMessages) {
      reject({ message: errorMessages });
    } else {
      reject(error);
    }
  }
}

function* fetchAllCouncils(action) {
  const { resolve, reject } = action;

  try {
    const response = yield call(request, {
      url: 'admin/councils?limit=999999',
      method: 'get',
      requestName: 'fetchAllCouncils',
    });
    yield put(setCouncilOptions(response.data));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

export default function* councilsSaga() {
  yield takeEvery(GET_COUNCILS_LIST, getCouncilsList);
  yield takeEvery(GET_COUNCIL_DETAILS_BY_ID, getCouncilById);
  yield takeLatest(UPDATE_COUNCIL_DETAILS, updateCouncilDetails);
  yield takeLatest(DELETE_COUNCILS_LIST, deleteCouncilsList);
  yield takeLatest(DELETE_COUNCIL_BY_ID, deleteCouncilById);
  yield takeLatest(UPDATE_COUNCIL_STATUS, updateCouncilStatus);
  yield takeLatest(CREATE_COUNCIL, createCouncil);
  yield takeEvery(UNMOUNT_CLEAR_COUNCIL_DETAILS, unmountClearCouncilDetails);
  yield takeLatest(GET_COUNCIL_REGIONS_DEFINATIONS, getCouncilRegionDefinations);
  yield takeLatest(GET_COUNCIL_STATES_DEFINATIONS, getCouncilStatesDefinations);
  yield takeLatest(FETCH_ALL_COUNCILS, fetchAllCouncils);
}
