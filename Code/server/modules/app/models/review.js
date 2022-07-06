const mongoose = require('mongoose');

const { Schema } = mongoose;

const reviewSchema = new Schema({
  collectionRequest: { type: Schema.Types.ObjectId, ref: 'CollectionRequest' },
  reviewer: { type: Schema.Types.ObjectId, ref: 'User' },
  reviewee: { type: Schema.Types.ObjectId, ref: 'User' },
  point: Number,
  comment: { type: String },
  status: { type: String },
  images: [String],
}, {
  timestamps: true,
});

/**
 * Class contain methods for Review models
 */
class ReviewClass {
  /**
   * Create data to return to client
   */
  async toReviewObject() {
    const result = {
      _id: this._id,
      point: this.point,
      comment: this.comment,
      createdAt: this.createdAt,
    };
    await this.populate('reviewer').execPopulate();
    await this.populate('reviewee').execPopulate();

    // Take reviewer and get necessary information
    const reviewer = await this.reviewer.toUserObject();
    const reviewerObject = {
      _id: reviewer._id,
      uId: reviewer.uId,
      email: reviewer.email,
      roles: reviewer.roles,
      firstname: reviewer.firstname,
      lastname: reviewer.lastname,
    };

    // Take reviewee and get necessary information
    const reviewee = await this.reviewee.toUserObject();
    const revieweeObject = {
      _id: reviewee._id,
      uId: reviewee.uId,
      email: reviewee.email,
      roles: reviewee.roles,
      firstname: reviewee.firstname,
      lastname: reviewee.lastname,
    };
    result.reviewer = reviewerObject;
    result.reviewee = revieweeObject;
    return result;
  }
}

reviewSchema.loadClass(ReviewClass);

const Review = mongoose.model('Review', reviewSchema);

Review.STATUS_REPORTED = 'Reported';
Review.STATUS_ACTIONED = 'Actioned';
Review.STATUS_RESOLVED = 'Resolved';

module.exports = Review;

