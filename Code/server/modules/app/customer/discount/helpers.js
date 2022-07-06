
const Coupon = require('../../models/coupon');
const { parseAddress } = require('../../../common/shipping');

async function buildQueryByLocation(location) {
  try {
    if (!location) {
      return [];
    }
    const { postalCode } = await parseAddress(location);
    return [
      {
        regions: {
          $elemMatch: { postCodes: postalCode },
        },
      },
    ];
  } catch (error) {
    return [];
  }
}

function buildQueryByProduct(products) {
  try {
    if (!products) {
      return null;
    }
    const productArray = products.split(',');
    return {
      $or: productArray.reduce((conditions, arr) => conditions.concat([
        {
          products: {
            $elemMatch: {
              name: arr,
            },
          },
        },
        {
          products: {
            $elemMatch: {
              code: arr,
            },
          },
        },
      ]), []),
    };
  } catch (error) {
    return null;
  }
}

function buildQueryByDiscountCode(discountCode) {
  try {
    if (!discountCode) {
      return [];
    }
    return [
      {
        code: discountCode,
      },
    ];
  } catch (error) {
    return [];
  }
}

async function buildDiscountQueries(query) {
  const { location, products, discountCode } = query;
  const locationConditions = await buildQueryByLocation(location);
  const productConditions = buildQueryByProduct(products);

  const discountCodeConditions = buildQueryByDiscountCode(discountCode);
  const conditions = {
    status: { $eq: Coupon.STATUS_ACTIVE },
    $and: [
      ...locationConditions,
      ...discountCodeConditions,
    ],
  };

  if (productConditions) {
    conditions.$and.push(productConditions);
  }

  if (conditions.$and.length === 0) {
    delete conditions.$and;
  }

  const pipelines = [
    {
      $lookup: {
        from: 'products',
        localField: 'products',
        foreignField: '_id',
        as: 'products',
      },
    },
    {
      $lookup: {
        from: 'councils',
        localField: 'regions',
        foreignField: '_id',
        as: 'regions',
      },
    },
    {
      $match: conditions,
    },
  ];

  return pipelines;
}

module.exports = {
  buildDiscountQueries,
};
