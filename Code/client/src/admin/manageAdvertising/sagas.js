import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';

import { getHttpErrorMessages } from '../../common/utils/common';
import { request } from '../../common/helpers';
import { setSuccess } from '../../common/actions';

import {
  GET_ADVERTISING_LIST,
  GET_ADVERTISING_DETAILS_BY_ID,
  UPDATE_ADVERTISING_DETAILS,
  DELETE_ADVERTISING_LIST,
  DELETE_ADVERTISING_BY_ID,
  UPDATE_ADVERTISING_STATUS,
  CREATE_ADVERTISING,
  UNMOUNT_CLEAR_ADVERTISING_DETAILS,
  PUBLISH_ADVERTISING_ITEM,
} from './constants/actionTypes';

import {
  setAdvertisingList2State,
  putAdvertisingDetails2State,
  clearAdvertisingDetails2State,
} from './actions';

function* getAdvertisingList(action) {
  const { resolve, reject, payload } = action;

  const searchString = payload.search ? `&s=${payload.search}` : '';

  try {
    const response = yield call(request, {
      url: `admin/ads?limit=${payload.limit}&page=${payload.page}${searchString}`,
      method: 'get',
      requestName: 'advertisingList',
    });
    yield put(setAdvertisingList2State(response));
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

function* getAdvertisingById(action) {
  const { resolve, reject, payload } = action;

  try {
    yield put(clearAdvertisingDetails2State());

    const response = yield call(request, {
      url: `admin/ads/${payload.uid}`,
      method: 'get',
      requestName: 'advertisingDetails',
    });

    yield put(putAdvertisingDetails2State(response));
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

function* updateAdvertisingDetails(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `admin/ads/${payload.uid}`,
      data: payload.data,
      method: 'put',
    });
    yield put(setSuccess('Advertising details have been updated successfully'));

    getAdvertisingById(action);
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

function* deleteAdvertisingList(action) {
  const { resolve, reject, payload } = action;

  try {
    const response = yield call(request, {
      url: 'admin/ads',
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

function* deleteAdvertisingById(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `admin/ads/${payload.uid}`,
      method: 'delete',
    });
    yield put(setSuccess('This advertising has been deleted successfully'));
    yield getAdvertisingList({
      resolve, reject, payload: { limit: 10, page: 1, url: payload.url },
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

function* updateAdvertisingStatus(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: 'admin/ads/status',
      method: 'put',
      data: { status: payload.status, ids: payload.ids },
    });
    // yield put(setSuccess('The advertising(s) has been updated successfully'));
    // yield getAdvertisingList({ resolve, reject, payload: { limit: 10, page: 1 } });
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

function* createAdvertising(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: 'admin/ads',
      method: 'post',
      data: payload.data,
    });

    yield put(setSuccess('New advertising has been created successfully!'));
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

function* unmountClearAdvertisingDetails(action) {
  const { reject } = action;
  try {
    yield put(clearAdvertisingDetails2State());
  } catch (error) {
    const errorMessages = getHttpErrorMessages(error);

    if (errorMessages) {
      reject({ message: errorMessages });
    } else {
      reject(error);
    }
  }
}

function* publishAdvertising(action) {
  const { resolve, reject, payload } = action;

  try {
    const response = yield call(request, {
      url: '/admin/ads/publish',
      method: 'put',
      data: { id: payload.uid },
    });

    yield put(putAdvertisingDetails2State(response));
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

export default function* advertisingSaga() {
  yield takeEvery(GET_ADVERTISING_LIST, getAdvertisingList);
  yield takeEvery(GET_ADVERTISING_DETAILS_BY_ID, getAdvertisingById);
  yield takeLatest(UPDATE_ADVERTISING_DETAILS, updateAdvertisingDetails);
  yield takeLatest(DELETE_ADVERTISING_LIST, deleteAdvertisingList);
  yield takeLatest(DELETE_ADVERTISING_BY_ID, deleteAdvertisingById);
  yield takeLatest(UPDATE_ADVERTISING_STATUS, updateAdvertisingStatus);
  yield takeLatest(CREATE_ADVERTISING, createAdvertising);
  yield takeEvery(UNMOUNT_CLEAR_ADVERTISING_DETAILS, unmountClearAdvertisingDetails);
  yield takeLatest(PUBLISH_ADVERTISING_ITEM, publishAdvertising);
}
