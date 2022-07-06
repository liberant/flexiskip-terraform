import { combineReducers } from 'redux';

import { statusProductStockTypes } from '../../common/constants/styles';

import {
  SET_PRODUCTS_LIST2STATE,
  SET_PRODUCT_DETAILS2STATE,
  GET_PRODUCT_DETAILS_BY_ID,
  PUT_PRODUCT_DETAIL2STATE,
  CLEAR_CUSTOMER_DETAIL2STATE,
  PUT_PRODUCT_MATERIAL_OPTIONS2STATE,
  PUT_PRODUCT_COUNCILS_DEFINATIONS,
  SET_PRODUCT_WASTETYPES_LIST2STATE,
  PUT_COUNCIL_PRODUCT_LIST2STATE,
  PUT_COUNCIL_PRODUCT_DETAILS2STATE,
  SET_PRODUCT_OPTIONS,
} from './constants/actionTypes';

/* eslint no-case-declarations: 0 */
/* eslint no-return-assign: 0 */

const initialProductsState = {
  data: [],
  pagination: {
    currentPage: 1,
    pageCount: 1,
    perPage: 10,
    totalCount: 1,
  },
  materialsAllowances: [],
  productOptions: [],
};

function products(state = initialProductsState, action) {
  switch (action.type) {
    case SET_PRODUCTS_LIST2STATE:
      const { data, headers } = action.payload;
      const newProducts = {
        data,
        pagination: {
          currentPage: headers['x-pagination-current-page'] >> 0,
          pageCount: headers['x-pagination-page-count'] >> 0,
          perPage: headers['x-pagination-per-page'] >> 0,
          totalCount: headers['x-pagination-total-count'] >> 0,
        },
      };

      return { ...state, ...newProducts };
    case SET_PRODUCT_DETAILS2STATE:
      return { ...state, product: action.payload.data };
    case GET_PRODUCT_DETAILS_BY_ID:
      return { ...state, product: action.payload.data };
    case PUT_PRODUCT_DETAIL2STATE:
      const ma = [];
      const { materialsAllowance, ...others } = action.payload.data;
      if (materialsAllowance && Array.isArray(materialsAllowance)) {
        state.materialsAllowances.map((m) => {
          if (materialsAllowance.includes(m)) {
            ma.push(true);
          } else {
            ma.push(false);
          }

          return true;
        });
      }

      if (others.status) {
        others.status = statusProductStockTypes.find(status =>
          status.toLowerCase() === others.status.toLowerCase());
      }

      return { ...state, product: { materialsAllowance: ma, ...others } };
    case CLEAR_CUSTOMER_DETAIL2STATE:
      return {
        ...state,
        product: null,
        councilProducts: null,
        councilProduct: null,
        councils: null,
      };
    case PUT_PRODUCT_MATERIAL_OPTIONS2STATE:
      return { ...state, materialsAllowances: action.payload.data };
    case PUT_PRODUCT_COUNCILS_DEFINATIONS:
      return { ...state, councils: action.payload.data };
    case SET_PRODUCT_WASTETYPES_LIST2STATE:
      return { ...state, wasteTypes: action.payload.data };
    case PUT_COUNCIL_PRODUCT_LIST2STATE:
      const { data: dataCouncil, headers: headersCouncil } = action.payload;
      const newCouncilProducts = {
        data: dataCouncil,
        pagination: {
          currentPage: headersCouncil['x-pagination-current-page'] >> 0,
          pageCount: headersCouncil['x-pagination-page-count'] >> 0,
          perPage: headersCouncil['x-pagination-per-page'] >> 0,
          totalCount: headersCouncil['x-pagination-total-count'] >> 0,
        },
      };

      return { ...state, councilProducts: newCouncilProducts };
    case PUT_COUNCIL_PRODUCT_DETAILS2STATE:
      const {
        residentialPrice, businessPrice,
        quantity, qtyPerAddress,
        ...rest
      } = action.payload.data;

      return {
        ...state,
        councilProduct: {
          resBinPrice: residentialPrice,
          busBinPrice: businessPrice,
          allowanceCountTotal: quantity,
          allowanceCountPerUnit: qtyPerAddress,
          ...rest,
        },
      };

    case SET_PRODUCT_OPTIONS:
      return {
        ...state,
        productOptions: action.payload.map(p => ({ label: p.name, value: p._id })),
      };

    default:
      return state;
  }
}

export default combineReducers({
  products,
});
