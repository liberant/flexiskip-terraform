const Vehicle = require('../../models/vehicle');
const {
  validationExc,
  notFoundExc,
} = require('../../../common/helpers');
const {
  validateUpdateVehicleForm,
} = require('./helpers');

// Get Vehicle Detail
async function getVehicleDetail(req, res, next) {
  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
    }).populate('createdBy');
    if (!vehicle) {
      return next(notFoundExc('Vehicle not found'));
    }
    const result = vehicle.toObject();
    result.createdBy = await vehicle.createdBy.toUserObject();
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}


// Update Vehicle
async function updateVehicle(req, res, next) {
  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
    });
    if (!vehicle) {
      return next(notFoundExc('Vehicle not found'));
    }

    const { _id, ...data } = req.body;
    const errors = validateUpdateVehicleForm(data);
    if (errors) {
      return next(validationExc('Please correct your input.', errors));
    }
    vehicle.set(data);
    await vehicle.save();
    return res.json(vehicle.toObject());
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getVehicleDetail,
  updateVehicle,
};
