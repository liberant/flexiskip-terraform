const User = require('../../models/user');

const {
  validateContractorData,
  saveContractor,
  getQueryData,
  validateStatusData,
} = require('./helpers');
const {
  notFoundExc,
  validationExc,
} = require('../../../common/helpers');

async function list(req, res, next) {
  try {
    const query = getQueryData(req.query, req.user);
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

async function add(req, res, next) {
  try {
    const data = req.body;
    const user = new User();
    const errors = await validateContractorData(data, user);
    if (errors) {
      return next(validationExc('Please correct your input.', errors));
    }

    data.orgId = req.user.contractorProfile.organisation;
    data.status = User.STATUS_ACTIVE;
    await saveContractor(data, user);
    return res.json(await user.toUserObject());
  } catch (err) {
    return next(err);
  }
}

async function update(req, res, next) {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      'driverProfile.organisation': req.user.contractorProfile.organisation,
    });
    if (!user) {
      return next(notFoundExc('Contractor admin not found'));
    }

    const { _id, ...data } = req.body;
    const errors = await validateContractorData(data, user);
    if (errors) {
      return next(validationExc('Please correct your input.', errors));
    }

    data.orgId = req.user.contractorProfile.organisation;
    await saveContractor(data, user);
    return res.json(await user.toUserObject());
  } catch (err) {
    return next(err);
  }
}

async function detail(req, res, next) {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      'driverProfile.organisation': req.user.contractorProfile.organisation,
    });
    if (!user) {
      return next(notFoundExc('Contractor admin not found'));
    }

    return res.json(await user.toUserObject());
  } catch (err) {
    return next(err);
  }
}

// update status of multiple contractor user
async function massUpdateUserStatus(req, res, next) {
  try {
    const errors = validateStatusData(req.body);
    if (errors) {
      return next(validationExc('Please correct your input.', errors));
    }

    // update status of mutiple users
    const users = await User.find({
      _id: { $in: req.body.ids },
      'contractorProfile.organisation': req.user.contractorProfile.organisation,
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

module.exports = {
  update,
  add,
  list,
  detail,
  massUpdateUserStatus,
};
