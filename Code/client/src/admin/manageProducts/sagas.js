import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';

import { request, buildQueryString } from '../../common/helpers';
import { setSuccess } from '../../common/actions';

import {
  GET_PRODUCTS_LIST,
  GET_PRODUCT_DETAILS_BY_ID,
  UPDATE_PRODUCT_DETAILS,
  DELETE_PRODUCTS_LIST,
  DELETE_PRODUCT_BY_ID,
  UPDATE_PRODUCT_STATUS,
  CREATE_PRODUCT,
  UNMOUNT_CLEAR_PRODUCT_DETAILS,
  GET_PRODUCT_MATERIAL_OPTIONS,
  GET_PRODUCT_COUNCILS_DEFINATIONS,
  CREATE_COUNCIL_PRODUCT,
  GET_COUNCIL_PRODUCT_LIST,
  UPDATE_COUNCIL_PRODUCT_STATUS_BY_ID,
  DELETE_COUNCIL_PRODUCT_BY_ID,
  GET_PRODUCT_WASTETYPES_LIST,
  GET_COUNCIL_PRODUCT_DETAILS_BY_ID,
  UPDATE_COUNCIL_PRODUCT_DETAILS_BY_ID,
  FETCH_ALL_PRODUCTS,
} from './constants/actionTypes';

import {
  setProductsList2State,
  putProductDetails2State,
  clearProductDetails2State,
  putProductWasteTypesList2State,
  putProductMaterialOptions2State,
  putProductCouncilDefinations2State,
  putCouncilProductList2State,
  putCouncilProductDetails2State,
  setProductOptions,
} from './actions';

function* getProductWasteTypesList(action) {
  const { resolve, reject } = action;

  try {
    const response = yield call(request, {
      url: '/options/waste-types',
      method: 'get',
      requestName: 'wasttypesList',
    });
    yield put(putProductWasteTypesList2State(response));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* getProductMaterialOptions(action) {
  const { resolve, reject } = action;

  try {
    const response = yield call(request, {
      url: '/options/product/materials',
      method: 'get',
      requestName: 'productMatierials',
    });
    yield put(putProductMaterialOptions2State(response));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* getProductsList(action) {
  const { resolve, reject, payload } = action;

  try {
    const response = yield call(request, {
      url: `admin/products?${buildQueryString(payload)}`,
      method: 'get',
      requestName: 'productsList',
    });
    yield put(setProductsList2State(response));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* getProductById(action) {
  const { resolve, reject, payload } = action;

  try {
    yield put(clearProductDetails2State());
    const materials = yield call(request, {
      url: '/options/product/materials',
      method: 'get',
      requestName: 'productMatierials',
    });
    yield put(putProductMaterialOptions2State(materials));

    const response = yield call(request, {
      url: `admin/${payload.url}/${payload.uid}`,
      method: 'get',
      requestName: 'productDetails',
    });

    yield put(putProductDetails2State(response));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* updateProductDetails(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `admin/${payload.url}/${payload.uid}`,
      data: payload.data,
      method: 'put',
    });
    yield put(setSuccess('Product details have been updated successfully'));

    getProductById(action);
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* deleteProductsList(action) {
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
    // yield put(setSuccess('Those products have been deleted successfully'));
    // yield getProductsList({ resolve, reject,
    // payload: { limit: 10, page: 1, url: payload.url } });
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* deleteProductById(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `admin/${payload.url}/${payload.uid}`,
      method: 'delete',
    });
    yield put(setSuccess('This product has been deleted successfully'));
    yield getProductsList({ resolve, reject, payload: { limit: 10, page: 1, url: payload.url } });
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* updateProductStatusById(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `admin/${payload.url}/${payload.uid}/status`,
      method: 'put',
      data: { status: payload.status },
    });
    yield put(setSuccess('This product status has been updated successfully! '));
    yield getProductsList({ resolve, reject, payload: { limit: 10, page: 1, url: payload.url } });
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* createProduct(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `admin/${payload.url}`,
      method: 'post',
      data: payload.data,
    });

    yield put(setSuccess('New product has been created successfully!'));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* getCouncilProductsList(action) {
  const { resolve, reject, payload } = action;

  try {
    const response = yield call(request, {
      url: `admin/council-products?product=${payload.uid}&limit=${payload.limit}&page=${payload.page}`,
      method: 'get',
      requestName: 'councilProductsList',
    });
    yield put(putCouncilProductList2State(response));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* deleteCouncilProductById(action) {
  const { resolve, reject, payload } = action;
  const { uid } = payload;

  try {
    const response = yield call(request, {
      url: `admin/council-products/${uid}`,
      method: 'delete',
    });
    yield put(setSuccess('This product has been deleted successfully'));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* getCouncilProductDetailsById(action) {
  const { resolve, reject, payload } = action;

  try {
    yield put(clearProductDetails2State());
    const response = yield call(request, {
      url: `admin/council-products/${payload.uid}`,
      method: 'get',
      requestName: 'councilProductDetails',
    });

    yield put(putCouncilProductDetails2State(response));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* updateCouncilProductStatusById(action) {
  const { resolve, reject, payload } = action;
  const { uid, status } = payload;
  try {
    const response = yield call(request, {
      url: `admin/council-products/${uid}/status`,
      method: 'put',
      data: { status },
    });
    yield put(setSuccess('This product status has been updated successfully! '));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* updateCouncilProductDetailsById(action) {
  const { resolve, reject, payload } = action;
  const { data, uid } = payload;
  try {
    const response = yield call(request, {
      url: `admin/council-products/${uid}`,
      data,
      method: 'put',
    });
    yield put(setSuccess('This Product details have been updated successfully'));

    getProductById(action);
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* unmountClearProductDetails(action) {
  const { reject } = action;
  try {
    yield put(clearProductDetails2State());
  } catch (error) {
    reject(error);
  }
}

function* getProductCouncilDefinations(action) {
  const { resolve, reject } = action;

  try {
    const response = yield call(request, {
      url: '/admin/councils?limit=10000&page=1',
      method: 'get',
      requestName: 'councils',
    });
    yield put(putProductCouncilDefinations2State(response));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* createCouncilProduct(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: 'admin/council-products',
      method: 'post',
      data: payload,
    });

    yield put(setSuccess('New council product has been created successfully!'));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* fetchAllProducts(action) {
  const { resolve, reject } = action;

  try {
    const response = yield call(request, {
      url: 'admin/products?limit=999999',
      method: 'get',
      requestName: 'fetchAllProducts',
    });
    yield put(setProductOptions(response.data));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

export default function* productsSaga() {
  yield takeEvery(GET_PRODUCTS_LIST, getProductsList);
  yield takeEvery(GET_PRODUCT_DETAILS_BY_ID, getProductById);
  yield takeLatest(UPDATE_PRODUCT_DETAILS, updateProductDetails);
  yield takeLatest(DELETE_PRODUCTS_LIST, deleteProductsList);
  yield takeLatest(DELETE_PRODUCT_BY_ID, deleteProductById);
  yield takeLatest(UPDATE_PRODUCT_STATUS, updateProductStatusById);
  yield takeLatest(CREATE_PRODUCT, createProduct);
  yield takeEvery(UNMOUNT_CLEAR_PRODUCT_DETAILS, unmountClearProductDetails);
  yield takeLatest(GET_PRODUCT_MATERIAL_OPTIONS, getProductMaterialOptions);
  yield takeLatest(GET_PRODUCT_COUNCILS_DEFINATIONS, getProductCouncilDefinations);
  yield takeEvery(CREATE_COUNCIL_PRODUCT, createCouncilProduct);
  yield takeEvery(GET_COUNCIL_PRODUCT_LIST, getCouncilProductsList);
  yield takeEvery(UPDATE_COUNCIL_PRODUCT_STATUS_BY_ID, updateCouncilProductStatusById);
  yield takeEvery(DELETE_COUNCIL_PRODUCT_BY_ID, deleteCouncilProductById);
  yield takeLatest(GET_PRODUCT_WASTETYPES_LIST, getProductWasteTypesList);
  yield takeEvery(GET_COUNCIL_PRODUCT_DETAILS_BY_ID, getCouncilProductDetailsById);
  yield takeEvery(UPDATE_COUNCIL_PRODUCT_DETAILS_BY_ID, updateCouncilProductDetailsById);
  yield takeEvery(FETCH_ALL_PRODUCTS, fetchAllProducts);
}
