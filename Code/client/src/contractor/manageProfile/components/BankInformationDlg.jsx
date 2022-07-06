import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { compose } from 'redux';
import { Field, reduxForm } from 'redux-form';

import { withPreventingCheckHOC } from '../../../common/hocs';

import {
  renderInput,
  required,
  numberOnly,
  number as numberValidate,
  normalizeBsbNumber,
  validateMaskedBSBNumber,
} from '../../../common/components/form/reduxFormComponents';

Modal.setAppElement('#root');
Modal.defaultStyles.overlay.backgroundColor = 'rgba(145,146,147, 0.75)';


const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 600,
    minHeight: 480,
    padding: 0,
    overflow: 'none',
  },
};

const Styles = {
  input: {
    backgroundColor: 'transparent',
    boxShadow: '0 0 0',
    borderWidth: 0,
  },
  inputBox: {
    backgroundColor: '#F6F6F6',
    borderRadius: '5px',
  },
  sizePrefix: {
    fontSize: 16,
  },
  sizePostfix: {
    fontSize: 14,
  },
};

class BankInformationDlg extends React.Component {
  render() {
    const { dlgOpen, closeDlg, handleSubmit } = this.props;
    return (
      <Modal
        isOpen={dlgOpen}
        style={{ content: customStyles.content }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              backgroundColor: '#239dff',
              color: 'white',
              padding: '16px 20px',
            }}
          >
            <div style={{ fontSize: 28 }}>Bank Info Edit</div>
            <div>
              <span
                className="handel-cross"
                style={{ cursor: 'pointer', fontSize: 32 }}
                onClick={closeDlg}
              />
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ padding: 20 }}>
              <div className="row">
                <div className="col-xs-12">
                  <Field
                    name="name"
                    label="Account Name"
                    placeholder="Account Name"
                    style={Styles}
                    component={renderInput}
                    required
                    validate={[required]}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12">
                  <Field
                    name="bsb"
                    label="Account BSB"
                    placeholder="Account BSB"
                    style={Styles}
                    component={renderInput}
                    required
                    normalize={normalizeBsbNumber}
                    validate={[required, validateMaskedBSBNumber]}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12">
                  <Field
                    name="accountNo"
                    label="Account No."
                    placeholder="Account Number"
                    style={Styles}
                    component={renderInput}
                    required
                    normalize={numberOnly}
                    validate={[required, numberValidate]}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12">
                  <div style={{ textAlign: 'center', margin: '20px auto 50px auto' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        width: 250,
                        lineHeight: '52px',
                        backgroundColor: '#239dff',
                        color: 'white',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                      onClick={handleSubmit}
                    >
                      SUBMIT
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    );
  }
}

BankInformationDlg.propTypes = {
  dlgOpen: PropTypes.bool,
  closeDlg: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

BankInformationDlg.defaultProps = {
  dlgOpen: false,
};

const BANK_INFORMATION_FORM = 'contractor/bankInformation';

const BankInformationEditForm = compose(
  reduxForm({
    form: BANK_INFORMATION_FORM,
    forceUnregisterOnUnmount: true,
    enableReinitialize: true,
  }),
  withPreventingCheckHOC,
)(BankInformationDlg);

export default BankInformationEditForm;
