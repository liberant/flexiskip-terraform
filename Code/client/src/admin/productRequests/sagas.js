import { call, put, takeLatest, takeEvery, select } from 'redux-saga/effects';
import { request, readBlobError, buildQueryString } from '../../common/helpers';
import { setSuccess } from '../../common/actions';
import { downloadFile } from '../../common/utils';

import {
  GET_PRODUCT_REQUESTS_LIST,
  GET_PRODUCT_REQUESTS_DETAILS_BY_ID,
  UPDATE_PRODUCT_REQUESTS_DETAILS,
  DELETE_PRODUCT_REQUESTS_LIST,
  DELETE_PRODUCT_REQUESTS_BY_ID,
  UPDATE_PRODUCT_REQUESTS_STATUS,
  UNMOUNT_CLEAR_PRODUCT_REQUESTS_DETAILS,
  IMPORT_PRODUCT_ORDER,
  DOWNLOAD_QR_CODE,
  ADD_PRODUCT_REQUEST_NOTE,
  FETCH_PRODUCT_REQUEST_NOTES,
  DELETE_PRODUCT_REQUEST_NOTE,
  UPDATE_PRODUCT_REQUEST_NOTE,
  CREATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_REQUESTS_DELIVERY_STATUS,
  UPDATE_PRODUCT_REQUEST_DRAFT,
} from './constants/actionTypes';

import {
  setProductRequestsList2State,
  putProductRequestsDetails2State,
  clearProductRequestsDetails2State,
  importProductOrderStart,
  importProductOrderSuccessed,
  importProductOrderFailed,
  getProductRequestsDetailsById,
  downloadQRCodeStart,
  downloadQRCodeSuccessed,
  downloadQRCodeFailed,

  fetchBinRequestNotes,
  setNoteState,
  createProductRequestSuccess,
  createProductRequestFailure,
  updateProductRequestDraftSuccess,
} from './actions';

function* getProductRequestsList(action) {
  const { resolve, reject, payload } = action;

  const filters = payload.filters || {}
  const { flexiskipFilter, partnerDeliveredFilter } = filters;

  const searchString = payload.search ? `&s=${payload.search}` : '';
  const statusQuery = payload.status ? `&status=${payload.status}` : '';

  let producTypeFilterQuery = '';

  if (flexiskipFilter && partnerDeliveredFilter) producTypeFilterQuery = '';
  else if (flexiskipFilter) producTypeFilterQuery = `&partnerDelivered=false`;
  else if (partnerDeliveredFilter) producTypeFilterQuery = `&partnerDelivered=true`;

  try {
    const response = yield call(request, {
      // url: `admin/bin-requests?limit=${payload.limit}&page=${payload.page}`,
      url: `admin/bin-requests?limit=${payload.limit}&page=${payload.page}${searchString}${statusQuery}${producTypeFilterQuery}`,
      method: 'get',
      requestName: 'productRequestsList',
    });
    yield put(setProductRequestsList2State(response));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* getProductRequestsById(action) {
  const { resolve, reject, payload } = action;

  try {
    yield put(clearProductRequestsDetails2State());

    const response = yield call(request, {
      url: `admin/bin-requests/${payload.uid}`,
      method: 'get',
      requestName: 'productRequestsDetails',
    });

    yield put(putProductRequestsDetails2State(response));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* updateProductRequestsDetails(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `admin/bin-requests/${payload.uid}`,
      data: payload.data,
      method: 'put',
    });
    yield put(setSuccess('Product requests details have been updated successfully'));

    yield put(getProductRequestsDetailsById({
      userType: 'bin-requests',
      url: 'bin-requests',
      uid: payload.uid,
    }));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* deleteProductRequestsList(action) {
  const { resolve, reject, payload } = action;

  try {
    const response = yield call(request, {
      url: 'admin/bin-requests/status',
      data: {
        status: payload.status,
        binRequestIds: payload.ids,
      },
      method: 'put',
    });
    // yield put(setSuccess('Those product Requests have been deleted successfully'));
    // yield getProductRequestsList({ resolve, reject, payload: { limit: 10, page: 1 } });
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* deleteProductRequestsById(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: 'admin/bin-requests/status',
      data: {
        status: payload.status,
        binRequestIds: [payload.uid],
      },
      method: 'put',
    });
    // const response = yield call(request, {
    //   url: `admin/bin-requests/${payload.uid}`,
    //   method: 'delete',
    // });
    // yield put(setSuccess('This product requests has been deleted successfully'));
    // yield getProductRequestsList({ resolve, reject, payload: { limit: 10, page: 1 } });
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* updateBinDeliveryStatusById(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `admin/bins/${payload.uid}/status`,
      method: 'put',
      data: { status: payload.status },
    });
    yield put(setSuccess('This bin delivery status has been updated successfully! '));
    yield getProductRequestsList({ resolve, reject, payload: { limit: 10, page: 1 } });
    if (payload.productRequest) {
      yield getProductRequestsById({ resolve, reject, payload: { uid: payload.productRequest } });
    }
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* unmountClearProductRequestsDetails(action) {
  const { reject } = action;
  try {
    yield put(clearProductRequestsDetails2State());
  } catch (error) {
    reject(error);
  }
}

function* importProductOrderExecute(action) {
  const { payload } = action;
  try {
    yield put(importProductOrderStart());
    const response = yield call(request, {
      url: '/admin/bin-requests/import',
      method: 'post',
      data: payload,
      responseType: 'blob',
    });
    downloadFile(response.data, 'orders.pdf');
    yield put(importProductOrderSuccessed(response));
  } catch (error) {
    const errorJson = yield readBlobError(error.response.data);
    yield put(importProductOrderFailed(errorJson));
  }
}

function* executeDownloadQRCode(action) {
  const { payload } = action;
  try {
    yield put(downloadQRCodeStart());
    const response = yield call(request, {
      url: `/admin/bin-requests/${payload}/download-qr-code`,
      responseType: 'blob',
    });
    const attachment = response.headers['content-disposition'].replace('attachment; filename=', '');
    downloadFile(response.data, attachment);
    yield put(downloadQRCodeSuccessed(response));
  } catch (error) {
    const errorJson = yield readBlobError(error.response.data);
    yield put(downloadQRCodeFailed(errorJson));
  }
}

/**
 * Bin Request Notes
 */

function* executeAddBinRequestNote(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `admin/bin-requests/${payload.binRequest._id}/notes`,
      method: 'post',
      data: payload,
      requestName: 'addBinRequestNote',
    });
    yield put(setSuccess('Note added successfully.'));
    yield put(fetchBinRequestNotes(payload.binRequest._id));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* executeFetchBinRequestNotes(action) {
  const { resolve, reject, payload } = action;
  const { notePagination } = yield select(state => state.admin.manageDisputes.view);
  const { current: page, pageSize: limit } = notePagination;
  try {
    const response = yield call(request, {
      url: `admin/bin-requests/${payload}/notes?${buildQueryString({ page, limit })}`,
      method: 'get',
      requestName: 'fetchBinRequestNotes',
    });
    const newPag = { ...notePagination };
    newPag.total = parseInt(response.headers['x-pagination-total-count'], 10);
    yield put(setNoteState({
      notes: response.data,
      notePagination: newPag,
    }));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* executeDeleteBinRequestNote(action) {
  const { resolve, reject, payload: note } = action;
  try {
    const response = yield call(request, {
      url: `admin/bin-requests/notes/${note._id}`,
      method: 'delete',
      requestName: 'deleteBinRequestNote',
    });
    yield put(setSuccess('Note removed successfully.'));
    yield put(fetchBinRequestNotes(note.binRequest));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* executeUpdateBinRequestNote(action) {
  const { resolve, reject, payload: note } = action;
  try {
    const response = yield call(request, {
      url: `admin/bin-requests/notes/${note._id}`,
      method: 'put',
      requestName: 'updateBinRequestNote',
      data: note,
    });
    yield put(setSuccess('Note updated successfully.'));
    yield put(fetchBinRequestNotes(note.binRequest));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* createProductRequestAction(action) {
  const { payload } = action;
  try {
    const response = yield call(request, {
      url: 'admin/bin-requests?dryRun=0',
      method: 'post',
      data: payload,
      hideMessage: true,
    });
    if (response.errors) {
      yield put(createProductRequestFailure(response.error));
    } else {
      yield put(createProductRequestSuccess(response.data));
    }
  } catch (error) {
    yield put(createProductRequestFailure(error));
  }
}

function* updateProductRequestDeliveryStatus(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `admin/bin-requests/${payload.uid}/delivery-status`,
      data: payload.data,
      method: 'put',
    });
    yield put(setSuccess('Product requests details have been updated successfully'));

    yield put(getProductRequestsDetailsById({
      userType: 'bin-requests',
      url: 'bin-requests',
      uid: payload.uid,
    }));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* updateProductRequestDraft(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: 'admin/bin-requests?dryRun=1',
      method: 'post',
      data: payload,
      hideMessage: true,
    });
    yield put(updateProductRequestDraftSuccess(response.data));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

export default function* productRequestsSaga() {
  yield takeEvery(GET_PRODUCT_REQUESTS_LIST, getProductRequestsList);
  yield takeEvery(GET_PRODUCT_REQUESTS_DETAILS_BY_ID, getProductRequestsById);
  yield takeLatest(UPDATE_PRODUCT_REQUESTS_DETAILS, updateProductRequestsDetails);
  yield takeLatest(DELETE_PRODUCT_REQUESTS_LIST, deleteProductRequestsList);
  yield takeLatest(DELETE_PRODUCT_REQUESTS_BY_ID, deleteProductRequestsById);
  yield takeLatest(UPDATE_PRODUCT_REQUESTS_STATUS, updateBinDeliveryStatusById);
  yield takeEvery(UNMOUNT_CLEAR_PRODUCT_REQUESTS_DETAILS, unmountClearProductRequestsDetails);
  yield takeLatest(IMPORT_PRODUCT_ORDER, importProductOrderExecute);
  yield takeLatest(DOWNLOAD_QR_CODE, executeDownloadQRCode);

  yield takeLatest(ADD_PRODUCT_REQUEST_NOTE, executeAddBinRequestNote);
  yield takeLatest(FETCH_PRODUCT_REQUEST_NOTES, executeFetchBinRequestNotes);
  yield takeLatest(DELETE_PRODUCT_REQUEST_NOTE, executeDeleteBinRequestNote);
  yield takeLatest(UPDATE_PRODUCT_REQUEST_NOTE, executeUpdateBinRequestNote);
  yield takeLatest(CREATE_PRODUCT_REQUEST, createProductRequestAction);
  yield takeLatest(UPDATE_PRODUCT_REQUESTS_DELIVERY_STATUS, updateProductRequestDeliveryStatus);
  yield takeLatest(UPDATE_PRODUCT_REQUEST_DRAFT, updateProductRequestDraft);
}
