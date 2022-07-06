const mongoose = require('mongoose');

const { Schema } = mongoose;

const regionSchema = new Schema({
  name: { type: String },
});

const Region = mongoose.model('Region', regionSchema);

module.exports = Region;

