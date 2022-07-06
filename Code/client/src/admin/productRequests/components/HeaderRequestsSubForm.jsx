import React from 'react';
import { withRouter } from 'react-router-dom';
import { any, bool, func, string } from 'prop-types';

import PermissionRequired from '../../../common/hocs/PermissionRequired';
import ActionButton from '../../../common/components/ActionButton';
import HandelButton from '../../../common/components/HandelButton';
import styles, { stylesDetails } from './Styles';
import AddNoteButton from './notes/AddNoteButton';

const BackPreviousPage = props => (
  <div style={{ display: 'flex' }}>
    <div style={stylesDetails.backArrowBox} onClick={props.goBack}>
      <div style={stylesDetails.backBox}>
        <span>
          <i className="fa fa-angle-left" />
        </span>
      </div>
    </div>
    <div>
      <div style={{
        ...stylesDetails.backText,
        fontSize: 20,
        lineHeight: '52px',
      }}
      >
        {props.code}
      </div>
    </div>
  </div>
);

BackPreviousPage.propTypes = {
  code: string.isRequired,
  goBack: func.isRequired,
};

const ActionButtons = (props) => {
  const {
    stripeChargeId,
    editFlag,
    // handleViewTransaction,
    handlePrintQRCode,
    handleCancel,
    handleSave,
    handleDownloadQRCode,
    downloadQRCodeData,
  } = props;
  const toggleShowStyle = editFlag ? styles.showMe : styles.hideMe;
  const saveBtnIconName = editFlag ? 'handel-floppy-disk' : 'handel-pencil';
  const saveBtnLabel = editFlag ? 'Save' : 'Edit';
  return (
    <div className="row">
      <div className="col-md-6">
        <div className="top-toolbar">
          <HandelButton
            label="View Transaction"
            href={`https://dashboard.stripe.com/payments/${stripeChargeId}`}
            target="_blank"
            iconColor="white"
            bgColor="green"
          >
            <span className="handel-history" />
          </HandelButton>

          <PermissionRequired permission="printQRCode">
            <HandelButton
              label="Print QR Code"
              onClick={handlePrintQRCode}
              iconColor="white"
              bgColor="green"
            >
              <span className="handel-printer" />
            </HandelButton>
          </PermissionRequired>

          {
            handleDownloadQRCode && (
              <PermissionRequired permission="downloadQRCode">
                {
                  downloadQRCodeData.requesting ? (
                    <div
                      style={{
                        textAlign: 'center',
                        display: 'inline-block',
                        paddingBottom: 0,
                        verticalAlign: 'top',
                        marginTop: 15,
                        width: 100,
                      }}
                    >
                      <i className="fa fa-circle-o-notch fa-spin fa-3x" />
                    </div>
                  ) : (
                    <HandelButton
                      label="Download QR Code"
                      onClick={handleDownloadQRCode}
                      iconColor="white"
                      bgColor="green"
                    >
                      <span className="handel-download" />
                    </HandelButton>
                  )
                }
              </PermissionRequired>
            )
          }
          <AddNoteButton />
        </div>
      </div>
      <div className="col-md-6 text-right">
        <PermissionRequired permission="editProductRequest">
          <ActionButton
            title="Cancel Edit"
            spanName="handel-cross"
            stylesExtra={{
              boxStyles: {
                ...toggleShowStyle,
              },
              btnStyles: {
                border: '1px solid #f06666',
                color: '#f06666',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 4px 8px 0 rgba(102, 102, 102, 0.3)',
              },
              titleStyles: { ...styles.buttonText },
            }}
            handleClick={handleCancel}
          />
          <ActionButton
            type="submit"
            title={saveBtnLabel}
            spanName={saveBtnIconName}
            stylesExtra={{
              btnStyles: {
                backgroundColor: '#239DFF',
                boxShadow: '0 4px 8px 0 rgba(35, 157, 255, 0.3)',
              },
            }}
            handleClick={handleSave}
          />
        </PermissionRequired>
      </div>
    </div>
  );
};

ActionButtons.propTypes = {
  stripeChargeId: string.isRequired,
  editFlag: bool.isRequired,
  // handleViewTransaction: func.isRequired,
  handlePrintQRCode: func.isRequired,
  handleCancel: func.isRequired,
  handleSave: func.isRequired,
  handleDownloadQRCode: func.isRequired,
  downloadQRCodeData: any.isRequired,
};


class HeaderRequestsSubForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleCancel = this.handleCancel.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleToggleEdit = this.handleToggleEdit.bind(this);
    this.handleViewTransaction = this.handleViewTransaction.bind(this);
    this.handlePrintQRCode = this.handlePrintQRCode.bind(this);
    this.handleDeleteRequest = this.handleDeleteRequest.bind(this);
    this.handleGoBack = this.handleGoBack.bind(this);
  }

  handleGoBack() {
    this.props.history.goBack();
  }

  handleDeleteRequest() {
    this.props.handleDeleteRequest();
  }

  handleCancel() {
    const { isDirty } = this.props;

    if (isDirty) {
      this.props.history.push('/admin/product-requests');
    } else {
      this.props.handleToggleEdit();
    }
    // this.props.handleToggleEdit();
  }

  handlePrintQRCode() {
    this.props.handlePrintQRCode();
  }

  handleViewTransaction() {
    this.props.handleViewTransaction();
  }


  handleSave(e) {
    const { isEdit, handleSave, handleToggleEdit } = this.props;

    if (isEdit) {
      handleSave();
    } else {
      handleToggleEdit();
      e.preventDefault();
    }
  }

  handleToggleEdit() {
    this.props.handleToggleEdit();
  }

  render() {
    const {
      code, isEdit, stripeChargeId,
      handleDownloadQRCode,
      downloadQRCodeData,
    } = this.props;

    return (
      <div>
        <div className="back-previous-box col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <BackPreviousPage
            code={code}
            goBack={this.handleGoBack}
          />
        </div>
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" >
          <ActionButtons
            stripeChargeId={stripeChargeId}
            editFlag={isEdit}
            handleDelete={this.handleDeleteRequest}
            handleViewTransaction={this.handleViewTransaction}
            handlePrintQRCode={this.handlePrintQRCode}
            handleCancel={this.handleCancel}
            handleSave={this.handleSave}
            handleToggleEdit={this.handleToggleEdit}
            handleDownloadQRCode={handleDownloadQRCode}
            downloadQRCodeData={downloadQRCodeData}
          />
        </div>
      </div>
    );
  }
}

HeaderRequestsSubForm.propTypes = {
  stripeChargeId: string.isRequired,
  code: any.isRequired,
  isEdit: bool.isRequired,
  isDirty: bool.isRequired,
  history: any.isRequired,
  handleDeleteRequest: func.isRequired,
  handleViewTransaction: func.isRequired,
  handlePrintQRCode: func.isRequired,
  handleSave: func.isRequired,
  handleToggleEdit: func.isRequired,
  handleDownloadQRCode: func,
  downloadQRCodeData: func.isRequired,
};

HeaderRequestsSubForm.defaultProps = {
  handleDownloadQRCode: null,
};

export default withRouter(HeaderRequestsSubForm);
