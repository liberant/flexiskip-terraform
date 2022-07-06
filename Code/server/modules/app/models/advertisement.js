const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

const { Schema } = mongoose;
mongoose.plugin(slug);

const SECTION_HOR = 'Horizontal';
const SECTION_VER = 'Vertical';

const STATUS_REMOVED = 'Removed';
const STATUS_DRAFT = 'Draft';
const STATUS_LIVE = 'Live';

const advertisementSchema = new Schema({
  title: { type: String },
  slug: { type: String, slug: 'title', unique: true },
  section: {
    type: String,
    enum: [
      SECTION_HOR,
      SECTION_VER,
    ],
  },
  image: { type: String },
  content: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  status: {
    type: String,
    enum: [
      STATUS_REMOVED,
      STATUS_DRAFT,
      STATUS_LIVE,
    ],
  },
  published: { type: Boolean, default: false },
}, {
  timestamps: true,
  collection: 'advertisements',
});

advertisementSchema.query.available = function available() {
  return this.where({
    status: STATUS_LIVE,
  });
};

const Advertisement = mongoose.model('Advertisement', advertisementSchema);

Advertisement.STATUS_REMOVED = STATUS_REMOVED;
Advertisement.STATUS_DRAFT = STATUS_DRAFT;
Advertisement.STATUS_LIVE = STATUS_LIVE;

module.exports = Advertisement;

