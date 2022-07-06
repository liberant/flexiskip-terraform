import { createAsyncAction } from '../../common/helpers';
import {
  GET_DASHBOARD_REVENUE,
  GET_DASHBOARD_SUMMARY,
  PUT_DASHBOAD_SUMMARY2STATE,
  PUT_DASHBOARD_REVENUE2STATE,
} from './constants/actionTypes';

export const getDashboardSummary = createAsyncAction(GET_DASHBOARD_SUMMARY);
export const putDashboardSummary2State = createAsyncAction(PUT_DASHBOAD_SUMMARY2STATE);

export const getDashboardRevenue = createAsyncAction(GET_DASHBOARD_REVENUE);
export const putDashboardRevenue2State = createAsyncAction(PUT_DASHBOARD_REVENUE2STATE);

