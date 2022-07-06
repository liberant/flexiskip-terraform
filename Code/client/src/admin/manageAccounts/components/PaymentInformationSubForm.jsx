import React, { useEffect, useState } from "react";
import { Field } from "redux-form";
import { string } from "prop-types";

import { renderStaticText2Rows } from "../../../common/components/form/reduxFormComponents";
import CustomerDetailPayment from "./CustomerDetailPayment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { formStyles } from "./Styles";
import { Modal } from "antd";
import "./styles.css";

const PaymentInformationSubForm = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateCustomer, setIsUpdateCustomer] = useState(true);

  const { cardFieldName, data, isEdit } = props;

  const stripePromise = loadStripe(process.env.STRIPE_PUB_KEY);

  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Modal
        title="Add customer payment information"
        className="modal-add-customer-payment-info"
        visible={isModalVisible}
        footer={null}
        maskClosable={false}
        width={550}
        centered={true}
        // onOk={handleOk}
        onCancel={handleCancel}
      >
        <Elements stripe={stripePromise}>
          <CustomerDetailPayment
            isEdit
            data={data}
            isUpdateCustomer={isUpdateCustomer}
            onHandleCloseModal={closeModal}
            // closeModal={closeModalPay}
            // dataCustomer={dataCustomer}
            // isShowPaymentDetail={isShowPaymentDetail}
          />
        </Elements>
      </Modal>
      <div>
        <div className="row">
          <div className="col-xs-12">
            <Field
              icon
              name={cardFieldName}
              label="Credit Card No."
              component={renderStaticText2Rows}
            >
              <span>
                <i className="fa fa-cc-visa" />- **** &nbsp; **** &nbsp; ****
                &nbsp;
              </span>
            </Field>
            {data && data.prefix && data.prefix == "gc" ? (
              <Field
                icon
                name={cardFieldName}
                label="GCC Violation Fee"
                component={renderStaticText2Rows}
              >
                {data && data.gccViolationPaymentMethod !== null ? (
                  <span>
                    <i className="fa fa-cc-visa" />- **** &nbsp; **** &nbsp;
                    **** &nbsp;{" "}
                    {data.gccViolationPaymentMethod &&
                      data.gccViolationPaymentMethod.last4}{" "}
                    &nbsp;
                  </span>
                ) : (
                  <div>
                    <span>{`No payment method added`}</span> -{" "}
                    <button
                      onClick={() => showModal()}
                      style={formStyles.btnAddPayment}
                    >
                      {" "}
                      {`Add`}{" "}
                    </button>
                  </div>
                )}
              </Field>
            ) : (
              ""
            )}
          </div>
          {/* <Elements stripe={stripePromise}>
            <CustomerDetailPayment
              isEdit
              data={data}
              // dataCustomer={dataCustomer}
              // isShowPaymentDetail={isShowPaymentDetail}
            />
          </Elements> */}
        </div>
      </div>
    </div>
  );
};

PaymentInformationSubForm.propTypes = {
  cardFieldName: string,
};

PaymentInformationSubForm.defaultProps = {
  cardFieldName: "payment.cardLast4Digits",
};

export default PaymentInformationSubForm;
