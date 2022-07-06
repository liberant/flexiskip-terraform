import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';

import { getHttpErrorMessages } from '../../../common/utils/common';
import { request, buildQueryString } from '../../../common/helpers';
import { setSuccess } from '../../../common/actions';

import {
  GET_DUMPSITES_LIST,
  GET_DUMPSITE_DETAILS_BY_ID,
  UPDATE_DUMPSITE_DETAILS,
  DELETE_DUMPSITES_LIST,
  DELETE_DUMPSITE_BY_ID,
  UPDATE_DUMPSITE_STATUS,
  CREATE_DUMPSITE,
  UNMOUNT_CLEAR_DUMPSITE_DETAILS,
  GET_DUMPSITE_COUNCILS_DEFINATIONS,
  GET_DUMPSITE_WASTETYPES_LIST,
} from './constants/actionTypes';

import {
  setDumpsitesList2State,
  putDumpsiteDetails2State,
  clearDumpsiteDetails2State,
  putDumpsiteWasteTypesList2State,
  putDumpsiteCouncilDefinations2State,
} from './actions';

function* getDumpsiteWasteTypesList(action) {
  const { resolve, reject } = action;

  try {
    const response = yield call(request, {
      url: '/options/waste-types',
      method: 'get',
      requestName: 'wasttypesList',
    });
    yield put(putDumpsiteWasteTypesList2State(response));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* getDumpsiteCouncilDefinations(action) {
  const { resolve, reject } = action;

  try {
    const response = yield call(request, {
      url: '/admin/councils?limit=10000&page=1',
      method: 'get',
      requestName: 'councils',
    });
    yield put(putDumpsiteCouncilDefinations2State(response));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* getDumpsitesList(action) {
  const { resolve, reject, payload } = action;

  try {
    const response = yield call(request, {
      url: `admin/dumpsites?${buildQueryString(payload)}`,
      method: 'get',
      requestName: 'dumpsitesList',
    });
    yield put(setDumpsitesList2State(response));
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

function* getDumpsiteById(action) {
  const { resolve, reject, payload } = action;

  try {
    yield put(clearDumpsiteDetails2State());

    const response = yield call(request, {
      url: `admin/${payload.url}/${payload.uid}`,
      method: 'get',
      requestName: 'dumpsiteDetails',
    });

    yield put(putDumpsiteDetails2State(response));
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

function* updateDumpsiteDetails(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `admin/dumpsites/${payload.uid}`,
      data: payload.data,
      method: 'put',
    });
    yield put(setSuccess('Dumpsite details have been updated successfully'));

    getDumpsiteById(action);
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

function* deleteDumpsitesList(action) {
  const { resolve, reject, payload } = action;

  try {
    const response = yield call(request, {
      url: 'admin/dumpsites',
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

function* deleteDumpsiteById(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `admin/dumpsites/${payload.uid}`,
      method: 'delete',
    });
    yield put(setSuccess('This dumpsite has been deleted successfully'));
    yield getDumpsitesList({ resolve, reject, payload: { limit: 10, page: 1, url: payload.url } });
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

function* updateDumpsiteStatus(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: 'admin/dumpsites/status',
      method: 'put',
      data: { status: payload.status, ids: payload.ids },
    });
    // yield put(setSuccess('The dumpsite(s) has been updated successfully'));
    // yield getDumpsitesList({ resolve, reject, payload: { limit: 10, page: 1 } });
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

function* createDumpsite(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `admin/${payload.url}`,
      method: 'post',
      data: payload.data,
    });

    yield put(setSuccess('New dumpsite has been created successfully!'));
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

function* unmountClearDumpsiteDetails(action) {
  const { reject } = action;
  try {
    yield put(clearDumpsiteDetails2State());
  } catch (error) {
    const errorMessages = getHttpErrorMessages(error);

    if (errorMessages) {
      reject({ message: errorMessages });
    } else {
      reject(error);
    }
  }
}

export default function* dumpsitesSaga() {
  yield takeEvery(GET_DUMPSITES_LIST, getDumpsitesList);
  yield takeEvery(GET_DUMPSITE_DETAILS_BY_ID, getDumpsiteById);
  yield takeLatest(UPDATE_DUMPSITE_DETAILS, updateDumpsiteDetails);
  yield takeLatest(DELETE_DUMPSITES_LIST, deleteDumpsitesList);
  yield takeLatest(DELETE_DUMPSITE_BY_ID, deleteDumpsiteById);
  yield takeLatest(UPDATE_DUMPSITE_STATUS, updateDumpsiteStatus);
  yield takeLatest(CREATE_DUMPSITE, createDumpsite);
  yield takeEvery(UNMOUNT_CLEAR_DUMPSITE_DETAILS, unmountClearDumpsiteDetails);
  yield takeLatest(GET_DUMPSITE_COUNCILS_DEFINATIONS, getDumpsiteCouncilDefinations);
  yield takeLatest(GET_DUMPSITE_WASTETYPES_LIST, getDumpsiteWasteTypesList);
}
