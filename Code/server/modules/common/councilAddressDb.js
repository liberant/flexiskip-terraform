const _ = require('lodash');
const config = require('../../config');
const log = require('./log');

const mongoose = require('mongoose');

const options = {
  config: { autoIndex: false },
  useNewUrlParser: true,
};

const councilAddressDBConn = new mongoose.Mongoose();

councilAddressDBConn.connect(config.db.councilAddressDbUri, options)
.then(res => { log.info("Council Address DB connected") });

module.exports = councilAddressDBConn;
