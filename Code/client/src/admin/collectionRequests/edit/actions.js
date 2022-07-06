import { createAsyncAction } from '../../../common/helpers';
import * as actionTypes from './constants/actionTypes';

export const updateItem = createAsyncAction(actionTypes.UPDATE_ITEM);
