import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';

import { request, buildQueryString } from '../../../common/helpers';
import { setSuccess } from '../../../common/actions';

import {
  GET_COLLECTION_REQUESTS_LIST,
  GET_COLLECTION_REQUESTS_DETAILS_BY_ID,
  UPDATE_COLLECTION_REQUESTS_DETAILS,
  DELETE_COLLECTION_REQUESTS_LIST,
  DELETE_COLLECTION_REQUESTS_BY_ID,
  UPDATE_COLLECTION_REQUESTS_STATUS,
  UNMOUNT_CLEAR_COLLECTION_REQUESTS_DETAILS,
  UPDATE_BIN_COLLECTION_REQUEST_STATUS,
  UPDATE_BIN_STATUS
} from './constants/actionTypes';

import {
  setCollectionRequestsList2State,
  putCollectionRequestsDetails2State,
  clearCollectionRequestsDetails2State,
} from './actions';

function* getCollectionRequestsList(action) {
  const { resolve, reject } = action;
  try {
    let payload = { limit: 25, page: 1, s: '' };
    const table = JSON.parse(localStorage.getItem('collectionRequestsTable'));
    if (table) {
      payload = table;
    } else {
      localStorage.setItem('collectionRequestsTable', JSON.stringify(payload));
    }
    const queryString = buildQueryString(payload);
    const response = yield call(request, {
      url: `admin/collection-requests?${queryString}`,
      method: 'get',
      requestName: 'collectionRequestsList',
    });
    yield put(setCollectionRequestsList2State(response));
    resolve(response);
  } catch (error) {
    if (error.message.includes('404')){
      yield put(setCollectionRequestsList2State({data: []}));
    }
    reject(error);
  }
}

function* getCollectionRequestsById(action) {
  const { resolve, reject, payload } = action;

  try {
    yield put(clearCollectionRequestsDetails2State());

    const response = yield call(request, {
      url: `admin/collection-requests/${payload}`,
      method: 'get',
      requestName: 'collectionRequestsDetails',
    });

    yield put(putCollectionRequestsDetails2State(response));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* updateCollectionRequestsDetails(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `admin/collection-requests/${payload.uid}`,
      data: payload.data,
      method: 'put',
    });
    yield put(setSuccess('Collection requests details have been updated successfully'));
    yield getCollectionRequestsList({ resolve, reject });
    getCollectionRequestsById(action);
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* deleteCollectionRequestsList(action) {
  const { resolve, reject, payload } = action;

  try {
    const response = yield call(request, {
      url: 'admin/collection-requests/status',
      data: {
        status: payload.status,
        binRequestIds: payload.ids,
      },
      method: 'put',
    });
    // yield put(setSuccess('Those collection Requests have been deleted successfully'));
    // yield getCollectionRequestsList({ resolve, reject });
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* deleteCollectionRequestsById(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: 'admin/collection-requests/status',
      data: {
        status: payload.status,
        binRequestIds: [payload.uid],
      },
      method: 'put',
    });
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* updateCollectionRequestsStatusById(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `driver/collection-requests/${payload.uid}/status`,
      method: 'put',
      data: { status: payload.status },
    });
    yield put(setSuccess('This collection requests status has been updated successfully! '));
    yield getCollectionRequestsList({ resolve, reject });
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* updateBinStatusById(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `admin/bins/${payload.id}/status`,
      method: "put",
      data: { status: payload.status, collectionRequestId: payload.collectionRequestId },
    });
    yield getCollectionRequestsList({ resolve, reject });
    yield put(
      setSuccess(
        "This bin status has been updated successfully! "
      )
    );
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* updateBinCollectionRequestsStatusById(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `admin/bins/${payload.id}/collection-status`,
      method: "put",
      data: { status: payload.status, collectionRequestId: payload.collectionRequestId },
    });
    yield getCollectionRequestsList({ resolve, reject });
    yield put(
      setSuccess(
        "This bin collection requests status has been updated successfully! "
      )
    );
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* unmountClearCollectionRequestsDetails(action) {
  const { reject } = action;
  try {
    yield put(clearCollectionRequestsDetails2State());
  } catch (error) {
    reject(error);
  }
}

export default function* collectionRequestsSaga() {
  yield takeEvery(GET_COLLECTION_REQUESTS_LIST, getCollectionRequestsList);
  yield takeEvery(GET_COLLECTION_REQUESTS_DETAILS_BY_ID, getCollectionRequestsById);
  yield takeLatest(UPDATE_COLLECTION_REQUESTS_DETAILS, updateCollectionRequestsDetails);
  yield takeLatest(DELETE_COLLECTION_REQUESTS_LIST, deleteCollectionRequestsList);
  yield takeLatest(DELETE_COLLECTION_REQUESTS_BY_ID, deleteCollectionRequestsById);
  yield takeLatest(UPDATE_COLLECTION_REQUESTS_STATUS, updateCollectionRequestsStatusById);
  yield takeEvery(UNMOUNT_CLEAR_COLLECTION_REQUESTS_DETAILS, unmountClearCollectionRequestsDetails);
  yield takeEvery(UPDATE_BIN_COLLECTION_REQUEST_STATUS, updateBinCollectionRequestsStatusById);
  yield takeEvery(UPDATE_BIN_STATUS, updateBinStatusById);
}
