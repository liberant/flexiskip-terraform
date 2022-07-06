const ReviewNote = require('../../models/review-note');
const Review = require('../../models/review');
const {
  getQueryData,
  validateNoteData,
} = require('./helpers');
const {
  validationExc,
  notFoundExc,
} = require('../../../common/helpers');

async function getNotes(req, res, next) {
  try {
    const query = getQueryData(req.query);
    query.conditions.review = req.params.id;
    const total = await ReviewNote.countDocuments(query.conditions);
    let notes = await ReviewNote.find(query.conditions)
      .sort({ createdAt: 1 })
      .skip(query.offset)
      .limit(query.limit)
      .populate('user');
    notes = notes.map(note => ({
      ...note.toObject(),
      isAuthor: note.user._id.toString() === req.user._id.toString(),
    }));

    return res
      .set('X-Pagination-Page-Count', Math.ceil(total / query.limit))
      .set('X-Pagination-Current-Page', query.page)
      .set('X-Pagination-Per-Page', query.limit)
      .set('X-Pagination-Total-Count', total)
      .json(notes);
  } catch (err) {
    return next(err);
  }
}

async function addNote(req, res, next) {
  try {
    const report = await Review.findById(req.params.id);
    if (!report) {
      return next(notFoundExc('No report data found'));
    }

    const data = req.body;
    const errors = validateNoteData(data);
    if (errors) {
      return next(validationExc('Please correct your input', errors));
    }

    const note = new ReviewNote({
      review: req.params.id,
      user: req.user._id,
      content: data.content,
    });

    await note.save();
    await note.populate('user').populate('dispute').execPopulate();

    const result = note.toObject();
    result.user = await note.user.toUserObject();

    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

async function updateNote(req, res, next) {
  try {
    const note = await ReviewNote.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
      .populate('user')
      .populate('dispute');

    if (!note) {
      return next(notFoundExc('No note data found'));
    }

    const data = req.body;
    const errors = validateNoteData(data);
    if (errors) {
      return next(validationExc('Please correct your input', errors));
    }

    note.content = data.content;
    await note.save();

    const result = note.toObject();
    result.user = await note.user.toUserObject();

    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

async function deleteNote(req, res, next) {
  try {
    const note = await ReviewNote.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return next(notFoundExc('No note data found'));
    }

    await note.remove();
    return res.json(note);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getNotes,
  addNote,
  updateNote,
  deleteNote,
};
