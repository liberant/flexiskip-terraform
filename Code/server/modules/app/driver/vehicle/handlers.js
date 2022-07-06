const Vehicle = require('../../models/vehicle');
const User = require('../../models/user');

async function getVehicles(req, res, next) {
  try {
    const driver = req.user;
    const orgId = driver.driverProfile.organisation;

    // find all vehicles belong to this organisation
    let vehicles = await Vehicle.find({
      status: Vehicle.STATUS_ACTIVE,
      organisation: orgId,
    });

    // find a list of vehicle's id that have been assigned to driver
    const assignedVehicles = await User.find({
      roles: User.ROLE_DRIVER,
      'driverProfile.organisation': orgId,
      'driverProfile.vehicle': {
        $exists: true,
        $ne: null,
      },
    }, { 'driverProfile.vehicle': 1, email: 1 });

    // filter available vehicles
    vehicles = vehicles.filter(v =>
      !assignedVehicles.some(av =>
        // return true if vehicle in the list of assigned vehicles
        av.driverProfile.vehicle.toString() === v._id.toString()));
    return res.json(vehicles);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getVehicles,
};

