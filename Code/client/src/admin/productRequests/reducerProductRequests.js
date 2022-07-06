import { combineReducers } from 'redux';

import {
  SET_PRODUCT_REQUESTS_LIST2STATE,
  SET_PRODUCT_REQUESTS_DETAILS2STATE,
  GET_PRODUCT_REQUESTS_DETAILS_BY_ID,
  PUT_PRODUCT_REQUESTS_DETAIL2STATE,
  CLEAR_PRODUCT_REQUESTS_DETAIL2STATE,
  CHANGE_CURRENT_TAB,
  CHANGE_PER_PAGE,
  UPDATE_SEARCH_VALUE,
  UPDATE_FILTER_STATE,
  UPDATE_LOCATION_KEY,
  CHANGE_VIEW_MODE,

  IMPORT_PRODUCT_ORDER_REQUESTING,
  IMPORT_PRODUCT_ORDER_SUCCESSED,
  IMPORT_PRODUCT_ORDER_FAILED,

  DOWNLOAD_QR_CODE_REQUESTING,
  DOWNLOAD_QR_CODE_SUCCESSED,
  DOWNLOAD_QR_CODE_FAILED,

  SET_PRODUCT_REQUEST_NOTE_STATE,
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_REQUEST_SUCCESS,
  CREATE_PRODUCT_REQUEST_FAILURE,
  UPDATE_PRODUCT_REQUEST_DRAFT_SUCCESS,
} from './constants/actionTypes';

/* eslint no-case-declarations: 0 */
/* eslint no-return-assign: 0 */

const initialProductRequestsState = {
  data: [],
  pagination: {
    currentPage: 1,
    pageCount: 1,
    perPage: 10,
    totalCount: 1,
  },
  currentTab: 0,
  perPage: 10,
  expandAll: false,
  search: '',
  filters: {
    flexiskipFilter: false,
    partnerDeliveredFilter: false,
  },
  locationKey: null,
  viewMode: 0,
  importProductOrder: {
    requesting: false,
    error: null,
    data: null,
  },
  downloadQRCode: {
    requesting: false,
    error: null,
    data: null,
  },

  notes: [],
  notePagination: {
    total: 1,
    pageSize: 5,
    current: 1,
  },
  createProductRequest: {
    requesting: false,
    error: null,
    productRequestDraft: {},
    product: null,
  },
};

function productRequests(state = initialProductRequestsState, action) {
  switch (action.type) {
    case SET_PRODUCT_REQUESTS_LIST2STATE:
      const { data, headers } = action.payload;
      const newProductRequests = {
        data: ((data.constructor === Array) && data) || [],
        pagination: {
          currentPage: headers['x-pagination-current-page'] >> 0,
          pageCount: headers['x-pagination-page-count'] >> 0,
          perPage: headers['x-pagination-per-page'] >> 0,
          totalCount: headers['x-pagination-total-count'] >> 0,
        },
      };

      return { ...state, ...newProductRequests };
    case SET_PRODUCT_REQUESTS_DETAILS2STATE:
      return { ...state, productRequests: action.payload.data };
    case GET_PRODUCT_REQUESTS_DETAILS_BY_ID:
      return { ...state, productRequests: action.payload.data };
    case PUT_PRODUCT_REQUESTS_DETAIL2STATE:
      const tmpProductRequests = action.payload.data;
      const { items, statusHistory } = tmpProductRequests;
      let tmpCustomerTypeLabel = '';
      switch (tmpProductRequests.customer.roles[0]) {
        case 'residentialCustomer':
          tmpCustomerTypeLabel = 'Residential Customer';
          break;
        case 'businessCustomer':
          tmpCustomerTypeLabel = 'Business Customer';
          break;
        default:
          tmpCustomerTypeLabel = 'Residential Customer';
          break;
      }
      tmpProductRequests.customer.userTypeLabel = tmpCustomerTypeLabel;
      let totalQuantity = 0;

      if (items && items.constructor === Array) {
        items.forEach((item) => {
          totalQuantity += item.quantity || 0;
        });
      }

      let orderDate = '';
      if (statusHistory && statusHistory.constructor === Array) {
        const tmpStatusHistory = statusHistory.find(s => s.status === 'Pending');
        if (tmpStatusHistory) {
          orderDate = tmpStatusHistory.createdAt;
        }
      }

      tmpProductRequests.orderDate = orderDate;


      return { ...state, productRequests: { ...tmpProductRequests, totalQuantity } };
    case CLEAR_PRODUCT_REQUESTS_DETAIL2STATE:
      return { ...state, productRequests: null };
    case CHANGE_CURRENT_TAB:
      return { ...state, currentTab: action.payload };
    case CHANGE_PER_PAGE:
      return { ...state, expandAll: action.payload };
    case UPDATE_SEARCH_VALUE:
      return { ...state, search: action.payload };
    case UPDATE_FILTER_STATE:
      return { ...state, filters: action.payload };
    case UPDATE_LOCATION_KEY:
      return { ...state, locationKey: action.payload };
    case CHANGE_VIEW_MODE: {
      return { ...state, viewMode: action.payload };
    }

    /**
     * import product order
     */
    case IMPORT_PRODUCT_ORDER_REQUESTING:
      return {
        ...state,
        importProductOrder: {
          ...initialProductRequestsState.importProductOrder,
          requesting: true,
        },
      };

    case IMPORT_PRODUCT_ORDER_SUCCESSED:
      return {
        ...state,
        importProductOrder: {
          ...initialProductRequestsState.importProductOrder,
          requesting: false,
          data: action.data,
        },
      };

    case IMPORT_PRODUCT_ORDER_FAILED:
      return {
        ...state,
        importProductOrder: {
          ...initialProductRequestsState.importProductOrder,
          requesting: false,
          data: null,
          error: action.error,
        },
      };

      /**
     * Download QR code
     */
    case DOWNLOAD_QR_CODE_REQUESTING:
      return {
        ...state,
        downloadQRCode: {
          ...initialProductRequestsState.downloadQRCode,
          requesting: true,
        },
      };

    case DOWNLOAD_QR_CODE_SUCCESSED:
      return {
        ...state,
        downloadQRCode: {
          ...initialProductRequestsState.downloadQRCode,
          requesting: false,
          data: action.data,
        },
      };

    case DOWNLOAD_QR_CODE_FAILED:
      return {
        ...state,
        downloadQRCode: {
          ...initialProductRequestsState.downloadQRCode,
          requesting: false,
          data: null,
          error: action.error,
        },
      };

    /**
     * Note
     */
    case SET_PRODUCT_REQUEST_NOTE_STATE:
      return { ...state, ...action.payload };

    case CREATE_PRODUCT_REQUEST:
      return {
        ...state,
        createProductRequest: {
          ...state.createProductRequest,
          requesting: true,
        },
      };
    case CREATE_PRODUCT_REQUEST_SUCCESS:
      return {
        ...state,
        createProductRequest: {
          requesting: false,
          productRequestDraft: {},
          error: null,
          product: action.payload,
        },
      };
    case CREATE_PRODUCT_REQUEST_FAILURE:
      return {
        ...state,
        createProductRequest: {
          ...state.createProductRequest,
          requesting: false,
          error: action.payload.errors,
        },
      };
    case UPDATE_PRODUCT_REQUEST_DRAFT_SUCCESS:
      return {
        ...state,
        createProductRequest: {
          requesting: false,
          productRequestDraft: action.payload,
          error: null,
        },
      };
    default:
      return state;
  }
}

export default combineReducers({
  productRequests,
});
