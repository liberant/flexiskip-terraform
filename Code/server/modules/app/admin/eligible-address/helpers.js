const validate = require('validate.js');
const { escapeRegExp } = require('../../../common/helpers');
const CouncilAddress = require('../../models/council-address-db/address');


function getQueryData({ limit = 10, page = 1, s }) {
  const limit2 = parseInt(limit, 10);
  const page2 = parseInt(page, 10);
  const conditions = {};
  const sort = {};
  const pipelines = [];

  // calculate offset
  const offset = (page2 - 1) * limit2;

  // combine pipelines
  if (s) {
    pipelines.push({
      $searchBeta: {
        search: {
          query: s,
          path: ['address_1', 'city', 'full_address'],
          phrase: {
            prefix: true,
            maxExpansions: 1000
          }
        }
      }
    });
  }

  pipelines.push({
    $facet: {
      total: [{ $count: "count" }],
      data: [
        { $skip: offset },
        { $limit: limit2 },
      ],
    }
  })

  return {
    conditions,
    pipelines,
    limit: limit2,
    page,
    offset,
  };
}

async function validateCreateAddressData(data) {
  validate.Promise = global.Promise;
  validate.validators.unique = async (value, { except = '' }) => {
    const address = await CouncilAddress.findOne({
      customer_no: value,
    });

    if (address) return Promise.resolve('^This address already exists.');
    return Promise.resolve();
  };

  let errors;
  const rules = {
    customer_no: {
      presence: { allowEmpty: false },
      numericality: true,
      unique: true,
    },
    class_electoral_division: {
      presence: { allowEmpty: false },
      numericality: true,
    },
    city: {
      presence: { allowEmpty: false },
    },
    postcode: {
      presence: { allowEmpty: false },
      numericality: true,
    },
    address_1: {
      presence: { allowEmpty: false },
    },
  };

  try {
    await validate.async(data, rules, { format: 'grouped' });
  } catch (err) {
    errors = err;
  }
  return errors;
}

function validateCreateAddressDataSync(data) {
  const rules = {
    customer_no: {
      presence: { allowEmpty: false },
      numericality: true,
    },
    class_electoral_division: {
      presence: { allowEmpty: false },
      numericality: true,
    },
    city: {
      presence: { allowEmpty: false },
    },
    postcode: {
      presence: { allowEmpty: false },
      numericality: true,
    },
    address_1: {
      presence: { allowEmpty: false },
    },
  };
  return validate(data, rules, { format: 'grouped' });
}

function buildFullAddress(unit_no, address_1, city, postcode){
  let fullAddress = '';
  if (unit_no) fullAddress = `${unit_no} / ${address_1}, ${city}, ${postcode}`;
  else fullAddress = `${address_1}, ${city}, ${postcode}`;
  return fullAddress;
}

module.exports = {
  getQueryData,
  validateCreateAddressData,
  buildFullAddress,
  validateCreateAddressDataSync,
};
