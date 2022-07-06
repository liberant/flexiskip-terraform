import { combineReducers } from 'redux';

import {
  SET_ADVERTISING_LIST2STATE,
  SET_ADVERTISING_DETAILS2STATE,
  GET_ADVERTISING_DETAILS_BY_ID,
  PUT_ADVERTISING_DETAIL2STATE,
  CLEAR_ADVERTISING_DETAIL2STATE,
} from './constants/actionTypes';

/* eslint no-case-declarations: 0 */
/* eslint no-return-assign: 0 */
/* eslint no-underscore-dangle: 0 */

const initialAdvertisingState = {
  data: [],
  pagination: {
    currentPage: 1,
    pageCount: 1,
    perPage: 10,
    totalCount: 1,
  },
};

function advertising(state = initialAdvertisingState, action) {
  switch (action.type) {
    case SET_ADVERTISING_LIST2STATE:
      const { data, headers } = action.payload;
      const newAdvertising = {
        data,
        pagination: {
          currentPage: headers['x-pagination-current-page'] >> 0,
          pageCount: headers['x-pagination-page-count'] >> 0,
          perPage: headers['x-pagination-per-page'] >> 0,
          totalCount: headers['x-pagination-total-count'] >> 0,
        },
      };

      return { ...state, ...newAdvertising };
    case SET_ADVERTISING_DETAILS2STATE:
      return { ...state, advertising: action.payload.data };
    case GET_ADVERTISING_DETAILS_BY_ID:
      return { ...state, advertising: action.payload.data };
    case PUT_ADVERTISING_DETAIL2STATE:
      return {
        ...state,
        advertisingDetails: action.payload.data,
      };
    case CLEAR_ADVERTISING_DETAIL2STATE:
      return { ...state, advertising: null };
    default:
      return state;
  }
}

export default combineReducers({
  advertising,
});
