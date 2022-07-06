import { createAsyncAction, createAction } from '../../common/helpers';
import {
  GET_PRODUCTS_LIST,
  GET_PRODUCT_DETAILS_BY_ID,
  UPDATE_PRODUCT_DETAILS,
  DELETE_PRODUCTS_LIST,
  DELETE_PRODUCT_BY_ID,
  SET_PRODUCTS_LIST2STATE,
  SET_PRODUCT_DETAILS2STATE,
  UPDATE_PRODUCT_STATUS,
  CREATE_PRODUCT,
  PUT_PRODUCT_DETAIL2STATE,
  CLEAR_CUSTOMER_DETAIL2STATE,
  UNMOUNT_CLEAR_PRODUCT_DETAILS,
  GET_PRODUCT_MATERIAL_OPTIONS,
  PUT_PRODUCT_MATERIAL_OPTIONS2STATE,
  GET_PRODUCT_COUNCILS_DEFINATIONS,
  PUT_PRODUCT_COUNCILS_DEFINATIONS,
  GET_PRODUCT_WASTETYPES_LIST,
  SET_PRODUCT_WASTETYPES_LIST2STATE,

  CREATE_COUNCIL_PRODUCT,
  GET_COUNCIL_PRODUCT_LIST,
  PUT_COUNCIL_PRODUCT_LIST2STATE,
  UPDATE_COUNCIL_PRODUCT_STATUS_BY_ID,
  DELETE_COUNCIL_PRODUCT_BY_ID,
  PUT_COUNCIL_PRODUCT_DETAILS2STATE,
  UPDATE_COUNCIL_PRODUCT_DETAILS_BY_ID,
  GET_COUNCIL_PRODUCT_DETAILS_BY_ID,

  FETCH_ALL_PRODUCTS,
  SET_PRODUCT_OPTIONS,
} from './constants/actionTypes';

export const getProductsList = createAsyncAction(GET_PRODUCTS_LIST);
export const getProductDetailsById = createAsyncAction(GET_PRODUCT_DETAILS_BY_ID);
export const updateProductDetails = createAsyncAction(UPDATE_PRODUCT_DETAILS);
export const deleteProductsList = createAsyncAction(DELETE_PRODUCTS_LIST);
export const deleteProductById = createAsyncAction(DELETE_PRODUCT_BY_ID);
export const updateProductStatusById = createAsyncAction(UPDATE_PRODUCT_STATUS);

export const setProductsList2State = createAsyncAction(SET_PRODUCTS_LIST2STATE);
export const setProductDetails2State = createAsyncAction(SET_PRODUCT_DETAILS2STATE);
export const clearProductDetails2State = createAsyncAction(CLEAR_CUSTOMER_DETAIL2STATE);

export const createProduct = createAsyncAction(CREATE_PRODUCT);
export const putProductDetails2State = createAsyncAction(PUT_PRODUCT_DETAIL2STATE);

export const unmountClearProductDetails = createAsyncAction(UNMOUNT_CLEAR_PRODUCT_DETAILS);

export const getProductMaterialOptions = createAsyncAction(GET_PRODUCT_MATERIAL_OPTIONS);
export const putProductMaterialOptions2State
              = createAsyncAction(PUT_PRODUCT_MATERIAL_OPTIONS2STATE);

export const getProductCouncilDefinations = createAsyncAction(GET_PRODUCT_COUNCILS_DEFINATIONS);
export const putProductCouncilDefinations2State
  = createAsyncAction(PUT_PRODUCT_COUNCILS_DEFINATIONS);

export const createCouncilProduct = createAsyncAction(CREATE_COUNCIL_PRODUCT);
export const getCouncilProductList = createAsyncAction(GET_COUNCIL_PRODUCT_LIST);
export const putCouncilProductList2State
  = createAsyncAction(PUT_COUNCIL_PRODUCT_LIST2STATE);
export const updateCouncilProductStatusById
  = createAsyncAction(UPDATE_COUNCIL_PRODUCT_STATUS_BY_ID);
export const deleteCouncilProductById
  = createAsyncAction(DELETE_COUNCIL_PRODUCT_BY_ID);
export const getCouncilProductDetailsById
  = createAsyncAction(GET_COUNCIL_PRODUCT_DETAILS_BY_ID);
export const putCouncilProductDetails2State
  = createAsyncAction(PUT_COUNCIL_PRODUCT_DETAILS2STATE);
export const updateCouncilProductDetailsById
  = createAsyncAction(UPDATE_COUNCIL_PRODUCT_DETAILS_BY_ID);


export const getProductWastTypesList = createAsyncAction(GET_PRODUCT_WASTETYPES_LIST);
export const putProductWasteTypesList2State =
  createAsyncAction(SET_PRODUCT_WASTETYPES_LIST2STATE);

export const fetchAllProducts = createAsyncAction(FETCH_ALL_PRODUCTS);
export const setProductOptions = createAction(SET_PRODUCT_OPTIONS);

