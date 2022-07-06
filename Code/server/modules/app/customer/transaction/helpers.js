// const validate = require('validate.js');
const {
  getDatePart,
} = require('../../../common/helpers');

function getQueryData({ limit = 10, page = 1 }) {
  const limit2 = parseInt(limit, 10);
  const page2 = parseInt(page, 10);
  const conditions = {
  };

  // calculate offset
  const offset = (page2 - 1) * limit2;
  return {
    conditions,
    limit: limit2,
    page,
    offset,
  };
}

function getCollectionRequests(collectionRequests) {
  const result = collectionRequests.map((collectionRequest) => {
    const c = collectionRequest.toObject();
    c.requestType = 'collectionRequest';
    return c;
  });
  return result;
}

function getBinRequests(binRequests) {
  const result = binRequests.map((binRequest) => {
    const b = binRequest.toObject();
    b.requestType = 'binRequest';
    return b;
  });
  return result;
}

function combineRequests(binRequests, collectionRequests, dataType) {
  const resultBinRequests = getBinRequests(binRequests);
  const resultCollectionRequests = getCollectionRequests(collectionRequests);

  let requests;
  switch (dataType) {
    case 'binRequest':
      requests = resultBinRequests;
      break;
    case 'collectionRequest':
      requests = resultCollectionRequests;
      break;
    default:
      requests = resultBinRequests.concat(resultCollectionRequests);
  }

  return requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function groupRequest(requests) {
  const result = [];
  requests.forEach((request) => {
    const key = getDatePart(request.createdAt);
    let item = result.find(i => i.date === key);
    if (!item) {
      item = {
        data: [],
        date: key,
      };
      result.push(item);
    }
    item.data.push(request);
  });
  return result.sort((a, b) => new Date(b.date) - new Date(a.date));
}

module.exports = {
  getQueryData,
  combineRequests,
  groupRequest,
};
