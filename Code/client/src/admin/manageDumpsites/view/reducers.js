import * as actionTypes from './constants/actionTypes';

const initialState = {
  dumpsite: null,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_DUMPSITE_DETAIL:
      return { ...state, dumpsite: action.payload };

    default:
      return state;
  }
}

export default reducer;
