const selectUserProfileState = state => state.admin.connectedUserProfile;

export const selectUserDetail = state => selectUserProfileState(state).userData.data;

export const selectUserDetailRequesting =
  state => selectUserProfileState(state).userData.requesting;

export const selectUserDetailError = state => selectUserProfileState(state).userData.error;

export const selectViewMode = state => selectUserProfileState(state).ui.editMode;

export const selectUserDetailSubmit = state => selectUserProfileState(state).submitData;
