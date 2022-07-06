const CollectionRequest = require("../models/collection-request");

function getQueryData(query, organisationId) {
    const { limit = 10, page = 1, status } = query;

    const limit2 = parseInt(limit, 10);
    const page2 = parseInt(page, 10);

    let conditionStatus = [];
    if (status === "Pending") {
        conditionStatus = [
            CollectionRequest.STATUS_REQUESTED,
            CollectionRequest.STATUS_ACCEPTED,
            CollectionRequest.STATUS_IN_PROGRESS,
            CollectionRequest.STATUS_FUTILED,
        ];
    } else {
        conditionStatus = [
            CollectionRequest.STATUS_COMPLETED,
            CollectionRequest.STATUS_CANCELLED,
        ];
    }

    const match = {
        contractorOrganisation: organisationId,
        status: { $in: conditionStatus },
    };

    // calculate offset
    const offset = (page2 - 1) * limit2;

    const pipelines = [
        {
            $match: match,
        },
        {
            $facet: {
                total: [{ $count: "count" }],
                data: [
                    { $sort: { createdAt: -1 } },
                    { $skip: offset },
                    { $limit: limit2 },
                ],
            },
        },
    ];
    return {
        pipelines,
        limit: limit2,
        page: Number(page),
        offset,
    };
}

module.exports = {
    getQueryData,
};
