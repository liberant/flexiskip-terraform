const cron = require('node-cron');
const logger = require('./log');
const { chargeExpiredFlexiskipCustomer } = require('../app/admin/purchase/handlers');
const {
  enableGCCViolationChargeCRON,
  gcProductIds,
  gccViolationCRONExpression,

  jobQueueCRONExpression
} = require('../../config');
const { proceed } = require('./queue-job-handler');

const startGCCViolationCron = function(){
  try {
    const expression = gccViolationCRONExpression;

    if (enableGCCViolationChargeCRON){

      if (!gcProductIds.length) return logger.error('[GCC Violation Cron] No gcProductIds set.');

      cron.schedule(expression, function () {
        chargeExpiredFlexiskipCustomer();
      });
      logger.info(`[GCC Violation Cron] Initialized (${expression})`);
    }
  } catch (e) {
    logger.error('[GCC Violation Cron] Failed to initialize', e);
  }
};



const jobQueueCron = function(){
  try {
    const expression = jobQueueCRONExpression;
    cron.schedule(expression, function () {
      proceed();
    });
    logger.info(`[Job Queue Cron] Initialized (${expression})`);
  } catch (e) {
    console.log(e);
    logger.error('[Job Queue Cron] Failed to initialize', e);
  }
};

module.exports = {
  startGCCViolationCron,
  jobQueueCron
};
