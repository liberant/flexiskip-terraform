import { combineReducers } from 'redux';

// import _ from 'lodash';
// import Australia from './components/subcomponents/australia';
import {
  PUT_DASHBOAD_SUMMARY2STATE,
  PUT_DASHBOARD_RATE2STATE,
  PUT_DASHBOARD_REVENUE2STATE,
  PUT_DASHBOARD_AVERATETIME2STATE,
  PUT_DASHBOARD_JOBS2STATE,
  PUT_DASHBOARD_RISK2STATE,
  PUT_DASHBOARD_INACTIVE2STATE,
  MANUALLY_DASHBOARD_JOB_UPDATE,
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
  rate: [{}],
  averageTime: {
    states: [],
    total: {},
  },
  jobList: {
    data: [],
    pagination: {
      currentPage: 1,
      pageCount: 1,
      perPage: 10,
      totalCount: 1,
    },
  },
  riskList: {
    data: [],
    pagination: {
      currentPage: 1,
      pageCount: 1,
      perPage: 10,
      totalCount: 1,
    },
  },
  inactiveList: {
    data: [],
    pagination: {
      currentPage: 1,
      pageCount: 1,
      perPage: 10,
      totalCount: 1,
    },
  },
};

const sumReduce = key => (total, d) => total + d[key];
const decideToFixedNumber = (value) => {
  if (Number.isInteger(value)) {
    return value;
  }
  return value.toFixed(2);
};

function dashboard(state = initialDashboardState, action) {
  switch (action.type) {
    case PUT_DASHBOAD_SUMMARY2STATE: {
      return { ...state, summary: action.payload.data };
    }
    case PUT_DASHBOARD_REVENUE2STATE: {
      return { ...state, revenue: action.payload.data };
    }
    case PUT_DASHBOARD_RATE2STATE: {
      return { ...state, rate: action.payload.data };
    }
    case PUT_DASHBOARD_AVERATETIME2STATE: {
      const { data } = action.payload;
      if (!data || data.constructor !== Array || data.length < 1) {
        return {
          ...state,
          averageTime: {
            states: data,
            total: {
              binReqRev: 0,
              colReqRev: 0,
              totalRev: 0,
            },
          },
        };
      }
      const sortedData = data.sort((a, b) => (a.totalRev - b.totalRev));

      const total = {
        binReqRev: decideToFixedNumber(sortedData.reduce(sumReduce('binReqRev'), 0) || 0),
        colReqRev: decideToFixedNumber(sortedData.reduce(sumReduce('colReqRev'), 0) || 0),
        totalRev: decideToFixedNumber(sortedData.reduce(sumReduce('totalRev'), 0) || 0),
      };

      return {
        ...state,
        averageTime: {
          states: sortedData,
          total,
        },
      };
    }

    case PUT_DASHBOARD_JOBS2STATE: {
      const { data, headers } = action.payload;
      const newJobs = {
        data,
        pagination: {
          currentPage: headers['x-pagination-current-page'] >> 0,
          pageCount: headers['x-pagination-page-count'] >> 0,
          perPage: headers['x-pagination-per-page'] >> 0,
          totalCount: headers['x-pagination-total-count'] >> 0,
        },
      };
      return { ...state, jobList: newJobs };
    }
    case MANUALLY_DASHBOARD_JOB_UPDATE: {
      return {
        ...state,
        jobList: action.payload,
      };
    }
    case PUT_DASHBOARD_RISK2STATE: {
      const { data, headers } = action.payload;
      const newRisk = {
        data,
        pagination: {
          currentPage: headers['x-pagination-current-page'] >> 0,
          pageCount: headers['x-pagination-page-count'] >> 0,
          perPage: headers['x-pagination-per-page'] >> 0,
          totalCount: headers['x-pagination-total-count'] >> 0,
        },
      };
      return { ...state, riskList: newRisk };
    }
    case PUT_DASHBOARD_INACTIVE2STATE: {
      const { data, headers } = action.payload;
      const newInactive = {
        data,
        pagination: {
          currentPage: headers['x-pagination-current-page'] >> 0,
          pageCount: headers['x-pagination-page-count'] >> 0,
          perPage: headers['x-pagination-per-page'] >> 0,
          totalCount: headers['x-pagination-total-count'] >> 0,
        },
      };
      return { ...state, inactiveList: newInactive };
    }
    default:
      return state;
  }
}

export default combineReducers({
  dashboard,
});
