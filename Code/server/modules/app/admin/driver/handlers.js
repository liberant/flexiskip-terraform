const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const User = require('../../models/user');
const { getReviews } = require('../helpers');
const AddDriverForm = require('./models/add-driver-form');
const EmailHelper = require('../../helpers/email');
const { getQueryData } = require('./helpers');
const { formatDate } = require('../../../common/helpers');

const {
  validationExc,
  notFoundExc,
} = require('../../../common/helpers');
const {
  validateDriverData,
} = require('./helpers');

async function updateDriver(req, res, next) {
  try {
    const driver = await User.findById(req.params.id);
    if (!driver) {
      return next(notFoundExc('Driver not found'));
    }

    const data = req.body;
    const errors = await validateDriverData(data);
    if (errors) {
      return next(validationExc('Please correct your input', errors));
    }

    // update user data
    driver.avatar = data.avatar;
    driver.firstname = data.firstname;
    driver.lastname = data.lastname;
    driver.phone = data.phone;
    await driver.updateStatus(data.status);

    // Check the account if it is set the password yet, and becomes active, then send welcome email.
    if (driver.status === User.STATUS_ACTIVE && !driver.password) {
      // This account is a driver only, send Welcome email when Admin activates it.
      if (driver.roles.indexOf(User.ROLE_CONTRACTOR) < 0) {
        await EmailHelper.sendWelcomeEmailToDriver(driver);
      } else {
        // This account is contractor also a driver, send Welcome email
        // for contractor when Admin activates the driver account within it.
        await EmailHelper.sendWelcomeEmailToContractorDriver(driver);
      }
    }

    return res.json(await driver.toUserObject());
  } catch (err) {
    return next(err);
  }
}

async function createDriver(req, res, next) {
  try {
    const model = new AddDriverForm();
    model.data = req.body;
    if (!await model.save()) {
      throw validationExc('Please correct your input.', model.errors);
    }
    res.json(await model.driver.toUserObject());
  } catch (err) {
    next(err);
  }
}

async function getNonActivityDrivers(req, res, next) {
  try {
    const query = getQueryData(req.query);
    const total = await User.countDocuments(query.conditions);
    const items = await User.find(query.conditions)
      .skip(query.offset)
      .limit(query.limit)
      .sort({ fullname: 1 });
    return res
      .set('X-Pagination-Page-Count', Math.ceil(total / query.limit))
      .set('X-Pagination-Current-Page', query.page)
      .set('X-Pagination-Per-Page', query.limit)
      .set('X-Pagination-Total-Count', total)
      .json(items);
  } catch (err) {
    return next(err);
  }
}

async function exportNonActivityDrivers(req, res, next) {
  try {
    const query = getQueryData(req.query);
    const users = await User.find(query.conditions)
      .populate('driverProfile.organisation')
      .sort({ fullname: 1 });
    const items = users.map((user) => {
      const lastActiveDate = formatDate(user.driverProfile.lastJobAt);
      return {
        name: user.fullname,
        email: user.email,
        lastActiveDate,
        company: user.driverProfile.organisation.name,
      };
    });
    const csvStringifier = createCsvStringifier({
      header: [
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' },
        { id: 'lastActiveDate', title: 'Last activity date' },
        { id: 'company', title: 'Company' },
      ],
    });
    const header = csvStringifier.getHeaderString();
    const content = csvStringifier.stringifyRecords(items);
    res.setHeader('Content-disposition', 'attachment; filename=non-activity.csv');
    res.set('Content-Type', 'text/csv');
    return res.send(`${header}${content}`);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  updateDriver,
  createDriver,
  getReviews,
  getNonActivityDrivers,
  exportNonActivityDrivers,
};
