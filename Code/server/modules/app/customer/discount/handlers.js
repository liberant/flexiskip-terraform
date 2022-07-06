const Coupon = require('../../models/coupon');

const { buildDiscountQueries } = require('./helpers');

async function getDiscount(req, res, next) {
  try {
    const conditions = await buildDiscountQueries(req.query);
    const coupons = await Coupon.aggregate(conditions);
    return res.json(coupons);
  } catch (err) {
    return next(err);
  }
}


module.exports = {
  getDiscount,
};
