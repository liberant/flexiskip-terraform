const mongoose = require('mongoose');

const { Schema } = mongoose;

const STATUS_ACTIVE = 'Active';
const STATUS_INACTIVE = 'Inactive';
const STATUS_REMOVED = 'Removed';

const TYPE_PERCENTAGE = 'percentage';
const TYPE_FLAT = 'flat';
const TYPE_EXTRA = 'extra';
const TYPE_FREE = 'free';

const REQUEST_TYPE_BIN = 'bin';
const REQUEST_TYPE_COLLECTION = 'collection';

const couponSchema = new Schema({
  name: { type: String },
  code: { type: String, unique: true },
  type: { type: String, required: true },
  discount: { type: Number },
  quantity: { type: Number },
  minProdQty: { type: Number },
  minPrice: { type: Number },
  dateStart: { type: Date },
  dateEnd: { type: Date },
  request: [{
    type: String,
    required: true,
    enum: [
      REQUEST_TYPE_BIN,
      REQUEST_TYPE_COLLECTION,
    ],
  }],
  regions: [
    { type: Schema.Types.ObjectId, ref: 'Council' },
  ],
  products: [
    { type: Schema.Types.ObjectId, ref: 'Product' },
  ],
  extraProducts: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number },
  }],
  status: {
    type: String,
    required: true,
    enum: [
      STATUS_ACTIVE,
      STATUS_INACTIVE,
      STATUS_REMOVED,
    ],
  },
  // which customer this coupon will be applied (deprecated, will remove in 1.7)
  customer: { type: Schema.Types.ObjectId, ref: 'User' },

  // which organisation this coupon will be applied
  organisation: { type: Schema.Types.ObjectId, ref: 'Organisation' },
}, { timestamps: true });

/**
 * Class contain methods for Coupon models
 */
class CouponClass {
  /**
   * update status of coupon
   * @param {String} status
   */
  async updateStatus(status) {
    this.status = status;
    this.deletedAt = this.status === STATUS_REMOVED ? Date.now() : null;

    await this.save();
    return true;
  }

  /**
   * Decrease coupon's quantity
   */
  async deductCoupon() {
    this.quantity = this.quantity - 1;
    await this.save();
    return true;
  }
}

couponSchema.loadClass(CouponClass);

const Coupon = mongoose.model('Coupon', couponSchema);

Coupon.STATUS_ACTIVE = STATUS_ACTIVE;
Coupon.STATUS_INACTIVE = STATUS_INACTIVE;
Coupon.STATUS_REMOVED = STATUS_REMOVED;

Coupon.TYPE_PERCENTAGE = TYPE_PERCENTAGE;
Coupon.TYPE_FLAT = TYPE_FLAT;
Coupon.TYPE_EXTRA = TYPE_EXTRA;
Coupon.TYPE_FREE = TYPE_FREE;

Coupon.REQUEST_TYPE_BIN = REQUEST_TYPE_BIN;
Coupon.REQUEST_TYPE_COLLECTION = REQUEST_TYPE_COLLECTION;

module.exports = Coupon;

