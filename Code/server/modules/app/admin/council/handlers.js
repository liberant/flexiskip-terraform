const Council = require('../../models/council');
const Product = require('../../models/product');
const Dumpsite = require('../../models/dumpsite');
const {
  validationExc,
  notFoundExc,
} = require('../../../common/helpers');
const {
  getQueryData,
  validateFormData,
  validateStatusData,
  getProductListFilter,
} = require('./helpers');

async function listItems(req, res, next) {
  try {
    const query = getQueryData(req.query, req.user._id);
    const { excludeDumpsiteCount } = req.query;

    const rawData = await Council.aggregate(query.pipelines);
    const total = rawData[0].total[0] && rawData[0].total[0].count;
    let items = rawData[0].data;

    if (!excludeDumpsiteCount){
      items = await Promise.all(items.map(async (item) => {
        item.dumpsiteCount = await Dumpsite.countDocuments({ council: item._id });
        return item;
      }));
    }

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
    const item = new Council();
    const errors = await validateFormData(data, item);
    if (errors) {
      return next(validationExc('Please correct your input.', errors));
    }
    item.set({
      code: data.code,
      name: data.name,
      state: data.state,
      region: data.region,
      branding: data.branding,
      surcharge: data.surcharge,
      postCodes: data.postCodes,
      status: data.status,
    });
    await item.save();
    return res.json(item);
  } catch (err) {
    return next(err);
  }
}

async function getItem(req, res, next) {
  try {
    const item = await Council.findById(req.params.id);
    if (!item) {
      return next(notFoundExc('Item not found'));
    }
    const result = item.toObject();
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

async function updateItem(req, res, next) {
  try {
    const item = await Council.findById(req.params.id);
    if (!item) {
      return next(notFoundExc('Item not found'));
    }

    const data = req.body;
    data.product = item.product;
    const errors = await validateFormData(data, item);
    if (errors) {
      return next(validationExc('Please correct your input.', errors));
    }

    item.set({
      code: data.code,
      name: data.name,
      state: data.state,
      region: data.region,
      branding: data.branding,
      surcharge: data.surcharge,
      postCodes: data.postCodes,
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
    const item = await Council.findById(req.params.id);
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

    const items = await Council.find({
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

async function getCouncilProducts(req, res, next) {
  try {
    const query = getProductListFilter({ ...req.query, council: req.params.id });
    const total = await Product.countDocuments(query.conditions);
    const items = await Product.find(query.conditions)
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

module.exports = {
  listItems,
  createItem,
  updateItem,
  getItem,
  deleteItem,
  updateItemsStatus,
  getCouncilProducts,
};
