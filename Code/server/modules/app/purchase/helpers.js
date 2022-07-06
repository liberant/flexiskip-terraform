const BinRequest = require('../models/bin-request');
const Product = require('../models/product');
const CollectionRequest = require('../models/collection-request');
const CouncilAddress = require('../models/council-address');
const { validationExc, buildQuery } = require('../../common/helpers');
const { geocoding } = require('../../common/shipping');

async function getProductsByAddress(address) {
  if (!address) {
    throw validationExc('Address is required.');
  }

  const councilAddr = await CouncilAddress.findOne({ fullAddress: address });
  if (!councilAddr) {
    throw validationExc('Address is not allowed for purchasing council product.', 'purchase/invalid_address');
  }

  let products = await Product.find({
    council: councilAddr.council,
    residentialPrice: {
      $lte: 0,
    },
    businessPrice: {
      $lte: 0,
    },
  });

  // exclude purchased product
  let isGCCAvailable = true; // is new request order available ( not if there was no CR for any other delivered GCC bin)

  const excludeds = await Promise.all(products.map(async (product) => {
    const geocodedAddress = await geocoding(address);
    const existingBinRequest = await BinRequest.findOne({
      shippingAddress: { $in:[ geocodedAddress.formatted_address, address ] },
      'items.product': product._id,
      status: {
        $nin: [ BinRequest.STATUS_DRAFT, BinRequest.STATUS_CANCELLED ]
      },
    })

    if (isGCCAvailable && existingBinRequest){
      const collectionRequestExists = await CollectionRequest.countDocuments({
        items: {
          $elemMatch: {
            bin :{
              $in: existingBinRequest.bins,
            }
          }
        },
        status: {
          $in : [
            CollectionRequest.STATUS_REQUESTED,
            CollectionRequest.STATUS_ACCEPTED,
            CollectionRequest.STATUS_IN_PROGRESS,
            CollectionRequest.STATUS_COMPLETED,
            CollectionRequest.STATUS_NOT_COMPLETED,
          ]
        }
      });
      isGCCAvailable = collectionRequestExists > 0;
    }
    return !existingBinRequest;
  }));

  products = products
  .map((product, index) => {
    product = product.toProductObject();
    product.available = excludeds[index];
    product.gccAvailable = isGCCAvailable;
    return product;
  })
  .filter(p => ![Product.STATUS_REMOVED, Product.STATUS_UNAVAILABLE].includes(p.status)); // filter out not available product

  return products;
}

module.exports = {
  getProductsByAddress,
};
