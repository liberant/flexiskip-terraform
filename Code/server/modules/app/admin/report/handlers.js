const createCsvStringifier = require("csv-writer").createObjectCsvStringifier;
const moment = require("moment");

// const { parseAddress } = require('../../../common/shipping');
const CollectionRequest = require("../../models/collection-request");
const BinRequest = require("../../models/bin-request");
const Bin = require("../../models/bin");
const Product = require("../../models/product");
const { formatDate } = require("../../../common/helpers");
const {
  updateGoogleSheetReportForCollectionRequest,
  updateGoogleSheetReportForProducts,
  loadGoogleSheetReport,
  mapCollectionRequestReportDataToColumn,
  mapProductReportDataToColumn,
} = require("../../../common/google-sheet-helpers");
const config = require("../../../../config");
const Promise = require("bluebird");

async function customerReport(req, res, next) {
  try {
    const filter = {
      status: CollectionRequest.STATUS_COMPLETED,
    };
    const customerIds = req.query.customers
      ? req.query.customers.split(",")
      : [];
    if (customerIds.length > 0) {
      filter.customer = { $in: customerIds };
    }
    const colReqs = await CollectionRequest.find(filter)
      .sort({ createdAt: -1 })
      .populate("customer")
      .populate("items.bin")
      .populate("items.product");

    const items = await Promise.all(
      colReqs.map(async (colReq) => {
        if (!colReq.items[0]) {
          throw new Error(
            `request does not have item ${colReq.code}`
          );
        }
        const { customer } = colReq;
        const customerAddress = await customer.getAddress();
        return {
          qrcode: colReq.items[0].bin.code || "null",
          code: colReq.discountCode || "null",
          crCode: colReq.code || "null",
          redeemedAt: colReq.discountCode
            ? formatDate(colReq.createdAt)
            : "",
          customer: customer.fullname || "null",
          address: customerAddress || "null",
          product: colReq.items
            ? colReq.items
              .map((item) => item.product.name)
              .join(", ")
            : "",
          productDispatchDate:
            colReq.items[0] && colReq.items[0].bin
              ? formatDate(colReq.items[0].bin.dispatchedAt)
              : "",
          requestDate: colReq.createdAt
            ? formatDate(colReq.createdAt)
            : "",
          actionDate: colReq.collectedAt
            ? formatDate(colReq.collectedAt)
            : "",
          disposalAddress: colReq.disposalAddress || "null",
          disposedAt: colReq.disposedAt
            ? formatDate(colReq.disposedAt)
            : "",
        };
      })
    );

    const csvStringifier = createCsvStringifier({
      header: [
        {
          id: "qrcode",
          title: "QR Code",
        },
        {
          id: "crCode",
          title: "CR Code",
        },
        {
          id: "code",
          title: "Discount Code Redeemed",
        },
        {
          id: "redeemedAt",
          title: "Date Redeemed",
        },
        {
          id: "customer",
          title: "Customer Name",
        },
        {
          id: "address",
          title: "Customer Address",
        },
        {
          id: "product",
          title: "Product Purchased",
        },
        {
          id: "productDispatchDate",
          title: "Product Dispatch Date",
        },
        {
          id: "requestDate",
          title: "Collection Request Date",
        },
        {
          id: "actionDate",
          title: "Collection Action Date",
        },
        {
          id: "disposalAddress",
          title: "Disposal Location",
        },
        {
          id: "disposedAt",
          title: "Disposal Date",
        },
      ],
    });
    const header = csvStringifier.getHeaderString();
    const content = csvStringifier.stringifyRecords(items);
    res.setHeader(
      "Content-disposition",
      "attachment; filename=customer-col-report.csv"
    );
    res.set("Content-Type", "text/csv");
    return res.send(`${header}${content}`);
  } catch (err) {
    return next(err);
  }
}

async function customerBinReport(req, res, next) {
  try {
    const filter = {
      status: BinRequest.STATUS_COMPLETED,
    };
    const customerIds = req.query.customers
      ? req.query.customers.split(",")
      : [];
    if (customerIds.length > 0) {
      filter.customer = { $in: customerIds };
    }
    const binReqs = await BinRequest.find(filter)
      .sort({ createdAt: -1 })
      .populate("customer")
      .populate("items.product")
      .populate("bins");
    // TODO: Add in loop to get all bins
    const items = await Promise.all(
      binReqs.map(async (binReq) => {
        if (!binReq.items[0]) {
          throw new Error(
            `request does not have item ${binReq.code}`
          );
        }

        const { customer } = binReq;
        // const customerAddress = await customer.getAddress();
        return {
          qrcode: binReq.bins ? binReq.bins[0].code : "",
          code: binReq.discountCode || "null",
          brcode: binReq.code || "null",
          redeemedAt: binReq.discountCode
            ? formatDate(binReq.createdAt)
            : "",
          customerName: binReq.customer
            ? customer.fullname
            : "namefucked",
          email: binReq.customer ? customer.email : "null",
          address: binReq.shippingAddress || "null",
          product: binReq.items
            ? binReq.items
              .map((item) => item.product.name)
              .join(", ")
            : "null",
          productOrderDate: formatDate(binReq.createdAt),
          productDispatchDate:
            binReq.items[0] && binReq.bins[0]
              ? formatDate(binReq.bins[0].dispatchedAt)
              : "",
        };
      })
    );

    const csvStringifier = createCsvStringifier({
      header: [
        {
          id: "qrcode",
          title: "QR Code",
        },
        {
          id: "brcode",
          title: "BR Number",
        },
        {
          id: "code",
          title: "Discount Code Redeemed",
        },
        {
          id: "redeemedAt",
          title: "Date Redeemed",
        },
        {
          id: "customerName",
          title: "Customer Name",
        },
        {
          id: "email",
          title: "Email",
        },
        {
          id: "address",
          title: "Customer Address",
        },
        {
          id: "product",
          title: "Product Purchased",
        },
        {
          id: "productOrderDate",
          title: "Product Order Date",
        },
        {
          id: "productDispatchDate",
          title: "Product Dispatch Date",
        },
      ],
    });
    const header = csvStringifier.getHeaderString();
    const content = csvStringifier.stringifyRecords(items);
    res.setHeader(
      "Content-disposition",
      "attachment; filename=customer-bin-report.csv"
    );
    res.set("Content-Type", "text/csv");
    return res.send(`${header}${content}`);
  } catch (err) {
    return next(err);
  }
}

async function activityReport(req, res, next) {
  try {
    const colReqs = await CollectionRequest.find({
      $or: [
        // eslint-disable-next-line max-len
        { status: CollectionRequest.STATUS_REQUESTED },
        { status: CollectionRequest.STATUS_ACCEPTED },
        { status: CollectionRequest.STATUS_IN_PROGRESS },
        { status: CollectionRequest.STATUS_COMPLETED },
        { status: CollectionRequest.STATUS_FUTILED },
      ],
    })
      .sort({ createdAt: -1 })
      .populate("items.product")
      .populate("items.bin")
      .populate("contractorOrganisation")
      .populate("customer");

    const colSheet = await loadGoogleSheetReport(
      config.collectionRequestSheetReport
    );

    await colSheet.loadHeaderRow();
    const HEADER_ROW = colSheet.headerValues;

    const items = await mapCollectionRequestReportDataToColumn(
      HEADER_ROW,
      colReqs
    );

    const csvStringifier = createCsvStringifier({
      header: HEADER_ROW.map((h) => ({ id: h, title: h })),
    });

    const header = csvStringifier.getHeaderString();
    const content = csvStringifier.stringifyRecords(items);
    res.setHeader(
      "Content-disposition",
      "attachment; filename=collection-report.csv"
    );
    res.set("Content-Type", "text/csv");
    return res.send(`${header}${content}`);
  } catch (err) {
    return next(err);
  }
}

async function activityBinReport(req, res, next) {
  try {
    const binReqs = await BinRequest.find({
      $or: [
        // eslint-disable-next-line max-len
        { status: BinRequest.STATUS_COMPLETED },
        { status: BinRequest.STATUS_IN_PROGRESS },
        { status: BinRequest.STATUS_PENDING },
      ],
    })
      .sort({ createdAt: -1 })
      .populate("items.product")
      .populate("bins")
      .populate("contractorOrganisation")
      .populate("customer");

    const prodSheet = await loadGoogleSheetReport(
      config.productRequestSheetReport
    );

    await prodSheet.loadHeaderRow();
    const HEADER_ROW = prodSheet.headerValues;

    const items = await mapProductReportDataToColumn(HEADER_ROW, binReqs);

    const csvStringifier = createCsvStringifier({
      header: HEADER_ROW.map((h) => ({ id: h, title: h })),
    });
    const header = csvStringifier.getHeaderString();
    const content = csvStringifier.stringifyRecords(items);
    res.setHeader(
      "Content-disposition",
      "attachment; filename=product-report.csv"
    );
    res.set("Content-Type", "text/csv");
    return res.send(`${header}${content}`);
  } catch (err) {
    return next(err);
  }
}

async function councilDiscountReport(req, res, next) {
  try {
    /**
     * Conditions
     */
    const pipelines = [
      {
        $match: {
          discountCodes: {
            $exists: true,
            $ne: [],
            $nin: [null, ""],
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "customer",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $unwind: {
          path: "$customer",
        },
      },
    ];

    /**
     * Query data
     */
    const colReqs = await CollectionRequest.aggregate(pipelines);
    const binReqs = await BinRequest.aggregate(pipelines);

    /**
     * Filter
     */
    const mapFilter = (addressType) => (accommodation, item) =>
      accommodation.concat(
        item.discountCodes.map((discount) => ({
          code: discount,
          customerName: item.customer.fullname,
          customerId: item.customer._id,
          address: item[addressType],
        }))
      );

    const filterColReqs = colReqs.reduce(
      mapFilter("collectionAddress"),
      []
    );
    const filterBinReqs = binReqs.reduce(mapFilter("shippingAddress"), []);

    const countTotalUseByCustomer = {};
    [...filterBinReqs, ...filterColReqs].forEach((item) => {
      const key = `${item.code}-${item.customerId}-${item.address}`;
      if (countTotalUseByCustomer[key]) {
        countTotalUseByCustomer[key].numberUses += 1;
      } else {
        countTotalUseByCustomer[key] = {
          code: item.code,
          customerName: item.customerName,
          numberUses: 1,
          address: item.address,
        };
      }
    });

    const councilDiscounts = Object.values(countTotalUseByCustomer);

    /**
     * CSV defined
     */
    const csvStringifier = createCsvStringifier({
      header: [
        { id: "code", title: "Code" },
        { id: "customerName", title: "Customer" },
        { id: "numberUses", title: "Number of uses" },
        { id: "address", title: "Address" },
      ],
    });

    const header = csvStringifier.getHeaderString();
    const content = csvStringifier.stringifyRecords(councilDiscounts);
    res.setHeader(
      "Content-disposition",
      "attachment; filename=discount-code-report.csv"
    );
    res.set("Content-Type", "text/csv");

    /**
     * End process
     */
    return res.send(`${header}${content}`);
  } catch (err) {
    return next(err);
  }
}

async function exportToGoogleSheet(req, res, next) {
  try {
    const NUMBER_YEAR_RANGE = 10;
    // Collection Sheet
    const colSheet = await loadGoogleSheetReport(
      config.collectionRequestSheetReport
    );
    await colSheet.loadHeaderRow();
    const HEADER_ROW_COL_SHEET = colSheet.headerValues;
    // clear sheet before export
    await colSheet.clear();
    // add new row report
    await colSheet.setHeaderRow(HEADER_ROW_COL_SHEET);

    // Product Sheet
    const prodSheet = await loadGoogleSheetReport(
      config.productRequestSheetReport
    );
    await prodSheet.loadHeaderRow();
    const HEADER_ROW_PROD_SHEET = prodSheet.headerValues;
    // clear sheet before export data
    await prodSheet.clear();
    // set header before export data
    await prodSheet.setHeaderRow(HEADER_ROW_PROD_SHEET);

    for (let i = 0; i < NUMBER_YEAR_RANGE; i += 1) {
      const fromDate = moment(new Date())
        .subtract(i, "year")
        .startOf("year")
        .toDate();
      const toDate = moment(new Date())
        .subtract(i, "year")
        .endOf("year")
        .toDate();

      const colReqs = await CollectionRequest.find({
        $or: [
          // eslint-disable-next-line max-len
          { status: CollectionRequest.STATUS_REQUESTED },
          { status: CollectionRequest.STATUS_ACCEPTED },
          { status: CollectionRequest.STATUS_IN_PROGRESS },
          { status: CollectionRequest.STATUS_COMPLETED },
          { status: CollectionRequest.STATUS_FUTILED },
        ],
        createdAt: {
          $gte: fromDate,
          $lte: toDate,
        },
      })
        .sort({ createdAt: -1 })
        .populate("items.product")
        .populate("items.bin")
        .populate("contractorOrganisation")
        .populate("customer");
      await updateGoogleSheetReportForCollectionRequest(
        colReqs,
        "override"
      );

      const binReqs = await BinRequest.find({
        $or: [
          // eslint-disable-next-line max-len
          { status: BinRequest.STATUS_COMPLETED },
          { status: BinRequest.STATUS_IN_PROGRESS },
          { status: BinRequest.STATUS_PENDING },
        ],
        createdAt: {
          $gte: fromDate,
          $lte: toDate,
        },
      })
        .sort({ createdAt: -1 })
        .populate("items.product")
        .populate("bins")
        .populate("customer");
      await updateGoogleSheetReportForProducts(binReqs, "override");
    }

    return res.json({ message: "Exported to Googlesheet" });
  } catch (err) {
    return next(err);
  }
}

async function exportCSVReport(req, res, next) {
  const { reportName } = req.query; // later can use this to separate types of report

  // Fetch GC products
  console.log(`[ ExportCSVReport ] - Fetching GC products and bins...`);

  const GC_PRODUCTS = await Product.find({
    prefix: "gc",
    status: { $ne: Product.STATUS_REMOVED },
  });

  const RESULTS = await Promise.map(GC_PRODUCTS, (p) =>
    Bin.find({
      status: Bin.STATUS_DELIVERED,
      statusUpdatedAt: {
        $lte: moment().subtract(30, "days").toDate(),
      },
      product: p._id,
      collectionStatus: Bin.STATUS_NEW,
    }).populate("customer")
  );

  console.log(`[ ExportCSVReport ] - Fetched product ids: `);
  console.log(GC_PRODUCTS.map((p) => p._id.toString()));
  let BIN_LIST = [];
  GC_PRODUCTS.forEach((p, i) => {
    console.log(
      `[ ExportCSVReport ] - ${p.name} - Total Bins : ${RESULTS[i].length}`
    );
    BIN_LIST = BIN_LIST.concat(RESULTS[i]);
  });

  console.log(`[ ExportCSVReport ] - Mapping CSV data...`);
  const items = BIN_LIST.map((item, index) => {
    let { customer } = item;
    return {
      index: index + 1,
      user_id: customer.uId,
      customer: customer.fullname,
      email: customer.email,
      address: customer.residentialCustomerProfile.address,
      product: item.name,
    };
  });

  console.log(`[ ExportCSVReport ] - Generating CSV...`);
  const csvStringifier = createCsvStringifier({
    header: [
      { id: "user_id", title: "USR ID" },
      { id: "customer", title: "Customer" },
      { id: "email", title: "Email" },
      { id: "address", title: "Address" },
      { id: "product", title: "Product" },
    ],
  });

  const header = csvStringifier.getHeaderString();
  const content = csvStringifier.stringifyRecords(items);

  console.log(`[ ExportCSVReport ] - Sent!`);
  const timestamp = moment().format("DD-MM-YYYY-HHmmss");
  res.setHeader(
    "Content-disposition",
    `attachment; filename=no-cr-gc-customer-${timestamp}.csv`
  );
  res.set("Content-Type", "text/csv");
  return res.send(`${header}${content}`);
}

module.exports = {
  customerReport,
  customerBinReport,
  activityReport,
  activityBinReport,
  councilDiscountReport,
  exportToGoogleSheet,
  exportCSVReport,
};
