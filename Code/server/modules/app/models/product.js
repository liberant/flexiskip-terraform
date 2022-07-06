const mongoose = require('mongoose');

const { Schema } = mongoose;
const config = require('../../../config');
const ProductPrice = require('./product-price');

const TYPE_NORMAL = 'Normal';
const TYPE_COUNCIL = 'Council';

const STATUS_ACTIVE = 'Active';
const STATUS_UNAVAILABLE = 'Unavailable';
const STATUS_REMOVED = 'Removed';
const STATUS_IN_STOCK = 'In stock';
const STATUS_OUT_OF_STOCK = 'Out of stock';

const productSchema = new Schema({
  code: { type: String, unique: true },
  name: { type: String },

  // product reference number from vendor
  vendorCode: { type: String },

  // the type of waste this product contain
  wasteType: { type: String },

  partnerDelivered: { type: Boolean, default: false },

  // price when making product request (residential customer)
  residentialPrice: { type: Number },

  // price when making product request (business customer)
  businessPrice: { type: Number },

  // price when making collection request (residential customer)
  resColPrice: { type: Number },

  // price when making collection request (business customer)
  busColPrice: { type: Number },

  // number of in-stock products
  quantity: { type: Number },

  // number of in-stock products
  prefix: { type: String, default: 'standard' },

  // product image list
  images: [String],
  comment: { type: String },
  size: {
    width: { type: Number },
    height: { type: Number },
    length: { type: Number },
  },
  postageSize: {
    width: { type: Number },
    height: { type: Number },
    length: { type: Number },
  },
  weight: { type: Number },
  weightAllowance: { type: Number },
  materialsAllowance: [String],
  status: { type: String },
  deletedAt: { type: Date, default: null },

  // type of this product: normal or council
  type: {
    type: String,
    enum: [
      TYPE_NORMAL,
      TYPE_COUNCIL,
    ],
  },

  // council product attributes:
  startDate: { type: Date },
  endDate: { type: Date },
  qtyPerAddress: { type: Number },
  council: { type: Schema.Types.ObjectId, ref: 'Council' },
  product: { type: Schema.Types.ObjectId, ref: 'Product' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  usedTimes: [{
    address: { type: String },
    quantity: { type: Number },
  }],
}, { timestamps: true });

/**
 * Generate product's short id for new record
 */
productSchema.pre('save', async function preValidate(next) {
  try {
    if (this.code) {
      return next();
    }
    const { generateProductCode } = require('../helpers');
    this.code = await generateProductCode(this);
    return next();
  } catch (err) {
    return next(err);
  }
});

/**
 * Class contain methods for Product models
 */
class ProductClass {
  /**
   * Return a default image when no image was uploaded
   */
  getImages() {
    const defaultImage = `${config.awsConfig.websiteEndpoint}/product/default.png`.replace('https', 'http');
    return (this.images.length) ? this.images : [defaultImage];
  }

  /*
   * Return item's price for making collection request
   */
  async getCollectionPrice(user, collectionAddress) {
    let price = 0;

    // apply collection price base on customer type
    if (user.roles.includes('businessCustomer')) {
      price = this.busColPrice;
    } else if (user.roles.includes('residentialCustomer')) {
      price = this.resColPrice;
    }

    // apply customer collection price override
    if (user.roles.includes('businessCustomer')) {
      const { organisation } = user.businessCustomerProfile;
      const ovdPrice = await ProductPrice.findOne({
        product: this._id,
        organisation,
      });
      if (ovdPrice) {
        price = ovdPrice.colPrice;
      }
    }

    // apply council's surchage base on collection address
    const { getCouncilByAddress } = require('../helpers');
    const council = await getCouncilByAddress(collectionAddress);
    const surcharge = council && council.surcharge ? council.surcharge : 0;
    price += surcharge;

    return price;
  }

  /*
   * Return item's price for making bin request
   */
  async getProductPrice(user) {
    let price = 0;
    // apply product price base on customer type
    if (user.roles.includes('businessCustomer')) {
      price = this.businessPrice;
    } else if (user.roles.includes('residentialCustomer')) {
      price = this.residentialPrice;
    }

    // apply customer product price override
    if (user.roles.includes('businessCustomer')) {
      const { organisation } = user.businessCustomerProfile;
      const ovdPrice = await ProductPrice.findOne({
        product: this._id,
        organisation,
      });
      if (ovdPrice) {
        price = ovdPrice.prodPrice;
      }
    }

    return price;
  }

  /**
   * Return product data based on user context
   */
  toProductObject() {
    const result = this.toObject();
    result.images = this.getImages();
    result.type = result.wasteType;
    return result;
  }
}

productSchema.loadClass(ProductClass);

const Product = mongoose.model('Product', productSchema);

Product.TYPE_NORMAL = TYPE_NORMAL;
Product.TYPE_COUNCIL = TYPE_COUNCIL;

Product.STATUS_REMOVED = STATUS_REMOVED;
Product.STATUS_IN_STOCK = STATUS_IN_STOCK;
Product.STATUS_OUT_OF_STOCK = STATUS_OUT_OF_STOCK;

Product.STATUS_ACTIVE = STATUS_ACTIVE;
Product.STATUS_UNAVAILABLE = STATUS_UNAVAILABLE;

module.exports = Product;
