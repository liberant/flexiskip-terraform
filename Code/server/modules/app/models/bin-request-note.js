const mongoose = require('mongoose');

const { Schema } = mongoose;

const binRequestNoteSchema = new Schema({
  binRequest: { type: Schema.Types.ObjectId, ref: 'BinRequest' },
  // who write this note
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  content: { type: String },
}, {
  timestamps: true,
  collection: 'binRequestNotes',
});

const BinRequestNote = mongoose.model('BinRequestNote', binRequestNoteSchema);

module.exports = BinRequestNote;

