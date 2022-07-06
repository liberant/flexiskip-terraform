const Review = require('../../models/review');
const {
  getQueryData,
  validateStatus,
} = require('./helpers');
const {
  validationExc,
  notFoundExc,
} = require('../../../common/helpers');

async function getReports(req, res, next) {
  try {
    const query = getQueryData(req.query);
    const total = (await Review.aggregate(query.pipelines)).length;
    const items = await Review.aggregate(query.pipelines)
      .sort({ _id: -1 })
      .skip(query.offset)
      .limit(query.limit);

    return res
      .set('X-Pagination-Page-Count', Math.ceil(total / query.limit))
      .set('X-Pagination-Current-Page', query.page)
      .set('X-Pagination-Per-Page', query.limit)
      .set('X-Pagination-Total-Count', total)
      .json(items);
  } catch (err) {
    return next(err);
  }
}

async function getReportDetail(req, res, next) {
  try {
    const item = await Review.findOne({
      _id: req.params.id,
    }).populate('collectionRequest')
      .populate('reviewer')
      .populate('reviewee');
    if (!item) {
      return next(notFoundExc('No data found'));
    }

    return res.json(item);
  } catch (err) {
    return next(err);
  }
}

async function updateReport(req, res, next) {
  try {
    const data = req.body;
    const errors = validateStatus(data);
    if (errors) {
      return next(validationExc('Please correct your input', errors));
    }
    const item = await Review.findById(req.params.id)
      .populate('collectionRequest')
      .populate('reviewer')
      .populate('reviewee');
    if (!item) {
      return next(notFoundExc('No data found'));
    }

    item.status = data.status;
    await item.save();
    return res.json(item);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getReports,
  getReportDetail,
  updateReport,
};
