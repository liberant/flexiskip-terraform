const WasteType = require('../../models/waste-type');
const {
  validationExc,
  notFoundExc,
} = require('../../../common/helpers');
const validate = require('validate.js');

async function listItems(req, res, next) {
  try {
    const items = await WasteType.find().sort({ name: 1 });
    return res.json(items);
  } catch (err) {
    return next(err);
  }
}

async function updateItemImage(req, res, next) {
  try {
    const item = await WasteType.findById(req.params.id);
    if (!item) {
      return next(notFoundExc('Item not found'));
    }

    const data = req.body;
    const errors = validate(data, {
      image: {
        presence: { allowEmpty: false },
      },
    }, { format: 'grouped' });
    if (errors) {
      return next(validationExc('Please correct your input.', errors));
    }

    item.image = data.image;
    await item.save();

    return res.json(item);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listItems,
  updateItemImage,
};
