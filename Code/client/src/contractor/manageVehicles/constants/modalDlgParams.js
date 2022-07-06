
export const modalContentsDeletion = {
  start: {
    title: 'Are You Sure?',
    subTitle: 'By clicking DELETE, this vehicle will be deleted.',
    buttonText: 'DELETE',
    bottomTitle: 'Do not Delete',
    styles: {
      icon: { fontSize: 64, color: '#f06666' },
    },
    iconSpanName: 'handel-question',
  },
  success: {
    title: 'Vehicle Deleted',
    subTitle: 'The current vehicle has been Deleted',
    styles: {
      icon: { fontSize: 64, color: '#239dff' },
    },
    iconSpanName: 'handel-check-circle',
  },
  fail: {
    title: 'Vehicle Deleted Failed',
    styles: {
      icon: { fontSize: 64, color: '#f06666' },
    },
    iconSpanName: 'handel-notify',
  },

  // func:
};

export const modalContentsResetPassword = {
  start: {
    title: 'Are You Sure?',
    subTitle: 'By clicking RESET, this user\'s password will be reset.',
    buttonText: 'RESET',
    bottomTitle: 'Do not Reset',
    styles: {
      icon: { fontSize: 64, color: '#f06666' },
    },
    iconSpanName: 'handel-question',
  },
  success: {
    title: 'Password Reset',
    // subTitle: `Password reset instructions is sent to <strong>${customer.email}</strong>`,
    subTitle: '',
    styles: {
      icon: { fontSize: 64, color: '#239dff' },
    },
    iconSpanName: 'handel-check-circle',
  },
  fail: {
    title: 'User Password Reset Failed',
    styles: {
      icon: { fontSize: 64, color: '#f06666' },
    },
    iconSpanName: 'handel-notify',
  },
  // func:

};

export const modalContentsSuspension = {
  start: {
    title: 'Are You Sure?',
    subTitle: 'By clicking SUSPEND, this vehicle will be suspended.',
    buttonText: 'SUSPEND',
    bottomTitle: 'Do not Suspend',
    styles: {
      icon: { fontSize: 64, color: '#f06666' },
    },
    iconSpanName: 'handel-question',
  },
  success: {
    title: 'Vehicle Suspended',
    subTitle: 'The current vehicle has been Suspended',
    styles: {
      icon: { fontSize: 64, color: '#239dff' },
    },
    iconSpanName: 'handel-check-circle',
  },
  fail: {
    title: 'Vehicle Suspended Failed',
    styles: {
      icon: { fontSize: 64, color: '#f06666' },
    },
    iconSpanName: 'handel-notify',
  },

  // func:
};
