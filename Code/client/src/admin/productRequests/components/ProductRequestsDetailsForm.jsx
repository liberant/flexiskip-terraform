import React, { Component } from 'react';
import { any, bool, func, array, shape } from 'prop-types';

import { SimpleCardLayout } from '../../../common/components';
import { stylesDetails } from './Styles';
import RequestDetailsSubForm from './RequestDetailsSubForm';
import CustomerDetailsSubForm from './CustomerDetailsSubForm';
import HeaderRequestsSubForm from './HeaderRequestsSubForm';
import StatusHistorySubForm from './StatusHistorySubForm';
import ReportNotes from './notes/ReportNotes';
import RequestedProductDetailTable from './RequestedProductDetailTable';
/* eslint no-unused-expressions: 0 */


class ProductRequestsDetailsForm extends Component {
  constructor(props) {
    super(props);

    this.handleSave = this.handleSave.bind(this);
    this.handleToggleEdit = this.handleToggleEdit.bind(this);
    this.handleViewTransaction = this.handleViewTransaction.bind(this);
    this.handlePrintQRCode = this.handlePrintQRCode.bind(this);
    this.handleDeleteRequest = this.handleDeleteRequest.bind(this);
    this.handleOnSelect = this.handleOnSelect.bind(this);
    this.handleDownloadQRCode = this.handleDownloadQRCode.bind(this);
  }

  handleOnSelect(selectedRowKeys) {
    const { handleGetSelected } = this.props;
    if (handleGetSelected) {
      handleGetSelected(selectedRowKeys, []);
    }
  }

  handleDeleteRequest() {
    this.props.handleDeleteRequest();
  }

  handlePrintQRCode() {
    const { handlePrintQRCode } = this.props;
    if (handlePrintQRCode) {
      handlePrintQRCode();
    }
  }

  handleViewTransaction() {
    const { handleViewTransaction } = this.props;
    if (handleViewTransaction) {
      handleViewTransaction();
    }
  }

  handleToggleEdit() {
    const { handleToggleEdit } = this.props;
    if (handleToggleEdit) {
      handleToggleEdit();
    }
  }

  handleSave() {
    const { handleSubmit } = this.props;
    if (handleSubmit) {
      handleSubmit();
    }
  }

  handleDownloadQRCode() {
    const { handleDownloadQRCode } = this.props;
    if (handleDownloadQRCode) {
      handleDownloadQRCode();
    }
  }

  render() {
    const {
      data, isEdit,
      dirty,
      handleSubmit,
      downloadQRCodeData,
    } = this.props;

    return (
      <div>
        <div className="row" style={stylesDetails.headerBox}>
          <HeaderRequestsSubForm
            stripeChargeId={data && data.stripeChargeId}
            code={data && data.code}
            isEdit={isEdit}
            isDirty={dirty}
            handleDeleteRequest={this.handleDeleteRequest}
            handleSave={this.handleSave}
            handleToggleEdit={this.handleToggleEdit}
            handleViewTransaction={this.handleViewTransaction}
            handlePrintQRCode={this.handlePrintQRCode}
            handleDownloadQRCode={this.handleDownloadQRCode}
            downloadQRCodeData={downloadQRCodeData}
          />
        </div>
        <form onSubmit={handleSubmit} className="row">
          <div className="col-xs-6">
            <SimpleCardLayout title="Order Details" styles={stylesDetails}>
              <RequestDetailsSubForm isEdit={isEdit} data={data} />
            </SimpleCardLayout>
          </div>
          <div className="col-xs-6">
            <SimpleCardLayout title="Customer Details">
              <CustomerDetailsSubForm
                isEdit={isEdit}
                userRoles={
                  (data && data.customer && data.customer.roles) || ['residentialCustomer']
                }
              />
            </SimpleCardLayout>
          </div>

        </form>
        <div className="row">
          <div className="col-xs-12">
            <RequestedProductDetailTable
              selectedBinSet={this.props.selectedBinSet}
              data={data}
              updateBinDeliveryStatusById={this.props.updateBinDeliveryStatusById}
              updateProductRequestDeliveryStatus={this.props.updateProductRequestDeliveryStatus}
              handleOnSelect={this.handleOnSelect}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <SimpleCardLayout title="Status History">
              <StatusHistorySubForm
                data={(data && data.statusHistory) || []}
              />
            </SimpleCardLayout>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <ReportNotes />
          </div>
        </div>
      </div>
    );
  }
}

ProductRequestsDetailsForm.propTypes = {
  isEdit: bool,
  dirty: bool,
  data: any,
  handleViewTransaction: func.isRequired,
  handlePrintQRCode: func.isRequired,
  handleSubmit: func.isRequired,
  handleToggleEdit: func.isRequired,
  handleDeleteRequest: func.isRequired,
  handleGetSelected: func.isRequired,
  selectedBinSet: array.isRequired,
  updateBinDeliveryStatusById: func.isRequired,
  handleDownloadQRCode: func.isRequired,
  downloadQRCodeData: shape({
    requesting: bool.isRequired,
    data: any.isRequired,
    error: any.isRequired,
  }).isRequired,
  updateProductRequestDeliveryStatus: func.isRequired,
};

ProductRequestsDetailsForm.defaultProps = {
  isEdit: false,
  dirty: false,
  data: {},
};

export default ProductRequestsDetailsForm;
