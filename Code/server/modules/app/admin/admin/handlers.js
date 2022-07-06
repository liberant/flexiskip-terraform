const User = require('../../models/user');
const {
  validationExc,
  notFoundExc,
} = require('../../../common/helpers');
const {
  validateFormData,
} = require('./helpers');

const EmailHelper = require('../../helpers/email');

async function createAdmin(req, res, next) {
  try {
    const data = req.body;
    const errors = await validateFormData(data);
    if (errors) {
      return next(validationExc('Please correct your input', errors));
    }

    const user = new User({
      email: data.email,
      status: User.STATUS_ACTIVE,
      roles: [data.role],
      avatar: data.avatar,
      firstname: data.firstname,
      lastname: data.lastname,
      phone: data.phone,
      adminProfile: {
        address: data.address,
      },
      contactMethod: User.CONTACT_METHOD_ADMIN,
    });

    await user.save();
    await EmailHelper.sendWelcomeEmailToAdmin(user);
    return res.json(await user.toUserObject());
  } catch (err) {
    return next(err);
  }
}

async function updateAdmin(req, res, next) {
  try {
    const admin = await User.findById(req.params.id);
    if (!admin) {
      return next(notFoundExc('Admin not found'));
    }
    const data = req.body;
    const errors = await validateFormData(data, 'update');
    if (errors) {
      return next(validationExc('Please correct your input', errors));
    }
    // update user data
    if (data.avatar) {
      admin.avatar = data.avatar;
    }
    admin.status = data.status;
    admin.firstname = data.firstname;
    admin.lastname = data.lastname;
    admin.phone = data.phone;
    admin.roles = [data.role];
    admin.adminProfile = {
      ...admin.toObject().adminProfile,
      address: data.address,
    };

    await admin.save();
    return res.json(await admin.toUserObject());
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  updateAdmin,
  createAdmin,
};
