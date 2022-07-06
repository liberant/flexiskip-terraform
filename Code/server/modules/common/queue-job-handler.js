const Promise = require('bluebird')
const QueueJob = require('./models/queue-job')
const logger = require('./log');

const { updateGoogleSheetReportForProducts, updateGoogleSheetReportForCollectionRequest } = require('./google-sheet-helpers');

const BinRequest = require('./../app/models/bin-request');
const CollectionRequest = require('./../app/models/collection-request');

const SENDING = {};

async function proceed(binReqs, mode) {
  try {


    // fetch jobs
    let queuedJobs = await QueueJob.find({
      status: { $in: [ QueueJob.STATUS_CREATED, QueueJob.STATUS_WAIT_FOR_RETRY ]},
      _id: { $nin: Object.keys(SENDING) },
      type: QueueJob.TYPE_GG_SHEET_UPDATE,
    })
    .sort({ createdAt: -1 })
    .limit(5);

    logger.info(`[Job Queue Cron]: Proceed queued job. (${Object.keys(SENDING).length} in sending)`);
    logger.info(queuedJobs.map(j => j._id));

    await Promise.map(queuedJobs, async function(job){
      try {
        const { binRequest, collectionRequest } = job;
        SENDING[job._id] = true;

        if (binRequest){ // Bin Request update
          const binReq = await BinRequest.findById(binRequest);
          if (binReq) {
            await updateGoogleSheetReportForProducts([binReq], 'update');
            logger.info(`[Job Queue Cron]: Updated for Bin Request ${binReq.code} (job: ${job._id})`);
          } else {
            throw new Error("[Job Queue Cron] Bin Request not found.");
          }

        } else if (collectionRequest){ // Collection Request update
          const colReq = await CollectionRequest.findById(collectionRequest);
          if (colReq) {
            await updateGoogleSheetReportForCollectionRequest([colReq], 'update');
            logger.info(`[Job Queue Cron]: Updated for Collection Request ${colReq.code} (job: ${job._id})`);
          } else {
            throw new Error("[Job Queue Cron] Collection Request not found.");
          }
        }

        job.status = QueueJob.STATUS_DONE;
        job.completedAt = new Date();
        await job.save();

      } catch(e) {
        logger.error(`[Job Queue Cron]: Failed to proceed queued job (${job._id})`, e);

        job.status = QueueJob.STATUS_WAIT_FOR_RETRY;
        job.retry += 1;
        if (job.retry >= 10){
          job.status = QueueJob.STATUS_FAILED;
          job.failedAt = new Date();
        }
        await job.save();
      } finally {
        delete SENDING[job._id];
      }
    })


  } catch (error) {
    logger.error('[Job Queue Cron]:Error on running queued job');
    logger.error(error.message);
    logger.error(error.stack);
    throw new Error(error.message);
  }
}

module.exports = {
  proceed,
};
