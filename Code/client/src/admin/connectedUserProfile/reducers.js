import {
  GET_USER_PROFILE_REQUESTING,
  GET_USER_PROFILE_SUCCESSED,
  GET_USER_PROFILE_FAILED,

  TOGGLE_EDIT_MODE,
  RESET_DATA,

  SUBMIT_USER_PROFILE_REQUESTING,
  SUBMIT_USER_PROFILE_SUCCESSED,
  SUBMIT_USER_PROFILE_FAILED,
} from './constants/actionTypes';

import { initialState } from './constants';

function connectedUserProfile(state = initialState, action) {
  switch (action.type) {
    /**
     * Get user detail
     */
    case GET_USER_PROFILE_REQUESTING:
      return {
        ...state,
        userData: {
          ...initialState.userData,
          requesting: true,
        },
      };

    case GET_USER_PROFILE_SUCCESSED:
      return {
        ...state,
        userData: {
          ...initialState.userData,
          requesting: false,
          data: action.data,
        },
      };

    case GET_USER_PROFILE_FAILED:
      return {
        ...state,
        userData: {
          ...initialState.userData,
          requesting: false,
          data: null,
          error: action.error,
        },
      };

    /**
     * Ui
     */
    case TOGGLE_EDIT_MODE:
      return {
        ...state,
        ui: {
          editMode: !state.ui.editMode,
        },
      };

    case RESET_DATA:
      return {
        ...initialState,
      };

    /**
     * Submit user
     */
    case SUBMIT_USER_PROFILE_REQUESTING:
      return {
        ...state,
        submitData: {
          ...initialState.submitData,
          requesting: true,
        },
      };

    case SUBMIT_USER_PROFILE_SUCCESSED:
      return {
        ...state,
        submitData: {
          ...initialState.submitData,
          requesting: false,
          data: action.data,
        },
      };

    case SUBMIT_USER_PROFILE_FAILED:
      return {
        ...state,
        submitData: {
          ...initialState.submitData,
          requesting: false,
          data: null,
          error: action.error,
        },
      };

    default:
      return state;
  }
}

export default connectedUserProfile;
