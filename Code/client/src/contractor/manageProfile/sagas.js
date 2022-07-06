import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';

import { request } from '../../common/helpers';
import { setSuccess, updateUser } from '../../common/actions';

import {
  CREATE_ADMIN_USER,
  GET_ADMINS_LIST,
  GET_ADMIN_DETAILS,
  UPDATE_ADMIN_DETAILS,
  // DELETE_ADMINS_LIST,
  // DELETE_ADMIN_BY_ID,
  // UPDATE_ADMIN_STATUS,
  UPDATE_ADMINS_STATUS,
  UPDATE_CONTRACTOR_STATUS,
  UNMOUNT_CLEAR_ADMIN_DETAILS,
  GET_CONTRACTOR_ADMIN_DETAILS,
  UPDATE_CONTRACTOR_ADMIN_DETAILS,
  UPDATE_BANK_INFORMATION,
  UPDATE_PAYMENT_INFORMATION,
} from './constants/actionTypes';

import {
  setAdminsList2State,
  setAdminDetails2State,
  setContractorAdminDetails2State,
  clearAdminDetails2State,
  clearContractorAdminDetails2State,
} from './actions';

function* createAdminUser(action) {
  const { resolve, reject, payload } = action;
  if (!payload.data) {
    return;
  }

  const { phone, ...rest } = payload.data;
  const trimPhone = phone.replace(/[^\d]/g, '');
  try {
    const response = yield call(request, {
      url: 'contractor/admins',
      method: 'post',
      data: { phone: trimPhone, ...rest },
    });
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* getAdminsList(action) {
  const { resolve, reject, payload } = action;

  try {
    const response = yield call(request, {
      // url: `admin/${payload.url}?limit=${payload.limit}&page=${payload.page}`,
      url: `contractor/admins?limit=${payload.limit}&page=${payload.page}&s=${payload.s || ''}`,
      method: 'get',
      requestName: 'adminsList',
    });
    yield put(setAdminsList2State(response));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* getAdminDetails(action) {
  const { resolve, reject } = action;

  try {
    yield put(clearAdminDetails2State());
    const response = yield call(request, {
      url: 'contractor/account/profile',
      method: 'get',
      requestName: 'adminDetails',
    });
    yield put(setAdminDetails2State(response));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* getContractorAdminDetails(action) {
  const { resolve, reject, payload } = action;

  try {
    yield put(clearContractorAdminDetails2State());
    const response = yield call(request, {
      url: `contractor/admins/${payload.uid}`,
      method: 'get',
      requestName: 'contractorAdminDetails',
    });
    yield put(setContractorAdminDetails2State(response));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* updateBankInformation(action) {
  const { resolve, reject, payload } = action;

  try {
    const response = yield call(request, {
      url: 'contractor/account/profile/bank',
      method: 'put',
      data: payload.data,
    });
    yield put(setSuccess('Bank information has been updated successfully.'));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* updatePaymentInformation(action) {
  const { resolve, reject, payload } = action;

  try {
    const response = yield call(request, {
      url: 'contractor/account/profile/payment',
      method: 'put',
      data: payload.data,
    });
    yield put(setSuccess('Payment information has been updated successfully.'));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* updateContractorAdminDetails(action) {
  const { resolve, reject, payload } = action;
  if (!payload.data) {
    return;
  }

  const { phone, ...rest } = payload.data;
  const trimPhone = phone.replace(/[^\d]/g, '');

  try {
    const response = yield call(request, {
      url: `contractor/admins/${payload.uid}`,
      method: 'put',
      data: { phone: trimPhone, ...rest },
    });
    yield put(setSuccess('Admin details have been updated successfully.'));

    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* updateAdminDetails(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: 'contractor/account/profile',
      data: payload.data,
      method: 'put',
    });
    yield put(setSuccess('Admin details have been updated successfully'));
    yield put(updateUser(response.data));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

// function* deleteAdminsList(action) {
//   const { resolve, reject, payload } = action;
//   try {
//     const response = yield call(request, {
//       url: `admin/${payload.url}`,
//       data: payload.data,
//       method: 'delete',
//     });
//     yield put(setSuccess('Those admins have been deleted successfully'));
//     getAdminsList({ resolve, reject, payload: { limit: 10, page: 1, url: payload.url } });
//     resolve(response);
//   } catch (error) {
//     reject(error);
//   }
// }

// function* deleteAdminById(action) {
//   const { resolve, reject, payload } = action;
//   try {
//     const response = yield call(request, {
//       url: `admin/${payload.url}/${payload.uid}`,
//       method: 'delete',
//     });
//     yield put(setSuccess('This admin has been deleted successfully'));
//     yield getAdminsList({ resolve, reject, payload: { limit: 10, page: 1, url: payload.url } });
//     resolve(response);
//   } catch (error) {
//     reject(error);
//   }
// }

// function* updateAdminStatusById(action) {
//   const { resolve, reject, payload } = action;
//   try {
//     const response = yield call(request, {
//       url: `admin/${payload.url}/${payload.uid}/status`,
//       method: 'put',
//       data: { status: payload.status },
//     });
//     yield put(setSuccess('This admin status has been updated successfully! '));
//     yield getAdminsList({ resolve, reject, payload: { limit: 10, page: 1, url: payload.url } });
//     resolve(response);
//   } catch (error) {
//     reject(error);
//   }
// }

function* updateAdminsStatus(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: 'contractor/admins/status',
      method: 'put',
      data: {
        status: payload.status,
        ids: payload.ids,
      },
    });
    yield put(setSuccess('Those admin(s) status has(ve) been updated successfully! '));
    yield getAdminsList({ resolve, reject, payload: { limit: 1000, page: 1, url: payload.url } });
  } catch (error) {
    reject(error);
  }
}

function* updateContractorStatus(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: 'contractor/account/status',
      method: 'put',
      data: {
        status: payload.status,
      },
    });
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

function* unmountClearAdminDetails(action) {
  const { reject } = action;
  try {
    yield put(clearAdminDetails2State());
  } catch (error) {
    reject(error);
  }
}

export default function* accountsSaga() {
  yield takeEvery(CREATE_ADMIN_USER, createAdminUser);
  yield takeEvery(GET_ADMINS_LIST, getAdminsList);
  yield takeEvery(GET_ADMIN_DETAILS, getAdminDetails);
  yield takeLatest(UPDATE_ADMIN_DETAILS, updateAdminDetails);
  // yield takeLatest(DELETE_ADMINS_LIST, deleteAdminsList);
  // yield takeLatest(DELETE_ADMIN_BY_ID, deleteAdminById);
  // yield takeLatest(UPDATE_ADMIN_STATUS, updateAdminStatusById);
  yield takeLatest(UPDATE_ADMINS_STATUS, updateAdminsStatus);
  yield takeEvery(UPDATE_BANK_INFORMATION, updateBankInformation);
  yield takeEvery(UPDATE_PAYMENT_INFORMATION, updatePaymentInformation);
  yield takeEvery(UPDATE_CONTRACTOR_STATUS, updateContractorStatus);
  yield takeEvery(GET_CONTRACTOR_ADMIN_DETAILS, getContractorAdminDetails);
  yield takeEvery(UPDATE_CONTRACTOR_ADMIN_DETAILS, updateContractorAdminDetails);
  yield takeEvery(UNMOUNT_CLEAR_ADMIN_DETAILS, unmountClearAdminDetails);
}
