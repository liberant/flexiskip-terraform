import { combineReducers } from 'redux';

import {
  PUT_DASHBOAD_SUMMARY2STATE,
  PUT_DASHBOARD_REVENUE2STATE,
} from './constants/actionTypes';

/* eslint no-case-declarations: 0 */
/* eslint no-return-assign: 0 */
/* eslint no-underscore-dangle: 0 */

const initialDashboardState = {
  summary: {},
  revenue: {
    binReqRevenue: [{}],
    colReqRevenue: [{}],
  },
};

function dashboard(state = initialDashboardState, action) {
  switch (action.type) {
    case PUT_DASHBOAD_SUMMARY2STATE: {
      return { ...state, summary: action.payload.data };
    }
    case PUT_DASHBOARD_REVENUE2STATE: {
      return { ...state, revenue: action.payload.data };
    }
    default:
      return state;
  }
}

export default combineReducers({
  dashboard,
});
