import React from "react";
import { withRouter } from "react-router-dom";
import { any, bool, func, object } from "prop-types";

import { SimpleCardLayout } from "../../../common/components";
import HeaderSubForm from "./HeaderSubForm";
import AccountDetailsSubForm from "./AccountDetailsSubForm";
import CustomerDetailsSubForm from "./CustomerDetailsSubForm";
import PaymentInformationSubForm from "./PaymentInformationSubForm";
import CommonLocalDataTable from "../../../common/components/CommonLocalDataTable";
import TransactionHistory from "./TransactionHistory/TransactionHistory";
import { columnsRating } from "./columnsDef";

class CustomerResidentialForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleResetPassword = this.handleResetPassword.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleToggleEdit = this.handleToggleEdit.bind(this);
    this.handleDeletion = this.handleDeletion.bind(this);
  }

  handleResetPassword() {
    this.props.onResetPassword();
  }

  handleSave() {
    this.props.handleSubmit();
  }

  handleToggleEdit() {
    this.props.onToggleEdit();
  }

  handleDeletion() {
    this.props.onDelete();
  }

  render() {
    // console.log('detail')
    const {
      data,
      isEdit,
      handleSubmit,
      dirty,
      onDelete,
      getUserTransactionHistory,
      userTransactionHistory,
    } = this.props;
    const name = data ? `${data.firstname} ${data.lastname}` : "";
    const code = data && data.uId ? data.uId : "";
    const rating =
      data.ratings.constructor === Array && data.ratings.length > 0
        ? data.ratings.reduce(
            (total, rating) => (total + rating.point) >> 0,
            0
          ) / data.ratings.length
        : 0;

    return (
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <HeaderSubForm
              code={code}
              name={name}
              isEdit={isEdit}
              isDirty={dirty}
              handleResetPassword={this.handleResetPassword}
              handleSave={this.handleSave}
              handleToggleEdit={this.handleToggleEdit}
              handleDeletion={onDelete}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <SimpleCardLayout title="Account Details">
              <AccountDetailsSubForm isEdit={isEdit} />
            </SimpleCardLayout>
            <SimpleCardLayout title="Payment Information">
              <PaymentInformationSubForm data={data} isEdit={isEdit} />
            </SimpleCardLayout>
          </div>
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <SimpleCardLayout title="Customer Details">
              <CustomerDetailsSubForm
                isEdit={isEdit}
                isEditAccountPage={true}
              />
            </SimpleCardLayout>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <SimpleCardLayout title="Rating" ratingPoint={rating}>
              <CommonLocalDataTable
                selectRowFlag={false}
                data={data.ratings}
                columnsDef={columnsRating}
              />
            </SimpleCardLayout>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <TransactionHistory
              getUserTransactionHistory={getUserTransactionHistory}
              userTransactionHistory={userTransactionHistory}
            />
          </div>
        </div>
      </form>
    );
  }
}

CustomerResidentialForm.propTypes = {
  data: any.isRequired,
  isEdit: bool.isRequired,
  dirty: bool,
  handleSubmit: func.isRequired,
  onResetPassword: func.isRequired,
  onToggleEdit: func.isRequired,
  onDelete: func.isRequired,
  getUserTransactionHistory: func.isRequired,
  userTransactionHistory: object.isRequired,
};

CustomerResidentialForm.defaultProps = {
  dirty: false,
};

export default withRouter(CustomerResidentialForm);
