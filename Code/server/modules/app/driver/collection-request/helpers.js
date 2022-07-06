const validate = require('validate.js');
const Bin = require('../../models/bin');
const Dumpsite = require('../../models/dumpsite');
const Notification = require('../../models/notification');
const CollectionRequest = require('../../models/collection-request');
const { sendFCMToCustomer } = require('../../../app/helpers');
const geolib = require('geolib');

function validateBinData(data) {
  const rules = {
    status: {
      presence: { allowEmpty: false },
      inclusion: {
        within: [
          Bin.STATUS_COLLECTED,
          Bin.STATUS_NOT_COLLECTED,
          Bin.STATUS_COMPLETED,
        ],
        message: 'is not allowed',
      },
    },
    reason: {
      presence: data.status === Bin.STATUS_NOT_COLLECTED ? { allowEmpty: false } : null,
    },
    // collectedWeight: data.status === Bin.STATUS_COLLECTED ? {
    //   presence: { allowEmpty: false },
    //   numericality: {
    //     greaterThan: 0,
    //   },
    // } : null,
    'location.latitude': {
      presence: { allowEmpty: false },

    },
    'location.longitude': {
      presence: { allowEmpty: false },
    },
  };
  return validate(data, rules, { format: 'grouped' });
}

function validateUpdateDisposalData(data) {
  const rules = {
    'location.latitude': {
      presence: { allowEmpty: false },

    },
    'location.longitude': {
      presence: { allowEmpty: false },
    },
  };
  return validate(data, rules, { format: 'grouped' });
}

function validateCollectionRequestStatus(data) {
  const rules = {
    status: {
      presence: { allowEmpty: false },
      inclusion: {
        within: [
          CollectionRequest.STATUS_COMPLETED,
        ],
        message: 'only allow status Completed',
      },
    },
  };
  return validate(data, rules, { format: 'grouped' });
}

/**
 * Sent notification when all bins in a collection request has been scanned
 * (collected or not collected)
 */
function sendJobProcessedNotifToCustomer(collectionRequest) {
  const { driver } = collectionRequest;
  const driverName = `${driver.firstname}`;

  const title = 'Request has been processed';
  let body = `${driverName} has completed your collection. Please help us by rating your experience.`;

  /**
   * Other format notification for request collection included Not Collected Bin
   */
  if (collectionRequest.items) {
    const notCollectBin = collectionRequest.items
      .filter(item => item.binStatus === Bin.STATUS_NOT_COLLECTED);
    if (notCollectBin && notCollectBin.length) {
      body = `All bins of request ${collectionRequest.code} has been processed`;
    }
  }

  const data = {
    type: Notification.TYPE_REQ_PROCESSED,
    collectionRequestId: collectionRequest._id,
    code: collectionRequest.code,
  };
  return sendFCMToCustomer(collectionRequest.customer, title, body, data);
}

function validateLocation(collectionRequest, data) {
  const range = 200;
  const validStatus = [Bin.STATUS_COLLECTED, Bin.STATUS_NOT_COLLECTED];
  let start;
  const end = data.location;
  if (validStatus.includes(data.status)) {
    start = {
      latitude: collectionRequest.collectionLocation.coordinates[1],
      longitude: collectionRequest.collectionLocation.coordinates[0],
    };
    if (geolib.getDistance(start, end) > range) return false;
  } else if (data.status === Bin.STATUS_COMPLETED) {
    start = {
      latitude: collectionRequest.disposalLocation.coordinates[1],
      longitude: collectionRequest.disposalLocation.coordinates[0],
    };
    if (geolib.getDistance(start, end) > range) return false;
  }
  return true;
}

function validateRatingData(data) {
  const rules = {
    point: {
      presence: { allowEmpty: false },
      numericality: {
        onlyInteger: true,
        greaterThan: 0,
        lessThanOrEqualTo: 5,
      },
    },
  };

  return validate(data, rules, { format: 'grouped' });
}

function validateDisputeData(data) {
  const rules = {
    comment: {
      presence: { allowEmpty: false },
    },
  };

  return validate(data, rules, { format: 'grouped' });
}

async function findClosestDumpsite(location) {
  const dumpsite = await Dumpsite.findOne({
    location: {
      $near: {
        $geometry: location,
      },
    },
  });
  if (!dumpsite) {
    return {
      address: '',
      location: {
        type: 'Point',
        coordinates: [0, 0],
      },
    };
  }

  return {
    address: dumpsite.address,
    location: dumpsite.location,
  };
}

module.exports = {
  validateBinData,
  validateCollectionRequestStatus,
  sendJobProcessedNotifToCustomer,
  validateLocation,
  validateRatingData,
  validateDisputeData,
  validateUpdateDisposalData,
  findClosestDumpsite,
};

