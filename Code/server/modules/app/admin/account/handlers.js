const User = require('../../models/user');
const createMiddleware = require('../../../common/jwt');
const {
  validationExc,
  notFoundExc,
} = require('../../../common/helpers');
const {
  validateLoginData,
  validateProfileData,
  getAdminRoles,
} = require('./helpers');

async function login(req, res, next) {
  try {
    const data = req.body;
    const errors = validateLoginData(data);
    if (errors) {
      return next(validationExc('Please correct your input.', errors));
    }

    const user = await User.findOne({
      email: data.loginId.toLowerCase(),
      roles: { $in: await getAdminRoles() },
      status: User.STATUS_ACTIVE,
    });
    if (!user || !user.checkPassword(data.password)) {
      return res.status(400).json(validationExc(
        'Invalid login information.',
        {
          password: ['Incorrect username or password'],
        },
      ));
    }

    return res.json({
      token: user.createToken(data.remember ? '30 days' : '3h'),
      user: await user.toUserObject(),
    });
  } catch (err) {
    return next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    const data = req.body;
    if (!user) {
      return next(notFoundExc('No profile data found'));
    }

    const errors = validateProfileData(data, user);
    if (errors) {
      return next(validationExc('Please check your form input', errors));
    }

    if (data.newPassword) {
      user.setPassword(data.newPassword);
    }
    await user.save();
    return res.json(await user.toUserObject());
  } catch (err) {
    return next(err);
  }
}

const checkUserAuthenticated = createMiddleware(
  'jwtAdmin',
  async jwtPayload => User.findOne({
    _id: jwtPayload.userId,
    roles: { $in: await getAdminRoles() },
    status: User.STATUS_ACTIVE,
  }),
);

module.exports = {
  login,
  updateProfile,
  checkUserAuthenticated,
};
