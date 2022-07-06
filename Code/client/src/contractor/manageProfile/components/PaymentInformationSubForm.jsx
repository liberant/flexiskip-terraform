import React from 'react';
import { Field } from 'redux-form';
import { bool, func, string } from 'prop-types';

import {
  renderInput,
  renderStaticText2Rows,
} from '../../../common/components/form/reduxFormComponents';

const APP_BACKGROUND_COLOR = '#F6F6F6';

const Styles = {
  input: {
    backgroundColor: 'transparent',
    boxShadow: '0 0 0',
    borderWidth: 0,
  },
  inputBox: {
    backgroundColor: APP_BACKGROUND_COLOR,
    borderRadius: '5px',
  },
  sizePrefix: {
    fontSize: 16,
  },
  sizePostfix: {
    fontSize: 14,
  },
  textarea: {
    backgroundColor: APP_BACKGROUND_COLOR,
    borderRadius: '5px',
  },
  dropdownList: {
    width: '100%',
    height: 34,
    borderWidth: 0,
    backgroundColor: APP_BACKGROUND_COLOR,
  },
};

class PaymentInformationSubForm extends React.Component {
  render() {
    const {
      cardFieldName,
      isEdit,
      openBankDlg,
      openCardDlg,
    } = this.props;
    return (
      <div>
        <div className="row">
          <div className="col-xs-12" onClick={openBankDlg} title={isEdit ? 'Click to Edit Bank Information' : ''}>
            <Field
              icon
              name={cardFieldName}
              label="Bank Information"
              disabled
              style={
                isEdit ? Styles : {}
              }
              component={
                isEdit ? renderInput : renderStaticText2Rows
              }
            >
              <span>
                **** &nbsp; **** &nbsp; **** &nbsp;
              </span>
            </Field>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12" onClick={openCardDlg} title={isEdit ? 'Click to Edit Payment Information' : ''}>
            <Field
              icon
              disabled
              name={cardFieldName}
              label="Payment Information"
              style={
                isEdit ? Styles : {}
              }
              component={
                isEdit ? renderInput : renderStaticText2Rows
              }
            >
              <span>
                <i className="fa fa-cc-visa" />
                - **** &nbsp; **** &nbsp; **** &nbsp;
              </span>
            </Field>
          </div>
        </div>
      </div>
    );
  }
}

PaymentInformationSubForm.propTypes = {
  cardFieldName: string,
  isEdit: bool,
  openBankDlg: func.isRequired,
  openCardDlg: func.isRequired,
};

PaymentInformationSubForm.defaultProps = {
  cardFieldName: 'payment.cardLast4Digits',
  isEdit: false,
};

export default PaymentInformationSubForm;
