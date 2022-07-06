const CollectionRequest = require('../../models/collection-request');
const { escapeRegExp } = require('../../../common/helpers');

function getQueryData({
  limit = 10, page = 1, sort = 'createdAt', dir = 'desc', s,
}) {
  const limit2 = parseInt(limit, 10);
  const page2 = parseInt(page, 10);
  const conditions = {
    status: {
      $ne: CollectionRequest.STATUS_DRAFT,
    },
  };
  if (s) {
    conditions.code = new RegExp(escapeRegExp(s), 'i');
  }

  // calculate offset
  const offset = (page2 - 1) * limit2;
  return {
    conditions,
    limit: limit2,
    page,
    offset,

    sort: { [sort]: dir === 'desc' ? -1 : 1 },
  };
}

module.exports = {
  getQueryData,
};
