const {
  validateBinData,
  validateRatingData,
  validateDisputeData,
  validateUpdateDisposalData,
  sendJobProcessedNotifToCustomer,
} = require('./helpers');

const { PAYMENT_TYPE_STRIPE } = require('../../models/payment');

const CollectionRequest = require('../../models/collection-request');
const { notFoundExc, validationExc } = require('../../../common/helpers');
const Bin = require('../../models/bin');
const Review = require('../../models/review');
const Dispute = require('../../models/dispute');
const { settleCharge, capturePaymentIntent } = require('../../../common/payment');
const EmailHelper = require('../../helpers/email');
const SMSHelper = require('../../helpers/sms');
const config = require('../../../../config');
const Promise = require('bluebird');

/**
 * @deprecated
 */
async function getCollectionRequests(req, res, next) {
  try {
    const { user } = req;
    let confirmedReqs = await user.getConfirmedColReqs();
    confirmedReqs = await Promise.all(confirmedReqs.map(item => item.toClientObject()));

    let availableReqs = await user.getAvailableColReqs();
    availableReqs = await Promise.all(availableReqs.map(item => item.toClientObject()));

    let completedReqs = await user.getCompletedColReqs();
    completedReqs = await Promise.all(completedReqs.map(item => item.toClientObject()));

    return res.json({
      confirmed: confirmedReqs,
      available: availableReqs,
      completed: completedReqs,
    });
  } catch (err) {
    return next(err);
  }
}

async function getAvailableColReqs(req, res, next) {
  try {
    const { user } = req;
    let { limit = config.limitJob, offset = 0 } = req.query;
    const { sort, search } = req.query;
    const sortParams = sort ? JSON.parse(sort) : { createdAt: -1 };
    limit = parseInt(limit, 10);
    offset = parseInt(offset, 10);
    const MAX_DISTANCE = 50000; // 50km
    const [lng, lat] = user.location.coordinates;
    // execute database query and get the cursor
    // for fetching data. using cursor because we don't
    // want to fetch all records in database at once
    const findParams = {
      status: CollectionRequest.STATUS_REQUESTED,
      // https://trello.com/c/aU0o2ELW
      // collectBy: { $gt: new Date() },
      collectionLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          $maxDistance: MAX_DISTANCE,
          $minDistance: 0,
        },
      },
    };
    if (search) {
      findParams.code = { $regex: `.*${search}.*` };
    }
    const cursor = CollectionRequest.find(findParams)
      .skip(offset)
      .sort(sortParams)
      .cursor();

    // while fetching each individual record, we want to
    // apply some business logic to filter data, this process
    // is finished when we get enough data
    const fetchData = () => {
      let processed = 0;
      // TODO handle reject
      return new Promise((resolve, reject) => {
        const result = [];
        const fetchRecord = async () => {
          const colReq = await cursor.next();
          if (colReq && result.length < limit) {
            processed += 1;
            /* apply some business logic checking to filter data
                   https:trello.com/c/aU0o2ELW */
            const canAccept = await user.canAcceptJob(colReq);
            if (canAccept) {
              result.push(colReq);
            }
            result.push(colReq);
            fetchRecord();
          } else {
            resolve({
              requests: result,
              processed,
            });
          }
        };
        fetchRecord();
      });
    };

    const { requests, processed } = await fetchData();
    const data = await Promise.all(requests.map(item => item.toClientObject()));
    debugAnomaly(data)
    return res
      .set('X-Pagination-Offset', offset + processed)
      .json(data);
  } catch (err) {
    return next(err);
  }
}

async function getConfirmedColReqs(req, res, next) {
  try {
    const { user } = req;
    let { limit = config.pageJob, offset = 0 } = req.query;
    limit = parseInt(limit, 10);
    offset = parseInt(offset, 10);
    const conditions = {
      driver: user._id,
      status: {
        $in: [
          CollectionRequest.STATUS_IN_PROGRESS,
          CollectionRequest.STATUS_ACCEPTED,
        ],
      },
    };
    const total = await CollectionRequest.countDocuments(conditions);
    const requests = await CollectionRequest.find(conditions)
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 });
    const data = await Promise.all(requests.map(item => item.toClientObject()));

    debugAnomaly(data)
    return res
      .set('X-Pagination-Page-Count', Math.ceil(total / limit))
      .set('X-Pagination-Offset', offset)
      .set('X-Pagination-Per-Page', limit)
      .set('X-Pagination-Total-Count', total)
      .json(data);
  } catch (err) {
    return next(err);
  }
}

async function getCompletedColReqs(req, res, next) {
  try {
    const { user } = req;
    let { limit = config.pageJob, offset = 0 } = req.query;
    limit = parseInt(limit, 10);
    offset = parseInt(offset, 10);
    const conditions = {
      driver: user._id,
      status: {
        $in: [
          CollectionRequest.STATUS_COMPLETED,
          CollectionRequest.STATUS_CANCELLED,
        ],
      },
    };
    const total = await CollectionRequest.countDocuments(conditions);
    const requests = await CollectionRequest.find(conditions)
      .skip(offset)
      .limit(limit)
      .sort({ disposedAt: -1 });
    const data = await Promise.all(requests.map(item => item.toClientObject()));

    debugAnomaly(data)
    return res
      .set('X-Pagination-Page-Count', Math.ceil(total / limit))
      .set('X-Pagination-Offset', offset)
      .set('X-Pagination-Per-Page', limit)
      .set('X-Pagination-Total-Count', total)
      .json(data);
  } catch (err) {
    return next(err);
  }
}


function debugAnomaly(data){
    const logged = {}; // prevent duplicate with current fetch job list logic
    const anomaly = data.filter(d => {
      let isAnomaly = false;
      if (!logged[d.code]){
        if (
          (d.customer && d.customer.firstname === "BlankFirst")
          || (d.customer && d.customer.lastname === "BlankLast")
          || (d.customer && d.customer.fullname === "BlankFullName")
          || (d.customer && d.customer.phone === "0400 000 000")
        ) isAnomaly = true;
      }
      logged[d.code] = true;
      return isAnomaly;
    });
    if (anomaly.length > 0) Promise.map(anomaly, cr => EmailHelper.sendDebuggingEmail(cr));
}



async function getCollectionRequestDetail(req, res, next) {
  try {
    const collectionRequest = await CollectionRequest.findOne({
      _id: req.params.id,
      driver: req.user._id,
    }).populate('items.bin');
    if (!collectionRequest) {
      return next(notFoundExc('Collection Request not found'));
    }
    return res.json(collectionRequest);
  } catch (err) {
    return next(err);
  }
}

async function raiseDispute(data) {
  const dispute = new Dispute(data);
  await dispute.save();
  EmailHelper.sendDisputeNotifEmailToAdmin(dispute);
}

async function updateBinStatus(req, res, next) {
  try {
    const driver = req.user;
    const colReq = await CollectionRequest.findOne({
      driver: driver._id,
      status: {
        $in: [CollectionRequest.STATUS_ACCEPTED, CollectionRequest.STATUS_IN_PROGRESS],
      },
      'items.bin': req.params.id,
    })
      .populate('customer')
      .sort({ createdAt: -1 });
    if (!colReq) {
      return next(notFoundExc('Bin not found'));
    }

    const bin = await Bin.findById(req.params.id).populate('customer').populate('product');
    const colReqItem = colReq.items.find(item => item.bin.toString() === bin._id.toString());
    const data = req.body;
    const errors = validateBinData(data);
    if (errors) {
      return next(validationExc('Please correct your input', errors));
    }

    // if (!validateLocation(colReq, data)) {
    //   return next(validationExc('Your location is incorrect', undefined, 'location_incorrect'));
    // }

    // when bin is not collected, save the reason
    if (data.status === Bin.STATUS_NOT_COLLECTED) {
      bin.reason = data.reason;
    }

    // when collected bin, save weight
    if (data.status === Bin.STATUS_COLLECTED) {
      bin.collectedWeight = data.collectedWeight;
    }

    // update bin's status
    await bin.updateCollectionStatus(data.status);

    // save bin's status in this collection request
    colReqItem.binStatus = bin.collectionStatus;
    await colReq.save();

    // update collection's status
    const processedStatuses = [Bin.STATUS_NOT_COLLECTED, Bin.STATUS_COLLECTED];
    if (processedStatuses.includes(bin.collectionStatus)) {
      await colReq.updateStatus(CollectionRequest.STATUS_IN_PROGRESS);
    }

    // check if all bins are processed (collected or not collected)
    await colReq.populate('items.bin').populate('customer').populate('driver').execPopulate();
    const allBinsCollected = colReq.items.every(item =>
      processedStatuses.includes(item.bin.collectionStatus));
    if (allBinsCollected) {
      if (colReq.total > 0 && colReq.paymentType === PAYMENT_TYPE_STRIPE) {
        // charge customer, settle the authorized charge
        await settleCharge(colReq.stripeChargeId);
        colReq.paid = true;
        await colReq.save();
      } else {
        if (colReq.additionalChargePaymentIntentId) await capturePaymentIntent(colReq.additionalChargePaymentIntentId);
        colReq.paid = true;
        await colReq.save();
      }
    }

    const colReqCompleted = colReq.items.every(item => item.bin.collectionStatus === Bin.STATUS_COLLECTED);
    if (colReqCompleted) {
      // send notification to customer by email and push notification
      EmailHelper.sendFinishedJobEmailToCustomer(driver, colReq, bin.product.prefix);
      await sendJobProcessedNotifToCustomer(colReq);
      SMSHelper.sendFinishedJobSMSToCustomer(driver, colReq, bin.product.prefix)
    }

    return res.json(bin);
  } catch (err) {
    return next(err);
  }
}

async function updateCollectionRequestStatus(req, res, next) {
  try {
    const query = {
      _id: req.params.id,
    };
    if (!req.user.roles.includes('admin')) query.driver = req.user._id;
    const colReq = await CollectionRequest.findOne(query).populate('items.bin')
      .populate('customer')
      .populate('items.product')
      .populate('contractorOrganisation');

    if (!colReq) {
      return next(notFoundExc('Collection Request not found'));
    }
    const data = req.body;
    // const errors = validateCollectionRequestStatus(data);
    // if (errors) {
    //   return next(validationExc('Please correct your input', errors));
    // }

    //Check current status of collection request
    // const currentStatus = colReq.status;
    // let message = 'Could not complete the request';
    // if (currentStatus !== CollectionRequest.STATUS_IN_PROGRESS) {
    //   switch (currentStatus) {
    //     case CollectionRequest.STATUS_REQUESTED:
    //     case CollectionRequest.STATUS_ACCEPTED:
    //       message = 'Collection Request has not been started';
    //       break;
    //     case CollectionRequest.STATUS_COMPLETED:
    //       message = 'Collection Request has been already completed';
    //       break;
    //     case CollectionRequest.STATUS_CANCELLED:
    //       message = 'Collection Request has been cancelled';
    //       break;
    //     default:
    //       break;
    //   }
    //   return next(validationExc(message));
    // }

    // Check current status of Bin
    // const invalidBinStatus = [Bin.STATUS_REQUESTED, Bin.STATUS_ACCEPTED];
    // const inProgress = colReq.items
    //   .some(item => invalidBinStatus.includes(item.bin.collectionStatus));
    // if (inProgress) {
    //   return next(validationExc('Collection Request is In-Progress'));
    // }
    let { status } = data;

    // if all bins are not collected, the CR status should be auto updated to Cancelled
    const isAllNotCollectedBins =
      colReq.items.filter(item => item.bin.collectionStatus === Bin.STATUS_NOT_COLLECTED).length === colReq.items.length;
    if (isAllNotCollectedBins) {
      status = CollectionRequest.STATUS_NOT_COMPLETED;
    }
    // Set status collection request
    await colReq.updateStatus(status);

    if (status === CollectionRequest.STATUS_COMPLETED) {
      for await (const item of colReq.items) {
        const { bin } = item;
        const colReqItem = colReq.items.find(
          (item) => item.bin._id.toString() === bin._id.toString()
        );

        // update bin's status
        await bin.updateDeliveryStatus(Bin.STATUS_DELIVERED);
        await bin.updateCollectionStatus(Bin.STATUS_COMPLETED);

        // save bin's status in this collection request
        colReqItem.binStatus = bin.collectionStatus;
        await colReq.save();
      }

      // send notification to customer by email and push notification
      await EmailHelper.sendFinishedJobEmailToCustomer(req.user, colReq, colReq.items[0].product.prefix, `${config.webUrl}/rating-collection-request/${req.params.id}`);
      await SMSHelper.sendFinishedJobSMSToCustomer(req.customer, colReq, `${config.webUrl}/rating-collection-request/${req.params.id}`);
    }

    return res.json(colReq);
  } catch (err) {
    return next(err);
  }
}

async function acceptCollectionRequest(req, res, next) {
  try {
    const colReq = await CollectionRequest.findById(req.params.id)
      .populate('items.bin')
      .populate('customer');
    if (!colReq) {
      return next(notFoundExc('Collection request not found'));
    }

    const driver = req.user;
    if (!await driver.acceptJob(colReq)) {
      return next(validationExc('This request is not available now'));
    }

    // Cron job trigger a dispute when driver doesnt collect job within 72hrs
    // eslint-disable-next-line prefer-const
    setTimeout(async () => {
      const newColReq = await CollectionRequest.findById(colReq._id).populate('driver');
      if (newColReq.isExpiredAcception()) {
        raiseDispute({
          collectionRequest: colReq._id,
          reporter: colReq.customer._id,
          user: driver._id,
          reason: 'Driver did not collect job within 72 hours',
          status: Dispute.STATUS_REPORTED,
        });
      }
    }, config.collectionProcessLifeTime);

    // setup initial dumpsite address
    const [longitude, latitude] = driver.location.coordinates;
    await colReq.updateDisposalAddress(latitude, longitude);

    return res.json(colReq);
  } catch (err) {
    return next(err);
  }
}

async function updateDisposalAddress(req, res, next) {
  try {
    const colReq = await CollectionRequest
      .findById(req.params.id)
      .populate('items.bin');
    if (!colReq) {
      return next(notFoundExc('Collection request not found'));
    }

    const data = req.body;
    const errors = validateUpdateDisposalData(data);
    if (errors) {
      return next(validationExc('Please correct your input', errors));
    }
    const { latitude, longitude } = data.location;
    await colReq.updateDisposalAddress(latitude, longitude);
    const resp = await colReq.toClientObject();
    return res.json(resp);
  } catch (err) {
    return next(err);
  }
}

async function rateCustomer(req, res, next) {
  try {
    // validate submitted data
    const colReq = await CollectionRequest.findOne({
      _id: req.params.id,
      // driver: req.user._id,
    }).populate('customer');

    if (!colReq) {
      return next(notFoundExc('Collection Request not found'));
    }
    const data = req.body;
    const errors = validateRatingData(data);
    if (errors) {
      return next(validationExc('Please correct your input', errors));
    }

    // save review
    const { customer } = colReq;
    const review = new Review({
      collectionRequest: colReq._id,
      reviewer: req.user._id,
      reviewee: customer._id,
      point: data.point,
      comment: data.comment,
      images: data.images || [],
      status: Review.STATUS_REPORTED,
    });
    await review.save();

    // if rating lower than 3 stars, raise a dispute
    if (review.point < 3) {
      await raiseDispute({
        collectionRequest: review.collectionRequest,
        reporter: review.reviewer,
        user: review.reviewee,
        reason: review.comment,
        images: review.images || [],
        status: Dispute.STATUS_REPORTED,
      });
    }

    // update customer's average rating
    const ratings = await Review.find({
      reviewee: customer._id,
    });
    let total = 0;
    ratings.forEach((r) => {
      total += r.point;
    });
    customer.rating = total / ratings.length;
    await customer.save();

    // return customer's detail
    const result = await customer.toUserObject();
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

async function createDispute(req, res, next) {
  try {
    const driver = req.user;
    const colReq = await CollectionRequest.findOne({
      _id: req.params.id,
      driver: driver._id,
    }).populate('customer');
    if (!colReq) {
      return next(notFoundExc('Collection Request not found'));
    }

    // validate submitted data
    const data = req.body;
    const errors = validateDisputeData(data);
    if (errors) {
      return next(validationExc('Please correct your input', errors));
    }

    // save dispute
    const { customer } = colReq;
    await raiseDispute({
      collectionRequest: colReq._id,
      reporter: driver._id,
      user: customer._id,
      reason: data.comment,
      images: data.images || [],
      status: Dispute.STATUS_REPORTED,
    });

    // return customer's detail
    const result = await customer.toUserObject();
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getCollectionRequests,
  getCollectionRequestDetail,
  updateBinStatus,
  updateCollectionRequestStatus,
  acceptCollectionRequest,
  rateCustomer,
  updateDisposalAddress,
  getAvailableColReqs,
  getConfirmedColReqs,
  getCompletedColReqs,
  createDispute,
};
