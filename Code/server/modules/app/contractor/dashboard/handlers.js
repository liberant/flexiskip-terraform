const {
  getTotalRevenue,
  getRevenueSinceLastMonth,
  getColReqCount,
  getColReqCountSinceLastMonth,
  getAvgRating,
  getAvgColTime,
  getPendingColReqCountIn6h,
  getPendingColReqCountIn48h,
  getNonConformanceCount,
  getRevenueChart,
} = require('./helpers');

async function getSummarySection(req, res, next) {
  try {
    const { user } = req;
    const { organisation } = user.contractorProfile;
    const [
      revenue,
      revenueSinceLastMonth,
      colReqCount,
      colReqCountSinceLastMonth,
      avgRating,
      avgColTime,
      pendingColReq6h,
      pendingColReq48h,
      nonConformance,
    ] = await Promise.all([
      getTotalRevenue(organisation),
      getRevenueSinceLastMonth(organisation),
      getColReqCount(organisation),
      getColReqCountSinceLastMonth(organisation),
      getAvgRating(organisation),
      getAvgColTime(organisation),
      getPendingColReqCountIn6h(organisation),
      getPendingColReqCountIn48h(organisation),
      getNonConformanceCount(organisation),
    ]);

    res.json({
      revenue,
      revenueSinceLastMonth,
      colReqCount,
      colReqCountSinceLastMonth,
      avgRating,
      avgColTime,
      pendingColReq6h,
      pendingColReq48h,
      nonConformance,
    });
  } catch (err) {
    next(err);
  }
}

async function getRevenueSection(req, res, next) {
  try {
    const { from, to } = req.query;
    const { user } = req;
    const data = await getRevenueChart(user, from, `${to}T23:59:59.999Z`);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSummarySection,
  getRevenueSection,
};
