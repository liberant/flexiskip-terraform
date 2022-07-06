const Advertisement = require('../../models/advertisement');
const {
  validationExc,
  notFoundExc,
} = require('../../../common/helpers');
const {
  getQueryData,
  validateFormData,
  validateStatusData,
} = require('./helpers');

async function list(req, res, next) {
  try {
    const query = getQueryData(req.query, req.user._id);
    const total = await Advertisement.countDocuments(query.conditions);
    const items = await Advertisement.find(query.conditions)
      .sort({ _id: -1 })
      .skip(query.offset)
      .limit(query.limit);

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
    const item = new Advertisement({
      title: data.title,
      section: data.section,
      image: data.image,
      content: data.content,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status,
      published: data.published,
    });
    await item.save();
    return res.json(item);
  } catch (err) {
    return next(err);
  }
}

async function getItemDetail(req, res, next) {
  try {
    const item = await Advertisement.findById(req.params.id);
    if (!item) {
      return next(notFoundExc('Advertisement not found'));
    }

    await item.save();
    return res.json(item);
  } catch (err) {
    return next(err);
  }
}

async function updateItem(req, res, next) {
  try {
    const item = await Advertisement.findById(req.params.id);
    if (!item) {
      return next(notFoundExc('Advertisement not found'));
    }

    const data = req.body;
    const errors = validateFormData(data);
    if (errors) {
      return next(validationExc('Please correct your input.', errors));
    }

    item.set({
      title: data.title,
      section: data.section,
      image: data.image,
      content: data.content,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status,
    });
    await item.save();
    return res.json(item);
  } catch (err) {
    return next(err);
  }
}

async function deleteItem(req, res, next) {
  try {
    const item = await Advertisement.findById(req.params.id);

    if (!item) {
      return next(notFoundExc('Advertisement not found'));
    }
    item.status = Advertisement.STATUS_REMOVED;
    await item.save();
    return res.json(item);
  } catch (err) {
    return next(err);
  }
}

// delete multiple items
async function deleteItems(req, res, next) {
  try {
    const errors = validateStatusData(req.body);
    if (errors) {
      return next(validationExc('Please correct your input.', errors));
    }

    const items = await Advertisement.find({
      _id: { $in: req.body.ids },
    });
    if (items.length === 0) {
      return next(notFoundExc('No items found.'));
    }

    await Promise.all(items.map((item) => {
      item.status = Advertisement.STATUS_REMOVED;
      return item.save();
    }));
    return res.json(items);
  } catch (err) {
    return next(err);
  }
}

/**
 * Publish advertising
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function publishAdvertising(req, res, next) {
  try {
    const data = req.body;
    const item = await Advertisement.findById(data.id);
    if (!item) {
      return next(notFoundExc('Advertisement not found'));
    }
    item.set({
      published: true,
    });
    await item.save();
    return res.json(item);
  } catch (err) {
    return next(err);
  }
}


module.exports = {
  list,
  createItem,
  updateItem,
  getItemDetail,
  deleteItem,
  deleteItems,
  publishAdvertising,
};
