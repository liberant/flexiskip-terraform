const mongoose = require('mongoose');

const { Schema } = mongoose;

const modelSchema = new Schema({
  address: { type: String },
  city: { type: String },
  postcode: { type: String },
  fullAddress: { type: String },
  unitNo: { type: String },
  council: { type: Schema.Types.ObjectId, ref: 'Council' },
});

const CouncilAddress = mongoose.model('CouncilAddress', modelSchema, 'councilAddresses');

module.exports = CouncilAddress;
