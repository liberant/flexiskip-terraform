const User = require('../../models/user');
const EmailHelper = require('../../helpers/email');
const {
  validationExc,
  notFoundExc,
} = require('../../../common/helpers');
const {
  validateUpdateForm,
} = require('./helpers');
const AddContractorForm = require('./models/add-contractor-form');
const UpdateStatusForm = require('./models/update-status-form');

const Organisation = require("../../models/organisation");

async function addContractor(req, res, next) {
  try {
    const model = new AddContractorForm();
    model.data = req.body;
    if (!await model.save()) {
      throw validationExc('Please correct your input.', model.errors);
    }
    const { contractor } = model;
    return res.json(await contractor.toUserObject());
  } catch (err) {
    return next(err);
  }
}

async function updateContractor(req, res, next) {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return next(notFoundExc('Customer not found'));
    }

    const data = req.body;

    // update company data
    await user.populate('contractorProfile.organisation').execPopulate();
    const org = user.contractorProfile.organisation;

    const newRunsheetUrl = data.company.runsheet.url;
    if (newRunsheetUrl && newRunsheetUrl !== org.runsheet.url) {
        const runsheet = await Organisation.findOne({
            "runsheet.url": newRunsheetUrl,
        });
        if (runsheet) {
            throw validationExc(
                "Runsheet url already exists!, please change the url"
            );
        }
    }

    const errors = validateUpdateForm(data);
    if (errors) {
      return next(validationExc('Please correct your input', errors));
    }

    org.set({
      abn: data.company.abn,
      name: data.company.name,
      phone: data.company.phone,
      address: data.company.address,
      inRotation: data.company.inRotation,
      runsheet: data.company.runsheet,
    });
    await org.save();

    // update user data
    user.avatar = data.avatar;
    await user.updateStatus(data.status);
    if (user.status === User.STATUS_ACTIVE && user.password == null) {
      if (user.roles.indexOf(User.ROLE_DRIVER) < 0) {
        await EmailHelper.sendWelcomeEmailToContractor(user);
      } else {
        await EmailHelper.sendWelcomeEmailToContractorDriver(user);
      }
    }

    const resp = await user.toUserObject();
    return res.json(resp);
  } catch (err) {
    return next(err);
  }
}

async function updateContractorStatus(req, res, next) {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return next(notFoundExc('Customer not found'));
    }

    const model = new UpdateStatusForm(user);
    model.data = req.body;
    if (!await model.save()) {
      throw validationExc('Please correct your input.', model.errors);
    }
    const { contractor } = model;
    return res.json(await contractor.toUserObject());
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  addContractor,
  updateContractor,
  updateContractorStatus,
};
