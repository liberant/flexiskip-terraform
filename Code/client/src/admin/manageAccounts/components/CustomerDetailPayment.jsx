import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Field } from "redux-form";
import PropTypes from "prop-types";
import InputFieldCard from "../../../common/components/form/InputFieldCard";
import { connect } from "react-redux";
import SimpleSaveButtons from "./SimpleSaveButtons";
import "./styles.css";
import {
  useStripe,
  useElements,
  CardCvcElement,
  CardNumberElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import httpClient from "../../../common/http";
import { Modal, Button, notification } from "antd";
import { withRouter } from "react-router-dom";
import { getCustomerDetailsById } from "../actions";

const modalStyles = {
  header: {
    width: "100%",
  },
  box: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: 600,
    minHeight: 450,
  },
  checkIcon: {
    fontSize: 64,
    color: "#239DFF",
  },
  title: {
    color: "#239DFF",
    fontWeight: 600,
    marginBottom: 50,
  },
  subTitle: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 133,
  },
  button: {
    display: "inline-block",
    height: 44,
    fontSize: 14,
    padding: "10px 15px",
    border: "0px solid #239DFF",
    color: "#FFFFFF",
    backgroundColor: "#239DFF",
    cursor: "pointer",
    borderRadius: "3px",
    width: 200,
    marginBottom: 10,
  },
  link: {
    color: "#239DFF",
    fontSize: 16,
    fontWeight: "600",
    cursor: "pointer",
  },
};

const modalSuccessContent = {
  title: "Payment Detail Activated",
  subTitle: "The current user(s) has been payment detail activated",
  buttonText: "OK",
  bottomTitle: "",
  styles: {
    modal: { top: 430 },
    icon: { fontSize: 64, color: "#239dff" },
    bottomTitle: {
      display: "none",
    },
  },
  isSuccess: true,
  iconSpanName: "handel-check-circle",
};

const modalFailContent = {
  title: "Payment Detail Failed",
  buttonText: "OK",
  bottomTitle: "",
  styles: {
    modal: { top: 430 },
    icon: { fontSize: 64, color: "#f06666" },
    title: {
      color: "#f06666",
    },
    buttonText: {
      color: "white",
      backgroundColor: "#f06666",
    },
    bottomTitle: {
      display: "none",
    },
  },
  isSuccess: false,
  iconSpanName: "handel-notify",
};

const required = (value) => (value ? undefined : "Required");

const CustomerDetailPayment = (props) => {
  // console.log('props :>> ', props);
  // console.log('payment')
  const [inputValues, setInputValues] = useState({
    cardExpiry: "",
    cardCVC: "",
    cardNumber: "",
    cardHolderName: "",
  });
  const userType = "res-customers";
  const [isShowModal, setIsShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [resultPayment, setResultPayment] = useState(false);
  const [stateSubmit, setStateSubmit] = useState(false);
  const {
    isEdit,
    isSaving,
    data,
    dataCustomer,
    isShowPaymentDetail,
    isUpdateCustomer,
    closeModal,
    getCustomerDetailsById,
    onHandleCloseModal,
  } = props;

  const stripe = useStripe();
  const elements = useElements();

  const handleChange = (e) => {
    let { name, value } = e.target;

    setInputValues({ ...inputValues, [name]: value });
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

  notification.config({
    duration: 1,
  });

  const handleSubmitPayment = async () => {
    setStateSubmit(true);

    await httpClient
      .get(
        `/admin/res-customers/${
          isUpdateCustomer ? data._id : dataCustomer._id
        }/setup-intent-secret`
      )
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
          inputValues.cardHolderName == ""
        ) {
          notification.warning({
            message: "Warning",
            description:
              "Please enter payment information fully before submit!",
          });
        } else {
          const result = await stripe.confirmCardSetup(
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
                    inputValues.cardHolderName.length > 0
                      ? inputValues.cardHolderName
                      : dataCustomer.name
                  }`,
                },
                metadata: {
                  trigger: "gcc-violation-charge",
                },
              },
            }
          );

          if (!isUpdateCustomer) {
            if (result.error) {
              setModalContent(modalFailContent);
              setIsShowModal(true);
            } else {
              setModalContent(modalSuccessContent);
              setIsShowModal(true);
            }
          } else {
            if (result.error) {
              notification.error({
                message: "Failed",
                description: result.error.message,
              });
            } else {
              notification.success({
                message: "Success",
                description: "Add customer payment information successfully!",
              });
              getCustomerDetailsById({
                userType,
                url: "res-customers",
                uid: data._id,
              });
            }
          }
        }
        // console.log('response :>> ', response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const createMarkup = (str) => {
    return { __html: str };
  };

  return (
    <div
      style={
        isUpdateCustomer
          ? { marginTop: "0", padding: "0 10px" }
          : { marginTop: "50px" }
      }
    >
      <form>
        <div className="row">
          <div
            className={
              isUpdateCustomer ? "" : "col-xs-12 col-sm-6 col-md-6 col-lg-6"
            }
          >
            <div className="w-form">
              <div className="row" style={{ fontSize: 14 }}>
                {isUpdateCustomer ? (
                  ""
                ) : (
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-4"></div>
                )}
                <div
                  id="card-element"
                  className={
                    isUpdateCustomer
                      ? "col-lg-12"
                      : "col-xs-12 col-sm-12 col-md-12 col-lg-8"
                  }
                >
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
                      <Field
                        name="cardHolderName"
                        id="cardHolderName"
                        label="Card Holder"
                        placeholder="CARD HOLDER"
                        component={InputFieldCard}
                        viewOnly={!isEdit}
                        // required
                        validate={stateSubmit ? required : ""}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </div>
                  <div
                    className="row"
                    style={
                      isUpdateCustomer
                        ? { marginBottom: "20px" }
                        : { marginBottom: "50px" }
                    }
                  >
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
                        CVC <span style={{ color: "rgb(169, 68, 66)" }}>*</span>
                      </label>
                      <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <SimpleSaveButtons
            isNewResidentialPayment="true"
            handleSubmit={handleSubmitPayment}
            isSaving={isSaving}
            dataCustomer={dataCustomer}
            isShowPaymentDetail={isShowPaymentDetail}
            isUpdateCustomer={isUpdateCustomer}
            handleCloseModal={onHandleCloseModal}
            // handleShow={handleShowSang}
            // closeModal={onCloseModal}
          />
        </div>
      </form>
      <Modal
        visible={isShowModal}
        footer={null}
        style={{ ...modalStyles.box }}
        closable={false}
      >
        {modalContent && modalContent.styles ? (
          <div style={modalStyles.box}>
            <div>
              <span style={modalContent.styles.icon}>
                <span className={modalContent.iconSpanName} />
              </span>
            </div>
            <h3 style={{ ...modalStyles.title, ...modalContent.styles.title }}>
              {modalContent.title}
            </h3>
            <div
              style={{
                ...modalStyles.subTitle,
                ...modalContent.styles.bottomTitle,
              }}
              dangerouslySetInnerHTML={createMarkup(modalContent.subTitle)}
            />
            <div>
              <Button
                onClick={() => {
                  if (modalContent.isSuccess) {
                    setIsShowModal(false);
                    props.history.push("/admin/manage-accounts");
                  } else {
                    setIsShowModal(false);
                  }
                }}
                style={{ ...modalStyles.button }}
                type="primary"
                disabled={isSaving}
                loading={isSaving}
              >
                {modalContent.buttonText}
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

CustomerDetailPayment.propTypes = {
  isEdit: PropTypes.bool,
};

CustomerDetailPayment.defaultProps = {
  isEdit: false,
};

function mapDispatchToProps(dispatch) {
  return {
    // setTitle: (title) => dispatch(setTitle(title)),
    getCustomerDetailsById: (id) => {
      const action = getCustomerDetailsById(id);
      dispatch(action);
      return action.promise;
    },
  };
}

export default withRouter(
  connect(null, mapDispatchToProps)(CustomerDetailPayment)
);

// export default compose(
//   // AdminLayout,
//   withRouter,
//   connect(null, mapDispatchToProps)
// )(CustomerDetailPayment);
