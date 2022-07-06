import React from 'react';
import { withRouter } from 'react-router-dom';
import { any, bool, func, string } from 'prop-types';
import axios from 'axios';
import qs from 'qs';
import { SubmissionError, FormSection } from 'redux-form';

import { SimpleCardLayout } from '../../../common/components';
import Spinner from '../../../common/components/Spinner';

import HeaderSubForm from './HeaderSubForm';
import HeaderAdminSubForm from './HeaderAdminSubForm';
import AccountDetailsSubForm from './AccountDetailsSubForm';
import BusinessDetailsSubForm from './BusinessDetailsSubForm';
import PaymentInformationSubForm from './PaymentInformationSubForm';
import { columnsContractorAdmin } from './columnsDef';
import BankInformationEditForm from './BankInformationDlg';
import CardInformationEditForm from './CardInformationDlg';
import AdminsTable from './AdminsTable';

/* eslint no-underscore-dangle:0 */

const Styles = {
  box: {
    height: 524,
  },
};

class BusinessContractorForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bankDlgOpen: false,
      cardDlgOpen: false,
      cardErrorFlag: false,
      cardErrorHint: '',
    };

    this.handleSave = this.handleSave.bind(this);
    this.handleToggleEdit = this.handleToggleEdit.bind(this);
    // this.handleDeletion = this.handleDeletion.bind(this);
    this.handleSearch = this.handleSearch.bind(this);

    this.handleOpenBankDlg = this.handleOpenBankDlg.bind(this);
    this.handleCloseBankDlg = this.handleCloseBankDlg.bind(this);
    this.handleSubmitBankInfo = this.handleSubmitBankInfo.bind(this);

    this.handleOpenCardDlg = this.handleOpenCardDlg.bind(this);
    this.handleCloseCardDlg = this.handleCloseCardDlg.bind(this);
    this.handleSubmitCardInfo = this.handleSubmitCardInfo.bind(this);

    this.handleGetSelected = this.handleGetSelected.bind(this);
  }

  handleSave() {
    this.props.handleSubmit();
  }

  handleToggleEdit() {
    this.props.onToggleEdit();
  }

  // handleDeletion() {
  //   this.props.onDelete();
  // }

  async handleSearch(event) {
    await this.props.getData({ limit: 1000, page: 1, s: event.target.value });
  }

  handleOpenBankDlg() {
    const { isEdit } = this.props;
    if (!isEdit) {
      return;
    }

    this.setState({
      bankDlgOpen: true,
    });
  }

  handleCloseBankDlg() {
    this.setState({
      bankDlgOpen: false,
    });
  }

  handleSubmitBankInfo(values) {
    const { onUpdateBankInformation } = this.props;

    this.setState({
      bankDlgOpen: false,
    });
    if (onUpdateBankInformation) {
      onUpdateBankInformation({ data: values });
    }
  }

  handleOpenCardDlg() {
    const { isEdit } = this.props;
    if (!isEdit) {
      return;
    }

    this.setState({
      cardDlgOpen: true,
    });
  }

  handleCloseCardDlg() {
    this.setState({
      cardDlgOpen: false,
    });
  }

  async handleSubmitCardInfo(values) {
    const { onUpdatePaymentInformation } = this.props;
    const { number, expireDate, cvc } = values;

    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer pk_test_s15DQMEisgjqkNt3h03J1x8Q',
      },
      data: qs.stringify({
        'card[number]': parseInt(number, 10),
        'card[exp_month]': expireDate.slice(0, 2) >> 0,
        'card[exp_year]': expireDate.slice(3) >> 0,
        'card[cvc]': cvc >> 0,
      }),
      url: 'https://api.stripe.com/v1/tokens',
    };

    await axios(options).then((response) => {
      if (onUpdatePaymentInformation) {
        onUpdatePaymentInformation({ data: { cardId: response.data.id } });
      }
      this.setState({
        cardDlgOpen: false,
        cardErrorFlag: false,
        cardErrorHint: '',
      });
    }).catch((error) => {
      this.setState({
        cardErrorFlag: true,
        cardErrorHint: 'Invalid Card Information!',
      });
      throw new SubmissionError({
        ...error.errors,
        _error: error.message,
      });
    });
  }

  handleGetSelected(valueSet) {
    const { onHandleAdminsSelect } = this.props;
    if (onHandleAdminsSelect) {
      onHandleAdminsSelect(valueSet);
    }
  }


  render() {
    const {
      data, isEdit, handleSubmit, admins,
      dirty, getData, status,
      onHandleSuspend, onHandleUnsuspend, onHandleInactive,
      onHandleAdminsSuspend, onHandleAdminsDeletion,
    } = this.props;
    const {
      bankDlgOpen, cardDlgOpen,
      cardErrorFlag, cardErrorHint,
    } = this.state;
    const suspendFlag = (data.status.toLowerCase() === 'suspend');
    const rowEvents = {
      onClick: (e, row) => {
        if (!((e.target.tagName === 'TD'
          && e.target.firstChild
          && e.target.firstChild.nodeName === 'INPUT'
        ) || (e.target.tagName === 'INPUT'))) {
          this.props.history.push(`/contractor/edit-admin/${row._id}`);
        }
      },
    };

    const bank = data && data.organisation && data.organisation.bank ? data.organisation.bank : {};

    return (
      <div>
        <BankInformationEditForm
          dlgOpen={bankDlgOpen}
          initialValues={bank}
          closeDlg={this.handleCloseBankDlg}
          onSubmit={this.handleSubmitBankInfo}
        />
        <CardInformationEditForm
          dlgOpen={cardDlgOpen}
          cardErrorFlag={cardErrorFlag}
          cardErrorHint={cardErrorHint}
          closeDlg={this.handleCloseCardDlg}
          onSubmit={this.handleSubmitCardInfo}
        />
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <HeaderSubForm
                isEdit={isEdit}
                suspendFlag={suspendFlag}
                isDirty={dirty}
                status={status}
                handleSave={this.handleSave}
                handleToggleEdit={this.handleToggleEdit}
                handleSuspend={onHandleSuspend}
                handleUnsuspend={onHandleUnsuspend}
                handleInactive={onHandleInactive}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <SimpleCardLayout title="Contact Details" styles={Styles}>
                <BusinessDetailsSubForm
                  isEdit={isEdit}
                />
              </SimpleCardLayout>
            </div>
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <SimpleCardLayout title="Account Details">
                <FormSection name="organisation.contact">
                  <AccountDetailsSubForm
                    isEdit={isEdit}
                  />
                </FormSection>

              </SimpleCardLayout>
              <SimpleCardLayout title="Bank & Payment Information">
                <PaymentInformationSubForm
                  cardFieldName="organisation.payment.cardLast4Digits"
                  isEdit={isEdit}
                  openBankDlg={this.handleOpenBankDlg}
                  openCardDlg={this.handleOpenCardDlg}
                />
              </SimpleCardLayout>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <HeaderAdminSubForm
                isEdit={isEdit}
                isDirty={dirty}
                // handleSuspend={onHandleSuspendUsers}
                // handleDeletion={onDelete}
                handleSuspend={onHandleAdminsSuspend}
                handleDeletion={onHandleAdminsDeletion}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <SimpleCardLayout title="Administrator Users" searchFlag onHandleSearch={this.handleSearch}>
                <AdminsTable
                  data={admins}
                  columnsDef={columnsContractorAdmin}
                  rowEvents={rowEvents}
                  getData={getData}
                  handleGetSelected={this.handleGetSelected}
                />
              </SimpleCardLayout>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

BusinessContractorForm.propTypes = {
  data: any.isRequired,
  admins: any.isRequired,
  isEdit: bool.isRequired,
  dirty: bool,
  history: any.isRequired,
  status: string.isRequired,
  handleSubmit: func.isRequired,
  getData: func.isRequired,
  onToggleEdit: func.isRequired,
  // onDelete: func.isRequired,

  onHandleSuspend: func.isRequired,
  onHandleUnsuspend: func.isRequired,
  onHandleInactive: func.isRequired,
  // onHandleSuspendUsers: func.isRequired,

  onHandleAdminsSelect: func.isRequired,
  onHandleAdminsSuspend: func.isRequired,
  onHandleAdminsDeletion: func.isRequired,
  onUpdateBankInformation: func.isRequired,
  onUpdatePaymentInformation: func.isRequired,
};

BusinessContractorForm.defaultProps = {
  dirty: false,
};

export default withRouter(BusinessContractorForm);
