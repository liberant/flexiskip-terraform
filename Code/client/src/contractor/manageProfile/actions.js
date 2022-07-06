import { createAsyncAction } from '../../common/helpers';
import {
  CREATE_ADMIN_USER,
  GET_ADMINS_LIST,
  GET_ADMIN_DETAILS,
  UPDATE_ADMIN_DETAILS,
  DELETE_ADMINS_LIST,
  DELETE_ADMIN_BY_ID,
  SET_ADMINS_LIST2STATE,
  SET_ADMIN_DETAILS2STATE,
  CLEAR_ADMIN_DETAILS2STATE,
  UPDATE_ADMIN_STATUS,
  UPDATE_ADMINS_STATUS,
  UPDATE_CONTRACTOR_STATUS,
  UNMOUNT_CLEAR_ADMIN_DETAILS,
  GET_CONTRACTOR_ADMIN_DETAILS,
  UPDATE_CONTRACTOR_ADMIN_DETAILS,
  SET_CONTRACTOR_ADMIN_DETAILS2STATE,
  CLEAR_CONTRACTOR_ADMIN_DETAILS2STATE,
  UPDATE_BANK_INFORMATION,
  UPDATE_PAYMENT_INFORMATION,
} from './constants/actionTypes';

export const createAdminUser = createAsyncAction(CREATE_ADMIN_USER);
export const getAdminsList = createAsyncAction(GET_ADMINS_LIST);
export const getAdminDetails = createAsyncAction(GET_ADMIN_DETAILS);
export const updateAdminDetails = createAsyncAction(UPDATE_ADMIN_DETAILS);
export const deleteAdminsList = createAsyncAction(DELETE_ADMINS_LIST);
export const deleteAdminById = createAsyncAction(DELETE_ADMIN_BY_ID);
export const updateAdminStatusById = createAsyncAction(UPDATE_ADMIN_STATUS);

export const setAdminsList2State = createAsyncAction(SET_ADMINS_LIST2STATE);
export const setAdminDetails2State = createAsyncAction(SET_ADMIN_DETAILS2STATE);
export const clearAdminDetails2State = createAsyncAction(CLEAR_ADMIN_DETAILS2STATE);

export const updateAdminsStatus = createAsyncAction(UPDATE_ADMINS_STATUS);
export const updateContractorStatus = createAsyncAction(UPDATE_CONTRACTOR_STATUS);

export const getContractorAdminDetails = createAsyncAction(GET_CONTRACTOR_ADMIN_DETAILS);
export const setContractorAdminDetails2State =
  createAsyncAction(SET_CONTRACTOR_ADMIN_DETAILS2STATE);
export const updateContractorAdminDetails = createAsyncAction(UPDATE_CONTRACTOR_ADMIN_DETAILS);
export const clearContractorAdminDetails2State =
  createAsyncAction(CLEAR_CONTRACTOR_ADMIN_DETAILS2STATE);

export const updateBankInformation = createAsyncAction(UPDATE_BANK_INFORMATION);
export const updatePaymentInformation = createAsyncAction(UPDATE_PAYMENT_INFORMATION);


export const unmountClearAdminDetails = createAsyncAction(UNMOUNT_CLEAR_ADMIN_DETAILS);

