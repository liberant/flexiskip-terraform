const mongoose = require('mongoose');

const { Schema } = mongoose;

const TYPE_DELIVERY = 'delivery';

const addressSchema = new Schema({
  address: { type: String },
  type: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Address = mongoose.model('Address', addressSchema);

Address.TYPE_DELIVERY = TYPE_DELIVERY;

module.exports = Address;

