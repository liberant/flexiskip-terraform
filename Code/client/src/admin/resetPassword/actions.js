import { createAsyncAction } from '../../common/helpers';
import { RESET_PASSWORD, UPDATE_PASSWORD } from './constants/actionTypes';

export const resetPassword = createAsyncAction(RESET_PASSWORD);
export const updatePassword = createAsyncAction(UPDATE_PASSWORD);
