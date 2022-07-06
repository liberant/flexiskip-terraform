const User = require('../../models/user');
const Review = require('../../models/review');
const AddDriverForm = require('./models/add-driver-form');
const UpdateDriverForm = require('./models/update-driver-form');
const InviteDriverForm = require('./models/invite-driver-form');
const { getQueryData, validateStatusData } = require('./helpers');
const { notFoundExc, validationExc } = require('../../../common/helpers');

async function getDriverDetail(req, res, next) {
  try {
    const driver = await User.findOne({
      _id: req.params.id,
      'driverProfile.organisation': req.user.contractorProfile.organisation,
    });
    if (!driver) {
      return next(notFoundExc('Driver not found'));
    }
    return res.json(await driver.toUserObject());
  } catch (err) {
    return next(err);
  }
}

async function getDrivers(req, res, next) {
  try {
    const query = getQueryData(req.query);
    query.conditions['driverProfile.organisation'] = req.user.contractorProfile.organisation;
    const total = await User.countDocuments(query.conditions);
    const items = await User.find(query.conditions)
      .sort({ _id: -1 })
      .skip(query.offset)
      .limit(query.limit);
    const users = await Promise.all(items.map(u => u.toUserObject()));
    return res
      .set('X-Pagination-Page-Count', Math.ceil(total / query.limit))
      .set('X-Pagination-Current-Page', query.page)
      .set('X-Pagination-Per-Page', query.limit)
      .set('X-Pagination-Total-Count', total)
      .json(users);
  } catch (err) {
    return next(err);
  }
}

async function createDriver(req, res, next) {
  try {
    const contractor = req.user;
    const model = new AddDriverForm(contractor);
    model.data = req.body;
    if (!await model.save()) {
      throw validationExc('Please correct your input.', model.errors);
    }
    res.json(await model.driver.toUserObject());
  } catch (err) {
    next(err);
  }
}

async function updateDriverDetail(req, res, next) {
  try {
    const driver = await User.findOne({
      _id: req.params.id,
      'driverProfile.organisation': req.user.contractorProfile.organisation,
    });
    if (!driver) {
      return next(notFoundExc('Driver not found'));
    }

    const model = new UpdateDriverForm(driver);
    model.data = req.body;
    if (!await model.save()) {
      throw validationExc('Please correct your input.', model.errors);
    }

    return res.json(await driver.toUserObject());
  } catch (err) {
    return next(err);
  }
}

// update status of multiple drivers
async function massUpdateDriverStatus(req, res, next) {
  try {
    const errors = validateStatusData(req.body);
    if (errors) {
      return next(validationExc('Please correct your input.', errors));
    }

    // update status of mutiple users
    const users = await User.find({
      _id: { $in: req.body.ids },
      'driverProfile.organisation': req.user.contractorProfile.organisation,
    });
    await Promise.all(users.map((u) => {
      const user = u;
      user.status = req.body.status;
      return user.save();
    }));

    // return user data after updating
    const result = await Promise.all(users.map(u => u.toUserObject()));
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

async function getReviews(req, res, next) {
  try {
    const driver = await User.findOne({
      _id: req.params.id,
      'driverProfile.organisation': req.user.contractorProfile.organisation,
    });
    if (!driver) {
      return next(notFoundExc('Driver not found'));
    }
    const items = await Review.find({ reviewee: req.params.id })
      .populate('reviewer')
      .populate('collectionRequest');

    return res.json(await Promise.all(items.map(item => item.toReviewObject())));
  } catch (err) {
    return next(err);
  }
}

async function inviteDriver(req, res, next) {
  try {
    const contractor = req.user;
    const model = new InviteDriverForm(contractor);
    model.data = req.body;
    if (!await model.save()) {
      throw validationExc('Please correct your input.', model.errors);
    }
    res.json({ message: 'success' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDriverDetail,
  updateDriverDetail,
  createDriver,
  getDrivers,
  massUpdateDriverStatus,
  getReviews,
  inviteDriver,
};
