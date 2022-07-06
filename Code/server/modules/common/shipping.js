const axios = require('axios');
const { buildQuery } = require('./helpers');
const { googleApiKey, fastwayApiKey } = require('../../config');
const logger = require('./log');

const parsed = [];

/**
 * Getting address by coordinates
 * @param {Number} lat
 * @param {Number} lng
 */
async function getAddressFromLocation(lat, lng) {
  const query = buildQuery({
    latlng: `${lat},${lng}`,
    key: googleApiKey,
  });
  const url = `https://maps.googleapis.com/maps/api/geocode/json?${query}`;
  const resp = await axios.get(url);
  if (resp.data.results.length === 0) {
    logger.error(`Getting address failed for location: ${lat},${lng}`);
    throw new Error(`Getting address failed for location: ${lat},${lng}`);
  }

  return resp.data.results[0].formatted_address;
}

/**
 * Get place information (postcode, city, location,...) by address
 * @param {String} address
 */
async function geocoding(address) {
  const query = buildQuery({
    address,
    key: googleApiKey,
  });
  const url = `https://maps.googleapis.com/maps/api/geocode/json?${query}`;
  const resp = await axios.get(url);

  if (resp.data.results.length === 0) {
    logger.error(`Could not get information of the address: ${address}.
      Api url: ${url}
      Error message: ${resp.data.error_message}`);
    throw new Error(`Could not get information of the address: ${address}`);
  }

  //sorting matching results based on precision. See location_type in https://developers.google.com/maps/documentation/geocoding/overview#results
  const sortedBy = {
    'ROOFTOP' : 0,
    'RANGE_INTERPOLATED' : 1,
    'GEOMETRIC_CENTER' : 2,
    'APPROXIMATE' : 3
  }

  resp.data.results.sort(
    (a,b) => sortedBy[a.geometry.location_type] - sortedBy[b.geometry.location_type]
  );

  // if the address contains forward slash then move the address with type "subpremise" to first index
  if (address && address.indexOf("/") > -1) {
    const sortedByTypes = {
      'subpremise': 1,
      'street_address': 2,
      'premise': 3,
    }
    resp.data.results.sort((a,b) => sortedByTypes[a.types] - sortedByTypes[b.types])
  }

  return resp.data.results[0];
}

/**
 * Return suburb, postal code, location for an address
 * @param {String} address
 */
async function parseAddress(address) {
  if (!parsed[address]) {
    const placeDetail = await geocoding(address);
    const addrComps = placeDetail.address_components;

    // get postal code
    const pc = addrComps.find(comp => comp.types.includes('postal_code'));

    // get suburb
    const sb = addrComps.find(comp => comp.types.includes('political'));

    // get country
    const ct = addrComps.find(comp => comp.types.includes('country'));

    // get city
    const cty = addrComps.find(comp => comp.types.includes('administrative_area_level_2'));

    // get state
    const state = addrComps.find(comp => comp.types.includes('administrative_area_level_1'));


    // get location
    const { lat, lng } = placeDetail.geometry.location;

    parsed[address] = {
      suburb: sb ? sb.long_name : '',
      postalCode: pc ? pc.long_name : '',
      country: ct ? ct.long_name : '',
      city: cty ? cty.short_name : '',
      state: state ? state.short_name : '',
      location: { lat, lng },
    };
  }
  return parsed[address];
}

/**
 * Fastway API, get pickup franchisee for an address
 * @param {String} address
 */
async function getFranchise(address) {
  const { suburb, postalCode } = await parseAddress(address);
  const query = buildQuery({
    api_key: fastwayApiKey,
    CountryCode: 1, // australia
    PostCode: postalCode,
    Suburb: suburb,
  });
  const url = `https://api.fastway.org/v3/psc/pickuprf?${query}`;
  logger.info(`Calling Fastway API "Get Franchisee" with url: ${url}`);
  const resp = await axios.get(url);
  if (resp.data.error) {
    const { error } = resp.data;
    logger.error(`Error while calling Fastway API Get Pickup Franchisee.
      Api url: ${url}
      Error message: ${error}`);
    throw new Error(`Fastway API error: ${error}`);
  }
  logger.info(`Response from Fastway API "Get Franchisee" with response: ${resp}`);
  return resp.data.result.franchise_code;
}

/**
 * Fastway API, return estimated delivery time and cost for a shipping
 *
 * @param {String} from
 * @param {String} to
 * @param {Number} width
 * @param {Number} height
 * @param {Number} length
 * @param {Number} weight
 */
async function estimate(from, to, weight) {
  const fr = await getFranchise(from);
  const { suburb, postalCode } = await parseAddress(to);
  const query = buildQuery({
    api_key: fastwayApiKey,
    RFCode: fr,
    Suburb: suburb,
    DestPostcode: postalCode,
    WeightInKg: weight,
  });
  const url = `https://api.fastway.org/v3/psc/lookup?${query}`;
  logger.info(`Calling Fastway API "Estimate" with url: ${url}`);
  const resp = await axios.get(url);
  if (resp.data.error) {
    const { error } = resp.data;
    logger.error(`Error while calling Fastway API PSC lookup.
      Api url: ${url}
      Error message: ${error}`);
    throw new Error(`Fastway API error: ${error}`);
  }

  const days = resp.data.result.delivery_timeframe_days;
  const service = resp.data.result.services.find(serv => serv.type === 'Parcel');
  const cost = service.totalprice_normal;
  return { days, cost };
}

/**
 * Fastway API, return user id
 */
async function getUserID() {
  const query = buildQuery({
    api_key: fastwayApiKey,
  });
  const url = `https://api.fastway.org/v3/fastlabel/listusers?${query}`;
  const resp = await axios.get(url);
  const { data } = resp;
  if (data.error) {
    const { error } = data;
    logger.error(`Error while calling Fastway API List User.
      Api url: ${url}
      Error message: ${error}`);
    throw new Error(`Fastway API error: ${error}`);
  }
  return data.result[0].UserID;
}

/**
 * Create a Fastway Consignment and return a Fastway Label
 * @param {*} data
 */
async function addConsignment(data) {
  const UserID = await getUserID();
  const query = buildQuery({
    api_key: fastwayApiKey,
    UserID,
    ...data,
  });
  const url = `https://api.fastway.org/v3/fastlabel/addconsignment?${query}`;
  logger.info(`Calling Fastway API "Add Consignment" with url: ${url}`);
  const resp = await axios.get(url);
  const { data: respData } = resp;
  if (respData.error) {
    const { error } = respData;
    logger.error(`Error while calling Fastway API Add Consignment.
      Api url: ${url}
      Error message: ${error}`);
    throw new Error(`Fastway API error: ${error}`);
  }
  logger.info(`Response from Fastway API "Add Consignment" with response: ${respData.result}`);
  const label = respData.result.Items[0].labels[0].labelNumber;
  return label;
}

/**
 * Register a label number to receive automatic updates when new scan events are processed
 * To setup target url, login to your Fastway Api account
 * @param {*} data
 */
async function registerNotification(label) {
  const query = buildQuery({
    api_key: fastwayApiKey,
    labelno: label,
    pushmethod: 'Url',
  });
  const url = `https://api.fastway.org/v3/tracktrace/pushnotification_register?${query}`;
  logger.info(`Calling Fastway API "Track and Trace" with url: ${url}`);
  const resp = await axios.get(url);
  const { data: respData } = resp;
  if (respData.error) {
    const { error } = respData;
    logger.error(error);
    throw new Error(`Error while calling Fastway API "Track and Trace": ${error}`);
  }
  logger.info(`Response from Fastway API "Track and Trace" with response: ${respData.result}`);
  return true;
}

/**
 * Request a pickup on Fastway Courier
 * @param {Object} data
 */
async function requestPickup(data) {
  const query = buildQuery({
    api_key: fastwayApiKey,
    ...data,
  });
  const url = `https://api.fastway.org/v3/collections/pickuprequest?${query}`;
  logger.info(`Calling Fastway API "Request Pickup" with url: ${url}`);
  const resp = await axios.get(url);
  if (resp.data.error) {
    const { error } = resp.data;
    logger.error(`Error while calling Fastway API Request Pickup.
      Api url: ${url}
      Error message: ${error}`);
    throw new Error(`Fastway API error: ${error}`);
  }
  logger.info(`Response from Fastway API "Request Pickup" with response: ${resp.data.result}`);
  return true;
}

/**
 * Do a Fastway Track/Trace lookup on the specified LabelNumber
 * @param {Object} data
 */
async function track(label) {
  const query = buildQuery({
    api_key: fastwayApiKey,
    CountryCode: 1,
    LabelNo: label,
  });
  const url = `https://api.fastway.org/v3/tracktrace/detail?${query}`;
  const resp = await axios.get(url);
  if (resp.data.error) {
    const { error } = resp.data;
    logger.error(`Error while calling Fastway API Track and Trace.
      Api url: ${url}
      Error message: ${error}`);
    return false;
  }
  return resp.data.result;
}

module.exports = {
  getAddressFromLocation,
  parseAddress,
  estimate,
  addConsignment,
  registerNotification,
  requestPickup,
  geocoding,
  track,
};
