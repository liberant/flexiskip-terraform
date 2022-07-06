import {
  GET_USER_PROFILE,
  GET_USER_PROFILE_REQUESTING,
  GET_USER_PROFILE_SUCCESSED,
  GET_USER_PROFILE_FAILED,

  TOGGLE_EDIT_MODE,
  RESET_DATA,

  SUBMIT_USER_PROFILE,
  SUBMIT_USER_PROFILE_REQUESTING,
  SUBMIT_USER_PROFILE_SUCCESSED,
  SUBMIT_USER_PROFILE_FAILED,
} from './constants/actionTypes';

/**
 * Define action get user profile
 */
export function getUserProfile(payload) {
  return {
    type: GET_USER_PROFILE,
    payload,
  };
}

export function getUserProfileStart() {
  return {
    type: GET_USER_PROFILE_REQUESTING,
  };
}

export function getUserProfileSuccessed(data) {
  return {
    type: GET_USER_PROFILE_SUCCESSED,
    data,
  };
}

export function getUserProfileFailed(error) {
  return {
    type: GET_USER_PROFILE_FAILED,
    error,
  };
}


/**
 * Define UI action
 */
export function toggleEditMode() {
  return {
    type: TOGGLE_EDIT_MODE,
  };
}

export function resetData() {
  return {
    type: RESET_DATA,
  };
}

/**
 * Submit Profile
 */
export function submitUserProfile(payload) {
  return {
    type: SUBMIT_USER_PROFILE,
    payload,
  };
}

export function submitUserProfileStart() {
  return {
    type: SUBMIT_USER_PROFILE_REQUESTING,
  };
}

export function submitUserProfileSuccessed(data) {
  return {
    type: SUBMIT_USER_PROFILE_SUCCESSED,
    data,
  };
}

export function submitUserProfileFailed(error) {
  return {
    type: SUBMIT_USER_PROFILE_FAILED,
    error,
  };
}
