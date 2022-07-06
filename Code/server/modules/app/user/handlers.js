const User = require('../models/user');
const { validationExc, notFoundExc, verifyToken } = require('../../common/helpers');
const {
  validateForgotPwdData,
  validateResetPwdData,
  validateChangePasswordData,
} = require('./helpers');
const { accessTokenLifeTime } = require('../../../config');
const createMiddleware = require('../../common/jwt');
const EmailHelper = require('../helpers/email');

/**
 * Send email contain password reset instruction to user
 */
async function requestResetPassword(req, res, next) {
  try {
    const data = req.body;
    const errors = await validateForgotPwdData(data);
    if (errors) {
      return next(validationExc('Please correct your input.', errors));
    }

    const user = await User.findOne({
      email: data.email.toLowerCase(),
    });
    await EmailHelper.sendResetPasswordEmailToUser(user);
    return res.json({ message: 'Please check your email.' });
  } catch (err) {
    return next(err);
  }
}

/**
 * Update user's password from reset token
 */
async function resetPassword(req, res, next) {
  try {
    const data = req.body;
    const errors = await validateResetPwdData(data);
    if (errors) {
      return next(validationExc('Please correct your input.', errors));
    }

    const decoded = verifyToken(data.token);
    const user = await User.findOne({
      _id: decoded.userId,
    });
    user.setPassword(data.password);
    await user.save();

    return res.json({
      token: user.createToken(accessTokenLifeTime),
      user: await user.toUserObject(),
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * Get data of current user
 */
async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    return user ? res.json(await user.toUserObject()) :
      next(notFoundExc('No profile data found'));
  } catch (err) {
    return next(err);
  }
}

/**
 * Change password of current user
 */
async function changePassword(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    const data = req.body;
    if (!user) {
      return next(notFoundExc('No profile data found'));
    }

    const errors = validateChangePasswordData(data, user);
    if (errors) {
      return next(validationExc('Please check your form input', errors));
    }

    user.setPassword(data.newPassword);
    await user.save();
    return res.json(await user.toUserObject());
  } catch (err) {
    return next(err);
  }
}

const checkUserAuthenticated = createMiddleware(
  'jwtUser',
  jwtPayload => User.findOne({
    _id: jwtPayload.userId,
  }),
);

async function submitFCMToken(req, res, next) {
  try {
    const user = await User.findById(req.user._id);

    user.fcmToken = req.body.fcmToken ? req.body.fcmToken : null;

    await user.save();

    return res.json(await user.toUserObject());
  } catch (err) {
    return next(err);
  }
}

async function logout(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    user.fcmToken = null;

    if (user.roles.indexOf('driver') >= 0) {
      // Need to set status to Unavailable
      user.driverProfile.vehicle = undefined;
      user.status = User.STATUS_UNAVAILABLE;
    }
    await user.save();

    req.logout();
    return res.json({
      code: 200,
      message: 'Logout successfully',
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  requestResetPassword,
  resetPassword,
  getProfile,
  changePassword,
  checkUserAuthenticated,
  submitFCMToken,
  logout,
};
