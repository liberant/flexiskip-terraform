import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';

import { request, buildQueryString } from '../../../common/helpers';
import { setSuccess } from '../../../common/actions';

import {
  GET_DISCOUNTS_LIST,
  GET_DISCOUNT_DETAILS_BY_ID,
  UPDATE_DISCOUNT_DETAILS,
  DELETE_DISCOUNTS_LIST,
  DELETE_DISCOUNT_BY_ID,
  UPDATE_DISCOUNT_STATUS,
  CREATE_DISCOUNT,
  UNMOUNT_CLEAR_DISCOUNT_DETAILS,
  GET_DISCOUNT_REGIONS_DEFINATIONS,
  GET_DISCOUNT_PRODUCTS_LIST,
} from './constants/actionTypes';

import {
  setDiscountsList2State,
  putDiscountDetails2State,
  clearDiscountDetails2State,
  putDiscountProductsList2State,
  putDiscountRegionDefinations2State,
} from './actions';

function* getDiscountProductsList(action) {
  const { resolve, reject } = action;

  try {
    const response = yield call(request, {
      url: 'admin/products',
      method: 'get',
      requestName: 'productsList',
    });
    yield put(putDiscountProductsList2State(response));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* getDiscountRegionDefinations(action) {
  const { resolve, reject } = action;

  try {
    const response = yield call(request, {
      url: '/admin/councils?limit=10000&page=1',
      method: 'get',
      requestName: 'regions',
    });
    yield put(putDiscountRegionDefinations2State(response));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* getDiscountsList(action) {
  const { resolve, reject, payload } = action;

  try {
    const response = yield call(request, {
      url: `admin/coupons?${buildQueryString(payload)}`,
      method: 'get',
      requestName: 'discountsList',
    });
    yield put(setDiscountsList2State(response));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* getDiscountById(action) {
  const { resolve, reject, payload } = action;

  try {
    const response = yield call(request, {
      url: `admin/${payload.url}/${payload.uid}`,
      method: 'get',
      requestName: 'discountDetails',
    });

    yield put(putDiscountDetails2State(response));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* updateDiscountDetails(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `admin/coupons/${payload.uid}`,
      data: payload.data,
      method: 'put',
    });
    yield put(setSuccess('Discount details have been updated successfully'));

    getDiscountById(action);
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* deleteDiscountsList(action) {
  const { resolve, reject, payload } = action;

  try {
    const response = yield call(request, {
      url: `admin/${payload.url}`,
      data: {
        status: payload.status,
        ids: payload.ids,
      },
      method: 'put',
    });

    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* deleteDiscountById(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `admin/${payload.url}/${payload.uid}`,
      method: 'delete',
    });
    yield put(setSuccess('This discount has been deleted successfully'));
    yield getDiscountsList({ resolve, reject, payload: { limit: 10, page: 1, url: payload.url } });
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* updateDiscountStatus(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: 'admin/coupons/status',
      method: 'put',
      data: { status: payload.status, ids: payload.ids },
    });
    // yield put(setSuccess('The discount(s) has been updated successfully'));
    // yield getDiscountsList({ resolve, reject, payload: { limit: 10, page: 1 } });
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* createDiscount(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `admin/${payload.url}`,
      method: 'post',
      data: payload.data,
    });

    yield put(setSuccess('New discount has been created successfully!'));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* unmountClearDiscountDetails(action) {
  const { reject } = action;
  try {
    yield put(clearDiscountDetails2State());
  } catch (error) {
    reject(error);
  }
}

export default function* discountsSaga() {
  yield takeEvery(GET_DISCOUNTS_LIST, getDiscountsList);
  yield takeEvery(GET_DISCOUNT_DETAILS_BY_ID, getDiscountById);
  yield takeLatest(UPDATE_DISCOUNT_DETAILS, updateDiscountDetails);
  yield takeLatest(DELETE_DISCOUNTS_LIST, deleteDiscountsList);
  yield takeLatest(DELETE_DISCOUNT_BY_ID, deleteDiscountById);
  yield takeLatest(UPDATE_DISCOUNT_STATUS, updateDiscountStatus);
  yield takeLatest(CREATE_DISCOUNT, createDiscount);
  yield takeEvery(UNMOUNT_CLEAR_DISCOUNT_DETAILS, unmountClearDiscountDetails);
  yield takeLatest(GET_DISCOUNT_REGIONS_DEFINATIONS, getDiscountRegionDefinations);
  yield takeLatest(GET_DISCOUNT_PRODUCTS_LIST, getDiscountProductsList);
}
