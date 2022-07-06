import React from 'react';
import { withRouter } from 'react-router-dom';
import { any, bool, func, object } from 'prop-types';
import { Field, FieldArray } from 'redux-form';

import { SimpleCardLayout } from '../../../common/components';

import HeaderSubForm from './HeaderSubForm';
import AccountDetailsSubForm from './AccountDetailsSubForm';
import BusinessDetailsSubForm from './BusinessDetailsSubForm';
import CommonLocalDataTable from '../../../common/components/CommonLocalDataTable';

import { columnsConnectedUsers, columnsRating } from './columnsDef';
import { onUserClick } from '../helpers';
import PaymentMethod from './PaymentMethod/PaymentMethod';
import CouponList from '../business-customer/CouponList';
import TransactionHistory from './TransactionHistory/TransactionHistory';
import AddConnectedUser from './AddConnectedUser/AddConnectedUser';
import ProductPricing from './ProductPricing/ProductPricing';

class CustomerBusinessForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      addConnectedUserModal: false,
    };

    this.handleResetPassword = this.handleResetPassword.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleToggleEdit = this.handleToggleEdit.bind(this);
    this.handleDeletion = this.handleDeletion.bind(this);
    this.handleAddConnectedUser = this.handleAddConnectedUser.bind(this);
  }

  get cardLast4Digits() {
    const { data } = this.props;
    if (
      data &&
      data.organisation &&
      data.organisation.payment &&
      data.organisation.payment.cardLast4Digits
    ) {
      return data.organisation.payment.cardLast4Digits;
    }
    return '';
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

  handleAddConnectedUser(e) {
    e.preventDefault();
    this.setState({ addConnectedUserModal: !this.state.addConnectedUserModal });
  }

  rowEventsUser = {
    onClick: onUserClick.bind(this),
  }

  render() {
    const {
      data, isEdit, handleSubmit, dirty, onDelete,
      getUserTransactionHistory,
      userTransactionHistory,
      initialize,
    } = this.props;
    const name = (data && data.organisation) ? data.organisation.name : '';
    const users = (data && data.organisation && data.organisation.users) ?
      data.organisation.users : [];
    const code = (data && data.organisation && data.organisation.abn) ?
      data.organisation.abn : '';
    const rating = data && data.rating ? data.rating : 0;

    return (
      <React.Fragment>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <HeaderSubForm
                name={name}
                code={code}
                isEdit={isEdit}
                isDirty={dirty}
                resetPasswordFlag
                handleResetPassword={this.handleResetPassword}
                handleSave={this.handleSave}
                handleToggleEdit={this.handleToggleEdit}
                handleDeletion={onDelete}
                handleAddConnectedUser={this.handleAddConnectedUser}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <SimpleCardLayout title="Account Details">
                <AccountDetailsSubForm
                  isEdit={isEdit}
                />
              </SimpleCardLayout>
              <SimpleCardLayout title="Payment Information">
                <Field
                  isEdit={isEdit}
                  name="organisation.paymentTypes"
                  path="organisation.paymentTypes"
                  component={PaymentMethod}
                  cardLast4Digits={this.cardLast4Digits}
                  change={this.props.change}
                  customer={data}
                  initialize={initialize}
                />
              </SimpleCardLayout>
            </div>
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <SimpleCardLayout title="Business Details">
                <BusinessDetailsSubForm
                  isEdit={isEdit}
                />
              </SimpleCardLayout>
            </div>
          </div>
          <FieldArray
            name="productPricing"
            component={ProductPricing}
            customer={data}
            isEdit={isEdit}
            initialize={initialize}
            rerenderOnEveryChange
            change={this.props.change}
          />
          <CouponList customer={data._id} />
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <SimpleCardLayout title="Connected Users">
                <CommonLocalDataTable
                  selectRowFlag={false}
                  data={users}
                  columnsDef={columnsConnectedUsers}
                  rowEvents={this.rowEventsUser}
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
        {
          this.state.addConnectedUserModal && (
            <AddConnectedUser
              isShow={this.state.addConnectedUserModal}
              handleAddConnectedUser={this.handleAddConnectedUser}
              organisation={data.organisation}
            />
          )
        }
      </React.Fragment>
    );
  }
}

CustomerBusinessForm.propTypes = {
  data: any.isRequired,
  isEdit: bool.isRequired,
  dirty: bool,
  handleSubmit: func.isRequired,
  onResetPassword: func.isRequired,
  onToggleEdit: func.isRequired,
  onDelete: func.isRequired,
  change: func.isRequired,
  initialize: func.isRequired,
  getUserTransactionHistory: func.isRequired,
  userTransactionHistory: object.isRequired,
};

CustomerBusinessForm.defaultProps = {
  dirty: false,
};

export default withRouter(CustomerBusinessForm);
