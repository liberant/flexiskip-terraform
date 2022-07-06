const mongoose = require('mongoose');

const { Schema } = mongoose;

const TYPE_APP_DOWNLOAD = 'app_download';

const eventSchema = new Schema({
  type: {
    type: String,
    enum: [
      TYPE_APP_DOWNLOAD,
    ],
  },
  data: { type: Schema.Types.Mixed },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

Event.TYPE_APP_DOWNLOAD = TYPE_APP_DOWNLOAD;

module.exports = Event;

