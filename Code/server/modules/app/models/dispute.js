const mongoose = require('mongoose');

const { Schema } = mongoose;

const disputeSchema = new Schema({
  collectionRequest: { type: Schema.Types.ObjectId, ref: 'CollectionRequest' },
  reporter: { type: Schema.Types.ObjectId, ref: 'User' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  reason: { type: String },
  status: { type: String },
  images: [String],

  futileBinPaymentIntentId: { type: String },
}, {
  timestamps: true,
});

/**
 * Class contain methods for Dispute models
 */
class DisputeClass {
  /**
   * Create data to return to client
   */
  async toDisputeObject() {
    const result = {
      _id: this._id,
      point: this.point,
      comment: this.comment,
      createdAt: this.createdAt,
    };
    await this.populate('reporter').execPopulate();
    await this.populate('user').execPopulate();

    // Take reviewer and get necessary information
    const reporter = await this.reporter.toUserObject();
    const reporterObject = {
      _id: reporter._id,
      uId: reporter.uId,
      email: reporter.email,
      roles: reporter.roles,
      fullname: reporter.fullname,
    };

    // Take reviewee and get necessary information
    const user = await this.user.toUserObject();
    const userObject = {
      _id: user._id,
      uId: user.uId,
      email: user.email,
      roles: user.roles,
      fullname: user.fullname,
    };
    result.reporter = reporterObject;
    result.user = userObject;
    return result;
  }
}

disputeSchema.loadClass(DisputeClass);

const Dispute = mongoose.model('Dispute', disputeSchema);

Dispute.STATUS_REPORTED = 'Reported';
Dispute.STATUS_ACTIONED = 'Actioned';
Dispute.STATUS_RESOLVED = 'Resolved';

module.exports = Dispute;

