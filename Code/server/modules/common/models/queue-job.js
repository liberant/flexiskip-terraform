const mongoose = require('mongoose');

const { Schema } = mongoose;

const STATUS_CREATED = 'Created';
const STATUS_DONE = 'Done';
const STATUS_WAIT_FOR_RETRY = 'Wait for retry';
const STATUS_FAILED = 'Failed';

const TYPE_GG_SHEET_UPDATE = 'Google sheet update';

const jobSchema = new Schema({
  type: { type: String },
  status: {
    type: String,
    default: STATUS_CREATED
  },

  binRequest: { type: Schema.Types.ObjectId, ref: 'BinRequest' },
  collectionRequest: { type: Schema.Types.ObjectId, ref: 'CollectionRequest' },

  payload: { type: Object },

  retry: {
    type: Number,
    default: 0
  },
  completedAt: { type: Date },
  failedAt: { type: Date },
}, { timestamps: true });

const QueueJob = mongoose.model('queue-jobs', jobSchema);

QueueJob.STATUS_CREATED = STATUS_CREATED;
QueueJob.STATUS_DONE = STATUS_DONE;
QueueJob.STATUS_WAIT_FOR_RETRY = STATUS_WAIT_FOR_RETRY;
QueueJob.STATUS_FAILED = STATUS_FAILED;

QueueJob.TYPE_GG_SHEET_UPDATE = TYPE_GG_SHEET_UPDATE;


module.exports = QueueJob;
