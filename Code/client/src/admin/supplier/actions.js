import { createAsyncAction } from '../../common/helpers';
import { SET_SUPPLIERS, GET_SUPPLIERS } from "./constants/actionTypes";

export const getSuppliers = createAsyncAction(GET_SUPPLIERS);
export const setSuppliers = createAsyncAction(SET_SUPPLIERS);
