const Vehicle = require('../../models/vehicle');
const {
  validationExc,
  notFoundExc,
} = require('../../../common/helpers');
const {
  validateUpdateVehicleForm,
  validateAddVehicleForm,
  getQueryData,
  validateStatusData,
} = require('./helpers');

// Get Vehicle List
async function getVehicles(req, res, next) {
  try {
    const query = getQueryData(req.query);
    query.conditions.organisation = req.user.contractorProfile.organisation;
    const total = await Vehicle.countDocuments(query.conditions);
    const items = await Vehicle.find(query.conditions)
      .sort({ _id: -1 })
      .skip(query.offset)
      .limit(query.limit);
    return res
      .set('X-Pagination-Page-Count', Math.ceil(total / query.limit))
      .set('X-Pagination-Current-Page', query.page)
      .set('X-Pagination-Per-Page', query.limit)
      .set('X-Pagination-Total-Count', total)
      .json(items.map(u => u.toObject()));
  } catch (err) {
    return next(err);
  }
}

// Get Vehicle Detail
async function getVehicleDetail(req, res, next) {
  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      organisation: req.user.contractorProfile.organisation,
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

// Create Vehicle
async function createVehicle(req, res, next) {
  try {
    const data = req.body;
    const errors = await validateAddVehicleForm(data);
    if (errors) {
      return next(validationExc('Please correct your input.', errors));
    }
    const vehicle = new Vehicle({
      ...data,
      status: 'Active',
      organisation: req.user.contractorProfile.organisation,
      createdBy: req.user._id,
    });
    await vehicle.save();
    return res.json(vehicle.toObject());
  } catch (err) {
    return next(err);
  }
}

// Update Vehicle
async function updateVehicle(req, res, next) {
  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      organisation: req.user.contractorProfile.organisation,
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
    // set date inactive
    vehicle.inactiveAt = data.status === Vehicle.STATUS_UNAVAILABLE ? Date.now() : null;

    await vehicle.save();
    return res.json(vehicle.toObject());
  } catch (err) {
    return next(err);
  }
}

// Delete Vehicle
async function deleteVehicle(req, res, next) {
  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      organisation: req.user.contractorProfile.organisation,
    });
    if (!vehicle) {
      return next(notFoundExc('Vehicle not found'));
    }

    await vehicle.remove();
    return res.json(vehicle.toObject());
  } catch (err) {
    return next(err);
  }
}

async function updateStatuses(req, res, next) {
  try {
    const errors = validateStatusData(req.body);
    if (errors) {
      return next(validationExc('Please correct your input.', errors));
    }

    // update status of mutiple vehicles
    const vehicles = await Vehicle.find({
      _id: { $in: req.body.ids },
    });

    const promises = vehicles.map(vehicle => vehicle.updateStatus(req.body.status));
    await Promise.all(promises);

    return res.json(vehicles.map(u => u.toObject()));
  } catch (err) {
    return next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const data = req.body;
    const errors = validateStatusData(data);
    if (errors) {
      return next(validationExc('Please correct your input.', errors));
    }

    // update status of vehicle
    const vehicle = await Vehicle.findById(req.params.id);
    vehicle.status = data.status;
    // set date inactive
    vehicle.inactiveAt = data.status === Vehicle.STATUS_UNAVAILABLE ? Date.now() : null;
    await vehicle.save();

    return res.json(vehicle);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getVehicles,
  getVehicleDetail,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  updateStatuses,
  updateStatus,
};
