const mongoose = require('mongoose');

const { Schema } = mongoose;

const councilSchema = new Schema({
  code: { type: String },
  name: { type: String },
  state: { type: String },
  region: { type: String },
  branding: { type: String },
  surcharge: { type: Number },
  postCodes: [String],
  status: { type: String },
});

const Council = mongoose.model('Council', councilSchema);

Council.STATUS_ACTIVE = 'Active';
Council.STATUS_INACTIVE = 'Inactive';

module.exports = Council;

