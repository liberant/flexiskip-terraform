/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, clearFields, registerField, change, touch } from 'redux-form';
import moment from 'moment';

// Components
import { Modal, Button, AutoComplete, Alert } from 'antd';
import InputField from '../../../common/components/form/InputField';
import RadioGroup from '../../../common/components/form/RadioGroup';
import CheckBox from '../../../common/components/form/CheckboxField';
import SelectField from '../../../common/components/form/SelectField';
import AutoCompleteInput from '../../../common/components/form/AutoCompleteInput';
import AutoCompleteInputAddress from "../../../common/components/form/AutoCompleteInputAddress";
import AddressField from '../../../common/components/form/AddressField';
import Spinner from '../../../common/components/Spinner';
import DatePickerField from '../../../common/components/form/DatePickerField';
import OneOffDiscountForm from './CreateOneOffDiscount';

// Images
import StripeIcon from '../../../public/images/stripe.svg';

// Constants
import { UserTypeDefs } from '../../../common/constants/commonTypes';
import {
  TYPE_PERCENTAGE,
  TYPE_FLAT,
} from '../../../common/constants/discount-types';

import {
  required,
  validateAddress,
} from "../../../common/components/form/reduxFormComponents";
import httpGetAddressGCC from "../../../common/httpGetAddressGCC";
import httpClient from "../../../common/http";

const PRODUCT_REQUEST_FORM = 'admin/newProductRequest';
const CUSTOMER_TYPES = ['residentialCustomer', 'businessCustomer'];

const styles = {
  spaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  addText: {
    color: '#239dff',
    fontSize: '16px',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  subInput: {
    marginLeft: '20px',
  },
  subLabel: {
    fontSize: '12px',
    color: '#666',
  },
  removeIcon: {
    color: '#f06666',
    marginBottom: '10px',
  },
  summaryBlock: {
    backgroundColor: '#f5fafe',
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '15px',
    margin: '30px',
  },
  priceBlock: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'middle',
    margin: '10px',
  },
  priceText: {
    fontWeight: '600',
    fontSize: '18px',
  },
  paymentLabel: {
    flex: 1,
    padding: '15px',
    margin: '10px',
    borderRadius: '3px',
    boxShadow: '0 4px 8px 0 rgba(199, 205, 210, 0.7)',
    backgroundColor: '#f5fafe',
    fontWeight: '600',
    color: '#1d415d',
    cursor: 'pointer',
  },
  icon: {
    height: '20px',
  },
};

const StripePaymentLabel = () => (
  <div style={styles.paymentLabel}>Credit Card via <img style={styles.icon} src={StripeIcon} alt="stripe" /></div>
);

const InvoicePaymentLabel = () => (
  <div style={styles.paymentLabel}>
    <span className="handel-document" />
    &nbsp;Invoice
  </div>
);

function disabledDate(current) { // must pick 2 business days before hand
  const DateSkipMap = {
    1: 2, // Mon
    2: 2,
    3: 4,
    4: 4,
    5: 4,
    6: 3,
    0: 2,
  }

  let today = moment().startOf('day');
  let nextAvailableDate = today.add(DateSkipMap[today.day()], 'days');

  return current && (
    [0, 6].includes(moment(current).day())
    || moment(current).isSameOrBefore(nextAvailableDate, 'day')
  )
}

function renderCustomerInfo(customer) {
  return (
    <AutoComplete.Option
      key={customer._id}
      value={JSON.stringify(customer)}
      text={`${customer.firstname} ${customer.lastname}`}
    >
      <div style={{ fontSize: "14px", color: "#666", fontWeight: "bold" }}>
        {`${customer.firstname} ${customer.lastname}`}
      </div>
      {customer.roles.includes(UserTypeDefs.businessCustomer.name) && (
        <div style={{ fontSize: "14px", color: "#666" }}>
          {customer.organisation.name}
        </div>
      )}
      <div style={{ fontSize: "14px", color: "#666" }}>{customer.phone}</div>
    </AutoComplete.Option>
  );
}

function renderProductInfo(address) {
  let addParsed = JSON.parse(address);
  return (
    <AutoComplete.Option
      key={addParsed._id}
      value={address}
    >
      <div style={{ fontSize: "14px", color: "#666", fontWeight: "bold" }}>
        {addParsed.full_address}
      </div>
    </AutoComplete.Option>
  );
}

class ProductRequestForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      extraProduct: [],
      isInvoicePayment: false,
      isCreateDiscountModal: false,
      oneOffDiscount: [],
      discountCode: [],
      options: [],
      dataProducts: [],
      errorMatch: "",
      dataDeliveryAddress: null,
      customer: null,
      deliveryAddress: null,
      errorProductAddress: "",
      isGCAddressSearch: false,
      isHiddenErrMsg: false
    };
    this.extraCounter = 0; // increase when add a product
    this.products = [];
    this.oneOffCounter = 0;
    this.discountCodeCounter = 0;
    this.customerId = "";
    this.shippingAddress = "";
    this.councilId = "";
    this.councilDivision = "";
  }

  componentDidMount() {
    this.props.change("enableNotification", true);
  }

  onChangeQuantity = (key, value) => {
    const productKey = key.replace("Quantity", "Name");
    // Find object in product array by product key or quantity key
    const productIndex = this.products.findIndex(
      (prod) => prod.productFormName === productKey
    );
    const quantityIndex = this.products.findIndex(
      (prod) => prod.quantityFormName === key
    );

    if (productIndex !== -1) {
      // user choose product first
      this.products[productIndex].quantityFormName = key;
      this.products[productIndex].quantity = parseInt(value, 10);
    } else if (quantityIndex !== -1) {
      // user change quantity
      this.products[quantityIndex].quantity = parseInt(value, 10);
    } else {
      // create new one
      this.products.push({
        quantityFormName: key,
        quantity: parseInt(value, 10),
      });
    }

    // Update product request draft
    const index = this.products.findIndex(
      (prod) => prod.quantityFormName === key
    );
    if (this.products[index].product) {
      if (this.products[index].quantity > 0) {
        this.updateProductRequestDraft();
      }
    }
  };

  onDeliveryDate = (key, value) => {
    const productKey = key.replace("DeliveryDate", "Name");
    // Find object in product array by product key or quantity key
    const index = this.products.findIndex(
      (prod) => prod.productFormName === productKey
    );

    if (index < 0) return;
    this.products[index].deliveryDate = value && value.startOf('day') || undefined;
    this.updateProductRequestDraft();
  };

  onChangePayment = (value) => {
    if (value === "invoice") {
      this.setState({
        isInvoicePayment: true,
      });
      return;
    }
    this.setState({
      isInvoicePayment: false,
    });
  };

  onChangeShippingAddress = (value) => {
    this.shippingAddress = value;
    this.updateProductRequestDraft();
  };

  getProductPrice = (id, customerType) => {
    const customerPriceField = customerType.replace("Customer", "Price");
    const product = this.props.products.data.find((prod) => prod._id === id);
    if (product) {
      return product[customerPriceField];
    }
    return 0;
  };

  getDiscountTextPlain = (discount) => {
    switch (discount.type) {
      case TYPE_FLAT:
        return `-$${discount.amount} off`;
      case TYPE_PERCENTAGE:
        return `${discount.amount}% off`;
      default:
        return "$0 off";
    }
  };

  addExtraProduct = () => {
    this.setState({
      extraProduct: [
        ...this.state.extraProduct,
        { counter: this.extraCounter },
      ],
    });
    this.extraCounter += 1;
  };

  addDiscountCode = () => {
    this.setState({
      discountCode: [
        ...this.state.discountCode,
        { counter: this.discountCodeCounter },
      ],
    });
    this.discountCodeCounter += 1;
  };

  inputDiscountCode = (e, counter) => {
    const tmpDiscountCode = this.state.discountCode.map((discount) => {
      if (discount.counter === counter) {
        return { ...discount, code: e.target.value };
      }
      return discount;
    });

    this.setState({
      discountCode: tmpDiscountCode,
    });
  };

  updateAllProductPrice = (customerType) => {
    if (this.products.length > 0) {
      this.products = this.products.map((prod) => {
        if (prod.product && prod.quantity) {
          const price = this.getProductPrice(prod._id, customerType);
          prod.price = price;
          prod.total = price * prod.quantity;
        }
        return prod;
      });
      // this.reCalculatePrice();
    }
  };

  selectProduct = async (key, value, position) => {
    let product = JSON.parse(value);

    const gcProduct = product && product.prefix === "gc";
    try {
      if (gcProduct){
        let addressProduct = [];
        const { data } = await httpClient.get(
          `purchase/products?address=${this.shippingAddress}`
        );
        addressProduct = data;
        const dataDeliveryAddress = addressProduct.find(p => p._id === gcProduct._id);
        this.setState({
          dataDeliveryAddress: dataDeliveryAddress,
        });
        if (dataDeliveryAddress) {
          if (!dataDeliveryAddress.available){
            this.setState({
              errorProductAddress: "Product already redeemed at this address.",
            });
          } else {
            this.setState({
              errorProductAddress: "",
            });
          }
        } else {
          this.setState({
            errorProductAddress: "This product is not available at this address.",
          });
        }
      } else {
        this.setState({
          errorProductAddress: "",
        });
      }
    } catch(e) {
      this.setState({
        errorProductAddress: "Problem checking this address",
      });
    }

    let extraProductCounter = key.replace('productName', '');

    product.extraProductCounter = extraProductCounter ? Number(extraProductCounter) : undefined;
    this.state.dataProducts[position] = product;

    this.setState({
      dataProducts: this.state.dataProducts,
    }, () => this.props.getSelectedProduct(this.state.dataProducts));

    const quantityKey = key.replace("Name", "Quantity");
    // Find object in product array by product key or quantity key
    const productIndex = this.products.findIndex(
      (prod) => prod.productFormName === key
    );
    const quantityIndex = this.products.findIndex(
      (prod) => prod.quantityFormName === quantityKey
    );

    if (productIndex !== -1) {
      // change product only
      this.products[productIndex].product = product._id;
      if (!product.partnerDelivered) // clear deliveryDate if change product to non partnerDelivered
        delete this.products[productIndex].deliveryDate;
    } else if (quantityIndex !== -1) {
      // user input quantity first
      this.products[quantityIndex].productFormName = key;
      this.products[quantityIndex].product = product._id;
    } else {
      // create new one
      this.products.push({
        productFormName: key,
        product: product._id,
      });
    }

    // Update product request draft
    const index = this.products.findIndex((prod) => prod.product === product._id);
    if (this.products[index].quantity && this.products[index].quantity > 0) {
      this.updateProductRequestDraft();
    }
  };

  removeExtraProduct = (counter, position) => {
    const tmpExtraProduct = this.state.extraProduct.filter(
      (product) => product.counter !== counter
    );
    this.setState({
      extraProduct: tmpExtraProduct,
      dataProducts: this.state.dataProducts.filter((item, index) => index !== position),
      errorProductAddress: ""
    }, () => this.props.getSelectedProduct(this.state.dataProducts));
    this.props.dispatch(
      clearFields(
        PRODUCT_REQUEST_FORM,
        false,
        false,
        `productName${counter}`,
        `productQuantity${counter}`,
        `productDeliveryDate${counter}`
      )
    );

    // remove from current product list
    this.products = this.products.filter(
      (prod) => prod.productFormName !== `productName${counter}`
    );
    this.updateProductRequestDraft();
  };

  _renderExtraProduct = () => {
    const { products } = this.props;
    const { extraProduct } = this.state;

    return extraProduct.map((product, index) => {
      const dataProduct = this.state.dataProducts.find(p => p && p.extraProductCounter == product.counter);
      return (
          <div
            key={product.counter}
            className="row"
          >
          <div
            style={{ display: "flex", alignItems: "center" }}
          >
              <div className="col-lg-8">
                <Field
                  name={`productName${product.counter}`}
                  options={
                    products.data
                      ? products.data.map((product) => ({
                          label: product.name,
                          value: JSON.stringify(product),
                        }))
                      : []
                  }
                  component={SelectField}
                  styleLabel={styles.subLabel}
                  validate={[required]}
                  onSelect={(value) =>
                    this.selectProduct(
                      `productName${product.counter}`,
                      value,
                      index + 1
                    )
                  }
                />
              </div>
              <div className="col-lg-3">
                <Field
                  name={`productQuantity${product.counter}`}
                  component={InputField}
                  type="number"
                  styleLabel={styles.subLabel}
                  validate={[required]}
                  onChange={(e) =>
                    this.onChangeQuantity(
                      `productQuantity${product.counter}`,
                      e.target.value
                    )
                  }
                />
              </div>
              <div
                className="col-lg-1"
                style={styles.removeIcon}
                onClick={() => this.removeExtraProduct(product.counter, index + 1)}
              >
                <span className="handel-cross" />
              </div>
            </div>

            {
              dataProduct && dataProduct.partnerDelivered ? // skip index 0 for default 1st product field
              (
                <div className="col-lg-8">
                <Field
                name={`productDeliveryDate${product.counter}`}
                placeholder="Delivery Date"
                component={DatePickerField}
                onChange={(date, dateString) =>
                  this.onDeliveryDate(
                    `productDeliveryDate${product.counter}`,
                    dateString
                  )
                }
                disabledDate={disabledDate}
                validate={[required]}
                />
                </div>
              ) : null
            }
          </div>
        )
      });
  };

  removeOneOffDiscount = (counter) => {
    const tmpOneOffDiscounts = this.state.oneOffDiscount.filter(
      (discount) => discount.counter !== counter
    );
    this.setState(
      {
        oneOffDiscount: tmpOneOffDiscounts,
      },
      () => this.updateProductRequestDraft()
    );
    this.props.dispatch(
      clearFields(
        PRODUCT_REQUEST_FORM,
        false,
        false,
        `oneOffDiscount${counter}`
      )
    );
  };

  removeDiscountCode = (counter) => {
    const tmpDiscountCode = this.state.discountCode.filter(
      (discount) => discount.counter !== counter
    );
    this.setState(
      {
        discountCode: tmpDiscountCode,
      },
      () => this.updateProductRequestDraft()
    );
    this.props.dispatch(
      clearFields(PRODUCT_REQUEST_FORM, false, false, `discountCode${counter}`)
    );
  };

  _renderDiscountCode = () => {
    const { discountCode } = this.state;
    return discountCode.map((discount) => (
      <div
        key={discount.counter}
        className="row"
        style={{ display: "flex", alignItems: "center" }}
      >
        <div className="col-lg-11">
          <Field
            name={`discountCode${discount.counter}`}
            component={InputField}
            onBlur={this.updateProductRequestDraft}
            onChange={(e) => this.inputDiscountCode(e, discount.counter)}
          />
        </div>
        <div
          className="col-lg-1"
          style={styles.removeIcon}
          onClick={() => this.removeDiscountCode(discount.counter)}
        >
          <span className="handel-cross" />
        </div>
      </div>
    ));
  };

  _renderOneOffDiscount = () => {
    const { oneOffDiscount } = this.state;
    return oneOffDiscount.map((discount) => (
      <div
        key={discount.counter}
        className="row"
        style={{ display: "flex", alignItems: "center" }}
      >
        <div className="col-lg-11">
          <Field
            name={`oneOffDiscount${discount.counter}`}
            component={InputField}
            viewOnly
          />
        </div>
        <div
          className="col-lg-1"
          style={styles.removeIcon}
          onClick={() => this.removeOneOffDiscount(discount.counter)}
        >
          <span className="handel-cross" />
        </div>
      </div>
    ));
  };

  _renderErrorMessage = () => {
    const { submitErrors } = this.props;
    const errorMsg = [];
    Object.keys(submitErrors).forEach((key) =>
      submitErrors[key].forEach((msg) => {
        errorMsg.push(<div>{msg}</div>);
      })
    );
    return (
      <React.Fragment>
        <Alert message="Error" description={errorMsg} type="error" showIcon />
        <br />
      </React.Fragment>
    );
  };

  handleSearchCustomer = (value) => {
    this.props.getCustomersList({
      limit: 10000,
      page: 1,
      type: CUSTOMER_TYPES,
      s: value,
    });
  };

  handleSelectCustomer = (value) => {
    this.shippingAddress = ""
    let customer = JSON.parse(value)
    this.setState({
      customer
    }, () => this.props.getCustomerInfo(this.state.customer))

    this.setState({
      extraProduct: [],
      dataProducts: [],
      discountCode: [],
      oneOffDiscount: [],
      isInvoicePayment: false,
      isHiddenErrMsg: true,
      deliveryAddress: undefined
    }, () => this.props.getSelectedProduct(this.state.dataProducts));

    this.props.dispatch(
      registerField(PRODUCT_REQUEST_FORM, "customerId", "Field")
    );
    this.props.dispatch(change(PRODUCT_REQUEST_FORM, "customerId", customer._id));
    this.props.dispatch(touch(PRODUCT_REQUEST_FORM, "customerId"));
    this.customerId = customer._id;
    this.updateProductRequestDraft();
    this.props.dispatch(
      clearFields(
        PRODUCT_REQUEST_FORM,
        false,
        false,
        "productName",
        "productQuantity",
        "productDeliveryDate",
        "shippingAddress",
        "courier",
        "paymentType",
        "invoiceCode",
        "comment"
      )
    );
    this.setState({
      isGCAddressSearch: false,
      dataProducts: []
    });
    this.props.getSelectedProduct([]);
    this.products = [];
  };

  handleSearchDeliveryAddress = async (value) => {
    this.setState({
      isGCAddressSearch: true
    });
    if(value && value.length > 0){
      let addressGCC = [];
      const { data } = await httpGetAddressGCC.get(
        `/addresses?query=${value}&limit=10`
      );
      if (data && data.length > 0) {
        data.map((address) => {
          addressGCC.push(JSON.stringify(address));
        });
        this.setState({
          options: addressGCC,
        });
      } else {
        this.setState({
          options: [],
        });
      }
    }else{
      this.setState({
        options: [],
      });
    }
  };

  handleSelectDeliveryAddress = async (value) => {
    const addressParsed = JSON.parse(value)
    this.setState({
      deliveryAddress: addressParsed.full_address,
    });
    if(value){
      this.shippingAddress = addressParsed.full_address;
      this.councilId = addressParsed.customer_no;
      this.councilDivision = addressParsed.class_electoral_division;
      this.updateProductRequestDraft();

      const gcProduct = this.state.dataProducts.find(p => p.prefix === "gc");
      try {
        if (gcProduct){
          let addressProduct = [];
          const { data } = await httpClient.get(
            `purchase/products?address=${addressParsed.full_address}`
          );

          addressProduct = data;
          const dataDeliveryAddress = addressProduct.find(p => p._id === gcProduct._id);
          this.setState({
            dataDeliveryAddress: dataDeliveryAddress,
          });

          if (dataDeliveryAddress) {
            if (!dataDeliveryAddress.available){
              this.setState({
                errorProductAddress: "Product already redeemed at this address.",
              });
            } else {
              this.setState({
                errorProductAddress: "",
              });
            }
          } else {
            this.setState({
              errorProductAddress: "This product is not available at this address.",
            });
          }
        } else {
          this.setState({
            errorProductAddress: "",
          });
        }
      } catch(e) {
        this.setState({
          errorProductAddress: "Problem checking this address",
        });
      }

      if(this.state.customer.prefix === "gc"){
        const responsive = await httpGetAddressGCC.get(
          `/addresses?query=${addressParsed.full_address}&limit=1`
        );
        this.props.handleAddAddress(responsive.data[0]);
      }
    }
    this.setState({
      isGCAddressSearch: false
    });
  };

  handleSubmit = (values) => {
    this.setState({
      isHiddenErrMsg: false
    })
    this.props.handleSubmit(values);
  };

  createOneOffDiscount = (discount) => {
    this.props.change(
      `oneOffDiscount${this.oneOffCounter}`,
      this.getDiscountTextPlain(discount)
    );
    this.setState(
      {
        isCreateDiscountModal: false,
        oneOffDiscount: [
          ...this.state.oneOffDiscount,
          { ...discount, counter: this.oneOffCounter },
        ],
      },
      () => this.updateProductRequestDraft()
    );
    this.oneOffCounter += 1;
  };

  updateProductRequestDraft = () => {
    if (
      this.products.length > 0 &&
      this.shippingAddress !== "" &&
      this.customerId !== ""
    ) {
      const tmpProductRequestDraft = this.props.productRequestDraft;
      tmpProductRequestDraft.customerId = this.customerId;
      tmpProductRequestDraft.items = this.products;
      tmpProductRequestDraft.discountCodes = this.state.discountCode.map(
        (discount) => discount.code
      );
      tmpProductRequestDraft.oneOffDiscounts = this.state.oneOffDiscount;
      tmpProductRequestDraft.shippingAddress = this.shippingAddress;
      // Save value for submit due to backend dont save it
      this.props.change("oneOffDiscounts", this.state.oneOffDiscount);
      this.props.updateProductRequestDraft(tmpProductRequestDraft);
    }
  };

  render() {
    const {
      products,
      accounts,
      isSubmitting,
      productRequestDraft,
      submitErrors,
    } = this.props;
    const { isInvoicePayment, isCreateDiscountModal,isHiddenErrMsg } = this.state;

    const hasPartnerDeliveredProduct = this.state.dataProducts.find(item => item.partnerDelivered);

    const gst = productRequestDraft.gst
      ? parseFloat(productRequestDraft.gst).toFixed(2)
      : 0;
    const subTotal = productRequestDraft.subTotal
      ? parseFloat(productRequestDraft.subTotal).toFixed(2)
      : 0;
    const discount = productRequestDraft.discount
      ? parseFloat(productRequestDraft.discount).toFixed(2)
      : 0;
    const total = productRequestDraft.total
      ? parseFloat(productRequestDraft.total).toFixed(2)
      : 0;
    return (
      <form onSubmit={(values) => this.handleSubmit(values)}>
        <Modal
          width="400px"
          title="Create Discount"
          visible={isCreateDiscountModal}
          footer={null}
          className="w-modal"
          centered
          onCancel={() => this.setState({ isCreateDiscountModal: false })}
        >
          {
            isCreateDiscountModal ? <OneOffDiscountForm onSubmit={this.createOneOffDiscount} /> : null
          }
        </Modal>
        <div className="w-form">
          <div className="row" style={styles.spaceBetween}>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-5">
              <Field
                name="customer"
                label="Customer"
                required
                dataSource={accounts.customers.data.map(renderCustomerInfo)}
                onSearch={this.handleSearchCustomer}
                onSelect={this.handleSelectCustomer}
                // styleLabel={styles.subLabel}
                component={AutoCompleteInput}
                validate={[required]}
                optionLabelProp="text"
                onBlur={this.updateProductRequestDraft}
              />
              <label className="control-label">
                Product <span style={{ color: "#a94442" }}>*</span>
              </label>
              <div className="row">
                <div className="col-lg-8">
                  <Field
                    name="productName"
                    label="Name"
                    options={
                      products.data
                        ? products.data.map((product) => {
                            if (
                              this.state.customer &&
                              this.state.customer.prefix === "gc"
                            ) {
                              return {
                                label: product.name,
                                value: JSON.stringify(product),
                              };
                            } else {
                              if (!product.council) {
                                return {
                                  label: product.name,
                                  value: JSON.stringify(product),
                                };
                              }
                            }
                          })
                        : []
                    }
                    component={SelectField}
                    styleLabel={styles.subLabel}
                    validate={[required]}
                    onSelect={(value) =>
                      this.selectProduct("productName", value, 0)
                    }
                  />
                </div>
                <div className="col-lg-3">
                  <Field
                    name="productQuantity"
                    label="Quantity"
                    component={InputField}
                    type="number"
                    styleLabel={styles.subLabel}
                    validate={[required]}
                    onChange={(e) =>
                      this.onChangeQuantity("productQuantity", e.target.value)
                    }
                  />
                </div>

                {
                  this.state.dataProducts[0] && this.state.dataProducts[0].partnerDelivered ?
                    (
                      <div className="col-lg-8">
                        <Field
                          name="productDeliveryDate"
                          onChange={(date, dateString) =>
                            this.onDeliveryDate("productDeliveryDate", dateString)
                          }
                          placeholder="Delivery Date"
                          component={DatePickerField}
                          disabledDate={disabledDate}
                          validate={[required]}
                        />
                      </div>
                    ) : null
                }

              </div>
              {this._renderExtraProduct()}
              {this.state.customer && this.state.customer.prefix === "gc" ? (
                <React.Fragment>
                  {this.state.dataProducts.filter((item) => item.council)
                    .length < 1 && (
                    <React.Fragment>
                      <div
                        style={styles.addText}
                        onClick={this.addExtraProduct}
                      >
                        <span className="handel-plus" /> Add Product
                      </div>
                    </React.Fragment>
                  )}
                </React.Fragment>
              ) : (
                <div style={styles.addText} onClick={this.addExtraProduct}>
                  <span className="handel-plus" /> Add Product
                </div>
              )}

              {this.state.customer && this.state.customer.prefix === "gc" && !hasPartnerDeliveredProduct ? (
                <AutoCompleteInputAddress
                  name="shippingAddress"
                  label="Delivery Address"
                  required
                  dataSource={this.state.options.map(renderProductInfo)}
                  onSearch={this.handleSearchDeliveryAddress}
                  onSelect={this.handleSelectDeliveryAddress}
                  onChange={(e) => {
                    if (e.length < 1) {
                      this.setState({
                        errorProductAddress: "This field can't be blank",
                      });
                    } else {
                      this.setState({
                        errorProductAddress: "",
                      });
                    }
                    this.setState({
                      deliveryAddress: e,
                    });
                  }}
                  value={this.state.deliveryAddress}
                  errorProductAddress={this.state.errorProductAddress}
                />
              ) : (
                <Field
                  name="shippingAddress"
                  label="Delivery Address"
                  required
                  component={AddressField}
                  validate={[required, validateAddress]}
                  onSelectAddress={this.onChangeShippingAddress}
                />
              )}

              {
                !hasPartnerDeliveredProduct ? (
                  <Field
                    component={RadioGroup}
                    name="courier"
                    required
                    label="Delivery Method"
                    options={[
                      { title: "Fastway", value: "Fastway" },
                      { title: "Other", value: "Other" },
                    ]}
                    validate={[required]}
                  />
                ) : null
              }

              <Field
                component={RadioGroup}
                name="paymentType"
                required
                vertical
                label="Payment Type"
                options={[
                  { title: StripePaymentLabel, value: "stripe" },
                  { title: InvoicePaymentLabel, value: "invoice" },
                ]}
                validate={[required]}
                onChangeSelection={this.onChangePayment}
              />
              {isInvoicePayment && isInvoicePayment ?
                <Field
                  name="invoiceCode"
                  label="Purchase Order No."
                  required
                  style={styles.subInput}
                  styleLabel={styles.subLabel}
                  component={isInvoicePayment ? InputField : null}
                  validate={[required]}
                />
               : null}

              <label className="control-label">Notification</label>
              <Field
                name="enableNotification"
                label="Send In-App notification"
                component={CheckBox}
              />
            </div>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-5">
              <Field
                name="comment"
                label="Comment"
                required
                component={InputField}
                validate={[required]}
              />

              <label className="control-label">Discount Code (Optional)</label>
              {this._renderDiscountCode()}
              <div
                style={styles.addText}
                onClick={() => this.addDiscountCode()}
              >
                <span className="handel-plus" /> Add Discount Code
              </div>
              <label className="control-label">
                One-Off Discount (Optional)
              </label>
              {this._renderOneOffDiscount()}
              <div
                style={styles.addText}
                onClick={() => this.setState({ isCreateDiscountModal: true })}
              >
                <span className="handel-plus" /> Add One-off Discount
              </div>
            </div>
          </div>
          <div className="row" style={styles.spaceBetween}>
            <div style={styles.summaryBlock}>
              <div style={styles.priceBlock}>
                <div>GST</div>
                <div style={styles.priceText}>{`$${gst}`}</div>
              </div>
              <div style={styles.priceBlock}>
                <div>Subtotal</div>
                <div style={styles.priceText}>{`$${subTotal}`}</div>
              </div>
              <div style={styles.priceBlock}>
                <div>Discount</div>
                <div style={styles.priceText}>{`- $${discount}`}</div>
              </div>
              <div style={styles.priceBlock}>
                <div style={{ fontWeight: "600" }}>TOTAL</div>
                <div
                  style={{ ...styles.priceText, color: "#00b5e2" }}
                >{`$${total}`}</div>
              </div>
            </div>
          </div>
          <div className="row" style={styles.spaceBetween}>
            {submitErrors && (
              <div className="col-xs-10 col-sm-10 col-md-6 col-lg-6">
                { isHiddenErrMsg ? null :  this._renderErrorMessage()}
              </div>
            )}
          </div>
          <div className="row" style={styles.spaceBetween}>
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-5">
              {isSubmitting ? (
                <Spinner />
              ) : (
                <Button
                  size="large"
                  type="primary"
                  loading={false}
                  htmlType="submit"
                  block
                  disabled={this.state.errorMatch.length > 0 || this.state.errorProductAddress.length > 0 || this.state.isGCAddressSearch}
                >
                  SUBMIT
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
    );
  }
}

ProductRequestForm.propTypes = {
  products: PropTypes.object.isRequired,
  getCustomersList: PropTypes.func.isRequired,
  accounts: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  discounts: PropTypes.object.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  updateProductRequestDraft: PropTypes.func.isRequired,
  productRequestDraft: PropTypes.object.isRequired,
  submitErrors: PropTypes.object,
};

ProductRequestForm.defaultProps = {
  submitErrors: {},
};

export default reduxForm({
  form: PRODUCT_REQUEST_FORM,
})(ProductRequestForm);
