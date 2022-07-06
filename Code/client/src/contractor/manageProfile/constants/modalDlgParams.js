
export const modalContentsDeletion = {
  start: {
    title: 'Are You Sure?',
    subTitle: 'By clicking DELETE, the user(s) will be deleted.',
    buttonText: 'DELETE',
    bottomTitle: 'Do not Delete',
    styles: {
      icon: { fontSize: 64, color: '#f06666' },
      title: { color: '#f06666' },
      buttonText: { backgroundColor: '#f06666' },
      bottomTitle: { display: 'none' },
    },
    iconSpanName: 'handel-question',
  },
  success: {
    title: 'User Deleted',
    subTitle: 'The current user(s) has(ve) been Deleted',
    styles: {
      icon: { fontSize: 64, color: '#239dff' },
    },
    iconSpanName: 'handel-check-circle',
  },
  fail: {
    title: 'Deleting User(s) Failed',
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

export const modalContentsAdminsSuspend = {
  start: {
    title: 'Are You Sure?',
    subTitle: 'By clicking CONFIRM, this user will be temporarily suspended.',
    buttonText: 'CONFIRM',
    bottomTitle: 'Do not Suspend',
    styles: {
      icon: { fontSize: 64, color: '#eebf15' },
      title: { color: '#eebf15' },
      bottomTitle: { display: 'none' },
      buttonText: { backgroundColor: '#eebf15' },
    },
    iconSpanName: 'handel-question',
  },
  success: {
    title: 'Account Suspended',
    subTitle: 'Your account has been Suspended',
    styles: {
      icon: { fontSize: 64, color: '#239dff' },
    },
    iconSpanName: 'handel-check-circle',
  },
  fail: {
    title: 'Suspending your account Failed',
    styles: {
      icon: { fontSize: 64, color: '#f06666' },
    },
    iconSpanName: 'handel-notify',
  },

  // func:
};

export const modalContentsSuspend = {
  start: {
    title: 'Are You Sure?',
    subTitle: 'By clicking CONFIRM, your Business Account will be temporarily suspended and will not be notified of available jobs until the account is updated as Available.',
    buttonText: 'CONFIRM',
    bottomTitle: 'Do not Suspend',
    styles: {
      icon: { fontSize: 64, color: '#eebf15' },
      title: { color: '#eebf15' },
      bottomTitle: { display: 'none' },
      buttonText: { backgroundColor: '#eebf15' },
    },
    iconSpanName: 'handel-question',
  },
  success: {
    title: 'Account Suspended',
    subTitle: 'Your account has been Suspended',
    styles: {
      icon: { fontSize: 64, color: '#239dff' },
    },
    iconSpanName: 'handel-check-circle',
  },
  fail: {
    title: 'Suspending your account Failed',
    styles: {
      icon: { fontSize: 64, color: '#f06666' },
    },
    iconSpanName: 'handel-notify',
  },

  // func:
};


export const modalContentsUnsuspend = {
  start: {
    title: 'Are You Sure?',
    subTitle: 'By clicking CONFRIM, your Business Account will be Available.',
    buttonText: 'CONFIRM',
    bottomTitle: 'Do not Unsuspend',
    styles: {
      icon: { fontSize: 64, color: '#f06666' },
      bottomTitle: { display: 'none' },
    },
    iconSpanName: 'handel-question',
  },
  success: {
    title: 'Account Available',
    subTitle: 'Your business account has been Available',
    styles: {
      icon: { fontSize: 64, color: '#239dff' },
    },
    iconSpanName: 'handel-check-circle',
  },
  fail: {
    title: 'Unsuspending Account Failed',
    styles: {
      icon: { fontSize: 64, color: '#f06666' },
    },
    iconSpanName: 'handel-notify',
  },

  // func:
};


export const modalContentsInactive = {
  start: {
    title: 'Are You Sure?',
    subTitle: 'By clicking INACTIVE, your Business Account will be inactivated on the handel: platform and you will no longer be able to log into your account. <br><br>You will need to contact handel:<br>if you wish to reactive your account.',
    buttonText: 'INACTIVE',
    bottomTitle: 'Do not Inactive',
    styles: {
      icon: { fontSize: 64, color: '#f06666' },
      title: { color: '#f06666' },
      bottomTitle: { display: 'none' },
      buttonText: { backgroundColor: '#f06666' },
    },
    iconSpanName: 'handel-question',
  },
  success: {
    title: 'Account Inactived',
    subTitle: 'Your business account has been Inactived',
    styles: {
      icon: { fontSize: 64, color: '#239dff' },
    },
    iconSpanName: 'handel-check-circle',
  },
  fail: {
    title: 'Inactiving Account Failed',
    styles: {
      icon: { fontSize: 64, color: '#f06666' },
    },
    iconSpanName: 'handel-notify',
  },

  // func:
};

export const modalContentsSuspendUsers = {
  start: {
    title: 'Are You Sure?',
    subTitle: 'By clicking CONFIRM, the Admin User(s) will be temporarily suspended and will not be notified of available jobs until the account is updated as Available.',
    buttonText: 'CONFIRM',
    bottomTitle: 'Do not Suspend',
    styles: {
      icon: { fontSize: 64, color: '#eebf15' },
      title: { color: '#eebf15' },
      bottomTitle: { display: 'none' },
    },
    iconSpanName: 'handel-question',
  },
  success: {
    title: 'Account Suspended',
    subTitle: 'The user(s) account has(ve) been Suspended',
    styles: {
      icon: { fontSize: 64, color: '#239dff' },
    },
    iconSpanName: 'handel-check-circle',
  },
  fail: {
    title: 'Suspending the account(s) Failed',
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
