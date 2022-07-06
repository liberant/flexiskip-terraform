const Notification = require('../../models/notification');

async function list(req, res, next) {
  try {
    const items = await Notification.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });
    return res.json(items);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  list,
};
