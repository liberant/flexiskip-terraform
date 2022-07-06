const mongoose = require('mongoose');
const { generateDumpsiteCode } = require('../helpers');

const { Schema } = mongoose;

const STATUS_ACTIVE = 'Active';
const STATUS_INACTIVE = 'Inactive';

const dumpsiteSchema = new Schema({
  name: { type: String },
  code: { type: String },
  address: { type: String },
  location: {
    type: {
      type: String,
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
    },
  },
  openDays: [{
    weekDay: { type: String },
    fromTime: { type: String },
    toTime: { type: String },
  }],
  charges: [{
    wasteType: { type: String },
    price: { type: Number },
  }],
  status: {
    type: String,
    enum: [
      STATUS_ACTIVE,
      STATUS_INACTIVE,
    ],
  },
  website: { type: String },
  priceListUrl: { type: String },
  council: { type: Schema.Types.ObjectId, ref: 'Council' },
});

dumpsiteSchema.index({ location: '2dsphere' });

/**
 * Generate dumpsite's short id for new record
 */
dumpsiteSchema.pre('save', async function preValidate(next) {
  try {
    if (this.code) {
      return next();
    }
    this.code = await generateDumpsiteCode(this);
    return next();
  } catch (err) {
    return next(err);
  }
});

/**
 * Class contain methods for Dumpsite models
 */
class DumpsiteClass {
  /**
   * Get allowed materials of this dumpsite
   */
  getMaterials() {
    return this.toObject().charges.map(ch => ch.wasteType);
  }
}

dumpsiteSchema.loadClass(DumpsiteClass);

const DumpSite = mongoose.model('Dumpsite', dumpsiteSchema);

DumpSite.STATUS_ACTIVE = STATUS_ACTIVE;
DumpSite.STATUS_INACTIVE = STATUS_INACTIVE;

module.exports = DumpSite;

