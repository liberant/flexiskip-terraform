const mongoose = require('mongoose');

const { Schema } = mongoose;

// Bin has QR Code + FastWay labels and is packaged ready for collection
const TYPE_BIN_READY = 'bin_delivery';

// Bin has been collected by courier service and is in transit to delivery address
const TYPE_BIN_DISPATCHED = 'bin_dispatched';

// Bin is confirmed as delivered at requested delivery address
const TYPE_BIN_DELIVERIED = 'bin_deliveried';

// Driver accept a collection request
const TYPE_DRIVER_ACCEPT_REQ = 'driver_accept';

// Driver collected a bin
const TYPE_DRIVER_COLLECT_BIN = 'bin_collected';

// Driver refuse to collect a bin
const TYPE_DRIVER_REFUSE_BIN = 'driver_not_collected';

// Collection request is processed (no bins have pending or request status)
const TYPE_REQ_PROCESSED = 'job_has_been_processed';

const notificationSchema = new Schema({
  type: { type: String },
  title: { type: String },
  body: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  data: { type: Schema.Types.Mixed },
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);

Notification.TYPE_BIN_READY = TYPE_BIN_READY;
Notification.TYPE_BIN_DISPATCHED = TYPE_BIN_DISPATCHED;
Notification.TYPE_BIN_DELIVERIED = TYPE_BIN_DELIVERIED;
Notification.TYPE_DRIVER_ACCEPT_REQ = TYPE_DRIVER_ACCEPT_REQ;
Notification.TYPE_DRIVER_COLLECT_BIN = TYPE_DRIVER_COLLECT_BIN;
Notification.TYPE_DRIVER_REFUSE_BIN = TYPE_DRIVER_REFUSE_BIN;
Notification.TYPE_REQ_PROCESSED = TYPE_REQ_PROCESSED;

module.exports = Notification;

