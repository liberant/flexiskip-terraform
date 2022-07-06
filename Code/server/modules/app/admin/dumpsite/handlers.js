const Council = require('../../models/council');
const Dumpsite = require('../../models/dumpsite');
const {
  validationExc,
  notFoundExc,
} = require('../../../common/helpers');
const { parseAddress } = require('../../../common/shipping');
const {
  getQueryData,
  validateFormData,
  validateStatusData,
} = require('./helpers');

async function listItems(req, res, next) {
  try {
    const query = getQueryData(req.query, req.user._id);
    const total = await Dumpsite.countDocuments(query.conditions);
    const items = await Dumpsite.find(query.conditions)
      .sort(query.sort)
      .skip(query.offset)
      .limit(query.limit)
      .populate('council');

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

async function createItem(req, res, next) {
  try {
    const data = req.body;
    const errors = validateFormData(data);
    if (errors) {
      return next(validationExc('Please correct your input.', errors));
    }

    const item = new Dumpsite({
      name: data.name,
      address: data.address,
      code: data.code,
      council: data.council,
      openDays: data.openDays,
      charges: data.charges,
      website: data.website,
      priceListUrl: data.priceListUrl,
    });
    const { location: { lat, lng } } = await parseAddress(data.address);
    item.location = {
      type: 'Point',
      coordinates: [lng, lat],
    };
    await item.save();

    return res.json(item);
  } catch (err) {
    return next(err);
  }
}

async function getItem(req, res, next) {
  try {
    const item = await Dumpsite.findById(req.params.id);
    if (!item) {
      return next(notFoundExc('Item not found'));
    }
    return res.json(item);
  } catch (err) {
    return next(err);
  }
}

async function updateItem(req, res, next) {
  try {
    const item = await Dumpsite.findById(req.params.id);
    if (!item) {
      return next(notFoundExc('Item not found'));
    }

    const data = req.body;
    data.product = item.product;
    const errors = validateFormData(data);
    if (errors) {
      return next(validationExc('Please correct your input.', errors));
    }

    item.set({
      name: data.name,
      address: data.address,
      code: data.code,
      council: data.council,
      openDays: data.openDays,
      charges: data.charges,
      website: data.website,
      priceListUrl: data.priceListUrl,
    });
    const { location: { lat, lng } } = await parseAddress(data.address);
    item.location = {
      type: 'Point',
      coordinates: [lng, lat],
    };
    await item.save();

    return res.json(item);
  } catch (err) {
    return next(err);
  }
}

async function deleteItem(req, res, next) {
  try {
    const item = await Dumpsite.findById(req.params.id);
    if (!item) {
      return next(notFoundExc('Item not found'));
    }
    await item.remove();

    return res.json(item);
  } catch (err) {
    return next(err);
  }
}

// delete multiple items
async function updateItemsStatus(req, res, next) {
  try {
    const errors = validateStatusData(req.body);
    if (errors) {
      return next(validationExc('Please correct your input.', errors));
    }

    const items = await Dumpsite.find({
      _id: { $in: req.body.ids },
    });
    if (items.length === 0) {
      return next(notFoundExc('No items found.'));
    }

    await Promise.all(items.map(item => item.remove()));
    return res.json(items);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listItems,
  createItem,
  updateItem,
  getItem,
  deleteItem,
  updateItemsStatus,
};
