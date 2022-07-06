import { call, put, takeLatest, takeEvery } from "redux-saga/effects";

import { stopSubmit } from "redux-form";

import { getHttpErrorMessages } from "../../common/utils/common";
import { request, buildQueryString } from "../../common/helpers";
import { setSuccess } from "../../common/actions";

import {
  GET_CUSTOMERS_LIST,
  GET_CUSTOMER_DETAILS_BY_ID,
  UPDATE_CUSTOMER_DETAILS,
  DELETE_CUSTOMERS_LIST,
  DELETE_CUSTOMER_BY_ID,
  UPDATE_CUSTOMER_STATUS,
  UPDATE_CUSTOMERS_STATUS,
  UNMOUNT_CLEAR_CUSTOMER_DETAILS,
  ADM_RESET_CUSTOMER_PASSWORD,
  ADD_NEW_CUSTOMER,
  GET_USER_TRANSACTION_HISTORY,
  CREATE_NEW_CONNECTED_USER,

  GET_COUNCIL_LIST,
} from "./constants/actionTypes";

import {
  setCustomersList2State,
  setCustomerDetails2State,
  clearCustomerDetails2State,
  setContractorList2State,
  setUserTransactionHistory,
  setUserTransactionHistoryLoading,
  createNewConnectedUserStart,
  createNewConnectedUserCompleted,
  createNewConnectedUserFailed,
  setCouncilList2State,
} from "./actions";

/* eslint no-nested-ternary: 0 */

function* createNewCustomer(action) {
  const { resolve, reject, payload } = action;
  if (!payload.data) {
    return;
  }

  const { abn, phone, contact, company, ...rest } = payload.data;
  let trimAbn = "";
  let trimPhone = "";
  let tmpData = payload.data;

  if (phone) {
    trimPhone = phone.replace(/[^\d]/g, "");

    if (abn) {
      trimAbn = abn.replace(/[^\d]/g, "");
      tmpData = { phone: trimPhone, abn: trimAbn, ...rest };
    } else {
      tmpData = { phone: trimPhone, ...rest };
    }
  }

  if (contact) {
    const tmpContact = contact;
    const tmpCompany = company;

    if (contact.phone) {
      trimPhone = contact.phone.replace(/[^\d]/g, "");
      tmpContact.phone = trimPhone;
    }
    if (company.abn) {
      tmpCompany.abn = company.abn.replace(/[^\d]/g, "");
    }

    tmpData = {
      company: tmpCompany,
      contact: tmpContact,
      ...rest,
    };
  }

  if (payload.data.organisation) {
    tmpData.organisation = payload.data.organisation;
  }

  try {
    const response = yield call(request, {
      url: `/admin/${payload.url}`,
      method: "post",
      data: tmpData,
      requestName: "createNewUser",
    });
    yield put(setSuccess(""));
    // yield put(setSuccess('The new customer has been created successfully'));
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

function* getCustomersList(action) {
  const { resolve, reject, payload } = action;
  const isPrimaryQuery =
    payload.type === "businessCustomer" ? "&isPrimary=true" : "";
  try {
    const response = yield call(request, {
      url: `admin/users?${buildQueryString(payload)}${isPrimaryQuery}`,
      method: "get",
      requestName: "customersList",
    });

    if (payload.type === "contractor" && payload.limit > 100) {
      yield put(setContractorList2State(response));
    } else {
      yield put(setCustomersList2State(response));
    }
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

function* getCustomerById(action) {
  const { resolve, reject, payload } = action;

  try {
    yield put(clearCustomerDetails2State());
    const response = yield call(request, {
      // url: `admin/${payload.url}/${payload.uid}`,
      url: `admin/users/${payload.uid}`,
      method: "get",
      requestName: "customerDetails",
    });
    yield put(setCustomerDetails2State(response));
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

function* updateCustomerDetailsById(action) {
  const { resolve, reject, payload } = action;
  if (!payload.data) {
    return;
  }

  const { abn, phone, company, ...rest } = payload.data;
  let trimAbn = "";
  let trimPhone = "";
  let tmpData = payload.data;

  if (phone) {
    trimPhone = phone.replace(/[^\d]/g, "");

    if (abn) {
      trimAbn = abn.replace(/[^\d]/g, "");
      tmpData = { phone: trimPhone, abn: trimAbn, ...rest };
    } else {
      tmpData = { phone: trimPhone, ...rest };
    }
  }

  if (company) {
    trimPhone = company.phone.replace(/[^\d]/g, "");
    const tmpCompany = company;
    tmpCompany.phone = trimPhone;
    if (company.abn) {
      tmpCompany.abn = company.abn.replace(/[^\d]/g, "");
    }

    tmpData = { company: tmpCompany, ...rest };
  }

  let productPricing;
  if (tmpData.productPricing) {
    productPricing = [...tmpData.productPricing];
    delete tmpData.productPricing;
  }

  try {
    // update customer
    const response = yield call(request, {
      url: `admin/${payload.url}/${payload.uid}`,
      data: tmpData,
      method: "put",
    });

    // update prices
    if (productPricing) {
      yield call(request, {
        url: `admin/${payload.url}/${payload.uid}/prices`,
        data: productPricing,
        method: "put",
      });
    }

    // yield put(setSuccess('Customer details have been updated successfully'));
    if (response) {
      yield put(setSuccess(""));
      resolve(response);
    }
  } catch (error) {
    const errorMessages = getHttpErrorMessages(error);

    if (errorMessages) {
      reject({ message: errorMessages });
    } else {
      reject(error);
    }
  }
}

function* deleteCustomersList(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `admin/${payload.url}`,
      data: payload.data,
      method: "delete",
    });
    yield put(setSuccess("Those customers have been deleted successfully"));
    getCustomersList({
      resolve,
      reject,
      payload: { limit: 10, page: 1, url: payload.url },
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

function* deleteCustomerById(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `admin/${payload.url}/${payload.uid}`,
      method: "delete",
    });
    yield put(setSuccess("This customer has been deleted successfully"));
    yield getCustomersList({
      resolve,
      reject,
      payload: { limit: 10, page: 1, url: payload.url },
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

function* updateCustomerStatusById(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `admin/${payload.url}/${payload.uid}/status`,
      method: "put",
      data: { status: payload.status },
    });
    yield put(
      setSuccess("This customer status has been updated successfully! ")
    );
    yield getCustomersList({
      resolve,
      reject,
      payload: { limit: 10, page: 1, url: payload.url },
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

function* updateCustomersStatus(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      // url: 'admin/customers/status',
      url: "admin/users/status",
      method: "put",
      data: {
        status: payload.status,
        ids: payload.ids,
      },
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

function* unmountClearCustomerDetails(action) {
  const { reject } = action;
  try {
    yield put(clearCustomerDetails2State());
  } catch (error) {
    reject(error);
  }
}

function* executeGetUserTransactionsHistoryList(action) {
  const { resolve, reject, payload } = action;
  const { userId, search, limit, page, name, sortedInfo } = payload;
  const paramSearch = `&s=${search || ""}`;
  const sortColumn = `&sort=${sortedInfo ? sortedInfo.column : ""}`;
  const sortDirection = `&dir=${
    sortedInfo ? (sortedInfo.direction === "ascend" ? "asc" : "desc") : ""
  }`;
  try {
    yield put(setUserTransactionHistoryLoading(true));
    const response = yield call(request, {
      url: `/admin/users/${userId}/transactions?limit=${limit}&page=${page}&type=${name}${paramSearch}${sortColumn}${sortDirection}`,
      method: "get",
      requestName: "TransactionHistory",
    });
    resolve(response);
    yield put(setUserTransactionHistoryLoading(false));
    yield put(setUserTransactionHistory(response));
  } catch (error) {
    reject(error);
    yield put(setUserTransactionHistoryLoading(false));
  }
}

function* resetCustomerPasswordByAdmin(action) {
  const { reject, resolve, payload } = action;
  try {
    const response = yield call(request, {
      // url: `admin/${payload.url}/password-reset/requests`,
      url: `admin/users/${payload.uid}/reset-pwd-request`,
      method: "POST",
      requestName: "resetCustomerPassword",
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

function* executeCreateNewConnectedUser(action) {
  const { reject, resolve, payload } = action;
  try {
    let tmpPhone = "";
    if (payload.phone) {
      tmpPhone = payload.phone.replace(/[^\d]/g, "");
    }

    yield put(createNewConnectedUserStart());
    const response = yield call(request, {
      url: "/admin/bus-customers/connected-user",
      method: "POST",
      requestName: "createNewConnectedUser",
      data: { ...payload, phone: tmpPhone },
      hideMessage: true,
    });
    yield put(createNewConnectedUserCompleted({}));
    resolve(response);
  } catch (error) {
    yield put(createNewConnectedUserFailed(error));
    const errors = {};
    /* eslint prefer-destructuring: 0 */
    Object.keys(error.response.data.errors).forEach((key) => {
      errors[key] = error.response.data.errors[key][0];
    });
    yield put(stopSubmit("addConnectedUser", errors));
    reject(error);
  }
}


function* getCouncilList(action) {
  const { resolve, reject, payload } = action;
  try {
    const response = yield call(request, {
      url: `admin/councils?limit=99999&excludeDumpsiteCount=true`,
      method: "get",
      requestName: "councilList",
    });

    yield put(setCouncilList2State(response));
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

export default function* accountsSaga() {
  yield takeEvery(GET_CUSTOMERS_LIST, getCustomersList);
  yield takeEvery(GET_CUSTOMER_DETAILS_BY_ID, getCustomerById);
  yield takeLatest(UPDATE_CUSTOMER_DETAILS, updateCustomerDetailsById);
  yield takeLatest(DELETE_CUSTOMERS_LIST, deleteCustomersList);
  yield takeLatest(DELETE_CUSTOMER_BY_ID, deleteCustomerById);
  yield takeLatest(UPDATE_CUSTOMER_STATUS, updateCustomerStatusById);
  yield takeLatest(UPDATE_CUSTOMERS_STATUS, updateCustomersStatus);
  yield takeEvery(UNMOUNT_CLEAR_CUSTOMER_DETAILS, unmountClearCustomerDetails);
  yield takeEvery(ADM_RESET_CUSTOMER_PASSWORD, resetCustomerPasswordByAdmin);
  yield takeEvery(ADD_NEW_CUSTOMER, createNewCustomer);
  yield takeEvery(
    GET_USER_TRANSACTION_HISTORY,
    executeGetUserTransactionsHistoryList
  );
  yield takeLatest(CREATE_NEW_CONNECTED_USER, executeCreateNewConnectedUser);
  yield takeEvery(GET_COUNCIL_LIST, getCouncilList);
}
