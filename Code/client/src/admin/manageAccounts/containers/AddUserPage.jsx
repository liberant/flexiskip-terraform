import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { CommonConfirmDlg } from '../../../common/components';
import { setTitle } from '../../../common/actions';

import AddAccountForm from '../components/AddAccountForm';
import AdminLayout from '../../hoc/AdminLayout';
import { createNewCustomer, getCustomersList } from '../actions';
import { modalUserCreate } from '../constants/modalDlgParams';


class AddUserPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      modalContents: {
        start: {},
        success: {},
        fail: {},
      },
      isSaving: false,
      dataCustomer: {},
      saveWithPayment: false
    };

    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.onHandleCreation = this.onHandleCreation.bind(this);
    this.handleProcessCreation = this.handleProcessCreation.bind(this);
    this.handleSuccessCreation = this.handleSuccessCreation.bind(this);
    this.handleSubmitWithPayment = this.handleSubmitWithPayment.bind(this);
    this.handleGetDataCustomer = this.handleGetDataCustomer.bind(this);
  }

  componentDidMount() {
    const { getCustomersList } = this.props;
    getCustomersList({
      limit: 10000,
      page: 1,
      type: "contractor",
    });
  }

  onHandleCreation(data, url) {
    const tmpModalContents = {
      ...modalUserCreate,
      func: {
        handleProcess: this.handleProcessCreation,
        handleSuccess: this.handleSuccessCreation,
      },
      data,
      url,
    };

    this.setState({
      modalIsOpen: true,
      modalContents: tmpModalContents,
    });
  }

  handleCloseModal() {
    this.setState({
      modalIsOpen: false,
    });
  }

  async handleProcessCreation() {
    const { createNewCustomer } = this.props;
    let { url, data } = this.state.modalContents;
    if (url === "drivers") {
      data = {
        ...data,
        organisation: data.organisation._id,
      };
    }
    try {
      this.setState({ isSaving: true });
      const result = await createNewCustomer({ url, data });
      this.setState({ isSaving: false });
      return result;
    } catch (err) {
      this.setState({ isSaving: false });
      throw err;
    }
  }

  handleSubmitWithPayment(){
    this.setState({
      saveWithPayment: true,
    });
  }

  handleSuccessCreation(checkIsPayment) {
    if (checkIsPayment && this.state.saveWithPayment) {
      this.setState({ isSaving: false, modalIsOpen: false });
    } else {
      this.setState({ isSaving: false });
      this.props.history.push("/admin/manage-accounts");
    }
  }

  handleGetDataCustomer(data) {
    if (this.state.saveWithPayment) {
      this.setState({ dataCustomer: data });
    }
  }
  render() {
    const { modalIsOpen, modalContents, isSaving } = this.state;
    const { form, contractorList, getCustomersList } = this.props;


    const isTouched =
      (form &&
        ((form["admin/newResidentialCustomer"] &&
          form["admin/newResidentialCustomer"].anyTouched) ||
          (form["admin/newBusinessCustomer"] &&
            form["admin/newBusinessCustomer"].anyTouched) ||
          (form["admin/newHandelAdmin"] &&
            form["admin/newHandelAdmin"].anyTouched) ||
          (form["admin/newBusinessContractor"] &&
            form["admin/newBusinessContractor"].anyTouched) ||
          (form["admin/newDriver"] && form["admin/newDriver"].anyTouched) ||
          (form["admin/newCouncilOfficer"] && form["admin/newCouncilOfficer"].anyTouched))) ||
      false;

    return (
      <div className="x_panel_">
        <CommonConfirmDlg
          modalIsOpen={modalIsOpen}
          modalContents={modalContents}
          handleCloseModal={this.handleCloseModal}
          isSaving={isSaving}
          handleGetDataCustomer={(data) => this.handleGetDataCustomer(data)}
          dataCustomer={this.state.dataCustomer}
          saveWithPayment={this.state.saveWithPayment}
        />

        <AddAccountForm
          onHandleSubmit={this.onHandleCreation}
          isTouched={isTouched}
          contractorList={contractorList}
          getCustomersList={getCustomersList}
          dataCustomer={this.state.dataCustomer}
          handleSubmitWithPayment={this.handleSubmitWithPayment}
        />
      </div>
    );
  }
}

AddUserPage.propTypes = {
  history: PropTypes.any.isRequired,
  form: PropTypes.any,
  contractorList: PropTypes.array,
  createNewCustomer: PropTypes.func.isRequired,
  getCustomersList: PropTypes.func.isRequired,
};

AddUserPage.defaultProps = {
  form: {},
  contractorList: [],
};

export default compose(
  AdminLayout,
  connect(
    state => ({
      accounts: state.admin.accounts,
      form: state.form,
      contractorList: state.admin.accounts.customers.contractorList || [],
    }),
    dispatch => ({
      setTitle: title => dispatch(setTitle(title)),
      createNewCustomer: (data) => {
        const action = createNewCustomer(data);
        dispatch(action);
        return action.promise;
      },
      getCustomersList: (data) => {
        const action = getCustomersList(data);
        dispatch(action);
        return action.promise;
      },
    }),
  ),
)(AddUserPage);
