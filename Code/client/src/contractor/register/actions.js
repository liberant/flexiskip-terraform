import { createAction, createAsyncAction } from '../../common/helpers';
import { REGISTER, REGISTER_PROCESSING } from './constants/actionTypes';

export const register = createAsyncAction(REGISTER);
export const registerProcessing = createAction(REGISTER_PROCESSING);
