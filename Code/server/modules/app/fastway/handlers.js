const logger = require('../../common/log');
const Bin = require('../models/bin');

async function processNotification(req, res, next) {
  try {
    logger.info(`Receive Fastway Notification, body: ${JSON.stringify(req.body)}, query: ${JSON.stringify(req.query)}`);
    const { labelnumber, ExtendedDescription: description } = req.body;
    const bin = await Bin.findOne({ fastwayLabel: labelnumber });
    logger.info(`Receive Fastway notification for label: ${labelnumber}, description: ${description}`);

    // update bin's status when it is delivered or dispatched
    if (description) {
      if (description.includes('Your parcel has been delivered')) {
        await bin.updateDeliveryStatus(Bin.STATUS_DELIVERED);
      } else if (description.includes('is on the way')) {
        await bin.updateDeliveryStatus(Bin.STATUS_DISPATCHED);
      }
    }
    res.json('success');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  processNotification,
};
