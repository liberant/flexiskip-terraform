const { Schema } = require('mongoose');
const councilAddressDb = require('../../../common/councilAddressDb');

const councilAddressSchema = new Schema({
  customer_no: {
    type: Number,
    required: false
  },
  unit_no: {
    type: Number,
    required: false
  },
  address_1: String,
  address_2: {
    required: false,
    type: String
  },
  city: String,
  class_electoral_division: {
    type: Number,
    required: false
  },
  class_land_use: {
    type: Number,
    required: false
  },
  lot_no: {
    type: String,
    required: false
  },
  rp_master: {
    type: Number,
    required: false
  },
  site_name: {
    type: String,
    required: false
  },
  postcode: Schema.Types.Mixed, // mixed
  full_address: {
    type: String,
    required: false
  },
});
const CouncilAddress = councilAddressDb.model('Address', councilAddressSchema);

module.exports = CouncilAddress;
