const { escapeRegExp } = require('../../../common/helpers');

function getQueryData({ limit = 10, page = 1, s = '' }) {
  const limit2 = parseInt(limit, 10);
  const page2 = parseInt(page, 10);
  const conditions = {};

  if (s) {
    conditions.$or = [
      { code: new RegExp(escapeRegExp(s), 'i') },
      { collectionAddress: new RegExp(escapeRegExp(s), 'i') },
    ];
  }

  // calculate offset
  const offset = (page2 - 1) * limit2;
  return {
    conditions,
    limit: limit2,
    page,
    offset,
  };
}

module.exports = {
  getQueryData,
};
