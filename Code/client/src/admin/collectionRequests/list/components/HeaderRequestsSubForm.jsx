import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { any, bool, func, string } from 'prop-types';

import ActionButton from '../../../common/components/ActionButton';
import styles, { stylesDetails } from './Styles';

const BackPreviousPage = props => (
  <div style={{ display: 'flex' }}>
    <Link to="/admin/product-requests" style={stylesDetails.backArrowBox}>
      <div style={stylesDetails.backBox}>
        <span>
          <i className="fa fa-angle-left" />
        </span>
      </div>
    </Link>
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
};

const ActionButtons = (props) => {
  const {
    editFlag,
    handleViewTransaction,
    handlePrintQRCode,
    handleCancel,
    handleSave,
    handleDelete,
  } = props;
  const toggleShowStyle = editFlag ? styles.showMe : styles.hideMe;
  const saveBtnIconName = editFlag ? 'handel-floppy-disk' : 'handel-pencil';
  const saveBtnLabel = editFlag ? 'Save' : 'Edit';
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 20,
      marginLeft: 34,
    }}
    >
      <div>
        <ActionButton
          title="View Transaction"
          stylesExtra={{
            btnStyles: {
              backgroundColor: '#72c814',
              boxShadow: '0 4px 8px 0 rgba(114, 200, 20, 0.3)',
            },
          }}
          handleClick={handleViewTransaction}
        />
        <ActionButton
          title="Print QR Code"
          spanName="handel-printer"
          stylesExtra={{
            btnStyles: {
              backgroundColor: '#72c814',
              boxShadow: '0 4px 8px 0 rgba(114, 200, 20, 0.3)',
            },
          }}
          handleClick={handlePrintQRCode}
        />
        <ActionButton
          title="Delete"
          spanName="handel-bin"
          stylesExtra={{
            btnStyles: {
              backgroundColor: '#f06666',
              boxShadow: '0 4px 8px 0 rgba(240, 102, 102, 0.3)',
            },
          }}
          handleClick={handleDelete}
        />
      </div>
      <div>
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
      </div>

    </div>
  );
};

ActionButtons.propTypes = {
  editFlag: bool.isRequired,
  handleViewTransaction: func.isRequired,
  handlePrintQRCode: func.isRequired,
  handleCancel: func.isRequired,
  handleSave: func.isRequired,
  handleDelete: func.isRequired,
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
    const { code, isEdit } = this.props;

    return (
      <div>
        <div className="back-previous-box col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <BackPreviousPage
            code={code}
          />
        </div>
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" >
          <ActionButtons
            editFlag={isEdit}
            handleDelete={this.handleDeleteRequest}
            handleViewTransaction={this.handleViewTransaction}
            handlePrintQRCode={this.handlePrintQRCode}
            handleCancel={this.handleCancel}
            handleSave={this.handleSave}
            handleToggleEdit={this.handleToggleEdit}
          />
        </div>
      </div>
    );
  }
}

HeaderRequestsSubForm.propTypes = {
  code: any.isRequired,
  isEdit: bool.isRequired,
  isDirty: bool.isRequired,
  history: any.isRequired,
  handleDeleteRequest: func.isRequired,
  handleViewTransaction: func.isRequired,
  handlePrintQRCode: func.isRequired,
  handleSave: func.isRequired,
  handleToggleEdit: func.isRequired,
};

HeaderRequestsSubForm.defaultProps = {

};

export default withRouter(HeaderRequestsSubForm);
