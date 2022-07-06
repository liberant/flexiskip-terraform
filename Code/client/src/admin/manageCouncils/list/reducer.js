import { combineReducers } from 'redux';

import {
  SET_COUNCILS_LIST2STATE,
  SET_COUNCIL_DETAILS2STATE,
  GET_COUNCIL_DETAILS_BY_ID,
  PUT_COUNCIL_DETAIL2STATE,
  CLEAR_COUNCIL_DETAIL2STATE,
  PUT_COUNCIL_REGIONS_DEFINATIONS2STATE,
  SET_COUNCIL_PRODUCTS_LIST2STATE,
  PUT_COUNCIL_STATES_DEFINATIONS2STATE,
  SET_COUNCIL_OPTIONS,
} from './constants/actionTypes';

import { statesLocal } from './components/CouncilDetailsUpperSubForm';

/* eslint no-case-declarations: 0 */
/* eslint no-return-assign: 0 */
/* eslint no-underscore-dangle: 0 */

const initialCouncilsState = {
  data: [],
  pagination: {
    currentPage: 1,
    pageCount: 1,
    perPage: 10,
    totalCount: 1,
  },
  councilOptions: [],
  states: [],
  regions: [],
  postCodeOptions: [],
};

function reducer(state = initialCouncilsState, action) {
  switch (action.type) {
    case SET_COUNCILS_LIST2STATE:
      const { data, headers } = action.payload;
      const newCouncils = {
        data,
        pagination: {
          currentPage: headers['x-pagination-current-page'] >> 0,
          pageCount: headers['x-pagination-page-count'] >> 0,
          perPage: headers['x-pagination-per-page'] >> 0,
          totalCount: headers['x-pagination-total-count'] >> 0,
        },
      };

      return { ...state, ...newCouncils };
    case SET_COUNCIL_DETAILS2STATE:
      return { ...state, council: action.payload.data };
    case GET_COUNCIL_DETAILS_BY_ID:
      return { ...state, council: action.payload.data };
    case PUT_COUNCIL_DETAIL2STATE:
      return {
        ...state,
        council: action.payload.data,
      };
    case CLEAR_COUNCIL_DETAIL2STATE:
      return { ...state, council: null };
    case PUT_COUNCIL_REGIONS_DEFINATIONS2STATE:
      return { ...state, regions: action.payload.data };
    case PUT_COUNCIL_STATES_DEFINATIONS2STATE: {
      let newStates = [];

      if (action.payload.data && action.payload.data.constructor === Array) {
        newStates = action.payload.data.map((d) => {
          const tmpState = d;
          const stateLocal = statesLocal.find(s => s.name === d.name);
          tmpState.description = stateLocal ? stateLocal.description : '';
          return tmpState;
        });
      }

      return {
        ...state,
        states: newStates,
      };
    }
    case SET_COUNCIL_PRODUCTS_LIST2STATE:
      return { ...state, products: action.payload.data };

    case SET_COUNCIL_OPTIONS:
      return {
        ...state,
        councilOptions: action.payload.map(c => ({ label: c.name, value: c._id })),
      };

    default:
      return state;
  }
}

export default reducer;
