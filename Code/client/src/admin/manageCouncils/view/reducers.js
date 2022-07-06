import * as actionTypes from './constants/actionTypes';

const initialState = {
  council: null,
  pagination: {
    total: 0,
    pageSize: 10,
    current: 1,
  },
};

function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case actionTypes.SET_COUNCIL_DETAIL:
      return {
        ...state,
        council: {
          ...payload,
          isActive: payload.status === 'Active',
        },
      };

    case actionTypes.SET_DUMPSITE_LIST_STATE:
      return {
        ...state,
        ...payload,
      };

    default:
      return state;
  }
}

export default reducer;
