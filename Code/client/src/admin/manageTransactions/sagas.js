import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import moment from 'moment';
import { request } from '../../common/helpers';
import { setSuccess } from '../../common/actions';
import { getEndOfDay, getStartOfDay } from '../../common/utils';

import {
  GET_MANAGE_TRANSACTIONS_LIST,
  GET_MANAGE_TRANSACTIONS_DETAILS_BY_ID,
  UPDATE_MANAGE_TRANSACTIONS_DETAILS,
  DELETE_MANAGE_TRANSACTIONS_LIST,
  DELETE_MANAGE_TRANSACTIONS_BY_ID,
  UPDATE_MANAGE_TRANSACTIONS_STATUS,
  UNMOUNT_CLEAR_MANAGE_TRANSACTIONS_DETAILS,
} from './constants/actionTypes';

import {
  setManageTransactionsList2State,
  putManageTransactionsDetails2State,
  clearManageTransactionsDetails2State,
} from './actions';

function* getManageTransactionsList(action) {
  const { resolve, reject, payload } = action;

  const from = (payload && payload.startDate) ? payload.startDate : moment().subtract(5, 'months').startOf('month');
  const to = (payload && payload.endDate) ? payload.endDate : moment().endOf('month');

  const paramStartDate = `&startDate=${encodeURIComponent(getStartOfDay(from))}`;
  const paramEndDate = `&endDate=${encodeURIComponent(getEndOfDay(to))}`;
  const paramSearch = `&s=${payload.search || ''}`;

  try {
    const response = yield call(request, {
      // url: `admin/transactions?limit=${payload.limit}&page=${payload.page}`,
      url: `admin/transactions?limit=${payload.limit}&page=${payload.page}&type=${payload.name}${paramStartDate}${paramEndDate}${paramSearch}`,
      method: 'get',
      requestName: 'manageTransactionsList',
    });
    yield put(setManageTransactionsList2State(response));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* getManageTransactionsById(action) {
  const { resolve, reject, payload } = action;

  try {
    yield put(clearManageTransactionsDetails2State());

    const response = yield call(request, {
      url: `admin/transactions/${payload.uid}`,
      method: 'get',
      requestName: 'manageTransactionsDetails',
    });

    yield put(putManageTransactionsDetails2State(response));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* updateManageTransactionsDetails(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `admin/transactions/${payload.uid}`,
      data: payload.data,
      method: 'put',
    });
    yield put(setSuccess('Collection requests details have been updated successfully'));

    getManageTransactionsById(action);
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* deleteManageTransactionsList(action) {
  const { resolve, reject, payload } = action;

  try {
    const response = yield call(request, {
      url: 'admin/transactions/status',
      data: {
        status: payload.status,
        binRequestIds: payload.ids,
      },
      method: 'put',
    });
    // yield put(setSuccess('Those collection Requests have been deleted successfully'));
    // yield getManageTransactionsList({ resolve, reject, payload: { limit: 10, page: 1 } });
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* deleteManageTransactionsById(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: 'admin/transactions/status',
      data: {
        status: payload.status,
        binRequestIds: [payload.uid],
      },
      method: 'put',
    });
    // const response = yield call(request, {
    //   url: `admin/transactions/${payload.uid}`,
    //   method: 'delete',
    // });
    // yield put(setSuccess('This collection requests has been deleted successfully'));
    // yield getManageTransactionsList({ resolve, reject, payload: { limit: 10, page: 1 } });
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* updateManageTransactionsStatusById(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `admin/transactions/${payload.uid}/status`,
      method: 'put',
      data: { status: payload.status },
    });
    yield put(setSuccess('This collection requests status has been updated successfully! '));
    yield getManageTransactionsList({ resolve, reject, payload: { limit: 10, page: 1 } });
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* unmountClearManageTransactionsDetails(action) {
  const { reject } = action;
  try {
    yield put(clearManageTransactionsDetails2State());
  } catch (error) {
    reject(error);
  }
}

export default function* manageTransactionsSaga() {
  yield takeEvery(GET_MANAGE_TRANSACTIONS_LIST, getManageTransactionsList);
  yield takeEvery(GET_MANAGE_TRANSACTIONS_DETAILS_BY_ID, getManageTransactionsById);
  yield takeLatest(UPDATE_MANAGE_TRANSACTIONS_DETAILS, updateManageTransactionsDetails);
  yield takeLatest(DELETE_MANAGE_TRANSACTIONS_LIST, deleteManageTransactionsList);
  yield takeLatest(DELETE_MANAGE_TRANSACTIONS_BY_ID, deleteManageTransactionsById);
  yield takeLatest(UPDATE_MANAGE_TRANSACTIONS_STATUS, updateManageTransactionsStatusById);
  yield takeEvery(UNMOUNT_CLEAR_MANAGE_TRANSACTIONS_DETAILS, unmountClearManageTransactionsDetails);
}
