import { combineReducers } from 'redux';

import {
  SET_CUSTOMERS_LIST2STATE,
  SET_CUSTOMER_DETAILS2STATE,
  CLEAR_CUSTOMER_DETAILS2STATE,
  SET_CONTRACTOR_LIST2STATE,
  SET_TAB,
  SET_BUSINESS_CUSTOMER_LIST2STATE,
  SET_COUNCIL_LIST2STATE,

  SET_USER_TRANSACTION_HISTORY,
  SET_USER_TRANSACTION_HISTORY_LOADING,

  CREATE_NEW_CONNECTED_USER_START,
  CREATE_NEW_CONNECTED_USER_COMPLETED,
  CREATE_NEW_CONNECTED_USER_FAILED,
  CLEAR_CREATE_NEW_CONNECTED_USER,
} from './constants/actionTypes';

/* eslint no-case-declarations: 0 */

const initialCustomersState = {
  tab: 0,
  data: [],
  pagination: {
    currentPage: 1,
    pageCount: 1,
    perPage: 10,
    totalCount: 1,
  },
  userTransactionHistory: {
    data: [],
    loading: false,
    pagination: {
      current: 1,
      pageSize: 10,
      total: 1,
    },
  },
  addConnectedUser: {
    loading: false,
    data: null,
    error: null,
  },
};

function customers(state = initialCustomersState, action) {
  switch (action.type) {
    case SET_CUSTOMERS_LIST2STATE:
      const { data, headers } = action.payload;
      const newCustomers = {
        data,
        pagination: {
          currentPage: headers['x-pagination-current-page'] >> 0,
          pageCount: headers['x-pagination-page-count'] >> 0,
          perPage: headers['x-pagination-per-page'] >> 0,
          totalCount: headers['x-pagination-total-count'] >> 0,
        },
      };

      return { ...state, ...newCustomers };
    case SET_CUSTOMER_DETAILS2STATE:
      return { ...state, details: action.payload.data };
    case CLEAR_CUSTOMER_DETAILS2STATE:
      return { ...state, details: null };
    case SET_CONTRACTOR_LIST2STATE: {
      const { data } = action.payload;

      let newContractors = [];
      if (data && (data.constructor === Array)) {
        newContractors = data.map(d => ({
          name: `${d.firstname} ${d.lastname}`,
          email: d.email,
          uId: d.uId,
          id: d._id,
          status: d.status,
          organisation: d.organisation,
        }));
      }

      return { ...state, contractorList: newContractors };
    }
    case SET_COUNCIL_LIST2STATE:{
      const councilOptions = action.payload.data.map(c => {
        return {
          label: c.name,
          value: c._id
        }
      })
      return { ...state, councilList: councilOptions };
    }

    case SET_TAB:
      return { ...state, tab: action.payload };

    case SET_USER_TRANSACTION_HISTORY_LOADING:
      return {
        ...state,
        userTransactionHistory: {
          ...initialCustomersState.userTransactionHistory,
          loading: action.payload,
        },
      };

    case SET_USER_TRANSACTION_HISTORY:
      return {
        ...state,
        userTransactionHistory: {
          ...state.userTransactionHistory,
          data: action.payload.data,
          pagination: {
            current: action.payload.headers['x-pagination-current-page'] >> 0,
            pageSize: action.payload.headers['x-pagination-per-page'] >> 0,
            total: action.payload.headers['x-pagination-total-count'] >> 0,
          },
        },
      };

    case CREATE_NEW_CONNECTED_USER_START:
      // console.log('hdhdhdhd')
      return {
        ...state,
        addConnectedUser: {
          data: null,
          error: null,
          loading: true,
        },
      };

    case CREATE_NEW_CONNECTED_USER_COMPLETED:
      return {
        ...state,
        addConnectedUser: {
          data: action.payload,
          error: null,
          loading: false,
        },
      };

    case CREATE_NEW_CONNECTED_USER_FAILED:
      return {
        ...state,
        addConnectedUser: {
          data: null,
          error: action.payload,
          loading: false,
        },
      };
    case CLEAR_CREATE_NEW_CONNECTED_USER:
      return {
        ...state,
        addConnectedUser: { ...initialCustomersState.addConnectedUser },
      };

    default:
      return state;
  }
}

export default combineReducers({
  customers,
});
