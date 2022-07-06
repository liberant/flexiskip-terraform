import * as actionTypes from './constants/action-types';

const initialState = {
  items: [],
  search: '',
  pagination: {
    total: 0,
    pageSize: 10,
    current: 1,
  },
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_STATE:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}

export default reducer;
