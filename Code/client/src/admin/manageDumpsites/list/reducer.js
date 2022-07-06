import {
  SET_DUMPSITES_LIST2STATE,
  SET_DUMPSITE_DETAILS2STATE,
  GET_DUMPSITE_DETAILS_BY_ID,
  PUT_DUMPSITE_DETAIL2STATE,
  CLEAR_DUMPSITE_DETAIL2STATE,
  PUT_DUMPSITE_COUNCILS_DEFINATIONS,
  SET_DUMPSITE_WASTETYPES_LIST2STATE,
} from './constants/actionTypes';

import { WeekDayDefs } from './constants/dumpsiteDefs';

/* eslint no-case-declarations: 0 */
/* eslint no-return-assign: 0 */
/* eslint no-underscore-dangle: 0 */

const initialDumpsitesState = {
  data: [],
  pagination: {
    currentPage: 1,
    pageCount: 1,
    perPage: 10,
    totalCount: 1,
  },
};

function dumpsites(state = initialDumpsitesState, action) {
  switch (action.type) {
    case SET_DUMPSITES_LIST2STATE:
      const { data, headers } = action.payload;
      const newDumpsites = {
        data,
        pagination: {
          currentPage: headers['x-pagination-current-page'] >> 0,
          pageCount: headers['x-pagination-page-count'] >> 0,
          perPage: headers['x-pagination-per-page'] >> 0,
          totalCount: headers['x-pagination-total-count'] >> 0,
        },
      };

      return { ...state, ...newDumpsites };
    case SET_DUMPSITE_DETAILS2STATE:
      return { ...state, dumpsite: action.payload.data };
    case GET_DUMPSITE_DETAILS_BY_ID:
      return { ...state, dumpsite: action.payload.data };
    case PUT_DUMPSITE_DETAIL2STATE:
      let tmpData = action.payload.data;
      if (action.payload.data) {
        const { openDays, charges, ...rest } = action.payload.data;
        const tmpOpenDays = [];
        if (openDays && openDays.constructor === Array) {
          openDays.forEach((o) => {
            const indexDay = WeekDayDefs.findIndex(w => w === o.weekDay);
            if (indexDay >= 0) {
              tmpOpenDays[indexDay] = o;
              tmpOpenDays[indexDay].isOpen = true;
            }
          });
          const wasteTypes = [];
          const amounts = [];
          if (charges && charges.constructor === Array) {
            charges.forEach((c) => {
              wasteTypes.push(c.wasteType);
              amounts.push(c.amount);
            });
          }
          tmpData = {
            openDays: tmpOpenDays,
            charges,
            wasteTypes,
            amounts,
            ...rest,
          };
        }
      }

      return {
        ...state,
        dumpsiteDetails: tmpData,
      };
    case CLEAR_DUMPSITE_DETAIL2STATE:
      return { ...state, dumpsite: null };
    case PUT_DUMPSITE_COUNCILS_DEFINATIONS:
      return { ...state, councils: action.payload.data };
    case SET_DUMPSITE_WASTETYPES_LIST2STATE:
      return { ...state, wasteTypes: action.payload.data };
    default:
      return state;
  }
}

export default dumpsites;
