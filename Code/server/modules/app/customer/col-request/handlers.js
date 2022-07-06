const moment = require('moment');
const ms = require('ms');
const CollectionRequest = require('../../models/collection-request');
const Bin = require('../../models/bin');
const Review = require('../../models/review');
const Coupon = require('../../models/coupon');
const Dispute = require('../../models/dispute');
const {
  validationExc,
  notFoundExc,
  getDatePart,
  round,
} = require('../../../common/helpers');
const {
  PAYMENT_TYPE_STRIPE,
  PAYMENT_TYPE_INVOICE,
} = require('../../models/payment');
const { collectionLifeTime } = require('../../../../config');
const { authorizeCharge } = require('../../../common/payment');
const { parseAddress } = require('../../../common/shipping');
const EmailHelper = require('../../helpers/email');
const ClickUpHelper = require('../../helpers/clickup');

const {
  validateCartData,
  getQueryData,
  validateCollectionRequest,
  validateColReqStatusData,
  validateRatingData,
  validateReportData,
  resolveInvalidQRCode,
} = require('./helpers');
const { sendFCMToDriver } = require('../../helpers');
const {
  generateCollectionRequestCode,
  validateBinAvailability,
} = require('../../helpers');
const { gcProductIds } = require('../../../../config');

async function raiseDispute(data) {
  const dispute = new Dispute(data);
  await dispute.save();
  EmailHelper.sendDisputeNotifEmailToAdmin(dispute);
}

async function createCart(req, res, next) {
  try {
    const cart = new CollectionRequest({
      items: [],
      customer: req.user._id,
      status: CollectionRequest.STATUS_DRAFT,
    });
    await cart.save();
    return res.json(cart.toObject());
  } catch (err) {
    return next(err);
  }
}

async function updateCart(req, res, next) {
  try {
    const data = req.body;
    const cart = await CollectionRequest.findOne({
      _id: req.params.id,
      customer: req.user._id,
      status: CollectionRequest.STATUS_DRAFT,
    });
    if (!cart) {
      return next(notFoundExc('Cart not found'));
    }

    // update cart
    // remove duplicated items
    const normalizedItems = [];
    data.items.forEach((item) => {
      const binExists = normalizedItems.some(item2 => item2.bin === item.bin);
      if (!binExists) {
        normalizedItems.push(item);
      }
    });
    cart.items = await Promise.all(normalizedItems.map(async (item) => {
      const bin = await Bin.findById(item.bin).populate('product');
      const { product } = bin;

      const isGCProduct = gcProductIds.includes(product._id.toString());

      let price;
      if (isGCProduct) price = bin.getGCPrice();
      else price = await product.getCollectionPrice(req.user, data.collectionAddress);

      return {
        bin: bin._id,
        product: product.toProductObject(),
        quantity: 1,
        price,
        total: price,
      };
    }));
    cart.discountCodes = data.discountCodes || [];
    cart.comment = data.comment;
    cart.paymentType = data.paymentType;
    cart.invoiceCode = data.invoiceCode;
    await cart.setCollectionAddress(data.collectionAddress);

    // implicit apply customer discount code
    const oldCodes = cart.discountCodes;
    await cart.addCustomerDiscount();
    await cart.setPrices();

    // validate cart
    const errors = await validateCartData(data, req.user, cart);
    if (errors) {
      return next(validationExc('Please correct your input', errors));
    }

    // revert discount code list
    cart.discountCodes = oldCodes;
    await cart.save();

    // save bin's comment
    await cart
      .populate('items.bin')
      .execPopulate();
    const p = cart.items.map((item) => {
      const { bin } = item;
      const it = data.items.find(di => di.bin === bin._id.toString());
      if (!it) {
        return Promise.resolve();
      }
      bin.comment = it.comment;
      return bin.save();
    });
    await Promise.all(p);
    return res.json(cart);
  } catch (err) {
    return next(err);
  }
}

async function getCartDetail(req, res, next) {
  try {
    const cart = await CollectionRequest.findOne({
      _id: req.params.id,
      customer: req.user._id,
      status: CollectionRequest.STATUS_DRAFT,
    }).populate('items.bin');
    if (!cart) {
      return next(notFoundExc('Cart not found'));
    }

    return res.json(cart.toObject());
  } catch (err) {
    return next(err);
  }
}

async function getBinDetail(req, res, next) {
  try {
    const code = await resolveInvalidQRCode(req.params.code);
    const bin = await Bin.findOne({
      code,
      status: Bin.STATUS_DELIVERED,
    });
    if (!bin) {
      return next(notFoundExc('Bin not found', { code: 'bin_not_found' }));
    }
    const isGCProduct = gcProductIds.includes(product._id.toString());
    if (isGCProduct) {
      return next(createGCColReq(req, res, next));
    }
   const error = await validateBinAvailability(bin._id);
    if (error) {
      const message = `Thanks for scanning ${req.user.firstname}! We already have a collection request pending in our system and we will be there soon.`;
      return next(validationExc(message, undefined, 'bin_already_booked'));
    }

    return res.json(bin);
  } catch (err) {
    return next(err);
  }
}

async function createCollectionRequest(req, res, next) {
  try {
    const colReq = await CollectionRequest.findOne({
      _id: req.body.cartId,
      customer: req.user._id,
      status: CollectionRequest.STATUS_DRAFT,
    }).populate('items.bin')
      .populate('items.product')
      .populate('contractorOrganisation')
      .populate('customer');

    if (!colReq) {
      return next(notFoundExc('Cart not found'));
    }

    const errors = await validateCollectionRequest(colReq);
    if (errors) {
      return next(validationExc('Please correct your input', errors));
    }

    colReq.code = await generateCollectionRequestCode();
    if (colReq.paymentType === PAYMENT_TYPE_STRIPE) {
      // handle process for credit card
      // check user had entered payment card
      const hasPayment = await req.user.hasPaymentInfo();
      if (colReq.total > 0 && !hasPayment) {
        return next({
          status: 400,
          code: 'no_billing_info',
          message: 'Please update your payment information first.',
        });
      }

      // Check bin belong to another collection request
      const usedBins = colReq.items.filter(item => !item.bin.isOrderable());
      if (usedBins.length > 0) {
        const { bin } = usedBins[0];
        return next(validationExc(
          `Bin ${bin.code} is not available for collection`,
          `Current bin status is ${bin.collectionStatus}`, 'collection_was_not_created',
        ));
      }

      // authorize payment for later charge
      if (colReq.total > 0) {
        const stripeCustomerId = await req.user.getStripeCustomerId();
        const total = round(colReq.total * 100, 0);
        const stripeChargeId = await authorizeCharge(
          stripeCustomerId,
          total,
          `Authorize payment for collection request ${colReq.code}`,
          {
            code: colReq.code,
            type: 'collection request charge',
          },
        );
        colReq.paymentType = 'stripe';
        colReq.stripeChargeId = stripeChargeId;
      }
    } else if (colReq.paymentType === PAYMENT_TYPE_INVOICE) {
      // handle process for invoice payment method
      colReq.paid = true;
    }

    colReq.createdAt = new Date();
    colReq.collectBy = moment().add(ms(collectionLifeTime), 'milliseconds').toDate();
    const { location } = await parseAddress(colReq.collectionAddress);
    colReq.collectionLocation.coordinates = [location.lng, location.lat];
    await colReq.updateStatus(CollectionRequest.STATUS_REQUESTED);

    // update data for every bins
    colReq.items.forEach((item) => {
      const { bin } = item;
      bin.collectionRequest = colReq._id;
      bin.collectionStatus = Bin.STATUS_REQUESTED;
      item.binStatus = bin.collectionStatus;
      bin.save();
    });

    /**
     * Save item of collection request
     */
    await colReq.save();

    // Deduct coupon usage
    if (colReq.discountCodes) {
      await Promise.all(colReq.discountCodes.map(async (code) => {
        const coupon = await Coupon.findOne({ code });
        await coupon.deductCoupon();
      }));
    }

    colReq.broadcastColReqToDrivers();
    ClickUpHelper.notifyNewCollectionRequest(colReq);
    return res.json(colReq.toObject());
  } catch (err) {
    if (err.message === 'Your card was declined.') {
      err.code = 'card_declined';
      err.message = 'I’m sorry!';
      err.description = 'Your card has been declined. Please check your card details are correct before trying again!';
    }
    return next(err);
  }
}

async function createGCColReq(req, res, next) {
  try {
    const colReq = await CollectionRequest.findOne({
      _id: req.body.cartId,
      customer: req.user._id,
      status: CollectionRequest.STATUS_DRAFT,
    }).populate('items.bin')
        .populate('items.product')
        .populate('contractorOrganisation')
        .populate('customer');

    if (!colReq) {
      return next(notFoundExc('Cart not found'));
    }

    colReq.code = await generateCollectionRequestCode();
    colReq.paymentType = PAYMENT_TYPE_INVOICE;
    colReq.paid = true;

    colReq.createdAt = new Date();
    colReq.collectBy = moment().add(ms(collectionLifeTime), 'milliseconds').toDate();
    await colReq.updateStatus(CollectionRequest.STATUS_REQUESTED);

    // update data for every bins
    colReq.items.forEach((item) => {
      const { bin } = item;
      bin.collectionRequest = colReq._id;
      bin.collectionStatus = Bin.STATUS_REQUESTED;
      item.binStatus = bin.collectionStatus;
      bin.save();
    });

    /**
     * Save item of collection request
     */
    await colReq.save();

    ClickUpHelper.notifyNewCollectionRequest(colReq);
    return res.json(colReq.toObject());
  } catch (err) {
  }
    return next(err);
}

async function getCollectionRequests(req, res, next) {
  try {
    const query = getQueryData(req.query, req.user._id);
    const total = await CollectionRequest.countDocuments(query.conditions);
    const collectionRequests = await CollectionRequest.find(query.conditions)
      .sort({ _id: -1 })
      .skip(query.offset)
      .limit(query.limit);
    const result = [];
    await Promise.all(collectionRequests.map(cr => cr.populate('items.bin').execPopulate()));
    collectionRequests.forEach((collectionRequest) => {
      if (collectionRequest.items.length > 0) {
        const key = getDatePart(collectionRequest.createdAt);
        let item = result.find(i => i.date === key);
        if (!item) {
          item = {
            data: [],
            date: key,
          };
          result.push(item);
        }
        item.data.push(collectionRequest);
      }
    });
    return res
      .set('X-Pagination-Page-Count', Math.ceil(total / query.limit))
      .set('X-Pagination-Current-Page', query.page)
      .set('X-Pagination-Per-Page', query.limit)
      .set('X-Pagination-Total-Count', total)
      .json(result);
  } catch (err) {
    return next(err);
  }
}

async function getCollectionDriverDetail(req, res, next) {
  try {
    const collectionRequest = await CollectionRequest.findOne({
      _id: req.params.id,
      customer: req.user._id,
      status: {
        $nin: [CollectionRequest.STATUS_DRAFT, CollectionRequest.STATUS_REQUESTED],
      },
    }).populate('driver')
      .populate('items.bin');

    if (!collectionRequest) {
      return next(notFoundExc('Collection request not found'));
    }

    const result = collectionRequest.toObject();
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

async function cancelCollectionRequest(req, res, next) {
  try {
    const errors = validateColReqStatusData(req.body);
    if (errors) {
      return next(validationExc('Please correct your input.', errors));
    }

    const colReq = await CollectionRequest.findOne({
      _id: req.params.id,
      customer: req.user._id,
      status: { $ne: CollectionRequest.STATUS_DRAFT },
    })
      .populate('driver')
      .populate('items.bin');

    if (!colReq) {
      return next(notFoundExc('Collection request not found'));
    }

    // only allow user cancel request if no driver has accepted yet
    // or the request has not been started
    if (colReq.status !== CollectionRequest.STATUS_REQUESTED
      && colReq.status !== CollectionRequest.STATUS_ACCEPTED) {
      return next(validationExc(
        'You cannot cancel this request',
        undefined, 'collection_was_not_cancelled',
      ));
    }

    // update collection status
    const promises = colReq.items.map(async (item) => {
      const { bin } = item;
      const validCollectionStatus = [Bin.STATUS_REQUESTED, Bin.STATUS_ACCEPTED];
      if (validCollectionStatus.includes(bin.collectionStatus)) {
        bin.updateCollectionStatus(Bin.STATUS_NEW);
        bin.collectionRequest = null;
        bin.save();
      }
    });
    await Promise.all(promises);
    await colReq.updateStatus(CollectionRequest.STATUS_CANCELLED);

    // notify driver about cancelled request
    if (colReq.driver) {
      sendFCMToDriver(
        colReq.driver.fcmToken,
        'Request was cancelled',
        `Collection request ${colReq.code} has been cancelled by customer`,
        {
          id: colReq._id,
          type: 'collection_request_cancelled_by_customer',
        },
      );
    }

    return res.json(colReq);
  } catch (err) {
    return next(err);
  }
}

async function rateDriver(req, res, next) {
  try {
    // validate submitted data
    const colReq = await CollectionRequest.findOne({
      _id: req.params.id,
      customer: req.user._id,
    }).populate('driver');
    if (!colReq) {
      return next(notFoundExc('Collection Request not found'));
    }
    const data = req.body;
    const errors = validateRatingData(data);
    if (errors) {
      return next(validationExc('Please correct your input', errors));
    }

    // save review
    const { driver } = colReq;
    const review = new Review({
      collectionRequest: colReq._id,
      reviewer: req.user._id,
      reviewee: driver._id,
      point: data.point,
      status: Review.STATUS_REPORTED,
      comment: data.comment,
      images: data.images || [],
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

    // update driver's average rating
    const driverReviews = await Review.find({
      reviewee: driver._id,
    });
    let total = 0;
    driverReviews.forEach((r) => {
      total += r.point;
    });
    const avgPoint = total / driverReviews.length;
    driver.rating = avgPoint;
    await driver.save();

    // return driver's detail
    const result = await driver.toUserObject();
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

async function reportDriver(req, res, next) {
  try {
    const collectionRequest = await CollectionRequest.findOne({
      _id: req.params.id,
      customer: req.user._id,
      status: { $nin: [CollectionRequest.STATUS_DRAFT, CollectionRequest.STATUS_REQUESTED] },
      driver: { $ne: null },
    }).populate('driver');

    if (!collectionRequest) {
      return next(notFoundExc('Collection Request not found'));
    }
    const data = req.body;
    const errors = validateReportData(data);
    if (errors) {
      return next(validationExc('Please correct your input', errors));
    }

    // noted: Dispute feature was removed in our system
    // const rep = new Dispute({
    //   collectionRequest: collectionRequest._id,
    //   reporter: req.user._id,
    //   user: collectionRequest.driver._id,
    //   reason: data.reason,
    //   status: Dispute.STATUS_REPORTED,
    // });
    // await rep.save();
    return res.json({ message: 'Your report has been successfully submitted.' });
  } catch (err) {
    return next(err);
  }
}

async function ratingCollection(req, res, next) {
  try {
    const { rate, comment } = req.body;

    const colReq = await CollectionRequest.findById(req.params.id);

    if (!colReq) {
      return next(notFoundExc("Collection Request not found"));
    }

    // Set status collection request
    await colReq.setRatingData(rate, comment);

    return res.json(colReq);
  } catch (err) {
    return next(err);
  }
}

async function getCollectionDetail(req, res, next) {
  try {
    const collectionRequest = await CollectionRequest.findOne({
      _id: req.params.id,
    });

    if (!collectionRequest) {
      return next(notFoundExc('Collection request not found'));
    }

    const result = collectionRequest.toObject();
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createCart,
  getCartDetail,
  updateCart,
  getBinDetail,
  createCollectionRequest,
  createGCColReq,
  getCollectionRequests,
  getCollectionDetail,
  getCollectionDriverDetail,
  cancelCollectionRequest,
  rateDriver,
  reportDriver,
  ratingCollection,
};
