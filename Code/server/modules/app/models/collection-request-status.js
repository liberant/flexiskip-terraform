const mongoose = require('mongoose');

const { Schema } = mongoose;

const collectionRequestStatusSchema = new Schema({
  collectionRequest: { type: Schema.Types.ObjectId, ref: 'CollectionRequest' },
  status: { type: String },
}, {
  timestamps: true,
  collection: 'collectionRequestStatuses',
});

const Collection = mongoose.model('CollectionRequestStatus', collectionRequestStatusSchema);

module.exports = Collection;

