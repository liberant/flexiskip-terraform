const User = require('../../models/user');

const createMiddleware = require('../../../common/jwt');
const config = require('../../../../config');
const { validationExc, notFoundExc } = require('../../../common/helpers');
const { validateLoginData } = require('./helpers');
const { accessTokenLifeTime } = require('../../../../config');
const { updateCard } = require('./helpers');
const RegistrationForm = require('./models/registration-form');
const { parseAddress } = require('../../../common/shipping');
const { verifyAccessToken } = require('../../../common/helpers.js');


// customer login
async function login(req, res, next) {
  try {
    const data = req.body;
    const errors = validateLoginData(data);
    if (errors) {
      return next(validationExc('Please correct your input.', errors));
    }

    // Login via social type
    if (data.socialType) {
      const { socialId, email } = await verifyAccessToken(data);
      if (socialId) {
        const orConditions = email ? [{ email }, { socialId }] : [{ socialId }];
        const user = await User.findOneAndUpdate(
          {
            status: User.STATUS_ACTIVE,
            roles: { $in: [User.ROLE_RES_CUSTOMER, User.ROLE_BUS_CUSTOMER] },
            $or: orConditions,
          },
          {
            socialId,
            socialType: data.socialType,
          },
        );
        if (user) {
          return res.json({
            token: user.createToken(accessTokenLifeTime),
            user: await user.toUserObject(),
          });
        }
        return res.json({
          token: undefined,
          user: undefined,
        });
      }
      return res.status(400).json(validationExc(
        'Invalid login information or account is not activated.',
        {
          socialType: ['Account is not activated'],
        },
      ));
    }

    // Login with email and password
    const user = await User.findOne({
      email: data.loginId.toLowerCase(),
      status: User.STATUS_ACTIVE,
      roles: { $in: [User.ROLE_RES_CUSTOMER, User.ROLE_BUS_CUSTOMER] },
    });

    if (!user || !user.checkPassword(data.password)) {
      return res.status(400).json(validationExc(
        'Invalid login information or account is not activated.',
        {
          password: ['Incorrect username or password'],
        },
      ));
    }

    return res.json({
      token: user.createToken(accessTokenLifeTime),
      user: await user.toUserObject(),
    });
  } catch (err) {
    return next(err);
  }
}

// customer registration
async function register(req, res, next) {
  try {
    const model = new RegistrationForm();
    model.data = req.body;

    // if dry run, only perform validation and return validation result
    let { fields = [], dryRun } = req.query;
    dryRun = (dryRun === '1');
    if (!Array.isArray(fields)) {
      fields = fields.split(',');
    }
    if (dryRun) {
      await model.validate(fields);
      const { errors } = model;
      return errors
        ? next(validationExc('I\'m sorry', errors))
        : res.json('Validation completed successfully, no errors found.');
    }

    // save registration
    if (!await model.save()) {
      throw validationExc('I\'m sorry', model.errors);
    }
    const { customer } = model;
    return res.json({
      token: customer.createToken(config.accessTokenLifeTime),
      user: await customer.toUserObject(),
    });
  } catch (err) {
    return next(err);
  }
}

const checkUserAuthenticated = createMiddleware('jwtCustomer', async (jwtPayload) => {
  const user = await User.findOne({
    _id: jwtPayload.userId,
    roles: { $in: [User.ROLE_RES_CUSTOMER, User.ROLE_BUS_CUSTOMER] },
    status: User.STATUS_ACTIVE,
  });
  return user;
});

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

// get customer's used addresses
async function getAddresses(req, res, next) {
  try {
    const customer = await User.findOne({
      _id: req.user._id,
    });
    if (customer.roles.indexOf('residentialCustomer') > -1) {
      return res.json(customer.residentialCustomerProfile.address);
    } else if (customer.roles.indexOf('businessCustomer') > -1) {
      return res.json(customer.businessCustomerProfile.address);
    }
    return next(notFoundExc('Sorry, we cannot find your registered address!'));
  } catch (err) {
    return next(err);
  }
}

/**
 * Function to check the address which is sent in the body of the request.
 * @param {*} req Request from front-end
 * @param {*} res Response to front-end
 * @param {*} next Return err
 */
async function checkAddress(req, res, next) {
  try {
    const { address } = req.body;
    const parsedAddr = await parseAddress(address);

    const { postalCode } = parsedAddr;

    if (postalCode) {
      const user = new User();
      const isAvailable = await user.checkAvailablePostalCode(postalCode);
      if (isAvailable) {
        return res.json({ postcode: postalCode });
      }
      return next(notFoundExc('Unfortunately, we do not service your area'));
    }
    return next(notFoundExc('Unfortunately, we do not service your area'));
  } catch (err) {
    return next(notFoundExc('Unfortunately, we do not service your area'));
  }
}

module.exports = {
  login,
  register,
  checkUserAuthenticated,
  updatePayment,
  getAddresses,
  checkAddress,
};
