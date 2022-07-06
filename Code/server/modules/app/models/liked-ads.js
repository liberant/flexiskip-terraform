const mongoose = require('mongoose');

const { Schema } = mongoose;

const sch = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  ads: { type: Schema.Types.ObjectId, ref: 'Advertisement' },
}, {
  timestamps: true,
  collection: 'likedAds',
});

const LikedAds = mongoose.model('LikedAds', sch);

module.exports = LikedAds;

