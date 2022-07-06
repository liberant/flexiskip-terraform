const mongoose = require('mongoose');

const { Schema } = mongoose;

const binRequestStatusSchema = new Schema({
  binRequest: { type: Schema.Types.ObjectId, ref: 'BinRequest' },
  status: { type: String },
}, {
  timestamps: true,
  collection: 'binRequestStatuses',
});

const Bin = mongoose.model('BinRequestStatus', binRequestStatusSchema);

module.exports = Bin;

