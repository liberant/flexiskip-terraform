import { combineReducers } from 'redux';

import {
  SET_ADMINS_LIST2STATE,
  SET_ADMIN_DETAILS2STATE,
  SET_CONTRACTOR_ADMIN_DETAILS2STATE,
  CLEAR_ADMIN_DETAILS2STATE,
  CLEAR_CONTRACTOR_ADMIN_DETAILS2STATE,
} from './constants/actionTypes';

/* eslint no-case-declarations: 0 */

const initialAdminsState = {
  list: {
    data: [],
    pagination: {
      currentPage: 1,
      pageCount: 1,
      perPage: 10,
      totalCount: 1,
    },
  },
  details: {},
};

function admins(state = initialAdminsState, action) {
  switch (action.type) {
    case SET_ADMINS_LIST2STATE:
      const { data, headers } = action.payload;
      const newAdmins = {
        data,
        pagination: {
          currentPage: headers['x-pagination-current-page'] >> 0,
          pageCount: headers['x-pagination-page-count'] >> 0,
          perPage: headers['x-pagination-per-page'] >> 0,
          totalCount: headers['x-pagination-total-count'] >> 0,
        },
      };

      return { ...state, list: newAdmins };
    case SET_ADMIN_DETAILS2STATE:
      return {
        ...state,
        details: action.payload.data,
      };
    case CLEAR_ADMIN_DETAILS2STATE:
      return { ...state, details: null };
    case SET_CONTRACTOR_ADMIN_DETAILS2STATE:
      const tmpList = state.list;
      tmpList.details = action.payload.data;
      if (tmpList.details && tmpList.details.roles && tmpList.details.roles.constructor === Array) {
        if (tmpList.details.roles.findIndex(t => t === 'driver') >= 0) {
          tmpList.details.isDriver = true;
        } else {
          tmpList.details.isDriver = false;
        }
      }
      return { ...state, list: tmpList };
    case CLEAR_CONTRACTOR_ADMIN_DETAILS2STATE:
      const tmpListClear = state.list;
      tmpListClear.details = null;
      return { ...state, list: tmpListClear };
    default:
      return state;
  }
}

export default combineReducers({
  admins,
});
