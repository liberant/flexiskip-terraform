const Review = require('../models/review');

async function getReviews(req, res, next) {
  try {
    const items = await Review.find({ reviewee: req.params.id })
      .populate('reviewer')
      .populate('collectionRequest');

    return res.json(await Promise.all(items.map(item => item.toReviewObject())));
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getReviews,
};
