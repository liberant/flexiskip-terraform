import { combineReducers } from 'redux';

import {
  SET_DISCOUNTS_LIST2STATE,
  SET_DISCOUNT_DETAILS2STATE,
  GET_DISCOUNT_DETAILS_BY_ID,
  PUT_DISCOUNT_DETAIL2STATE,
  CLEAR_CUSTOMER_DETAIL2STATE,
  PUT_DISCOUNT_REGIONS_DEFINATIONS,
  SET_DISCOUNT_PRODUCTS_LIST2STATE,
} from './constants/actionTypes';

/* eslint no-case-declarations: 0 */
/* eslint no-return-assign: 0 */
/* eslint no-underscore-dangle: 0 */

const initialDiscountsState = {
  data: [],
  pagination: {
    currentPage: 1,
    pageCount: 1,
    perPage: 10,
    totalCount: 1,
  },
};

function discounts(state = initialDiscountsState, action) {
  switch (action.type) {
    case SET_DISCOUNTS_LIST2STATE:
      const { data, headers } = action.payload;
      const newDiscounts = {
        data,
        pagination: {
          currentPage: headers['x-pagination-current-page'] >> 0,
          pageCount: headers['x-pagination-page-count'] >> 0,
          perPage: headers['x-pagination-per-page'] >> 0,
          totalCount: headers['x-pagination-total-count'] >> 0,
        },
      };

      return { ...state, ...newDiscounts };
    case SET_DISCOUNT_DETAILS2STATE:
      return { ...state, discount: action.payload.data };
    case GET_DISCOUNT_DETAILS_BY_ID:
      return { ...state, discount: action.payload.data };
    case PUT_DISCOUNT_DETAIL2STATE:
      const {
        type, regions, products, request, extraProducts, ...rest
      } = action.payload.data;
      const tmpType = type.toLowerCase().includes('flat') ? 'Exact Amount' : `${type.charAt(0).toUpperCase()}${type.substr(1)}`;
      const dataRegions = regions && regions.constructor === Array ?
        regions.map(r => state.regions.find(rg => rg._id === r)) : [];
      const dataProducts = products && products.constructor === Array ?
        products.map(p => state.products.find(pg => pg._id === p)) : [];
      const tmpRequest = request.sort();
      const dataExtraProducts = extraProducts && extraProducts.constructor === Array ?
        extraProducts.map(e => (
          { product: [state.products.find(pg => pg._id === e.product)], quantity: `${e.quantity}` })) : [];

      return {
        ...state,
        discount: {
          ...rest,
          extraProducts: dataExtraProducts,
          type: tmpType,
          regions: dataRegions,
          products: dataProducts,
          request: tmpRequest,
        },
      };
    case CLEAR_CUSTOMER_DETAIL2STATE:
      return { ...state, discount: null };
    case PUT_DISCOUNT_REGIONS_DEFINATIONS:
      return { ...state, regions: action.payload.data };
    case SET_DISCOUNT_PRODUCTS_LIST2STATE:
      return { ...state, products: action.payload.data };
    default:
      return state;
  }
}

export default discounts;
