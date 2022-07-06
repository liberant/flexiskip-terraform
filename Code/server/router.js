const express = require('express');

const router = express.Router();
const app = require('./modules/app/router');
const common = require('./modules/common/router');

const adminAccount = require('./modules/app/admin/account/router');
const adminUser = require('./modules/app/admin/user/router');
const adminResidentialCustomer = require('./modules/app/admin/res-customer/router');
const adminBusinessCustomer = require('./modules/app/admin/bus-customer/router');
const adminProduct = require('./modules/app/admin/product/router');
const adminContractorr = require('./modules/app/admin/contractor/router');
const adminBinRequest = require('./modules/app/admin/bin-request/router');
const adminColectionRequest = require('./modules/app/admin/col-request/router');
const adminTransaction = require('./modules/app/admin/transaction/router');
const adminDriver = require('./modules/app/admin/driver/router');
const adminAdmin = require('./modules/app/admin/admin/router');
const adminCouncilOfficer = require('./modules/app/admin/council-officer/router');
const adminCoupon = require('./modules/app/admin/coupon/router');
const adminReview = require('./modules/app/admin/review/router');
const adminReviewNote = require('./modules/app/admin/review-note/router');
const adminAdvertisement = require('./modules/app/admin/ads/router');
const adminCouncil = require('./modules/app/admin/council/router');
const adminCouncilProduct = require('./modules/app/admin/council-product/router');
const adminDumpsite = require('./modules/app/admin/dumpsite/router');
const adminDashboard = require('./modules/app/admin/dashboard/router');
const adminWasteType = require('./modules/app/admin/waste-type/router');
const adminReport = require('./modules/app/admin/report/router');
const adminDispute = require('./modules/app/admin/dispute/router');
const adminDisputeNote = require('./modules/app/admin/dispute-note/router');
const adminImport = require('./modules/app/admin/import/router');
const adminBinRequestNote = require('./modules/app/admin/bin-request-note/router');
const adminPurchase = require('./modules/app/admin/purchase/router');
const adminOrganisation = require("./modules/app/admin/organisation/router");

const residentialCustomer = require('./modules/app/res-customer/account/router');
const businessCustomer = require('./modules/app/bus-customer/account/router');
const customerAccount = require('./modules/app/customer/account/router');
const customerBinRequest = require('./modules/app/customer/bin-request/router');
const customerCollectionRequest = require('./modules/app/customer/col-request/router');
const customerTransaction = require('./modules/app/customer/transaction/router');
const customerAds = require('./modules/app/customer/ads/router');
const customerNotification = require('./modules/app/customer/notification/router');
const customerDiscount = require('./modules/app/customer/discount/router');

const contractorAccount = require('./modules/app/contractor/account/router');
const contractorVehicle = require('./modules/app/contractor/vehicle/router');
const contractorDriver = require('./modules/app/contractor/driver/router');
const contractorAdmin = require('./modules/app/contractor/admin/router');
const contractorTransaction = require('./modules/app/contractor/transaction/router');
const contractorDashboard = require('./modules/app/contractor/dashboard/router');
const contractorReport = require('./modules/app/contractor/report/router');
const contractorJob = require('./modules/app/contractor/jobs/router');

const runsheetSummary = require("./modules/app/runsheet/router");

const driverAccount = require('./modules/app/driver/account/router');
const driverColReqRouter = require('./modules/app/driver/collection-request/router');
const driverVehicle = require('./modules/app/driver/vehicle/router');

const adminVehicle = require('./modules/app/admin/vehicle/router');

const userRouter = require('./modules/app/user/router');
const fastwayRouter = require('./modules/app/fastway/router');
const purchaseRouter = require('./modules/app/purchase/router');

const eligibleAddressRouter = require('./modules/app/admin/eligible-address/router');


router.get('/', (req, res) => {
  res.json('api server is working properly.');
});

router.use('/api/v1', [
  common,
  app,
  userRouter,
  fastwayRouter,
  purchaseRouter,

  // customer
  residentialCustomer,
  businessCustomer,
  customerAccount,
  customerBinRequest,
  customerCollectionRequest,
  customerTransaction,
  customerAds,
  customerNotification,
  customerDiscount,

  // admin
  adminAccount,
  adminUser,
  adminResidentialCustomer,
  adminBusinessCustomer,
  adminContractorr,
  adminDriver,
  adminAdmin,
  adminProduct,
  adminBinRequest,
  adminColectionRequest,
  adminTransaction,
  adminCoupon,
  adminReview,
  adminReviewNote,
  adminAdvertisement,
  adminCouncilProduct,
  adminCouncil,
  adminDumpsite,
  adminDashboard,
  adminWasteType,
  adminReport,
  adminVehicle,
  adminDispute,
  adminDisputeNote,
  adminImport,
  adminBinRequestNote,
  adminPurchase,
  adminCouncilOfficer,
  adminOrganisation,

  // contractor
  contractorAccount,
  contractorVehicle,
  contractorDriver,
  contractorTransaction,
  contractorAdmin,
  contractorDashboard,
  contractorReport,
  contractorJob,

  // runsheet
  runsheetSummary,

  // driver
  driverAccount,
  driverColReqRouter,
  driverVehicle,

  //manage db
  eligibleAddressRouter,
]);

module.exports = router;
