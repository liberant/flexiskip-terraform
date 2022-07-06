import { combineReducers } from 'redux';

import {
  SET_MANAGE_TRANSACTIONS_LIST2STATE,
  SET_MANAGE_TRANSACTIONS_DETAILS2STATE,
  GET_MANAGE_TRANSACTIONS_DETAILS_BY_ID,
  PUT_MANAGE_TRANSACTIONS_DETAIL2STATE,
  CLEAR_MANAGE_TRANSACTIONS_DETAIL2STATE,
} from './constants/actionTypes';

/* eslint no-case-declarations: 0 */
/* eslint no-return-assign: 0 */

const initialTransactionsState = {
  data: [],
  pagination: {
    currentPage: 1,
    pageCount: 1,
    perPage: 10,
    totalCount: 1,
  },
};

function transactions(state = initialTransactionsState, action) {
  switch (action.type) {
    case SET_MANAGE_TRANSACTIONS_LIST2STATE:
      const { data, headers } = action.payload;
      let bins = [];
      const tmpData = data;

      if (data && data.constructor === Array) {
        data.forEach((d, i) => {
          bins = [];
          if (d.items && (d.items.constructor === Array) && d.items.length > 0) {
            d.items.forEach((item) => {
              bins.push(item.bin);
            });
            tmpData[i].bins = bins;
          }
        });
      }

      const newTransactions = {
        data: ((tmpData.constructor === Array) && tmpData) || [],
        pagination: {
          currentPage: headers['x-pagination-current-page'] >> 0,
          pageCount: headers['x-pagination-page-count'] >> 0,
          perPage: headers['x-pagination-per-page'] >> 0,
          totalCount: headers['x-pagination-total-count'] >> 0,
        },
      };

      return { ...state, ...newTransactions };
    case SET_MANAGE_TRANSACTIONS_DETAILS2STATE:
      return { ...state, transactions: action.payload.data };
    case GET_MANAGE_TRANSACTIONS_DETAILS_BY_ID:
      return { ...state, transactions: action.payload.data };
    case PUT_MANAGE_TRANSACTIONS_DETAIL2STATE:
      const tmpTransactions = action.payload.data;
      let tmpCustomerTypeLabel = '';
      switch (tmpTransactions.customer.userType) {
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
      tmpTransactions.customer.userTypeLabel = tmpCustomerTypeLabel;
      return { ...state, transaction: tmpTransactions };
    case CLEAR_MANAGE_TRANSACTIONS_DETAIL2STATE:
      return { ...state, transaction: null };
    default:
      return state;
  }
}

export default combineReducers({
  transactions,
});
