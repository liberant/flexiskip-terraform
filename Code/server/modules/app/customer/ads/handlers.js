const Advertisement = require('../../models/advertisement');
const LikedAds = require('../../models/liked-ads');

const {
  notFoundExc,
} = require('../../../common/helpers');

async function list(req, res, next) {
  try {
    let items = await Advertisement.find().available();
    items = await Promise.all(items.map(async (item) => {
      const ads = item.toObject();
      const likedAds = await LikedAds.findOne({ user: req.user._id, ads: ads._id });
      ads.liked = !!likedAds;
      return ads;
    }));
    return res.json(items);
  } catch (err) {
    return next(err);
  }
}

async function renderAds(req, res, next) {
  try {
    const { slug } = req.params;
    const item = await Advertisement.findOne({ slug }).available();
    if (!item) {
      return next(notFoundExc('Item not found'));
    }

    return res.render('ads', { item });
  } catch (err) {
    return next(err);
  }
}

async function likeAds(req, res, next) {
  try {
    const data = { user: req.user._id, ads: req.params.id };
    await LikedAds.findOneAndUpdate(data, data, { upsert: true });
    return res.json({ message: 'success' });
  } catch (err) {
    return next(err);
  }
}

async function unlikeAds(req, res, next) {
  try {
    await LikedAds.findOneAndRemove({ user: req.user._id, ads: req.params.id });
    return res.json({ message: 'success' });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  renderAds,
  list,
  likeAds,
  unlikeAds,
};
