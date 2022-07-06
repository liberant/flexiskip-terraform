import { combineReducers } from 'redux';

import { PUT_WASTE_TYPE_LIST2STATE } from './constants/actionTypes';

/* eslint no-case-declarations: 0 */
/* eslint no-return-assign: 0 */

const initialProductTypesState = {
  data: [],
};

function productTypes(state = initialProductTypesState, action) {
  switch (action.type) {
    case PUT_WASTE_TYPE_LIST2STATE:
      const { data } = action.payload;

      return { ...state, data };

    default:
      return state;
  }
}

export default combineReducers({
  productTypes,
});
