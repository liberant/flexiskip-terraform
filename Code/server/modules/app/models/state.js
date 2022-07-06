const mongoose = require('mongoose');

const { Schema } = mongoose;

const stateSchema = new Schema({
  name: { type: String },
  description: { type: String },
  postCodes: [{ type: String }],
});

const State = mongoose.model('State', stateSchema);

module.exports = State;
