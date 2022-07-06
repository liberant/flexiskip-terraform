const mongoose = require('mongoose');
const { generateVehicleCode } = require('../../app/helpers');

const { Schema } = mongoose;

// available user statuses
const STATUS_PENDING = 'Pending';
const STATUS_ACTIVE = 'Active';
const STATUS_UNAVAILABLE = 'Unavailable';
const STATUS_REMOVED = 'Removed';

const vehicleSchema = new Schema({
  code: { type: String, unique: true },
  class: { type: String },
  regNo: { type: String },
  model: { type: String },
  compliance: { type: String },
  wasteTypes: [{ type: String }],
  status: { type: String },
  organisation: { type: Schema.Types.ObjectId, ref: 'Organisation' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  inactiveAt: { type: Date },
}, { timestamps: true });

/**
 * Generate vehicle's short id for new record
 */
vehicleSchema.pre('save', async function preValidate(next) {
  try {
    if (this.code) {
      return next();
    }
    this.code = await generateVehicleCode(this);
    return next();
  } catch (err) {
    return next(err);
  }
});

/**
 * Class contain methods for Vehicle models
 */
class VehicleClass {
  /**
   * Update status of vehicle
   * @param {*} status
   */
  async updateStatus(status) {
    this.status = status;
    this.deletedAt = this.status === STATUS_REMOVED ? Date.now() : null;

    // set date inactive
    this.inactiveAt = this.status === STATUS_UNAVAILABLE ? Date.now() : null;

    await this.save();
    return true;
  }
}

vehicleSchema.loadClass(VehicleClass);

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

Vehicle.STATUS_PENDING = STATUS_PENDING;
Vehicle.STATUS_ACTIVE = STATUS_ACTIVE;
Vehicle.STATUS_UNAVAILABLE = STATUS_UNAVAILABLE;
Vehicle.STATUS_REMOVED = STATUS_REMOVED;

module.exports = Vehicle;

