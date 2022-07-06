const mongoose = require('mongoose');

const { Schema } = mongoose;

const disputeNoteSchema = new Schema({
  dispute: { type: Schema.Types.ObjectId, ref: 'Dispute' },
  // who write this note
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  content: { type: String },
}, {
  timestamps: true,
  collection: 'disputeNotes',
});

const DisputeNote = mongoose.model('DisputeNote', disputeNoteSchema);

module.exports = DisputeNote;

