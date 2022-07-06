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
  normalizeCcv,
  normalizeCardExpireDate,
  validateMaskedCardExpireDate,
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
    overflow: 'none',
    padding: 0,
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

class CardInformationDlg extends React.Component {
  render() {
    const {
      dlgOpen, closeDlg, cardErrorFlag, cardErrorHint,
      handleSubmit,
    } = this.props;
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
            <div style={{ fontSize: 28 }}>Payment Info Edit</div>
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
                    label="Card Holder Name"
                    placeholder="Card Holder Name"
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
                    icon
                    rightSide
                    name="number"
                    label="Card Number"
                    placeholder="Card Number"
                    style={Styles}
                    component={renderInput}
                    normalize={numberOnly}
                    required
                    validate={[required, numberValidate]}
                  >
                    <i className="fa fa-cc-visa" />
                  </Field>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-6">
                  <Field
                    name="expireDate"
                    label="Expiry Date"
                    style={{ ...Styles }}
                    component={renderInput}
                    placeholder="MM/YYYY"
                    required
                    normalize={normalizeCardExpireDate}
                    validate={[required, validateMaskedCardExpireDate]}
                  />
                </div>
                <div className="col-xs-6">
                  <Field
                    name="cvc"
                    label="CVC"
                    style={{ ...Styles }}
                    component={renderInput}
                    placeholder="CVC"
                    required
                    normalize={normalizeCcv}
                    validate={[required, numberValidate]}
                  />
                </div>
              </div>
              <div style={{ color: 'red' }}>
                {
                  cardErrorFlag && cardErrorHint
                }
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


CardInformationDlg.propTypes = {
  dlgOpen: PropTypes.bool,
  closeDlg: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  cardErrorFlag: PropTypes.bool.isRequired,
  cardErrorHint: PropTypes.string.isRequired,
};

CardInformationDlg.defaultProps = {
  dlgOpen: false,
};

const CARD_INFORMATION_FORM = 'contractor/cardInformation';

const CardInformationEditForm = compose(
  reduxForm({
    form: CARD_INFORMATION_FORM,
    forceUnregisterOnUnmount: true,
    enableReinitialize: true,
  }),
  withPreventingCheckHOC,
)(CardInformationDlg);

export default CardInformationEditForm;
