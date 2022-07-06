const mongoose = require('mongoose');
const { Schema } = mongoose;

const emailVerificationCodeSchema = new Schema(
  {
    code: { type: String },
    email: { type: String },
    data: { type: Object },
    verified: { type: Boolean, default: false },
  }, {
    timestamps: true,
    collection: 'emailVerificationCode',
  },
);

const EmailVerificationCode = mongoose.model('EmailVerificationCode', emailVerificationCodeSchema);
module.exports = EmailVerificationCode;
