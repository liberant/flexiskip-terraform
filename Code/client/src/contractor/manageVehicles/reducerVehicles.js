import { combineReducers } from 'redux';

import {
  SET_VEHICLES_LIST2STATE,
  SET_VEHICLE_DETAILS2STATE,
  CLEAR_VEHICLE_DETAILS2STATE,
} from './constants/actionTypes';

/* eslint no-case-declarations: 0 */

const initialVehiclesState = {
  data: [],
  pagination: {
    currentPage: 1,
    pageCount: 1,
    perPage: 10,
    totalCount: 1,
  },
};

function vehicles(state = initialVehiclesState, action) {
  switch (action.type) {
    case SET_VEHICLES_LIST2STATE:
      const { data, headers } = action.payload;
      const newVehicles = {
        data,
        pagination: {
          currentPage: headers['x-pagination-current-page'] >> 0,
          pageCount: headers['x-pagination-page-count'] >> 0,
          perPage: headers['x-pagination-per-page'] >> 0,
          totalCount: headers['x-pagination-total-count'] >> 0,
        },
      };

      return { ...state, ...newVehicles };
    case SET_VEHICLE_DETAILS2STATE:
      const { createdBy, ...others } = action.payload.data;

      return { ...state, details: { addedBy: `${createdBy.firstname} ${createdBy.lastname}`, ...others } };
    case CLEAR_VEHICLE_DETAILS2STATE:
      return { ...state, details: null };
    default:
      return state;
  }
}

export default combineReducers({
  vehicles,
});
