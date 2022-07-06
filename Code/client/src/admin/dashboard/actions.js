import { createAsyncAction, createAction } from '../../common/helpers';
import {
  GET_DASHBOARD_RATE,
  GET_DASHBOARD_REVENUE,
  GET_DASHBOARD_SUMMARY,
  PUT_DASHBOAD_SUMMARY2STATE,
  PUT_DASHBOARD_REVENUE2STATE,
  PUT_DASHBOARD_RATE2STATE,

  GET_DASHBOARD_AVERAGETIME,
  PUT_DASHBOARD_AVERATETIME2STATE,

  GET_DASHBOARD_JOBS,
  PUT_DASHBOARD_JOBS2STATE,
  MANUALLY_DASHBOARD_JOB_UPDATE,

  GET_DASHBOARD_RISK,
  PUT_DASHBOARD_RISK2STATE,

  GET_DASHBOARD_INACTIVE,
  PUT_DASHBOARD_INACTIVE2STATE,

  GET_DASHBOARD_DRIVERLIST_BY_JOBID,
  PUT_DASHBOARD_DRIVERLIST_BY_JOBID,
  SET_DASHBOARD_JOB_DRIVER,
  EXPORT_TO_GOOGLESHEET
} from './constants/actionTypes';

export const getDashboardSummary = createAsyncAction(GET_DASHBOARD_SUMMARY);
export const putDashboardSummary2State = createAsyncAction(PUT_DASHBOAD_SUMMARY2STATE);

export const getDashboardRevenue = createAsyncAction(GET_DASHBOARD_REVENUE);
export const putDashboardRevenue2State = createAsyncAction(PUT_DASHBOARD_REVENUE2STATE);

export const getDashboardRate = createAsyncAction(GET_DASHBOARD_RATE);
export const putDashboardRate2State = createAsyncAction(PUT_DASHBOARD_RATE2STATE);

export const getDashboardAverageTime = createAsyncAction(GET_DASHBOARD_AVERAGETIME);
export const putDashboardAverageTime2State =
  createAsyncAction(PUT_DASHBOARD_AVERATETIME2STATE);

export const getDashboardJobs = createAsyncAction(GET_DASHBOARD_JOBS);
export const putDashboardJobs2State = createAsyncAction(PUT_DASHBOARD_JOBS2STATE);
export const updateDashboardJobManual = createAction(MANUALLY_DASHBOARD_JOB_UPDATE);

export const getDashboardRisk = createAsyncAction(GET_DASHBOARD_RISK);
export const putDashboardRisk2State = createAsyncAction(PUT_DASHBOARD_RISK2STATE);

export const getDashboardInactive = createAsyncAction(GET_DASHBOARD_INACTIVE);
export const putDashboardInactive2State = createAsyncAction(PUT_DASHBOARD_INACTIVE2STATE);

export const getDashboardDriverListByJobId =
  createAsyncAction(GET_DASHBOARD_DRIVERLIST_BY_JOBID);
export const putDashboardDriverListByJobId =
  createAsyncAction(PUT_DASHBOARD_DRIVERLIST_BY_JOBID);
export const setDashboardJobDriver =
  createAsyncAction(SET_DASHBOARD_JOB_DRIVER);
export const getExportToGoogleSheet = createAsyncAction(EXPORT_TO_GOOGLESHEET);
