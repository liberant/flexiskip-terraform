import {
  SET_COLLECTION_REQUESTS_LIST2STATE,
  SET_COLLECTION_REQUESTS_DETAILS2STATE,
  GET_COLLECTION_REQUESTS_DETAILS_BY_ID,
  PUT_COLLECTION_REQUESTS_DETAIL2STATE,
  CLEAR_COLLECTION_REQUESTS_DETAIL2STATE,
} from './constants/actionTypes';

/* eslint no-case-declarations: 0 */
/* eslint no-return-assign: 0 */

const initialCollectionRequestsState = {
  data: [],
  pagination: {
    currentPage: 1,
    pageCount: 1,
    perPage: 10,
    totalCount: 1,
  },
};

function reducer(state = initialCollectionRequestsState, action) {
  switch (action.type) {
    case SET_COLLECTION_REQUESTS_LIST2STATE:
      const { data, headers } = action.payload;
      let bins = [];
      const tmpData = data;
      if (data && data.constructor === Array && data.length > 0) {
        data.forEach((d, i) => {
          bins = [];
          if (d.items && (d.items.constructor === Array) && d.items.length > 0) {
            d.items.forEach((item) => {
              const bin = { ...item, ...item.bin };
              delete bin.bin;
              bins.push(bin);
            });
            tmpData[i].bins = bins;
          }
        });
      }

      const newCollectionRequests = {
        data: ((tmpData.constructor === Array) && tmpData) || [],
        pagination: headers ? {
          currentPage: headers['x-pagination-current-page'] >> 0,
          pageCount: headers['x-pagination-page-count'] >> 0,
          perPage: headers['x-pagination-per-page'] >> 0,
          totalCount: headers['x-pagination-total-count'] >> 0,
        } : null,
      };

      return { ...state, ...newCollectionRequests };

    case SET_COLLECTION_REQUESTS_DETAILS2STATE:
      return { ...state, collectionRequests: action.payload.data };

    case GET_COLLECTION_REQUESTS_DETAILS_BY_ID:
      return { ...state, collectionRequests: action.payload.data };

    case PUT_COLLECTION_REQUESTS_DETAIL2STATE:
      const tmpCollectionRequests = action.payload.data;
      let tmpCustomerTypeLabel = '';
      switch (tmpCollectionRequests.customer.userType) {
        case 'residentialCustomer':
          tmpCustomerTypeLabel = 'Residential Customer';
          break;
        case 'businessCustomer':
          tmpCustomerTypeLabel = 'Business Customer';
          break;
        default:
          tmpCustomerTypeLabel = 'Residential Customer';
          break;
      }
      tmpCollectionRequests.customer.userTypeLabel = tmpCustomerTypeLabel;
      return { ...state, collectionRequests: tmpCollectionRequests };

    case CLEAR_COLLECTION_REQUESTS_DETAIL2STATE:
      return { ...state, collectionRequests: null };

    default:
      return state;
  }
}

export default reducer;
