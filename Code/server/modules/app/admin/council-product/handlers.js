const Product = require('../../models/product');
const {
  validationExc,
  notFoundExc,
} = require('../../../common/helpers');
const {
  getQueryData,
  validateFormData,
  validateStatus,
} = require('./helpers');

async function listItems(req, res, next) {
  try {
    const query = getQueryData(req.query, req.user._id);
    const total = await Product.countDocuments(query.conditions);
    const items = await Product.find(query.conditions)
      .sort({ _id: -1 })
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

    const parentProduct = await Product.findById(data.product);
    const item = new Product({
      type: Product.TYPE_COUNCIL,
      vendorCode: parentProduct.vendorCode,
      wasteType: parentProduct.wasteType,
      images: parentProduct.images,
      size: parentProduct.size,
      postageSize: parentProduct.postageSize,
      weight: parentProduct.weight,
      weightAllowance: parentProduct.weightAllowance,
      materialsAllowance: parentProduct.materialsAllowance,

      name: data.name,
      residentialPrice: data.resBinPrice,
      businessPrice: data.busBinPrice,
      resColPrice: data.resColPrice,
      busColPrice: data.busColPrice,
      quantity: data.quantity,
      qtyPerAddress: data.qtyPerAddress,
      startDate: data.startDate,
      endDate: data.endDate,
      council: data.council,
      product: data.product,
    });
    await item.save();
    return res.json(item);
  } catch (err) {
    return next(err);
  }
}

async function getItem(req, res, next) {
  try {
    const item = await Product.findById(req.params.id);
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
    const item = await Product.findById(req.params.id);
    if (!item) {
      return next(notFoundExc('Item not found'));
    }

    const data = req.body;
    data.product = item.product;
    const errors = validateFormData(data);
    if (errors) {
      return next(validationExc('Please correct your input.', errors));
    }

    const parentProduct = await Product.findById(data.product);
    item.set({
      type: Product.TYPE_COUNCIL,
      vendorCode: parentProduct.vendorCode,
      wasteType: parentProduct.wasteType,
      images: parentProduct.images,
      size: parentProduct.size,
      postageSize: parentProduct.postageSize,
      weight: parentProduct.weight,
      weightAllowance: parentProduct.weightAllowance,
      materialsAllowance: parentProduct.materialsAllowance,

      name: data.name,
      residentialPrice: data.resBinPrice,
      businessPrice: data.busBinPrice,
      resColPrice: data.resColPrice,
      busColPrice: data.busColPrice,
      quantity: data.quantity,
      qtyPerAddress: data.qtyPerAddress,
      startDate: data.startDate,
      endDate: data.endDate,
      council: data.council,
      product: data.product,
    });
    await item.save();
    return res.json(item);
  } catch (err) {
    return next(err);
  }
}

async function deleteItem(req, res, next) {
  try {
    const item = await Product.findById(req.params.id);
    if (!item) {
      return next(notFoundExc('Item not found'));
    }
    await item.remove();
    return res.json(item);
  } catch (err) {
    return next(err);
  }
}

async function updateItemStatus(req, res, next) {
  try {
    const item = await Product.findById(req.params.id);
    if (!item) {
      return next(notFoundExc('Item not found'));
    }

    const data = req.body;
    const errors = validateStatus(data);
    if (errors) {
      return next(validationExc('Please correct your input', errors));
    }

    item.status = data.status;
    await item.save();
    return res.json(item);
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
  updateItemStatus,
};
