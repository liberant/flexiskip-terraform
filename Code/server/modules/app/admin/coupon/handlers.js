const Coupon = require('../../models/coupon');
const {
  validationExc,
  notFoundExc,
} = require('../../../common/helpers');
const {
  validateCouponData,
  getQueryData,
  validateStatusData,
} = require('./helpers');

async function getCoupons(req, res, next) {
  try {
    const query = getQueryData(req.query);
    const total = await Coupon.countDocuments(query.conditions);
    const items = await Coupon.find(query.conditions)
      .sort(query.sort)
      .skip(query.offset)
      .limit(query.limit);
    return res
      .set('X-Pagination-Page-Count', Math.ceil(total / query.limit))
      .set('X-Pagination-Current-Page', query.page)
      .set('X-Pagination-Per-Page', query.limit)
      .set('X-Pagination-Total-Count', total)
      .json(items.map(i => i.toObject()));
  } catch (err) {
    return next(err);
  }
}

async function createCoupon(req, res, next) {
  try {
    const data = req.body;
    const errors = await validateCouponData(data);
    if (errors) {
      return next(validationExc('Please correct your input.', errors));
    }

    if (data.type !== Coupon.TYPE_EXTRA) {
      delete data.extraProducts;
    }

    const coupon = new Coupon(data);
    await coupon.save();

    return res.json(coupon.toObject());
  } catch (err) {
    return next(err);
  }
}

async function getCouponDetail(req, res, next) {
  try {
    const coupon = await Coupon.findOne({
      _id: req.params.id,
    });

    if (!coupon) {
      return next(notFoundExc('Coupon not found'));
    }

    return res.json(coupon.toObject());
  } catch (err) {
    return next(err);
  }
}

async function updateCoupon(req, res, next) {
  try {
    const coupon = await Coupon.findOne({
      _id: req.params.id,
    });

    if (!coupon) {
      return next(notFoundExc('Coupon not found'));
    }

    const data = req.body;
    data.action = 'update';
    const errors = await validateCouponData(data);
    if (errors) {
      return next(validationExc('Please correct your input.', errors));
    }

    if (data.type !== Coupon.TYPE_EXTRA) {
      delete data.extraProducts;
    }

    coupon.set(data);
    await coupon.save();

    return res.json(coupon.toObject());
  } catch (err) {
    return next(err);
  }
}

async function deleteCoupon(req, res, next) {
  try {
    const coupon = await Coupon.findOne({
      _id: req.params.id,
    });
    if (!coupon) {
      return next(notFoundExc('Coupon not found'));
    }

    coupon.status = Coupon.STATUS_REMOVED;
    coupon.deletedAt = Date.now();

    await coupon.save();
    return res.json(coupon.toObject());
  } catch (err) {
    return next(err);
  }
}

async function massUpdateCouponStatus(req, res, next) {
  try {
    const errors = validateStatusData(req.body);
    if (errors) {
      return next(validationExc('Please correct your input.', errors));
    }

    const coupons = await Coupon.find({
      _id: { $in: req.body.ids },
    });
    const promises = coupons.map(coupon => coupon.updateStatus(req.body.status));
    await Promise.all(promises);

    const result = coupons.map(coupon => coupon.toObject());
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getCoupons,
  createCoupon,
  getCouponDetail,
  updateCoupon,
  deleteCoupon,
  massUpdateCouponStatus,
};
