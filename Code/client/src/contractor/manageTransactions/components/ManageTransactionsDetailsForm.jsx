import React, { Component } from 'react';
import { any, bool, func } from 'prop-types';
import { FormSection } from 'redux-form';

import { SimpleCardLayout } from '../../../common/components';
import { stylesDetails } from './Styles';
import RequestDetailsSubForm from './RequestDetailsSubForm';
import CustomerDetailsSubForm from './CustomerDetailsSubForm';
import CommonLocalDataTable from '../../../common/components/CommonLocalDataTable';
import { columnsItems, columnsStatusHistories } from './columnsDef';
import HeaderRequestsSubForm from './HeaderRequestsSubForm';
/* eslint no-unused-expressions: 0 */


class ProductRequestsDetailsForm extends Component {
  constructor(props) {
    super(props);

    this.handleSave = this.handleSave.bind(this);
    this.handleToggleEdit = this.handleToggleEdit.bind(this);
    this.handleViewTransaction = this.handleViewTransaction.bind(this);
    this.handlePrintQRCode = this.handlePrintQRCode.bind(this);
    this.handleDeleteRequest = this.handleDeleteRequest.bind(this);
  }

  handleDeleteRequest() {
    this.props.handleDeleteRequest();
  }

  handlePrintQRCode() {
    this.props.handlePrintQRCode();
  }

  handleViewTransaction() {
    this.props.handleViewTransaction();
  }

  handleToggleEdit() {
    this.props.handleToggleEdit();
  }

  handleSave() {
    this.props.handleSubmit();
  }

  render() {
    const {
      data, isEdit,
      dirty,
      handleSubmit,
    } = this.props;
    const driverName = (data && data.driver) ?
      `${data.driver.firstname} ${data.driver.lastname}` : '';

    return (
      <form onSubmit={handleSubmit}>
        <div className="row" style={stylesDetails.headerBox}>
          <HeaderRequestsSubForm
            code={data && data.code}
            isEdit={isEdit}
            isDirty={dirty}
            handleDeleteRequest={this.handleDeleteRequest}
            handleSave={this.handleSave}
            handleToggleEdit={this.handleToggleEdit}
            handleViewTransaction={this.handleViewTransaction}
            handlePrintQRCode={this.handlePrintQRCode}
          />
        </div>
        <div className="row">
          <div className="col-xs-6">
            <SimpleCardLayout title="Order Details">
              <RequestDetailsSubForm isEdit={isEdit} />
            </SimpleCardLayout>
            <SimpleCardLayout title="Status History">
              <CommonLocalDataTable
                data={(data && data.statusHistories) || []}
                columnsDef={columnsStatusHistories}
                selectRowFlag={false}
                stylesExtra={{ tableBox: { marginTop: '-10px', padding: '0 10px' } }}
              />
            </SimpleCardLayout>
          </div>
          <div className="col-xs-6">
            <SimpleCardLayout title="Customer Details">
              <FormSection name="customer">
                <CustomerDetailsSubForm
                  isEdit={isEdit}
                  userType={
                    (data && data.customer && data.customer.userType) || 'residentialCustomer'
                  }
                />
              </FormSection>

            </SimpleCardLayout>
          </div>

        </div>
        <div className="row">
          <div className="col-xs-12">
            <SimpleCardLayout title="Requested Bins">
              <CommonLocalDataTable
                data={(data && data.items && (data.items.map(item => (
                  {
                    ...item.bin, driverName,
                  })))) || []}
                columnsDef={columnsItems}
                selectRowFlag={false}
              />
            </SimpleCardLayout>
          </div>
        </div>

      </form>
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
};

ProductRequestsDetailsForm.defaultProps = {
  isEdit: false,
  dirty: false,
  data: {},
};

export default ProductRequestsDetailsForm;
