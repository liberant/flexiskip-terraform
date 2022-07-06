import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import qs from 'qs';

import { change, SubmissionError, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { clearIdentity } from '../../../common/actions';

import { register, registerProcessing } from '../actions';
import FormRegister from '../components/FormRegister';
import FormBusinessDetails from '../components/FormBusinessDetails';
import FormBankPaymentDetails from '../components/FormBankPaymentDetails';
import FormPrimaryContactDetails from '../components/FormPrimaryContactDetails';
import FormDriversCreate from '../components/FormDriversCreate';
import FormDriversList from '../components/FormDriversList';
import FormVehiclesCreate from '../components/FormVehiclesCreate';
import FormVehiclesList from '../components/FormVehiclesList';

import SimpleConfirmDlg from '../../../common/components/SimpleConfirmDlg';
import { withPreventingCheckHOC } from '../../../common/hocs';


/* eslint react/require-default-props: 0 */
/* eslint no-param-reassign: 0 */

const REGISTER_FORM = 'contractorRegister';

// const FormRegisterEdit = compose(
//   reduxForm({
//     form: REGISTER_FORM,
//     destroyOnUnmount: false,
//     enableReinitialize: false,
//     validate,
//   }),
//   BlankLayout,
// )(FormRegister);

const selector = formValueSelector(REGISTER_FORM);


class RegisterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      cardId: null,
      cardErrorFlag: false,
      cardErrorHint: '',
      driverInitialValue: {},
      drivers: [],
      vehicles: [],
      goAddDriverFlag: false,
      goAddVehicleFlag: false,
      modalIsOpen: false,
      modalContent: {
        styles: {},
        title: 'Register Successfully',
        subTitle: 'Now you can Sign in with your account',
        buttonText: 'GO TO MY DASHBOARD',
        bottomTitle: '',
        handleButtonClick: this.closeModal,
        handleNoButtonClick: this.closeModal,
      },
      selectedDriverId: -1,
      selectedVehicleId: -1,
      deleteModalFlag: false,
    };

    this.onNextPage = this.onNextPage.bind(this);
    this.onPreviousPage = this.onPreviousPage.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCreateCardStripToken = this.onCreateCardStripToken.bind(this);

    this.onNextDriverPage = this.onNextDriverPage.bind(this);
    this.onHandleAddDriver = this.onHandleAddDriver.bind(this);
    this.onHandleCloseAddDriver = this.onHandleCloseAddDriver.bind(this);
    this.onHandleAddNewDriver = this.onHandleAddNewDriver.bind(this);
    this.onHandleGoAddNewDriver = this.onHandleGoAddNewDriver.bind(this);
    this.onHandleDeleteDriver = this.onHandleDeleteDriver.bind(this);
    this.onHandleConfirmDeleteDriver = this.onHandleConfirmDeleteDriver.bind(this);
    this.onHandleCancelDeleteDriver = this.onHandleCancelDeleteDriver.bind(this);

    this.onHandleAddVehicle = this.onHandleAddVehicle.bind(this);
    this.onHandleCloseAddVehicle = this.onHandleCloseAddVehicle.bind(this);
    this.onHandleAddNewVehicle = this.onHandleAddNewVehicle.bind(this);
    this.onHandleGoAddNewVehicle = this.onHandleGoAddNewVehicle.bind(this);
    this.onHandleDeleteVehicle = this.onHandleDeleteVehicle.bind(this);
    this.onHandleConfirmDeleteVehicle = this.onHandleConfirmDeleteVehicle.bind(this);
    this.onHandleCancelDeleteVehicle = this.onHandleCancelDeleteVehicle.bind(this);

    this.handleSuccessRegister = this.handleSuccessRegister.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    const { clearIdentity } = this.props;
    // window.addEventListener('beforeunload', this.handlerWindowClose);
    clearIdentity();
  }

  // handles for all pages.
  onNextPage() {
    const { page } = this.state;
    const { registerProcessing, password, confirmPassword } = this.props;

    if (!password || !confirmPassword) {
      throw new SubmissionError({
        password: ['Required'],
        confirmPassword: ['Required'],
      });
    }
    if (password !== confirmPassword) {
      throw new SubmissionError({
        confirmPassword: ['Two passwords should be Equal!'],
      });
    }

    this.setState({ page: page + 1 });
    registerProcessing('starting');

    window.addEventListener('beforeunload', (event) => {
      event.preventDefault();
      event.returnValue = 'o/';
      return 'o/';
    });
  }

  onPreviousPage() {
    const { page } = this.state;

    if (page === 1) {
      this.props.clearField(change(REGISTER_FORM, 'password', ''));
      this.props.clearField(change(REGISTER_FORM, 'confirmPassword', ''));
    }
    this.setState({ page: page < 1 ? 0 : page - 1 });
  }

  // handle for payment page.
  async onCreateCardStripToken() {
    const { page } = this.state;
    const { card } = this.props;

    if (!card || !card.number || !card.holder || !card.expireDate || !card.cvc) {
      return;
    }

    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer pk_test_s15DQMEisgjqkNt3h03J1x8Q',
      },
      data: qs.stringify({
        'card[number]': parseInt((card.number).replace(/[^\d]/g, ''), 10),
        'card[exp_month]': card.expireDate.slice(0, 2) >> 0,
        'card[exp_year]': card.expireDate.slice(3) >> 0,
        'card[cvc]': card.cvc >> 0,
      }),
      url: 'https://api.stripe.com/v1/tokens',
    };

    await axios(options).then((response) => {
      this.setState({
        page: page + 1,
        cardId: response.data.id,
        cardErrorFlag: false,
        cardErrorHint: '',
      });
    }).catch((error) => {
      this.setState({
        cardId: null,
        cardErrorFlag: true,
        cardErrorHint: 'Invalid Card Information!',
      });
      throw new SubmissionError({
        ...error.errors,
        _error: error.message,
      });
    });
  }


  // handles for driver page.
  onNextDriverPage(data) {
    const { page, drivers } = this.state;
    const tmpContact = data.isDriver ? data.contact : {};

    this.setState({
      page: page + 1,
      driverInitialValue: { driver: tmpContact, ...data },
      goAddDriverFlag: data.isDriver && (drivers.length < 1),
    });
  }

  onHandleAddDriver() {
    this.setState({ goAddDriverFlag: true });
  }

  onHandleCloseAddDriver() {
    this.setState({
      goAddDriverFlag: false,
    });
  }

  onHandleAddNewDriver(data) {
    const tmpDrivers = this.state.drivers;
    tmpDrivers.push(data.driver);
    this.setState({ drivers: tmpDrivers, goAddDriverFlag: false });
  }

  onHandleGoAddNewDriver() {
    this.setState({ goAddDriverFlag: true });
  }

  onHandleDeleteDriver(id) {
    const tmpModalContent = {
      title: 'Are You Sure?',
      subTitle: 'By clicking DELETE, this driver will be removed.',
      buttonText: 'DELETE',
      bottomTitle: 'Do not Delete',
      styles: {
        title: {
          color: '#f06666',
        },
        buttonText: {
          color: 'white',
          backgroundColor: '#f06666',
        },
      },
      handleButtonClick: this.onHandleConfirmDeleteDriver,
      handleNoButtonClick: this.onHandleCancelDeleteDriver,
    };

    this.setState({
      modalIsOpen: true,
      modalContent: tmpModalContent,
      selectedDriverId: id,
      deleteModalFlag: true,
    });
  }

  onHandleConfirmDeleteDriver() {
    const { drivers, selectedDriverId } = this.state;
    let tmpDrivers = [];
    tmpDrivers = tmpDrivers.concat(
      drivers.slice(0, selectedDriverId),
      drivers.slice(selectedDriverId + 1),
    );

    this.setState({ deleteModalFlag: false, modalIsOpen: false, drivers: tmpDrivers });
  }

  onHandleCancelDeleteDriver() {
    this.setState({ deleteModalFlag: false, modalIsOpen: false, selectedDriverId: -1 });
  }

  // handles for vehicle page.
  onNextVehiclePage() {
    const { page } = this.state;

    this.setState({
      page: page + 1,
      goAddVehicleFlag: false,
    });
  }

  onHandleAddVehicle() {
    this.setState({ goAddVehicleFlag: true });
  }

  onHandleCloseAddVehicle() {
    this.setState({
      goAddVehicleFlag: false,
    });
  }

  onHandleAddNewVehicle(data) {
    const tmpVehicle = this.state.vehicles;
    tmpVehicle.push(data.vehicle);
    this.setState({ vehicles: tmpVehicle, goAddVehicleFlag: false });
  }

  onHandleGoAddNewVehicle() {
    this.setState({ goAddVehicleFlag: true });
  }

  onHandleDeleteVehicle(id) {
    const tmpModalContent = {
      title: 'Are You Sure?',
      subTitle: 'By clicking DELETE, this vehicle will be removed.',
      buttonText: 'DELETE',
      bottomTitle: 'Do not Delete',
      styles: {
        title: {
          color: '#f06666',
        },
        buttonText: {
          color: 'white',
          backgroundColor: '#f06666',
        },
      },
      handleButtonClick: this.onHandleConfirmDeleteVehicle,
      handleNoButtonClick: this.onHandleCancelDeleteVehicle,
    };

    this.setState({
      modalIsOpen: true,
      modalContent: tmpModalContent,
      selectedVehicleId: id,
      deleteModalFlag: true,
    });
  }

  onHandleConfirmDeleteVehicle() {
    const { vehicles, selectedVehicleId } = this.state;
    let tmpVehicle = [];
    tmpVehicle = tmpVehicle.concat(
      vehicles.slice(0, selectedVehicleId),
      vehicles.slice(selectedVehicleId + 1),
    );
    this.setState({ deleteModalFlag: false, modalIsOpen: false, vehicles: tmpVehicle });
  }

  onHandleCancelDeleteVehicle() {
    this.setState({ deleteModalFlag: false, modalIsOpen: false, selectedVehicleId: -1 });
  }

  // final submit.
  onSubmit = async (data) => {
    const {
      cardId, vehicles, drivers, page,
    } = this.state;
    const {
      password, email,
      contact,
      company,
      account,
    } = data;
    contact.email = email;
    contact.phone = (contact.phone).replace(/[^\d]/g, '');

    company.abn = (company.abn).replace(/[^\d]/g, '');
    company.phone = (company.phone).replace(/[^\d]/g, '');

    account.bsb = (account.bsb).replace(/[^\d]/g, '');
    account.number = (account.number).replace(/[^\d]/g, '');

    const tmpDrivers = drivers.map((d) => {
      d.phone = (d.phone).replace(/[^\d]/g, '');
      return d;
    });

    const registerData = {
      password,
      email,
      contact,
      cardId,
      account,
      company,
      vehicles,
      drivers: tmpDrivers,
    };

    try {
      await this.props.register({ ...registerData });
      this.setState({ page: page + 1 });
      this.props.registerProcessing('finished');
    } catch (error) {
      throw new SubmissionError({
        ...error.errors,
        _error: error.message,
      });
    }
  }

  handleSuccessRegister() {
    this.openModal();
  }

  openModal() {
    const tmpModalContent = {
      title: 'Registration Successful',
      subTitle: 'Now you can Sign in with your account.',
      buttonText: 'GO TO MY DASHBOARD',
      bottomTitle: '',
      styles: {},
      handleButtonClick: this.closeModal,
    };

    this.setState({ modalIsOpen: true, modalContent: tmpModalContent });
  }

  closeModal() {
    this.props.history.push('/contractor/dashboard');
  }

  render() {
    const {
      page, cardErrorFlag, cardErrorHint,
      drivers, driverInitialValue, goAddDriverFlag,
      vehicles, goAddVehicleFlag,
      modalIsOpen, modalContent, deleteModalFlag,
    } = this.state;

    const { dirty, submitSucceeded } = this.props.form;
    if (!dirty && submitSucceeded && !modalIsOpen && (page > 5)) {
      this.handleSuccessRegister();
    }

    return (
      <div>
        <SimpleConfirmDlg
          modalIsOpen={modalIsOpen}
          styles={modalContent.styles}
          title={modalContent.title}
          subTitle={modalContent.subTitle}
          buttonText={modalContent.buttonText}
          bottomTitle={modalContent.bottomTitle}
          handleButtonClick={modalContent.handleButtonClick}
          handleNoButtonClick={modalContent.handleNoButtonClick}
        >
          {
          deleteModalFlag ? (
            <span style={{ fontSize: 68, color: '#f06666' }}>
              <span className="handel-question" />
            </span>) : null
        }
        </SimpleConfirmDlg>
        {
          page === 0 && (
            <FormRegister onSubmit={this.onNextPage} />
          )
        }
        {
          page === 1 && (
            <FormBusinessDetails
              page={page}
              onSubmit={this.onNextPage}
              handleBack={this.onPreviousPage}
            />
          )
        }
        {
          page === 2 && (
            <FormBankPaymentDetails
              page={page}
              cardErrorFlag={cardErrorFlag}
              cardErrorHint={cardErrorHint}
              onSubmit={this.onNextPage}
              // onSubmit={this.onCreateCardStripToken}
              handleBack={this.onPreviousPage}
            />
          )
        }
        {
          page === 3 && (
            <FormPrimaryContactDetails
              page={page}
              onSubmit={this.onNextDriverPage}
              handleBack={this.onPreviousPage}
            />
          )
        }
        {
          ((page === 4) && goAddDriverFlag) && (
            <FormDriversCreate
              page={page}
              initialValues={driverInitialValue}
              onSubmit={this.onHandleAddNewDriver}
              handleBack={this.onPreviousPage}
              handleCloseAddDriver={this.onHandleCloseAddDriver}
            />
          )
        }
        {
          ((page === 4) && !goAddDriverFlag) && (
            <FormDriversList
              page={page}
              drivers={drivers}
              onSubmit={this.onNextPage}
              handleBack={this.onPreviousPage}
              handleGoAddNewDriver={this.onHandleGoAddNewDriver}
              handleDeleteDriver={this.onHandleDeleteDriver}
            />
          )
        }
        {
          ((page === 5) && goAddVehicleFlag) && (
            <FormVehiclesCreate
              page={page}
              onSubmit={this.onHandleAddNewVehicle}
              handleBack={this.onPreviousPage}
              handleCloseAddVehicle={this.onHandleCloseAddVehicle}
            />
          )
        }
        {
          ((page === 5) && !goAddVehicleFlag) && (
            <FormVehiclesList
              page={page}
              vehicles={vehicles}
              onSubmit={this.onSubmit}
              handleBack={this.onPreviousPage}
              handleGoAddNewVehicle={this.onHandleGoAddNewVehicle}
              handleDeleteVehicle={this.onHandleDeleteVehicle}
            />
          )
        }
      </div>
    );
  }
}

RegisterPage.propTypes = {
  register: PropTypes.func.isRequired,
  clearIdentity: PropTypes.func.isRequired,
  dirty: PropTypes.bool,
  submitSucceeded: PropTypes.bool,
  form: PropTypes.any.isRequired,
  history: PropTypes.any.isRequired,
  password: PropTypes.string.isRequired,
  confirmPassword: PropTypes.string.isRequired,
  registerProcessing: PropTypes.func.isRequired,
  clearField: PropTypes.func.isRequired,
};

RegisterPage.defaultProps = {
  dirty: false,
  submitSucceeded: false,
};

export default compose(
  connect(
    state => ({
      card: (state.form && state.form.contractorRegister
      && state.form.contractorRegister.values
      && state.form.contractorRegister.values.card) || {},
      form: state.form.contractorRegister || { dirty: false, submitSucceeded: false },
      registerProcessingStatus: state.contractor.contractor.registerProcessing || 'finished',
      password: selector(state, 'password'),
      confirmPassword: selector(state, 'confirmPassword'),
    }),
    dispatch => ({
      register: (data) => {
        const action = register(data);
        dispatch(action);
        return action.promise;
      },
      clearField: data => dispatch(data),
      clearIdentity: () => dispatch(clearIdentity()),
      registerProcessing: data => dispatch(registerProcessing(data)),
    }),
  ),
  withPreventingCheckHOC,
)(RegisterPage);
