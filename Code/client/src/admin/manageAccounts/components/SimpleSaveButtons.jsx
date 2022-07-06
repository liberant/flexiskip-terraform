import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import HandelButton from "../../../common/components/HandelButton";
import { InnerDivider, Spinner } from "../../../common/components";
import CardIcon from "../../../public/icons/credit-cards-payment.svg";

const SimpleSaveButtons = (props) => {
  const {
    handleSubmit,
    isSaving,
    isNewResidential,
    handleSubmitWithPayment,
    isUpdateCustomer,
    closeModal,
    handleCloseModal,
    isChargeFutile,
    isLoading,
    onShow,
  } = props;

  const onHandleClose = () => {
    handleCloseModal();
  };

  return (
    <div>
      <InnerDivider />
      <div
        style={
          isUpdateCustomer
            ? isChargeFutile ? { margin: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }  : { margin: 0, textAlign: "center" }
            : { marginLeft: 190 }
        }
      >
        {isUpdateCustomer ? (
          <HandelButton
            label=""
            href="#"
            borderColor="red"
            iconColor="red"
            shadowColor="red"
            bgColor="white"
            loading={isSaving}
            handleClose={onHandleClose}
          >
            <span className="handel-cross" />
          </HandelButton>
        ) : (
            <HandelButton
              label=""
              href="/admin/manage-accounts"
              borderColor="red"
              iconColor="red"
              shadowColor="red"
              bgColor="white"
              loading={isSaving}
            >
              <span className="handel-cross" />
            </HandelButton>
          )}

        <span style={{ paddingLeft: "10px", marginRight: "15px" }}>Cancel</span>
        {/* Show Form Payment */}
        {isNewResidential ? (
          <span>
            <HandelButton
              label=""
              htmlType="button"
              onClick={() => {
                handleSubmit();
                handleSubmitWithPayment();
              }}
              iconColor="white"
              bgColor="blue"
              borderColor="blue"
              shadowColor="blue"
              loading={isSaving}
            >
              <span className="handel-credit-cards" />
              {/* <span
                className="handel-discount-icon"
                style={{ background: `url(${CardIcon})` }}
              /> */}
            </HandelButton>
            <span style={{ paddingLeft: "10px", marginRight: "15px" }}>
              Save (with payment details)
            </span>
          </span>
        ) : (
            ""
          )}
          {
            isLoading && isLoading ? <Spinner isChargeFutile={isChargeFutile}/> : <HandelButton
          label=""
          htmlType="button"
          onClick={handleSubmit}
          iconColor="white"
          bgColor="blue"
          borderColor="blue"
          shadowColor="blue"
          loading={isSaving}
        >
          <span className="handel-floppy-disk" />
        </HandelButton>
          }
        <span style={{ paddingLeft: "10px" }}>Save</span>
      </div>
    </div>
  );
};

SimpleSaveButtons.propTypes = {
  history: PropTypes.any.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
};

export default withRouter(SimpleSaveButtons);
