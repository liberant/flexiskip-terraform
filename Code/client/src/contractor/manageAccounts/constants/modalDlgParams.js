
export const modalContentsDeletion = {
  start: {
    title: 'Are You Sure?',
    subTitle: 'By clicking DELETE, this user will be deleted.',
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

export const modalUserCreate = {
  start: {
    title: 'Are You Sure?',
    subTitle: 'By clicking CONFIRM, this user will be added',
    buttonText: 'CONFIRM',
    bottomTitle: 'Do not confirm',
    styles: {
      icon: { fontSize: 64, color: '#f06666' },
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

