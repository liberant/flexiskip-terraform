
export const modalContentsInactive = {
  start: {
    title: 'Are You Sure?',
    subTitle: 'By clicking INACTIVATE, your Business Account will be inactivated on the handel: platform and you will no longer be able to log into your account. <br><br> You will need to contact handel: <br>if you wish to reactive you account.',
    buttonText: 'INACTIVATE',
    bottomTitle: 'Do not Inactivate',
    styles: {
      icon: { fontSize: 64, color: '#f06666' },
    },
    iconSpanName: 'handel-question',
  },
  success: {
    title: 'You are INACTIVE',
    subTitle: 'You will no longer be able to log into your account.',
    styles: {
      icon: { fontSize: 64, color: '#239dff' },
    },
    iconSpanName: 'handel-check-circle',
  },
  fail: {
    title: 'Inactive Failed',
    styles: {
      icon: { fontSize: 64, color: '#f06666' },
    },
    iconSpanName: 'handel-notify',
  },

  // func:
};

export const modalContentsDeletion = {
  start: {
    title: 'Are You Sure?',
    subTitle: 'By clicking DELETE, the user(s) will be deleted',
    buttonText: 'DELETE',
    bottomTitle: 'Do not Delete',
    styles: {
      icon: { fontSize: 64, color: '#f06666' },
    },
    iconSpanName: 'handel-question',
  },
  success: {
    title: 'User Deleted',
    subTitle: 'The current user has been Deleted',
    styles: {
      icon: { fontSize: 64, color: '#239dff' },
    },
    iconSpanName: 'handel-check-circle',
  },
  fail: {
    title: 'User Deleted Failed',
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

export const modalContentsSuspended = {
  start: {
    title: 'Are You Sure?',
    subTitle: 'By clicking CONFIRM, your Business Account will be temporarily suspended and will not be notified of available jobs until the account is updated as Available',
    buttonText: 'CONFIRM',
    bottomTitle: 'Do not confirm',
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

export const modalUserCreate = {
  start: {
    title: 'Are You Sure?',
    subTitle: 'By clicking CONFIRM, this user will be added',
    buttonText: 'CONFIRM',
    bottomTitle: 'Do not confirm',
    styles: {
      icon: { fontSize: 64, color: '#f06666' },
      bottomTitle: { backgroundColor: '#f06666' },
      buttonText: { backgroundColor: '#239dff' },
    },
    iconSpanName: 'handel-question',
  },
  success: {
    title: 'User Created',
    // subTitle: `Password reset instructions is sent to <strong>${customer.email}</strong>`,
    subTitle: '',
    styles: {
      icon: { fontSize: 64, color: '#239dff' },
    },
    iconSpanName: 'handel-check-circle',
  },
  fail: {
    title: 'User Created Failed',
    styles: {
      icon: { fontSize: 64, color: '#f06666' },
    },
    iconSpanName: 'handel-notify',
  },
  // func:

};
