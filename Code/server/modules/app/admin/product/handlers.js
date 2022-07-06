const Product = require('../../models/product');
const User = require('../../models/user');
const {
  validationExc,
  notFoundExc,
} = require('../../../common/helpers');
const {
  validateProductData,
  getQueryData,
} = require('./helpers');

// Get Product List
async function getProducts(req, res, next) {
  try {
    const query = getQueryData(req.query);
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
      .json(items.map(u => u.toObject()));
  } catch (err) {
    return next(err);
  }
}

// Get Product Detail
async function getProductDetail(req, res, next) {
  try {
    const product = await Product.findOne({
      _id: req.params.productId,
    });
    if (!product) {
      return next(notFoundExc('Product not found'));
    }

    const creator = await User.findOne({
      _id: product.createdBy,
    });

    const result = product.toObject();
    if (!creator) {
      result.createdBy = '';
    } else {
      result.createdBy = `${creator.firstname} ${creator.lastname}`;
    }

    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

// Create Product
async function createProduct(req, res, next) {
  try {
    const data = req.body;
    const errors = validateProductData(data);
    if (errors) {
      return next(validationExc('Please correct your input.', errors));
    }
    data.type = Product.TYPE_NORMAL;
    data.createdBy = req.user._id;
    const product = new Product(data);
    await product.save();
    return res.json(product.toObject());
  } catch (err) {
    return next(err);
  }
}

// Update Product
async function updateProduct(req, res, next) {
  try {
    const product = await Product.findOne({
      _id: req.params.productId,
    });
    if (!product) {
      return next(notFoundExc('Product not found'));
    }

    const { _id, ...data } = req.body;
    const errors = validateProductData(data);
    if (errors) {
      return next(validationExc('Please correct your input.', errors));
    }
    data.type = Product.TYPE_NORMAL;
    product.set(data);
    await product.save();

    // update council products
    await Product.updateMany({
      type: Product.TYPE_COUNCIL,
      product: product._id,
    }, {
      $set: {
        vendorCode: product.vendorCode,
        wasteType: product.wasteType,
        images: product.images,
        size: product.size,
        postageSize: product.postageSize,
        weight: product.weight,
        prefix: product.prefix,
        weightAllowance: product.weightAllowance,
        materialsAllowance: product.materialsAllowance,
      },
    });
    return res.json(product.toObject());
  } catch (err) {
    return next(err);
  }
}

// Delete Product
async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findOne({
      _id: req.params.productId,
    });
    if (!product) {
      return next(notFoundExc('Product not found'));
    }

    product.status = Product.STATUS_REMOVED;
    product.deletedAt = Date.now();

    await product.save();
    return res.json(product.toObject());
  } catch (err) {
    return next(err);
  }
}

// Delete Product
async function deleteMultiProducts(req, res, next) {
  try {
    // soft delete products by updating their status
    if (req.body.status === 'Removed') {
      const newStatus = Product.STATUS_REMOVED;
      await Product.update(
        {
          _id: { $in: req.body.ids },
        },
        {
          $set: {
            status: newStatus,
            deletedAt: Date.now(),
          },
        },
        {
          multi: true,
        },
      );
    }

    // return removed products
    const products = await Product.find({
      _id: { $in: req.body.ids },
    });
    return res.json(products.map(product => product.toObject()));
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getProducts,
  getProductDetail,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteMultiProducts,
};
