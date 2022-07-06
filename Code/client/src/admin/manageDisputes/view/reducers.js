import * as actionTypes from './constants/actionTypes';

const initialState = {
  dispute: null,
  notes: [],
  notePagination: {
    total: 0,
    pageSize: 5,
    current: 1,
  },
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_DISPUTE_DETAIL:
      return { ...state, dispute: action.payload };

    case actionTypes.SET_NOTE_STATE:
      return { ...state, ...action.payload };

    default:
      return state;
  }
}

export default reducer;
