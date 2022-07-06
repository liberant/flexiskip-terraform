const User = require('../../models/user');
const CouncilAddress = require('../../models/council-address');
const EmailVerificationCode = require('../../models/email-verification-code');

const createMiddleware = require('../../../common/jwt');
const { randomString, verifyAccessToken } = require('../../../common/helpers');
const { verificationCodeLifeTime, accessTokenLifeTime } = require('../../../../config');

const {
  validationExc,
  notFoundExc,
} = require('../../../common/helpers');
const { validateProfileData } = require('./helpers');
const { getCouncilByAddress } = require('../../helpers');
const { sendResCustomerSignInVerificationEmail } = require('../../helpers/email');

const validate = require('validate.js');
const {
  parseAddress,
  geocoding,
} = require('../../../common/shipping');
const {
  createCustomer,
  createSetupIntent,
  getPaymentMethod,
  createPaymentIntent,
} = require('../../../common/payment');
const { sendMail } = require('../../../common/mail');

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

    const council = await getCouncilByAddress(data.address);
    user.avatar = data.avatar;
    user.council = council ? council._id : undefined;
    user.firstname = data.firstname;
    user.lastname = data.lastname;
    user.phone = data.phone;
    user.residentialCustomerProfile.address = data.address;
    user.residentialCustomerProfile.receiveInvoiceEmail = data.receiveInvoiceEmail;

    await user.save();
    return res.json(await user.toUserObject());
  } catch (err) {
    return next(err);
  }
}

async function signInWithLink(req, res, next) {
  try {
    const input = req.body;

    // validate client input
    validate.Promise = global.Promise;
    const constraints = {
      email: {
        presence: { allowEmpty: false },
        email: true,
      },
    };
    let errors;
    try {
      await validate.async(input, constraints, { format: 'grouped' });
    } catch (err) {
      errors = err;
    }
    if (errors) {
      throw validationExc('Invalid customer data', errors);
    }

    input.email = input.email.toLowerCase();
    // Check exist/ create user
    // create customer account for this purchase
    let customer = await User.findOne({ email: input.email });
    if (!customer) customer = await createResidentialCustomer(input);

    // generate verification code
    let code = new EmailVerificationCode({
      code: randomString(12),
      email: input.email,
      data: input.data,
      verified: false
    });
    await code.save();

    // send email verification
    await sendResCustomerSignInVerificationEmail(customer, code.code, 'gc');
    return res.json({ message: 'Verification email was sent.' });
  } catch (err) {
    return next(err);
  }
}

/**
 * Find/ Create new residential customer user
 *
 * @typedef {Object} userInfo
 * @property {String} email
 * @property {String} address
 * @property {String} firstname
 * @property {String} lastname
 * @property {String} phone
 */
async function createResidentialCustomer(userInfo) {
  const councilAddr = await CouncilAddress.findOne({ fullAddress: userInfo.address });
  const geocodedAddress = await geocoding(userInfo.address);

  // create stripe customer
  const stripeCustomer = await createCustomer(userInfo.email, 'Flexiskip Customer');

  let customer = new User({
    email: userInfo.email,
    status: User.STATUS_ACTIVE,
    roles: User.ROLE_RES_CUSTOMER,
    council: councilAddr ? councilAddr.council : null,
    firstname: userInfo.firstname || '',
    lastname: userInfo.lastname || '',
    phone: userInfo.phone || '',
    socialId: userInfo.socialId || undefined,
    socialType: userInfo.socialType || undefined,
    residentialCustomerProfile: {
      address: geocodedAddress.formatted_address,
      payment: {
        stripeCustomerId: stripeCustomer.id,
        cardLast4Digits: null,
      },
    },
  });
  await customer.save();
  return customer;
}

async function verifyCode(req, res, next) {
  try {
    const query = req.query;
    let code = await EmailVerificationCode.findOne({
      code: query.verificationCode,
      verified: false,
      createdAt: { $gt: new Date(Date.now() - verificationCodeLifeTime*60*60*1000) }
    });
    if (!code) return next(notFoundExc('Verification code not found'));
    let user = await User.findOne({ email: code.email });
    if (!user) return next(notFoundExc('User not found'));

    code.verified = true;
    await code.save();

    return res.json({
      token: user.createToken(accessTokenLifeTime),
      user: await user.toUserObject(),
    });

  } catch (err) {
    return next(err);
  }
}

// res - customer login (currently only using social login (Google/ AppleID))
async function login(req, res, next) {
  try {
    const data = req.body;
    // validate client input
    validate.Promise = global.Promise;
    const constraints = {
      socialType: {
        presence: { allowEmpty: false },
      },
      accessToken: {
        presence: { allowEmpty: false },
      },
    };
    let errors;
    try {
      await validate.async(data, constraints, { format: 'grouped' });
    } catch (err) {
      errors = err;
    }
    if (errors) {
      throw validationExc('Invalid login data', errors);
    }

    // Login via social type
    if (data.socialType) {
      const { socialId, email } = await verifyAccessToken(data);
      const { address, socialType } = data;

      if (socialId) {
        let customer = await User.findOne({
          $or : [
            {email: email},
            {socialId: socialId, socialType: socialType},
          ]
        });

        if (!customer) {
          let userInfo = {
            email: email,
            socialId: socialId,
            socialType: socialType,
            address: address,
            firstname: '',
            lastname: '',
            phone: '',
          }

          customer = await createResidentialCustomer(userInfo);
        } else if (!customer.socialId) { // update socialID if found by email
          customer.socialId = socialId;
          customer.socialType = socialType;
          await customer.save();
        }

        return res.json({
          token: customer.createToken(accessTokenLifeTime),
          user: await customer.toUserObject(),
        });
      }
      return res.status(400).json(validationExc(
        'Invalid login information or account is not activated.',
        {
          socialType: ['Account is not activated'],
        },
      ));
    }
  } catch (err) {
    return next(err);
  }
}

async function getSetupIntentSecret(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    const setupIntent = await createSetupIntent(user.residentialCustomerProfile.payment.stripeCustomerId);
    return res.json({
      clientSecret: setupIntent.client_secret
    });
  } catch (err) {
    return next(err);
  }
}

async function getCustomerPaymentMethod(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    const paymentMethods = await getPaymentMethod(user.residentialCustomerProfile.payment.stripeCustomerId, 'gcc-violation-charge');
    let result = null;
    if (paymentMethods.length) result = { last4: paymentMethods[0].card.last4 };
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

async function getPaymentIntentSecretForCollectionRequest(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    const paymentIntent = await createPaymentIntent(12500, user.residentialCustomerProfile.payment.stripeCustomerId);
    return res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (err) {
    return next(err);
  }
}


const checkUserAuthenticated = createMiddleware(
  'jwtResCustomer',
  jwtPayload => User.findOne({
    _id: jwtPayload.userId,
    roles: User.ROLE_RES_CUSTOMER,
    status: User.STATUS_ACTIVE,
  }),
);

module.exports = {
  updateProfile,
  checkUserAuthenticated,
  signInWithLink,
  verifyCode,
  login,
  getSetupIntentSecret,
  getCustomerPaymentMethod,
  getPaymentIntentSecretForCollectionRequest
};
