import { createAction, createAsyncAction } from '../../common/helpers';
import {
  CONTRACTOR_RESET_PASSWORD,
  CONTRACTOR_UPDATE_PASSWORD,
  CONTRACTOR_UPDATED_PROCESSING,
} from './constants/actionTypes';

export const resetContractorPassword = createAsyncAction(CONTRACTOR_RESET_PASSWORD);
export const updateContractorPassword = createAsyncAction(CONTRACTOR_UPDATE_PASSWORD);
export const updatedProcessing = createAction(CONTRACTOR_UPDATED_PROCESSING);
