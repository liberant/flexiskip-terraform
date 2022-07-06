export * from './actionTypes';

/**
 * Form names
 */
export const USER_PROFILE_FORM = 'userProfile/userProfileForm';

/**
 * Default state
 */
export const initialState = {
  userData: {
    requesting: false,
    error: null,
    data: null,
  },
  submitData: {
    requesting: false,
    error: null,
    data: null,
  },
  ui: {
    editMode: false,
  },
};
