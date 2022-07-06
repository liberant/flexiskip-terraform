import React, { Component } from 'react';
import { func } from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { delay } from 'redux-saga';

import { setTitle } from '../../../common/actions';
import { ALERT_DISPLAY_DURATION } from '../../../common/constants/params';

import {
  getManageTransactionsDetailsById,
  updateManageTransactionsDetails,
  deleteManageTransactionsById,
  unmountClearManageTransactionsDetails,
} from '../actions';

import { withPreventingCheckHOC } from '../../../common/hocs';
import ManageTransactionsDetailsForm from '../components/ManageTransactionsDetailsForm';
import AdminLayout from '../../hoc/AdminLayout';

// import { materialAllowances } from '../constants/productDefs';
import { Spinner } from '../../../common/components';
import SimpleNewConfirmDlg from '../../../common/components/SimpleNewConfirmDlg';

/* eslint react/require-default-props: 0 */
/* eslint react/prop-types: 0 */
/* eslint no-unused-expressions: 0 */
/* eslint no-restricted-globals: 0 */
/* eslint no-alert: 0 */

const EDIT_TRANSACTION_FORM = 'contractor/editTransactionsDetails';

const EditManageTransactionsDetailsForm = compose(
  reduxForm({
    form: EDIT_TRANSACTION_FORM,
  }),
  withPreventingCheckHOC,
)(ManageTransactionsDetailsForm);


class ManageTransactionsEditPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      modalIsOpen: false,
      // isReset: false,
      firstFetchFlag: true,
      userType: 'transactions',
      productId: this.props.match.params.id,
      modalContent: {
        styles: { modal: { top: 430 } },
        title: 'Email Sent',
        subTitle: 'Password reset instructions is sent to',
        buttonText: 'OK',
        bottomTitle: '',
        handleButtonClick: () => {},
        handleNoButtonClick: () => {},
      },
    };

    this.handleProductSubmit = this.handleProductSubmit.bind(this);
    this.handleSuccesUpdate = this.handleSuccesUpdate.bind(this);
    this.onHandleToggleEdit = this.onHandleToggleEdit.bind(this);
    this.onHandleViewTransaction = this.onHandleViewTransaction.bind(this);
    this.onHandlePrintQRCode = this.onHandlePrintQRCode.bind(this);

    this.onHandleDeleteRequest = this.onHandleDeleteRequest.bind(this);
    this.onHandleConfirmDeleteRequest = this.onHandleConfirmDeleteRequest.bind(this);
    this.onHandleCancelDeleteRequest = this.onHandleCancelDeleteRequest.bind(this);
    this.onHandleDeleteRequestSuccess = this.onHandleDeleteRequestSuccess.bind(this);
  }


  componentDidMount() {
    const {
      setTitle, getManageTransactionsDetailsById,
    } = this.props;
    const { userType, productId } = this.state;

    setTitle('');
    getManageTransactionsDetailsById({
      userType,
      url: 'bin-requests',
      uid: productId,
    });
  }

  // shouldComponentUpdate(nextProps) {
  //   if (!nextProps.manageTransactionsDetails && !this.state.firstFetchFlag) {
  //     return false;
  //   }

  //   return true;
  // }

  componentWillUnmount() {
    this.props.unmountClearManageTransactionsDetails();
  }

  onHandleToggleEdit() {
    const { isEdit } = this.state;
    this.setState({
      isEdit: !isEdit,
    });
  }


  onHandleViewTransaction() {

  }

  onHandlePrintQRCode() {

  }

  onHandleDeleteRequest() {
    const tmpModalContent = {
      title: 'Are You Sure?',
      subTitle: 'By clicking DELETE, this request will be removed.',
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
      handleButtonClick: this.onHandleConfirmDeleteRequest,
      handleNoButtonClick: this.onHandleCancelDeleteRequest,
    };

    this.setState({
      modalIsOpen: true,
      modalContent: tmpModalContent,
      deleteModalFlag: true,
    });
  }

  async onHandleConfirmDeleteRequest() {
    const { productId } = this.state;
    try {
      await this.props.deleteManageTransactionsById({
        uid: productId,
        status: 'Cancelled',
      });

      const tmpModalContent = {
        title: 'Request Deleted',
        subTitle: 'The current request has been deleted',
        buttonText: 'OK',
        bottomTitle: '',
        styles: {
          // modal: { top: 430 },
          bottomTitle: {
            display: 'none',
          },
        },
        handleButtonClick: this.onHandleDeleteRequestSuccess,
      };
      this.setState({
        modalIsOpen: true,
        modalContent: tmpModalContent,
        deleteModalFlag: false,
      });
    } catch (error) {
      const tmpModalContent = {
        title: 'Request Deleted Failed',
        subTitle: `Error occured: ${error.message}`,
        buttonText: 'OK',
        bottomTitle: '',
        styles: {
          title: {
            color: '#f06666',
          },
          buttonText: {
            color: 'white',
            backgroundColor: '#f06666',
          },
          bottomTitle: {
            display: 'none',
          },
        },
        handleButtonClick: this.onHandleCancelDeleteRequest,
      };

      this.setState({
        modalIsOpen: true,
        modalContent: tmpModalContent,
        deleteModalFlag: true,
      });
    }
  }

  onHandleDeleteRequestSuccess() {
    this.props.history.push('/contractor/transactions');
  }

  onHandleCancelDeleteRequest() {
    this.setState({
      deleteModalFlag: false,
      modalIsOpen: false,
    });
  }

  async handleProductSubmit(values) {
    if (!values) {
      return;
    }

    //
    // MUST get userType from userTypeLabel!
    //

    const {
      vendorCode,
      name,
      weight,
      price,
      postageSize,
      images,
      weightAllowance,
      quantity,
      type,
      size,
      comment,
    } = values;

    const data = {
      vendorCode,
      name,
      weight,
      price,
      postageSize,
      images,
      weightAllowance,
      quantity,
      type,
      size,
      comment,
      status: 'In Stock',
    };

    const { productId, userType } = this.state;

    const response = await this.props.updateManageTransactionsDetails({
      url: userType,
      uid: productId,
      data,
    });
    if (response.status === '200') {
      await delay(ALERT_DISPLAY_DURATION);
    }

    this.setState({ isEdit: false });
  }

  async handleSuccesUpdate() {
    await delay(ALERT_DISPLAY_DURATION);
    this.props.history.push('/admin/product-requests');
  }


  render() {
    const {
      manageTransactionsDetails, manageTransactions,
    } = this.props;
    const {
      firstFetchFlag, isEdit,
      modalIsOpen, modalContent, deleteModalFlag,
    } = this.state;

    if ((firstFetchFlag && !manageTransactionsDetails) || (JSON.stringify(manageTransactions) === '{}')) {
      return (
        <Spinner />
      );
    }

    if (JSON.stringify(manageTransactions) === '{}') {
      return (
        <Spinner />
      );
    }

    // if (!dirty && submitSucceeded) {
    //   this.handleSuccesUpdate();
    // }

    return (
      <div className="x_panel_">
        <SimpleNewConfirmDlg
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
        </SimpleNewConfirmDlg>
        <EditManageTransactionsDetailsForm
          isEdit={isEdit}
          data={{
            ...manageTransactions,
            code: manageTransactions.code || '',
          }}
          initialValues={manageTransactions}
          onSubmit={this.handleProductSubmit}
          handleDeleteRequest={this.onHandleDeleteRequest}
          handleToggleEdit={this.onHandleToggleEdit}
          handlePrintQRCode={this.onHandlePrintQRCode}
          handleViewTransaction={this.onHandleViewTransaction}
        />
      </div>
    );
  }
}

ManageTransactionsEditPage.propTypes = {
  setTitle: func.isRequired,
  unmountClearManageTransactionsDetails: func.isRequired,
};

ManageTransactionsEditPage.defaultProps = {
};

export default compose(
  AdminLayout,

  connect(
    state => ({
      manageTransactionsDetails: state.common.requestFinished.manageTransactionsDetails,
      manageTransactions: state.contractor.transactions.transactions.transaction || {},
      form: state.form['contractor/editTransactionsDetails'] || {},
    }),
    dispatch => ({
      // set page title
      setTitle: title => dispatch(setTitle(title)),

      getManageTransactionsDetailsById: (data) => {
        const action = getManageTransactionsDetailsById(data);
        dispatch(action);
        return action.promise;
      },

      updateManageTransactionsDetails: (data) => {
        const action = updateManageTransactionsDetails(data);
        dispatch(action);
        return action.promise;
      },

      deleteManageTransactionsById: (data) => {
        const action = deleteManageTransactionsById(data);
        dispatch(action);
        return action.promise;
      },

      unmountClearManageTransactionsDetails: () => {
        const action = unmountClearManageTransactionsDetails();
        dispatch(action);
        return action.promise;
      },


    }),
  ),
)(ManageTransactionsEditPage);
