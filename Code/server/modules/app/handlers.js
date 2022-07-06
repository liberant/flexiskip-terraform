const User = require('./models/user');
const Bin = require('./models/bin');
const Dumpsite = require('./models/dumpsite');
const WasteType = require('./models/waste-type');
const State = require('./models/state');
const Region = require('./models/region');
const Event = require('./models/event');
const Product = require('./models/product');

const createMiddleware = require('../common/jwt');
const config = require('../../config');
const logger = require('../common/log');
const { validationExc } = require('../common/helpers');
const { validateEventData, getCouncilByAddress } = require('./helpers');
const { getAddressFromLocation } = require('../common/shipping');

/**
 * middle to check access token of user
 */
const verifyUserToken = createMiddleware(
  'jwtUser',
  jwtPayload => User.findById(jwtPayload.userId),
);

// return a new token using a valid user token
// this is used to prolong token expiration
async function refreshToken(req, res, next) {
  try {
    const { user } = req;
    res.json({
      id: user._id,
      token: user.createToken(config.accessTokenLifeTime),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get dropdown option for product's materials
 */
function getProductMaterialOptions(req, res, next) {
  try {
    const result = [
      'General',
      'Green',
      'Asbestos',
      'Contaminated soil',
      'Timber',
      'Concrete',
      'E-waste',
      'Bricks and rubble',
      'Steel',
      'Paper and cardboard',
      'Broken furniture',
      'Plastic',
      'Glass',
    ].sort();
    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Get dropdown option for product's materials
 */
async function getWasteTypeOptions(req, res, next) {
  try {
    const wasteTypes = await WasteType.find().sort({ name: 1 });
    res.json(wasteTypes.map(item => item.name));
  } catch (error) {
    next(error);
  }
}

// display bins to test qr code scanning
async function viewBins(req, res, next) {
  try {
    const bins = await Bin.find()
      .populate('customer')
      .populate('product')
      .limit(50)
      .sort({ _id: -1 });
    res.render('bins', { bins });
  } catch (err) {
    next(err);
  }
}

function getSettings(req, res, next) {
  try {
    const response = {
      handelPhone: '0123456789',
      maximumJobAccepted: config.limitJob,
    };
    return res.json(response);
  } catch (err) {
    return next(err);
  }
}

// Auto detect dumpsite address from location
async function updateDumpsiteAddress(req, res, next) {
  try {
    const dumpsites = await Dumpsite.find();
    await Promise.all(dumpsites.map(async (d) => {
      const dumpsite = d;
      const [lng, lat] = d.location.coordinates;
      if (!lng || !lat) return Promise.resolve();

      try {
        dumpsite.address = await getAddressFromLocation(lat, lng);
        dumpsite.status = Dumpsite.STATUS_ACTIVE;
      } catch (error) {
        dumpsite.status = Dumpsite.STATUS_IN_ACTIVE;
        logger.error(`Error while finding address of ${d.name}`);
      }
      return dumpsite.save();
    }));

    return res.json('success');
  } catch (err) {
    return next(err);
  }
}

async function getStates(req, res, next) {
  try {
    const states = await State.find().sort({ name: 1 });
    return res.json(states.map(st => ({
      name: st.name,
      postCodes: st.postCodes,
    })));
  } catch (err) {
    return next(err);
  }
}

async function getRegions(req, res, next) {
  try {
    const regions = await Region.find().sort({ name: 1 });
    return res.json(regions.map(rg => rg.name));
  } catch (err) {
    return next(err);
  }
}

async function addEvent(req, res, next) {
  try {
    const ev = new Event();
    const data = req.body;
    const errors = validateEventData(data);
    if (errors) {
      return next(validationExc('Please check your form input', errors));
    }

    ev.type = data.type;
    ev.data = data.data;
    await ev.save();

    return res.json(ev);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  verifyUserToken,
  refreshToken,
  getProductMaterialOptions,
  getWasteTypeOptions,
  getSettings,
  updateDumpsiteAddress,
  viewBins,
  getStates,
  getRegions,
  addEvent,
};
