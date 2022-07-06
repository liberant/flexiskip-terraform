import React, { Component } from 'react';
import { func } from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { reduxForm } from 'redux-form';
import { delay } from 'redux-saga';
import axios from 'axios';
import { message } from 'antd';


import { setTitle } from '../../../common/actions';
import { ALERT_DISPLAY_DURATION } from '../../../common/constants/params';

import {
  getProductRequestsDetailsById,
  updateProductRequestsDetails,
  deleteProductRequestsById,
  unmountClearProductRequestsDetails,
  updateBinDeliveryStatusById,
  downloadQRCode,
  updateProductRequestDeliveryStatus,
} from '../actions';

import { withPreventingCheckHOC } from '../../../common/hocs';
import ProductRequestsDetailsForm from '../components/ProductRequestsDetailsForm';
import AdminLayout from '../../hoc/AdminLayout';

// import { materialAllowances } from '../constants/productDefs';
import { Spinner } from '../../../common/components';
import SimpleNewConfirmDlg from '../../../common/components/SimpleNewConfirmDlg';
import { printQRCodes } from '../utils';
import { geoAddress } from '../../../common/components/form/reduxFormComponents';
import httpClient from '../../../common/http';

/* eslint react/require-default-props: 0 */
/* eslint react/prop-types: 0 */
/* eslint no-unused-expressions: 0 */
/* eslint no-restricted-globals: 0 */
/* eslint no-alert: 0 */
/* eslint react/no-did-update-set-state: 0 */

const EDIT_PRODUCT_REQUESTS_FORM = 'admin/editProductRequestsDetail';

const EditProductRequestsDetailsForm = compose(
  reduxForm({
    form: EDIT_PRODUCT_REQUESTS_FORM,
  }),
  withPreventingCheckHOC,
)(ProductRequestsDetailsForm);


class ProductRequestsManageEditPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      modalIsOpen: false,
      // isReset: false,
      firstFetchFlag: true,
      userType: 'bin-requests',
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
      selectedBinSet: [],
      firstInit: true,
    };

    this.handleProductSubmit = this.handleProductSubmit.bind(this);
    this.handleSuccesUpdate = this.handleSuccesUpdate.bind(this);
    this.onHandleToggleEdit = this.onHandleToggleEdit.bind(this);
    this.onHandleViewTransaction = this.onHandleViewTransaction.bind(this);
    this.onHandlePrintQRCode = this.onHandlePrintQRCode.bind(this);
    this.onHandleDownloadQRCode = this.onHandleDownloadQRCode.bind(this);

    this.onHandleDeleteRequest = this.onHandleDeleteRequest.bind(this);
    this.onHandleConfirmDeleteRequest = this.onHandleConfirmDeleteRequest.bind(this);
    this.onHandleCancelDeleteRequest = this.onHandleCancelDeleteRequest.bind(this);
    this.onHandleDeleteRequestSuccess = this.onHandleDeleteRequestSuccess.bind(this);

    this.onHandleSelect = this.onHandleSelect.bind(this);

    this.onShowErrorMessage = this.onShowErrorMessage.bind(this);
  }

  componentDidMount() {
    const {
      setTitle, getProductRequestsDetailsById,
    } = this.props;
    const { userType, productId } = this.state;

    setTitle('');
    getProductRequestsDetailsById({
      userType,
      url: 'bin-requests',
      uid: productId,
    });
  }

  componentDidUpdate() {
    /**
     * Set all selected item
     */
    const { productRequests } = this.props;
    if (productRequests.bins && this.state.firstInit) {
      const selectedBinSet = productRequests.bins.filter(binItem => !binItem.deliveryDate)
                                .map(binItem => binItem._id);
      this.setState({
        firstInit: false,
        selectedBinSet,
      });
    }
  }

  componentWillUnmount() {
    this.props.unmountClearProductRequestsDetails();
  }

  onHandleToggleEdit() {
    const { isEdit } = this.state;
    this.setState({
      isEdit: !isEdit,
    });
  }

  onHandleSelect(selectedBinSet) {
    this.setState({ selectedBinSet });
  }


  onHandleViewTransaction() {

  }

  onShowErrorMessage(message) {
    if (!message) {
      return;
    }
    const tmpModalContent = {
      title: 'Error',
      subTitle: message,
      buttonText: 'Got It',
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

  async onHandlePrintQRCode() {
    if (this.state.selectedBinSet.length < 1) {
      return;
    }

    // get QR Code Images.
    let qrSets;
    try {
      qrSets = await httpClient.post("/admin/bins/qrcode", {
        ids: this.state.selectedBinSet,
      });
    } catch (error) {
      const errMessage = error.response ? error.response.data.message : error.message;
      message.error(errMessage);
      return;
    }

    try {
      if (qrSets.data && qrSets.data.constructor === Array && qrSets.data.length > 0) {
        let content = '';
        qrSets.data.forEach((q) => {
          content = `<div style="height: 210px; width: 210px;display: flex;justify-content: center;align-items: center;"><span style="display: inline-block;text-align:center;width: 170px;"><img src=${q.qrCodeImage} alt=${q.code} crossOrigin="anonymous" class="qrcode-print" /> <div>${q.code}</div><div>${q.name}</div><div>${q.binRequest.code}</div></span></div>`;
          printQRCodes({
            content,
            title: `${q.code} - ${q.name} - ${q.binRequest.code}`,
          });
        });
      }
    } catch (error) {
      console.warn(error.message);
      this.onShowErrorMessage('Sorry, cannot fetch the QR Code Images to print !');
    }
  }

  onHandleDownloadQRCode() {
    const { downloadQRCode, productRequests } = this.props;
    const standardBin = productRequests.bins.find(binItem => !binItem.deliveryDate)
    if (!standardBin) return; // not any standard bin found
    downloadQRCode(productRequests._id);
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
      await this.props.deleteProductRequestsById({
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
    this.props.history.push('/admin/product-requests');
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

    const { productId, userType } = this.state;

    const response = await this.props.updateProductRequestsDetails({
      url: userType,
      uid: productId,
      data: values,
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
      productRequestsDetails, productRequests,
      downloadQRCodeData,
    } = this.props;
    const {
      firstFetchFlag, isEdit,
      modalIsOpen, modalContent, deleteModalFlag,
    } = this.state;

    if ((firstFetchFlag && !productRequestsDetails) || (JSON.stringify(productRequests) === '{}')) {
      return (
        <Spinner />
      );
    }

    if (JSON.stringify(productRequests) === '{}') {
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
        <EditProductRequestsDetailsForm
          isEdit={isEdit}
          data={{
            ...productRequests,
            code: productRequests.code || '',
          }}
          initialValues={productRequests}
          onSubmit={this.handleProductSubmit}
          handleDeleteRequest={this.onHandleDeleteRequest}
          handleToggleEdit={this.onHandleToggleEdit}
          handlePrintQRCode={this.onHandlePrintQRCode}
          handleViewTransaction={this.onHandleViewTransaction}
          handleGetSelected={this.onHandleSelect}
          selectedBinSet={this.state.selectedBinSet}
          updateBinDeliveryStatusById={this.props.updateBinDeliveryStatusById}
          handleDownloadQRCode={this.onHandleDownloadQRCode}
          downloadQRCodeData={downloadQRCodeData}
          updateProductRequestDeliveryStatus={this.props.updateProductRequestDeliveryStatus}
        />
      </div>
    );
  }
}

ProductRequestsManageEditPage.propTypes = {
  setTitle: func.isRequired,
  unmountClearProductRequestsDetails: func.isRequired,
};

ProductRequestsManageEditPage.defaultProps = {
};

export default compose(
  AdminLayout,

  connect(
    state => ({
      productRequestsDetails: state.common.requestFinished.productRequestsDetails,
      productRequests: state.admin.productRequests.productRequests.productRequests || {},
      form: state.form['admin/editProductRequestsDetail'] || {},
      downloadQRCodeData: state.admin.productRequests.productRequests.downloadQRCode,
    }),
    dispatch => ({
      ...bindActionCreators({
        downloadQRCode,
      }, dispatch),

      // set page title
      setTitle: title => dispatch(setTitle(title)),

      getProductRequestsDetailsById: (data) => {
        const action = getProductRequestsDetailsById(data);
        dispatch(action);
        return action.promise;
      },

      updateProductRequestsDetails: (data) => {
        const action = updateProductRequestsDetails(data);
        dispatch(action);
        return action.promise;
      },

      deleteProductRequestsById: (data) => {
        const action = deleteProductRequestsById(data);
        dispatch(action);
        return action.promise;
      },

      unmountClearProductRequestsDetails: () => {
        const action = unmountClearProductRequestsDetails();
        dispatch(action);
        return action.promise;
      },
      updateBinDeliveryStatusById: (data) => {
        const action = updateBinDeliveryStatusById(data);
        dispatch(action);
        return action.promise;
      },

      updateProductRequestDeliveryStatus: (data) => {
        const action = updateProductRequestDeliveryStatus(data);
        dispatch(action);
        return action.promise;
      },
    }),
  ),
)(ProductRequestsManageEditPage);
