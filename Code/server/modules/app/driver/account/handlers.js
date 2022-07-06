/* eslint-disable */
const User = require('../../models/user');
const createMiddleware = require('../../../common/jwt');
const {
  validationExc,
  notFoundExc,
} = require('../../../common/helpers');
const {
  validateLoginData,
  validateProfileData,
  validateUpdateStatusData,
} = require('./helpers');
const config = require('../../../../config');

async function login(req, res, next) {
  try {
    const data = req.body;
    const errors = validateLoginData(data);
    if (errors) {
      return next(validationExc('Please correct your input.', errors));
    }

    const user = await User.findOne({
      email: data.loginId.toLowerCase(),
      roles: User.ROLE_DRIVER,
      status: {
        $in: [User.STATUS_ACTIVE, User.STATUS_UNAVAILABLE],
      },
    });
    if (!user || !user.checkPassword(data.password)) {
      return res.status(400).json(validationExc(
        'Invalid login information.',
        { password: ['Incorrect username or password'] },
      ));
    }

    // auto set driver's status to active when login
    user.status = User.STATUS_ACTIVE;
    await user.save();

    return res.json({
      token: user.createToken(config.accessTokenLifeTime),
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

    const errors = await validateProfileData(data, user);
    if (errors) {
      return next(validationExc('Please check your form input', errors));
    }

    user.firstname = data.firstname;
    user.lastname = data.lastname;
    user.phone = data.phone;
    user.status = data.status;
    user.avatar = data.avatar;
    if (data.vehicle)
      user.driverProfile.vehicle = data.vehicle;
    await user.save();
    return res.json(await user.toUserObject());
  } catch (err) {
    return next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    const data = req.body;
    if (!user) {
      return next(notFoundExc('No profile data found'));
    }

    const errors = validateUpdateStatusData(data, user);
    if (errors) {
      return next(validationExc('Please correct your input.', errors));
    }

    user.status = data.status;
    await user.save();
    return res.json(await user.toUserObject());
  } catch (err) {
    return next(err);
  }
}

const checkUserAuthenticated = createMiddleware(
  'jwtDriver',
  jwtPayload => User.findOne({
    _id: jwtPayload.userId,
    roles: User.ROLE_DRIVER,
    status: { $in: [User.STATUS_ACTIVE, User.STATUS_UNAVAILABLE] },
  }),
);

const checkUserAuthenticatedIncludesAdmin = createMiddleware(
  'jwtDriverAdmin',
  jwtPayload => User.findOne({
    _id: jwtPayload.userId,
    roles: { $in: [User.ROLE_DRIVER, User.ROLE_ADMIN] },
    status: { $in: [User.STATUS_ACTIVE, User.STATUS_UNAVAILABLE] },
  }),
);

function renderOnboardingForm(req, res) {
  res.sendFile(`${config.basePath}/views/driver-onboarding.html`);
}

module.exports = {
  login,
  updateProfile,
  updateStatus,
  checkUserAuthenticated,
  checkUserAuthenticatedIncludesAdmin,
  renderOnboardingForm,
};
