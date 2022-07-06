const mongoose = require('mongoose');

const { Schema } = mongoose;

const wasteTypeSchema = new Schema({
  name: { type: String, unique: true },
  image: { type: String },
}, {
  collection: 'wasteTypes',
});

const WasteType = mongoose.model('WasteType', wasteTypeSchema);

module.exports = WasteType;
