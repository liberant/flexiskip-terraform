import * as actionTypes from './constants/actionTypes';

const initialState = {
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_ITEM:
      return { ...state, item: action.payload };

    default:
      return state;
  }
}

export default reducer;
