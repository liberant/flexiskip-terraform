const mongoose = require('mongoose');

const { Schema } = mongoose;

const reviewNoteSchema = new Schema({
  review: { type: Schema.Types.ObjectId, ref: 'Review' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  content: { type: String },
}, {
  timestamps: true,
  collection: 'reviewNotes',
});

const ReviewNote = mongoose.model('ReviewNote', reviewNoteSchema);

module.exports = ReviewNote;

