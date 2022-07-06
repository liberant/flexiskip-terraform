import { createAsyncAction } from '../../common/helpers';
import {
  GET_CUSTOMERS_LIST,
  GET_CUSTOMER_DETAILS_BY_ID,
  UPDATE_CUSTOMER_DETAILS,
  DELETE_CUSTOMERS_LIST,
  DELETE_CUSTOMER_BY_ID,
  SET_CUSTOMERS_LIST2STATE,
  SET_CUSTOMER_DETAILS2STATE,
  CLEAR_CUSTOMER_DETAILS2STATE,
  UPDATE_CUSTOMER_STATUS,
  UPDATE_CUSTOMERS_STATUS,

  UNMOUNT_CLEAR_CUSTOMER_DETAILS,
  ADM_RESET_CUSTOMER_PASSWORD,
  GET_DRIVER_RATINGS_BY_ID,
  SET_DRIVER_RATINGS2STATE,
  CREATE_DRIVER,

  GET_UNASSIGNED_JOBS_LIST,
  SET_UNASSIGNED_JOBS_LIST2STATE,
  ASSIGN_JOB_2DRIVER,
} from './constants/actionTypes';

export const getDriversList = createAsyncAction(GET_CUSTOMERS_LIST);
export const getDriverDetailsById = createAsyncAction(GET_CUSTOMER_DETAILS_BY_ID);
export const updateDriverDetailsById = createAsyncAction(UPDATE_CUSTOMER_DETAILS);
export const deleteDriversList = createAsyncAction(DELETE_CUSTOMERS_LIST);
export const deleteDriverById = createAsyncAction(DELETE_CUSTOMER_BY_ID);
export const updateDriverStatusById = createAsyncAction(UPDATE_CUSTOMER_STATUS);

export const setDriversList2State = createAsyncAction(SET_CUSTOMERS_LIST2STATE);
export const setDriverDetails2State = createAsyncAction(SET_CUSTOMER_DETAILS2STATE);
export const clearDriverDetails2State = createAsyncAction(CLEAR_CUSTOMER_DETAILS2STATE);

export const updateDriversStatus = createAsyncAction(UPDATE_CUSTOMERS_STATUS);

export const unmountClearDriverDetails = createAsyncAction(UNMOUNT_CLEAR_CUSTOMER_DETAILS);
export const resetDriverPasswordByAdmin = createAsyncAction(ADM_RESET_CUSTOMER_PASSWORD);

export const getDriverRatingsById = createAsyncAction(GET_DRIVER_RATINGS_BY_ID);
export const setDriverRatings2State = createAsyncAction(SET_DRIVER_RATINGS2STATE);

export const getUnassignedJobsList = createAsyncAction(GET_UNASSIGNED_JOBS_LIST);
export const setUnassignedJobs2State = createAsyncAction(SET_UNASSIGNED_JOBS_LIST2STATE);
export const assignJobToDriver = createAsyncAction(ASSIGN_JOB_2DRIVER);

export const createDriver = createAsyncAction(CREATE_DRIVER);
