const validate = require('validate.js');
const User = require('../../../models/user');
const Coupon = require('../../../models/coupon');
const Product = require('../../../models/product');
const { validateAustraliaAddress } = require('../../../helpers');

async function validateNumber(value, { orderList }) {
  const orderSameNumber = orderList.filter(order => order.number === value.trim());
  // count themself with other order
  if (orderSameNumber.length <= 1) {
    return Promise.resolve();
  }

  const emailKeys = {};
  orderSameNumber.forEach((order) => { emailKeys[order.email] = order.email; });
  if (Object.keys(emailKeys).length <= 1) {
    return Promise.resolve();
  }
  return Promise.resolve(' is not same customer');
}

async function validateQuantity(quantity) {
  if (Number.isInteger(quantity) && quantity > 0) {
    return Promise.resolve();
  }
  return Promise.resolve('is invalid.');
}

async function validateDiscountCode(code) {
  if (!code) {
    return Promise.resolve();
  }

  if (code.trim() === '') {
    return Promise.resolve();
  }

  const coupon = await Coupon.findOne({ code });
  if (coupon) {
    return Promise.resolve();
  }
  return Promise.resolve('is not exist.');
}

class Item {
  constructor({
    quantity, product,
  }) {
    this.quantity = quantity;
    this.product = product;
  }
}

class Order {
  constructor({
    address, discountCode, customer, items,
  }) {
    this.address = address;
    this.discountCode = discountCode;
    this.customer = customer;
    this.items = items;
  }
}

class ProductOrder {
  constructor(data, isHeader = false) {
    const [number, email, address, discountCode, productCode, quantity] = data;

    this.number = number.trim();
    this.email = email.trim();
    this.address = address.trim();
    this.discountCode = discountCode.trim();
    this.productCode = productCode.trim() === '' ? null : productCode.trim();
    this.quantity = isHeader ? quantity : parseInt(quantity, 10);

    // will assign when validate
    this.customer = null;
    this.product = null;
  }

  async validateProductCode(code) {
    const product = await Product.findOne({ code });
    if (product) {
      this.product = product;
      return Promise.resolve();
    }
    return Promise.resolve('is not exist.');
  }

  async emailNotExists(email) {
    const user = await User.findOne({ email });
    if (user) {
      this.customer = user;
      return Promise.resolve();
    }
    return Promise.resolve('is not exist.');
  }

  async validateModel(orderList) {
    validate.Promise = global.Promise;
    validate.validators.emailNotExists = this.emailNotExists.bind(this);
    validate.validators.validateAustraliaAddress = validateAustraliaAddress;
    validate.validators.validateDiscountCode = validateDiscountCode;
    validate.validators.validateProductCode = this.validateProductCode.bind(this);
    validate.validators.validateQuantity = validateQuantity;
    validate.validators.validateNumber = validateNumber;

    const constraints = {
      number: {
        presence: { allowEmpty: false },
        validateNumber: { orderList },
      },
      email: {
        presence: { allowEmpty: false },
        emailNotExists: true,
      },
      address: {
        presence: { allowEmpty: false },
        validateAustraliaAddress: true,
      },
      discountCode: {
        presence: { allowEmpty: true },
        validateDiscountCode: true,
      },
      productCode: {
        presence: { allowEmpty: false },
        validateProductCode: true,
      },
      quantity: {
        presence: { allowEmpty: false },
        validateQuantity: true,
      },
    };

    try {
      await validate.async(this, constraints, { format: 'grouped' });
      return undefined;
    } catch (error) {
      return error;
    }
  }
}

class CSVRawData {
  constructor() {
    this.data = [];
    this.header = null;
  }

  async validate() {
    const promises = this.data.map(async (da, index) => {
      const error = await da.validateModel(this.data);
      if (error && Object.entries(error).length !== 0) {
        error.line = index + 1;
        return error;
      }
      return undefined;
    });
    const errors = (await Promise.all(promises)).filter(error => error);
    return errors.length > 0 ? errors : null;
  }

  async addProductOrder(row) {
    if (this.header === null) {
      const order = new ProductOrder(row, true);
      this.header = order;
    } else {
      const order = new ProductOrder(row);
      this.data.push(order);
    }
  }

  groupOrderByNumber() {
    const orders = {};
    if (this.data) {
      this.data.forEach((da) => {
        if (orders[da.number]) {
          /** Put item for order */
          orders[da.number].items.push(new Item({
            product: da.product,
            quantity: da.quantity,
          }));
        } else {
          /** Create order */
          orders[da.number] = new Order({
            address: da.address,
            discountCode: da.discountCode,
            customer: da.customer,
            items: [
              new Item({
                product: da.product,
                quantity: da.quantity,
              }),
            ],
          });
        }
      });
    }
    return orders;
  }
}

module.exports = CSVRawData;
