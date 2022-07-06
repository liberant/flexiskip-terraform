const User = require('../../models/user');
const Review = require('../../models/review');
const Vehicle = require('../../models/vehicle');
const BinRequest = require('../../models/bin-request');
const CollectionRequest = require('../../models/collection-request');
const {
  validationExc,
  notFoundExc,
} = require('../../../common/helpers');
const { validateStatusData } = require('./helpers');
const EmailHelper = require('../../helpers/email');
const {
  getQueryData,
  validateUpdateUserData,
  getQueryDataForUser,
  combineRequests,
} = require('./helpers');
const { getPaymentMethod } = require('../../../common/payment');
const { STRIPE_PAYMENT_METHOD_TRIGGERS } = require('../../../common/constants');

// get user list
async function getUserList(req, res, next) {
  try {
    const query = await getQueryData(req.query);
    const total = await User.countDocuments(query.conditions);
    const items = await User.find(query.conditions)
      .sort({ _id: -1 })
      .skip(query.offset)
      .limit(query.limit);
    return res
      .set('X-Pagination-Page-Count', Math.ceil(total / query.limit))
      .set('X-Pagination-Current-Page', query.page)
      .set('X-Pagination-Per-Page', query.limit)
      .set('X-Pagination-Total-Count', total)
      .json(await Promise.all(items.map(u => u.toUserObject())));
  } catch (err) {
    return next(err);
  }
}

// get user Detail
async function getUserDetail(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(notFoundExc('User not found'));
    }
    const result = await user.toUserObject();

    // return additional drivers, vehicles, contractors user for business contractor account
    if (user.can(User.ROLE_CONTRACTOR)) {
      const drivers = await User.find({ 'driverProfile.organisation': result.organisation._id });
      result.drivers = await Promise.all(drivers.map(d => d.toUserObject()));
      result.vehicles = await Vehicle.find({ organisation: result.organisation._id });
      const contractors = await User.find({
        'contractorProfile.organisation': result.organisation._id,
      });
      result.contractors = contractors;
    }

    // return rating list
    const ratings = await Review.find({ reviewee: user._id });
    result.ratings = ratings.length > 0
      ? await Promise.all(ratings.map(r => r.toReviewObject())) : [];

    //get GCC payment method
    if (user.prefix == 'gc' && user.residentialCustomerProfile){
      const paymentMethods = await getPaymentMethod(user.residentialCustomerProfile.payment.stripeCustomerId, STRIPE_PAYMENT_METHOD_TRIGGERS.GCC_VIOLATION_CHARGE);
      let gccViolationPaymentMethod = null;
      if (paymentMethods[0]){
        const { brand, last4 } = paymentMethods[0].card;
        console.log();
        gccViolationPaymentMethod = {
          brand,
          last4
        }
      }
      result.gccViolationPaymentMethod = gccViolationPaymentMethod;
    }

    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

// update status of multiple users
async function massUpdateUserStatus(req, res, next) {
  try {
    const errors = validateStatusData(req.body);
    if (errors) {
      return next(validationExc('Please correct your input.', errors));
    }

    // update status of mutiple users
    const users = await User.find({
      _id: { $in: req.body.ids },
    });
    const promises = users.map(user => user.updateStatus(req.body.status));
    await Promise.all(promises);

    // return user data after updating
    const result = await Promise.all(users.map(u => u.toUserObject()));
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

// soft delete user
async function deleteUser(req, res, next) {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return next(notFoundExc('User not found'));
    }

    await user.updateStatus(User.STATUS_REMOVED);
    return res.json(await user.toUserObject());
  } catch (err) {
    return next(err);
  }
}

// send password reset instruction email to user
async function requestResetPassword(req, res, next) {
  try {
    const user = await User.findOne({
      _id: req.params.id,
    });
    if (!user) {
      return next(notFoundExc('User not found'));
    }

    await EmailHelper.sendResetPasswordEmailToUser(user);
    return res.json(await user.toUserObject());
  } catch (err) {
    return next(err);
  }
}

async function updateUserDetail(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(notFoundExc('User not found'));
    }
    const data = req.body;

    const errors = await validateUpdateUserData(data, user);
    if (errors) {
      return next(validationExc('Please correct your input.', errors));
    }
    user.set({
      email: data.email,
      firstname: data.firstname,
      lastname: data.lastname,
      phone: data.phone,
    });

    await user.save();
    return res.json(user);
  } catch (err) {
    return next(err);
  }
}

async function getContractorsByOrganisation(req, res, next) {
  try {
    const contractors = await User.find({
      'contractorProfile.organisation': req.params.id,
    });
    return res.json(await Promise.all(contractors.map(u => u.toUserObject())));
  } catch (err) {
    return next(err);
  }
}

/**
 * Get Transaction history for user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getTransactionsByUser(req, res, next) {
  try {
    const dataType = req.query.type;
    const userId = req.params.id;

    const conditions = getQueryDataForUser(req.query, userId);
    if (dataType === 'all') {
      const binRequests = await BinRequest.aggregate(conditions.pipelines);
      const collectionRequests = await CollectionRequest.aggregate(conditions.pipelines);
      const combineTwoDocument = combineRequests(binRequests, collectionRequests, req.query);
      const total = combineTwoDocument.length;

      const result = combineTwoDocument.splice(conditions.offset, conditions.limit);
      return res
        .set('X-Pagination-Page-Count', Math.ceil(total / conditions.limit))
        .set('X-Pagination-Current-Page', conditions.page)
        .set('X-Pagination-Per-Page', conditions.limit)
        .set('X-Pagination-Total-Count', total)
        .json(result);
    }
    const Model = dataType === 'bin' ? BinRequest : CollectionRequest;
    const total = (await Model.aggregate(conditions.pipelines)).length;
    const data = await Model.aggregate(conditions.pipelines)
      .sort(conditions.sort)
      .skip(conditions.offset)
      .limit(conditions.limit);

    return res
      .set('X-Pagination-Page-Count', Math.ceil(total / conditions.limit))
      .set('X-Pagination-Current-Page', conditions.page)
      .set('X-Pagination-Per-Page', conditions.limit)
      .set('X-Pagination-Total-Count', total)
      .json(data);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  massUpdateUserStatus,
  deleteUser,
  requestResetPassword,
  getUserList,
  getUserDetail,
  updateUserDetail,
  getContractorsByOrganisation,
  getTransactionsByUser,
};
