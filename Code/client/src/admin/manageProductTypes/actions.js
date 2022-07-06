import { createAsyncAction } from '../../common/helpers';
import * as actionTypes from './constants/actionTypes';

export const getWasteTypeList = createAsyncAction(actionTypes.GET_WASTE_TYPE_LIST);
export const updateWasteTypeImage = createAsyncAction(actionTypes.UPDATE_WASTE_TYPE_IMAGE);
export const putWasteTypeList2State = createAsyncAction(actionTypes.PUT_WASTE_TYPE_LIST2STATE);
