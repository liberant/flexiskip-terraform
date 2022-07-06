import * as actionTypes from './constants/actionTypes';

const initialState = {
  discount: null,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_DISCOUNT_DETAIL:
      return { ...state, discount: action.payload };

    default:
      return state;
  }
}

export default reducer;
