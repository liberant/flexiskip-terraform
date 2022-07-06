const User = require('../../models/user');
const createMiddleware = require('../../../common/jwt');
const {
  validationExc,
  notFoundExc,
} = require('../../../common/helpers');
const {
  validateLoginData,
  validateProfileData,
  updateCard,
  validateStatus,
  validateBankData,
  updateDriverLocation,
} = require('./helpers');
const RegistrationForm = require('./models/registration-form');
const config = require('../../../../config');

// contractor login
async function login(req, res, next) {
  try {
    const data = req.body;
    const errors = validateLoginData(data);
    if (errors) {
      return next(validationExc('Please correct your input.', errors));
    }

    const user = await User.findOne({
      email: data.loginId.toLowerCase(),
      roles: User.ROLE_CONTRACTOR,
      status: { $in: [User.STATUS_ACTIVE, User.STATUS_SUSPENDED] },
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

// contractor register
async function register(req, res, next) {
  try {
    const model = new RegistrationForm();
    model.data = req.body;
    if (!await model.save()) {
      throw validationExc('Please correct your input.', model.errors);
    }
    const { contractor } = model;
    const userData = await contractor.toUserObject();
    res.json({
      token: contractor.createToken(config.accessTokenLifeTime),
      user: userData,
    });
  } catch (err) {
    next(err);
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

    // update organisation information
    await user.populate('contractorProfile.organisation').execPopulate();
    const org = user.contractorProfile.organisation;
    org.name = data.company.name;
    org.phone = data.company.phone;
    org.address = data.company.address;
    org.contact.firstname = data.contact.firstname;
    org.contact.lastname = data.contact.lastname;
    org.contact.email = data.contact.email;
    org.contact.phone = data.contact.phone;
    await org.save();

    // update user information
    user.avatar = data.avatar;
    user.firstname = data.contact.firstname;
    user.lastname = data.contact.lastname;
    user.phone = data.contact.phone;
    await user.save();

    // update driver location base on organisation's address
    await updateDriverLocation(org);

    return res.json(await user.toUserObject());
  } catch (err) {
    return next(err);
  }
}

const checkUserAuthenticated = createMiddleware(
  'jwtContractor',
  jwtPayload => User.findOne({
    _id: jwtPayload.userId,
    roles: User.ROLE_CONTRACTOR,
    status: { $in: [User.STATUS_ACTIVE, User.STATUS_SUSPENDED] },
  }),
);

// update payment (stripe card token)
async function updatePayment(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(notFoundExc('No user found'));
    }

    const data = req.body;
    await updateCard(user, data.cardId);
    return res.json(await user.toUserObject());
  } catch (err) {
    return next(err);
  }
}

// update bank information
async function updateBankInfo(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    await user.populate('contractorProfile.organisation').execPopulate();
    const org = user.contractorProfile.organisation;
    if (!org) {
      return next(notFoundExc('No contractor data found'));
    }

    const data = req.body;
    const errors = validateBankData(data, user);
    if (errors) {
      return next(validationExc('Please check your form input', errors));
    }
    org.bank = {
      name: data.name,
      bsb: data.bsb,
      accountNo: data.accountNo,
    };
    await org.save();
    return res.json({ message: 'success' });
  } catch (err) {
    return next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(notFoundExc('No user found'));
    }
    const data = req.body;
    const errors = validateStatus(data);
    if (errors) {
      return next(validationExc('Please check your form input', errors));
    }
    await user.updateStatus(data.status);
    return res.json(await user.toUserObject());
  } catch (err) {
    return next(err);
  }
}

function renderOnboardingForm(req, res) {
  res.sendFile(`${config.basePath}/views/contractor-onboarding.html`);
}

module.exports = {
  login,
  register,
  updateProfile,
  checkUserAuthenticated,
  updatePayment,
  updateStatus,
  updateBankInfo,
  renderOnboardingForm,
};
