const User = require('../../models/user');
const {
  validationExc,
  notFoundExc,
} = require('../../../common/helpers');

const AddCouncilOfficerForm = require('./models/add-council-officer-form');
const UpdateCouncilOfficerForm = require('./models/update-council-officer-form');

async function createCouncilOfficer(req, res, next) {
  try {
    const model = new AddCouncilOfficerForm();
    model.data = req.body;
    if (!await model.save()) {
      throw validationExc('Please correct your input.', model.errors);
    }
    const { customer } = model;
    return res.json(await customer.toUserObject());
  } catch (err) {
    return next(err);
  }
}

async function updateCouncilOfficer(req, res, next) {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return next(notFoundExc('User not found'));
    }
    const model = new UpdateCouncilOfficerForm(user);
    model.data = req.body;
    if (!await model.save()) {
      throw validationExc('Please correct your input.', model.errors);
    }
    const { customer } = model;
    return res.json(await customer.toUserObject());
  } catch (err) {
    return next(err);
  }
}


module.exports = {
  createCouncilOfficer,
  updateCouncilOfficer,
};
