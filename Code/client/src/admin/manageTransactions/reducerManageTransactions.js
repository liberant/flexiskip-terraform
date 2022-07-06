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

const initialManageTransactionsState = {
  data: [],
  pagination: {
    total: 0,
    pageSize: 10,
    current: 1,
  },
};

function manageTransactions(state = initialManageTransactionsState, action) {
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

      const newManageTransactions = {
        data: ((tmpData.constructor === Array) && tmpData) || [],
        pagination: {
          current: headers['x-pagination-current-page'] >> 0,
          pageSize: headers['x-pagination-per-page'] >> 0,
          total: headers['x-pagination-total-count'] >> 0,
        },
      };

      return { ...state, ...newManageTransactions };
    case SET_MANAGE_TRANSACTIONS_DETAILS2STATE:
      return { ...state, manageTransactions: action.payload.data };
    case GET_MANAGE_TRANSACTIONS_DETAILS_BY_ID:
      return { ...state, manageTransactions: action.payload.data };
    case PUT_MANAGE_TRANSACTIONS_DETAIL2STATE:
      const tmpManageTransactions = action.payload.data;
      let tmpCustomerTypeLabel = '';
      switch (tmpManageTransactions.customer.userType) {
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
      tmpManageTransactions.customer.userTypeLabel = tmpCustomerTypeLabel;
      return { ...state, manageTransactions: tmpManageTransactions };
    case CLEAR_MANAGE_TRANSACTIONS_DETAIL2STATE:
      return { ...state, manageTransactions: null };
    default:
      return state;
  }
}

export default combineReducers({
  manageTransactions,
});
