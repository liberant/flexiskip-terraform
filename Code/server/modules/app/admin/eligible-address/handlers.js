const Promise = require('bluebird');
const CouncilAddress = require('../../models/council-address-db/address');
const HandelCouncilAddress = require('../../models/council-address');
const {
  validationExc,
  notFoundExc,
} = require('../../../common/helpers');
const {
  getQueryData,
  validateCreateAddressData,
  buildFullAddress,
  validateCreateAddressDataSync,
} = require('./helpers');

const S3 = require('aws-sdk/clients/s3');
const { awsConfig } = require('../../../../config');
const s3Helper = require('../../../common/s3');
const s3Client = new S3({
  accessKeyId: awsConfig.accessKeyId,
  secretAccessKey: awsConfig.secretAccessKey,
});

const _ = require('lodash');
const csv = require( "fast-csv" );
const request = require('request');
const logger = require('../../../common/log');


// Get Product List
async function getAddresses(req, res, next) {
  try {
    const query = getQueryData(req.query);
    const rawData = await CouncilAddress.aggregate(query.pipelines);
    const total = rawData[0].total[0] && rawData[0].total[0].count;
    const items = rawData[0].data;

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

// Create Address
async function createAddress(req, res, next) {
  let resultSave;
  try {
    const data = req.body;
    const errors = await validateCreateAddressData(data);
    if (errors) {
      let errorMessage = 'Please correct your input.';
      if (errors.customer_no == "This address already exists.") errorMessage = "This address already exists.";
      return next(validationExc(errorMessage, errors));
    }

    const { unit_no, address_1, city, postcode } = data;
    const full_address = buildFullAddress(unit_no, address_1, city, postcode);

    data.full_address = full_address;
    const newAddress = new CouncilAddress(data);
    resultSave = await newAddress.save();

    const newHandelCouncilAddress = new HandelCouncilAddress({
      address: address_1,
      city: city,
      postcode: postcode,
      fullAddress: full_address,
      unitNo: unit_no,
      council: req.user.council,
    });
    await newHandelCouncilAddress.save();

    return res.json(data);
  } catch (err) {
    if (resultSave._id) await CouncilAddress.deleteOne({ _id: resultSave._id });
    return next(err);
  }
}


// Delete batch address
async function deleteBatchAddress(req, res, next) {
  try {
    const { ids } = req.query;

    const fullAddresses = await CouncilAddress.find({ _id: ids }, { full_address:1 });

    let deleted = await Promise.all([
      CouncilAddress.deleteMany({ _id: ids }),
      HandelCouncilAddress.deleteMany({ fullAddress: fullAddresses.map(f => f.full_address) }),
    ]);

    return res.json({ status: "OK" });
  } catch (err) {
    return next(err);
  }
}


async function importAddresses(req, res, next) {
  // download import file
  const { key } = req.query;
  const fileUrl = `https://handel-dev.s3.amazonaws.com/import/${key}`;
  const rows = [];
  const councilIds = [];

  let rowErrors = [];
  let rowIndex = 2; // row 1 for header
  const parser = csv.fromStream(request(fileUrl), { headers: true })
  .on('error', error => {
    parser.pause();
    return next(validationExc("Problem processing uploaded file."))
  })
  .on("data", function(row){
    if (!row.hasOwnProperty('customer_no')) throw new Error(); // wrong file format, stop stream

    // validate row data
    const errors = validateCreateAddressDataSync(row);
    if (errors) { rowErrors.push(rowIndex) }
    rowIndex++;

    // push data to proceed after stream ended
    rows.push(row);
    councilIds.push(row.customer_no);
  })
  .on("end", async function(){
    // Return validation error on rows
    if (rowErrors.length) return next(validationExc(`Data validation failed on row(s): [${rowErrors}]`))

    //check duplicated council ids in  csv file
    let dups = _.filter(councilIds, v => _.filter(councilIds, v1 => v1 === v).length > 1);
    dups = [... new Set(dups)];
    if (dups.length)  return next(validationExc(`Duplicated customer_no in uploaded file: [${dups}]`))

    // check if id already exist
    const exist = await CouncilAddress.find({ customer_no: councilIds }).exec();
    if (exist.length) return next(validationExc(`One or more addresses were already in the DB. This upload has not been processed. [${exist.map(r=>r.customer_no)}]`))

    // Proceed import

    await Promise.map(rows, async (data) => {
      const { unit_no, address_1, city, postcode } = data;
      const full_address = buildFullAddress(unit_no, address_1, city, postcode);

      data.full_address = full_address;
      const newAddress = new CouncilAddress(data);
      resultSave = await newAddress.save();

      const newHandelCouncilAddress = new HandelCouncilAddress({
        address: address_1,
        city: city,
        postcode: postcode,
        fullAddress: full_address,
        unitNo: unit_no,
        council: req.user.council,
      });
      await newHandelCouncilAddress.save();
      logger.info(`Imported address: ${full_address}`)
    })

    //Delete import file
    const params = {
        Bucket: awsConfig.bucket,
        Key: `import/${key}`
    };

    s3Client.deleteObject(params, (error, data) => {
      if (error) logger.error("Delete import file error", error)
      logger.info("Delete import file successfully")
    });

    return res.json("OK");
  });
}

async function getUploadParams(req, res, next) {
  try {
    const overrides = {
      keyPrefix: 'import/',
      contentTypePrefix: 'text/csv',
    }

    return res.json(s3Helper.getUploadParams(overrides));
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getAddresses,
  createAddress,
  deleteBatchAddress,
  importAddresses,
  getUploadParams,
};
