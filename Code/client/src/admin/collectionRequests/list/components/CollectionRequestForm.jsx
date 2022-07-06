import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import './styles.css'
import {
  Field,
  reduxForm,
  clearFields,
  registerField,
  change,
  touch,
} from "redux-form";

import {
  useStripe,
  useElements,
  CardCvcElement,
  CardNumberElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";

// Components
import { Button, AutoComplete, message, notification, Input } from "antd";
import AutoCompleteInput from "../../../../common/components/form/AutoCompleteInput";
import AutoCompleteInputAnt from "../../../../common/components/form/AutoCompleteInputAnt";
import Spinner from "../../../../common/components/Spinner";

import {
  required,
} from "../../../../common/components/form/reduxFormComponents";
import httpGetAddressGCC from '../../../../common/httpGetAddressGCC'
import httpClient from "../../../../common/http";

const styles = {
  reminderIcon: {
    fontSize: "3em",
    color: "rgb(243, 92, 93)",
    marginBottom: "20px",
    display: "block",
  },
  reminderText: {
    display: "block",
    fontSize: "24px",
    fontWeight: "bold",
    lineHeight: "1",
    letterSpacing: "-1px",
    color: "rgb(243, 92, 93)",
  },
  spaceBetween: {
    display: "flex",
    justifyContent: "space-between",
  },
  addText: {
    color: "#239dff",
    fontSize: "16px",
    cursor: "pointer",
    marginBottom: "20px",
  },
  subInput: {
    marginLeft: "20px",
  },
  subLabel: {
    fontSize: "12px",
    color: "#666",
  },
  removeIcon: {
    color: "#f06666",
    marginBottom: "10px",
  },
  summaryBlock: {
    backgroundColor: "#f5fafe",
    display: "flex",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "15px",
    margin: "30px",
  },
  priceBlock: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "middle",
    margin: "10px",
  },
  priceText: {
    fontWeight: "600",
    fontSize: "18px",
  },
  paymentLabel: {
    flex: 1,
    padding: "15px",
    margin: "10px",
    borderRadius: "3px",
    boxShadow: "0 4px 8px 0 rgba(199, 205, 210, 0.7)",
    backgroundColor: "#f5fafe",
    fontWeight: "600",
    color: "#1d415d",
    cursor: "pointer",
  },
  icon: {
    height: "20px",
  },
  containerCardProduct: {
    margin: "10px 0px",
    width: "400px",
    height: "auto",
    border: "1px solid lightslategray",
    boxShadow: "2px 2px lightsteelblue",
    display: "flex",
    borderRadius: "8px",
    cursor: "pointer",
  },
  containerCardProductSelected: {
    margin: "10px 0px",
    width: "400px",
    height: "auto",
    border: "1px solid lightslategray",
    boxShadow: "2px 2px lightsteelblue",
    display: "flex",
    borderRadius: "8px",
    backgroundColor: "lightblue",
    cursor: "pointer",
  },
  containerCardProductImage: {
    marginTop: "10px",
    width: "180px",
    textAlign: "center",
  },
  containerCardProductInfor: {},
  containerCardProductSubInfor: {
    marginTop: "5px",
  },
  containerCardProductSubInforLabel: {
    color: "#00b5e2",
    fontSize: "16px",
    fontWeight: "700",
    marginBottom: "0px",
  },
};

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "black",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "24px",
      "::placeholder": {
        color: "#999",
      },
      backgroundColor: "#f6f6f6",
    },
    invalid: {
      color: "#FF0000",
      iconColor: "#fa755a",
    },
  },
};
const inputStyles = {
  display: 'block',
  marginBottom: '10px',
  border: 'none',
  color: "black",
  fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
  fontSmoothing: "antialiased",
  fontSize: "24px",
  "::placeholder": {
    color: "#999",
  },
  backgroundColor: "#f6f6f6",
};

notification.config({
  duration: 1,
});


const CUSTOMER_TYPES = ["residentialCustomer", "businessCustomer"];
const COLLECTION_REQUEST_FORM = "admin/newCollectionRequest";

const CollectionRequestForm = (props) => {
  const [customerId, setCustomerId] = useState("")
  const [dataDeliveryAddress, setDataDeliveryAddress] = useState("");
  const [dataProductDelivered, setDataProductDelivered] = useState([]);
  const [selectProductDelivered, setSelectProductDelivered] = useState(null);
  const [dataAddressGCC, setDataAddressGCC] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorProductAddress, setErrorProductAddress] = useState(null);
  const [options, setOptions] = useState([])
  const [errorMatch,setErrorMatch] = useState('');
  const [cardHolderName ,setCardHolderName] = useState('')
  const [showFormPaymentFlag, setShowFormPaymentFlag] = useState(false);
  const { getCustomersList, accounts, closeModal } = props;
  const stripe = useStripe();
  const elements = useElements();

  useEffect( async () =>{
    handleSearchCustomer();
  },[])

  useEffect( async () =>{
    if(customerId){
      try{
        const { data } = await httpClient.get(
          `/admin/purchase/delivered-bins?customerId=${customerId}`
        );

        if (data && data.length > 0) {
          setDataProductDelivered(data);
          setErrorMatch("");
        } else {
          setDataProductDelivered([]);
          setErrorMatch(
            "The selected user doesn't have any FLEXiSKiPs ready for collection"
          );
        }
      }catch(e){
        console.log(e)
      }
    }
  },[customerId])

  useEffect(async () => {
    if (selectProductDelivered && selectProductDelivered._id) {
      try {
        const { data } = await httpGetAddressGCC.get(
          `/addresses?query=${selectProductDelivered.shippingAddress}&limit=10`
        );
        setDataAddressGCC(data[0]);
      } catch (error) {
        message.error(error.message)
      }
    }
  }, [selectProductDelivered]);

  const handleSearchCustomer = (value) => {
    getCustomersList({
      limit: 10000,
      page: 1,
      type: CUSTOMER_TYPES,
      s: value,
      prefix: 'gc' // GC customer only
    });
  };

  const handleSelectCustomer = (value) => {
    setCustomerId(value)
    setShowFormPaymentFlag(false)
    setSelectProductDelivered(null)
    setDataDeliveryAddress("");
  };

  const renderCustomerInfo = (customer) => {
    return (
      <AutoComplete.Option
        key={customer._id}
        value={customer._id}
        text={`${customer.firstname} ${customer.lastname}`}
      >
        <div style={{ fontSize: "14px", color: "#666", fontWeight: "bold" }}>
          {`${customer.firstname} ${customer.lastname}`}
        </div>

        <div style={{ fontSize: "14px", color: "#666" }}>{customer.phone}</div>
      </AutoComplete.Option>
    );
  }

  const handleSearchDeliveryAddress = async (value) => {
    if(value && value.length > 0){
      let addressGCC = [];
      const { data } = await httpGetAddressGCC.get(
        `/addresses?query=${value}&limit=10`
      );
      if (data && data.length > 0) {
        data.map((address) => {
          addressGCC.push(address.full_address);
        });
        setOptions(addressGCC);
      }
    }
  };

  const handleSelectDeliveryAddress = async (value) => {
    if(value && value.length > 0){
      try {
        const { data } = await httpGetAddressGCC.get(
          `/addresses?query=${value}&limit=10`
        );
        setDataAddressGCC(data[0]);
      } catch (error) {
        message.error(error.message)
      }
      setDataDeliveryAddress(value)
    }else{
      setErrorProductAddress("This field can't be blank")
    }
  }

  const handleClickProductDelivered = (data) =>{
    setOptions(
      (prev) => {
        if(prev.indexOf(data.shippingAddress) === -1){
          return [data.shippingAddress, ...prev];
        }else{
          return ""
        }

      } );
    setDataDeliveryAddress(data.shippingAddress);
    setSelectProductDelivered(data)
    setDataAddressGCC(null)
    setShowFormPaymentFlag(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (selectProductDelivered.isGCExpired){
      await httpClient
        .get(`/admin/res-customers/${customerId}/gc-cr-payment-intent-secret`)
        .then(async function (response) {
          if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
          }
          const cardNumberElement = elements.getElement(CardNumberElement);
          const cardExpiryElement = elements.getElement(CardExpiryElement);
          const cardCvcElement = elements.getElement(CardCvcElement);

          if (
            cardNumberElement._implementation._empty ||
            cardExpiryElement._implementation._empty ||
            cardCvcElement._implementation._empty ||
            cardHolderName == ""
          ) {
            notification.warning({
              message: "Warning",
              description:
                "Please enter payment information fully before submit!",
            });
            setIsLoading(false);
          } else {
            const result = await stripe.confirmCardPayment(
              response.data.clientSecret,
              {
                payment_method: {
                  card: elements.getElement(
                    CardCvcElement,
                    CardExpiryElement,
                    CardNumberElement
                  ),
                  billing_details: {
                    name: `${
                      cardHolderName.length > 0 ? cardHolderName : "Customer"
                    }`,
                  }
                },
                setup_future_usage: "off_session",
              }
            );
            if (result.error) {
              setIsLoading(false)
              notification.error({
                message: "Failed",
                description: result.error.message,
              });
            } else {
              let dataPost;
                  if (dataAddressGCC) {
                    dataPost = {
                      customerId: customerId,
                      qrCode: selectProductDelivered.code,
                      addressCouncilId: dataAddressGCC.customer_no,
                      addressDivision: dataAddressGCC.class_electoral_division,
                      address: dataAddressGCC.full_address,
                      paymentIntentId: result.paymentIntent.id,
                    };
                  }else{
                    dataPost = {
                      customerId: customerId,
                      qrCode: selectProductDelivered.code,
                      addressCouncilId: selectProductDelivered.shippingAddressCouncilId,
                      addressDivision: selectProductDelivered.shippingAddressDivision,
                      address: selectProductDelivered.shippingAddress,
                      paymentIntentId: result.paymentIntent.id,
                    };
                  }
                  try {
                    await httpClient.post(`/admin/purchase/collection-requests`, dataPost);
                    setIsLoading(false);
                    props.dispatch(change(COLLECTION_REQUEST_FORM, "customerId", ""));
                    props.dispatch(change(COLLECTION_REQUEST_FORM, "customer", ""));
                    setDataDeliveryAddress("");
                    setDataProductDelivered([]);
                    setSelectProductDelivered(null);
                    message.success("Send Request Success!");
                    closeModal();
                  } catch (e) {
                    message.success(e.message);
                    setIsLoading(false);
                  }
            }
          }
        })
        .catch(function (error) {
          console.log(error);
          notification.error({
            message: "Failed",
            description: error.response.data.message
          });
        });
    }else{
      let dataPost;
      if (dataAddressGCC) {
        dataPost = {
          customerId: customerId,
          qrCode: selectProductDelivered.code,
          addressCouncilId: dataAddressGCC.customer_no,
          addressDivision: dataAddressGCC.class_electoral_division,
          address: dataAddressGCC.full_address,
        };
      } else {
        dataPost = {
          customerId: customerId,
          qrCode: selectProductDelivered.code,
          addressCouncilId: selectProductDelivered.shippingAddressCouncilId,
          addressDivision: selectProductDelivered.shippingAddressDivision,
          address: selectProductDelivered.shippingAddress,
        };
      }
      try {
        await httpClient.post(`/admin/purchase/collection-requests`, dataPost);
        setIsLoading(false);
        props.dispatch(change(COLLECTION_REQUEST_FORM, "customerId", ""));
        props.dispatch(change(COLLECTION_REQUEST_FORM, "customer", ""));
        setDataDeliveryAddress("");
        setDataProductDelivered([]);
        setSelectProductDelivered(null);
        message.success("Send Request Success!");
        closeModal();
      } catch (e) {
        message.success(e.message);
        setIsLoading(false);
      }
    }

  };
  return (
    <form onSubmit={(values) => handleSubmit(values)}>
      <div className="w-form">
        <div className="row" style={styles.spaceBetween}>
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-5">
            <Field
              name="customer"
              label="Customer ( GCC only )"
              required
              dataSource={accounts.customers.data.map(renderCustomerInfo)}
              onSearch={handleSearchCustomer}
              onSelect={handleSelectCustomer}
              component={AutoCompleteInput}
              validate={[required]}
              optionLabelProp="text"
              errorMatch={errorMatch}
            />
            <AutoCompleteInputAnt
              name="shippingAddress"
              label="Delivery Address"
              required
              dataSource={options}
              onSearch={handleSearchDeliveryAddress}
              onSelect={handleSelectDeliveryAddress}
              onChange={(e) => {
                if (e.length < 1) {
                  setErrorProductAddress("This field can't be blank");
                } else {
                  setErrorProductAddress(null);
                }
                setDataDeliveryAddress(e);
              }}
              value={dataDeliveryAddress}
              errorProductAddress={errorProductAddress}
            />
            {showFormPaymentFlag ? selectProductDelivered &&
            selectProductDelivered.isGCExpired ? (
                <div className="customer-info__payment">
                  <p
                    style={{
                      fontWeight: "600",
                      margin: "40px 0 10px 0",
                      fontSize: "18px",
                      letterSpacing: "1px",
                      color: "#239dff",
                    }}
                  >{`Add customer payment information`}</p>
                  <div className="w-form">
                    <div className="row" style={{ fontSize: 14 }}>
                      <div id="card-element" className="col-md-12">
                        <div className="row">
                          <div
                            style={{ height: "65px" }}
                            className="col-xs-12 col-sm-12 col-md-12 col-lg-12"
                          >
                            <label className="control-label">
                              Card Number{" "}
                              <span style={{ color: "rgb(169, 68, 66)" }}>*</span>
                            </label>

                            <CardNumberElement options={CARD_ELEMENT_OPTIONS} />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <label className="control-label">
                              Card Holder{" "}
                              <span style={{ color: "rgb(169, 68, 66)" }}>*</span>
                            </label>
                            <Input
                              className="input__card-holder-name"
                              maxLength={15}
                              placeholder="CARD HOLDER"
                              style={inputStyles}
                              onChange={(e) => setCardHolderName(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="row" style={{ marginBottom: "20px" }}>
                          <div
                            style={{ height: "65px" }}
                            className="col-xs-6 col-sm-6 col-md-6 col-lg-6"
                          >
                            <label className="control-label">
                              Expiry Date{" "}
                              <span style={{ color: "rgb(169, 68, 66)" }}>*</span>
                            </label>
                            <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
                          </div>
                          <div
                            style={{ height: "65px" }}
                            className="col-xs-6 col-sm-6 col-md-6 col-lg-6"
                          >
                            <label className="control-label">
                              CVC{" "}
                              <span style={{ color: "rgb(169, 68, 66)" }}>*</span>
                            </label>
                            <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null : null}
          </div>
          <div
            className="col-xs-12 col-sm-12 col-md-12 col-lg-5"
            style={ dataProductDelivered && dataProductDelivered.length > 3 ? {
              maxHeight: "500px",
              overflowY: "scroll",
            } : {}}
          >
            {dataProductDelivered.length > 0 &&
              dataProductDelivered.map((item, index) => {
                if (
                  selectProductDelivered &&
                  item &&
                  selectProductDelivered._id === item._id
                ) {
                  return (
                    <div
                      key={index}
                      style={styles.containerCardProductSelected}
                      onClick={() => handleClickProductDelivered(item)}
                    >
                      <div style={styles.containerCardProductImage}>
                        <img
                          src={item.images[0]}
                          width="150px"
                          height="100px"
                        />
                      </div>
                      <div style={styles.containerCardProductInfor}>
                        <div style={styles.containerCardProductSubInfor}>
                          <p style={styles.containerCardProductSubInforLabel}>
                            QR:
                          </p>
                          <p style={{ fontSize: "13px", fontWeight: "600" }}>
                            {item.code}
                          </p>
                        </div>
                        <div style={styles.containerCardProductSubInfor}>
                          <p style={styles.containerCardProductSubInforLabel}>
                            Product:
                          </p>
                          <p style={{ fontSize: "13px", fontWeight: "600" }}>
                            {item.name}
                          </p>
                        </div>
                        {item && item.isGCExpired ? (
                          <div style={styles.containerCardProductSubInfor}>
                            <p style={styles.containerCardProductSubInforLabel}>
                              Price:
                            </p>
                            <p style={{ fontSize: "13px", fontWeight: "600" }}>
                              ${item.price} inc. GST
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={index}
                      style={styles.containerCardProduct}
                      onClick={() => handleClickProductDelivered(item)}
                    >
                      <div style={styles.containerCardProductImage}>
                        <img
                          src={item.images[0]}
                          width="150px"
                          height="100px"
                        />
                      </div>
                      <div style={styles.containerCardProductInfor}>
                        <div style={styles.containerCardProductSubInfor}>
                          <p style={styles.containerCardProductSubInforLabel}>
                            QR:
                          </p>
                          <p style={{ fontSize: "13px", fontWeight: "600" }}>
                            {item.code}
                          </p>
                        </div>
                        <div style={styles.containerCardProductSubInfor}>
                          <p style={styles.containerCardProductSubInforLabel}>
                            Product:
                          </p>
                          <p style={{ fontSize: "13px", fontWeight: "600" }}>
                            {item.name}
                          </p>
                        </div>
                        {item && item.isGCExpired ? (
                          <div style={styles.containerCardProductSubInfor}>
                            <p style={styles.containerCardProductSubInforLabel}>
                              Price:
                            </p>
                            <p style={{ fontSize: "13px", fontWeight: "600" }}>
                              ${item.price} inc. GST
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                }
              })}
          </div>
        </div>
        {
          showFormPaymentFlag ?
              selectProductDelivered && selectProductDelivered.isGCExpired ? <div className="row" style={styles.spaceBetween}>
          <div className="warning">
            <span className="warning__icon">
              <i className="handel-notify" style={styles.reminderIcon}></i>
            </span>
            <span
              style={styles.reminderText}
            >{`IMPORTANT - Please pause the call in Zendesk NOW before collecting the customers credit card details. Make sure you reactivate the call recording once card details are approved`}</span>
          </div>
        </div> : null : null
        }

        <div className="row" style={styles.spaceBetween}>
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-5">
            {isLoading ? (
              <Spinner />
            ) : (
              <Button
                style={{ display: "inline-block", marginTop: "30px" }}
                size="large"
                type="primary"
                loading={false}
                htmlType="submit"
                block
                disabled={
                  errorMatch.length > 0 ||
                  dataDeliveryAddress.length < 1 ||
                  !customerId ||
                  !selectProductDelivered
                }
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

CollectionRequestForm.propTypes = {
  getCustomersList: PropTypes.func.isRequired,
  accounts: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default reduxForm({
  form: COLLECTION_REQUEST_FORM,
})(CollectionRequestForm);
