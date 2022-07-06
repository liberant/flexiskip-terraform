const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Product price override data for business customer
 */
const prodPriceSchema = new Schema({
  prodPrice: { type: Number },
  colPrice: { type: Number },
  product: { type: Schema.Types.ObjectId, ref: 'Product' },
  organisation: { type: Schema.Types.ObjectId, ref: 'Organisation' },
}, {
  timestamps: true,
  collection: 'productPrices',
});

const ProductPrice = mongoose.model('ProductPrice', prodPriceSchema);

module.exports = ProductPrice;

