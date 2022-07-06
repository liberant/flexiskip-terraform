const User = require('../../models/user');
const createMiddleware = require('../../../common/jwt');
const {
  validationExc,
  notFoundExc,
} = require('../../../common/helpers');
const {
  validateProfileData,
  updateUserProfile,
  validateCustomerData,
} = require('./helpers');

async function updateProfile(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    const data = req.body;
    if (!user) {
      return next(notFoundExc('No profile data found'));
    }

    const errors = validateProfileData(data);
    if (errors) {
      return next(validationExc('Please check your form input', errors));
    }

    await updateUserProfile(user, data);
    const updatedUser = await User.findById(user._id);
    return res.json(await updatedUser.toUserObject());
  } catch (err) {
    return next(err);
  }
}

async function validateConnectedUser(req, res, next) {
  try {
    const data = req.body;
    const errors = await validateCustomerData(data);
    return errors
      ? next(validationExc('Invalid customer data', errors))
      : res.json({ message: 'Validation completed successfully, no errors found.' });
  } catch (err) {
    return next(err);
  }
}

const checkUserAuthenticated = createMiddleware(
  'jwtBusCustomer',
  jwtPayload => User.findOne({
    _id: jwtPayload.userId,
    roles: User.ROLE_BUS_CUSTOMER,
    status: User.STATUS_ACTIVE,
  }),
);

module.exports = {
  updateProfile,
  checkUserAuthenticated,
  validateConnectedUser,
};
