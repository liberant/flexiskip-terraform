import { combineReducers } from 'redux';

import {
  SET_SUPPLIERS,
} from './constants/actionTypes';

const initialState = {
  list: []
}
function supplier(state = initialState, action) {
  switch (action.type) {
    case SET_SUPPLIERS:
      const {data} = action.payload;
      return {
          ...state,
          list: data,
      };
    default:
      return state;
  }
}

export default supplier;
