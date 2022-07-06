import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom";
import { func, bool } from 'prop-types';


import CustomerDetailsSubForm from './CustomerDetailsSubForm';
import SimpleSaveButtons from './SimpleSaveButtons';
import CustomerDetailPayment from "./CustomerDetailPayment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const NewResidentialCustomerSubForm = (props) => {
  const [isShowPaymentDetail, setIsShowPaymentDetail] = useState(false);
  const {
    handleSubmit,
    isSaving,
    dataCustomer,
    handleSubmitWithPayment,
  } = props;
  const stripePromise = loadStripe(process.env.STRIPE_PUB_KEY);
  useEffect(() => {
    if(dataCustomer && dataCustomer._id){
      setIsShowPaymentDetail(true);
    }
  }, [dataCustomer]);

  const Styles = {
    reminderIcon: {
      fontSize: '5em',
      color: 'rgb(243, 92, 93)',
      marginBottom: '20px',
      marginTop: '55px',
      display: 'block',
    },
    reminderText: {
      display: 'block',
      fontSize: '2em',
      fontWeight: 'bold',
      lineHeight: '1',
      letterSpacing: '-1px',
      color: 'rgb(243, 92, 93)',
    },
  };

  return (
    <div>
      {dataCustomer && dataCustomer._id ? (
        <div>
          <i className="handel-notify" style={Styles.reminderIcon}></i>
          <span style={Styles.reminderText}>
            IMPORTANT - Please pause the call in Zendesk NOW before collecting the customers credit card details. Make sure you reactivate the call recording once card details are approved
          </span>
          <Elements stripe={stripePromise}>
            <CustomerDetailPayment
              isEdit
              isAdd
              dataCustomer={dataCustomer}
              isSaving={isSaving}
              isShowPaymentDetail={isShowPaymentDetail}
            />
          </Elements>
        </div>
      ) : (
        <form>
          <div className="row">
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <CustomerDetailsSubForm isEdit isAdd />
            </div>
          </div>

          <div className="row">
            <SimpleSaveButtons
              isNewResidential="true"
              handleSubmit={handleSubmit}
              isSaving={isSaving}
              handleSubmitWithPayment={handleSubmitWithPayment}
            />
          </div>
        </form>
      )}
    </div>
  );
}

NewResidentialCustomerSubForm.propTypes = {
  handleSubmit: func.isRequired,
  isSaving: bool.isRequired,
};

NewResidentialCustomerSubForm.defaultProps = {
};

export default NewResidentialCustomerSubForm;
