import React from 'react';
import { bool, func, number, string } from 'prop-types';
import { Field, reduxForm } from 'redux-form';
// import { StripeProvider, Elements } from 'react-stripe-elements';

import { validateLoginData as validate } from '../helpers';
import SubmitButton from '../../../common/components/form/SubmitButton';
import {
  renderInput,
  required,
  // number as numberValidate,
  // normalizeCcv,
  normalizeBsbNumber,
  // normalizeCardExpireDate,
  fixedNumberLength6,
  // validateMaskedCardExpireDate,

  // normalizeCreditCard,
  normalizeBankAccount,

  minNumberLength,
  maxNumberLength,
  // fixedNumberLength16,
} from '../../../common/components/form/reduxFormComponents';
import RegisterLayout from '../../hoc/RegisterLayout';

import ItemHeader from './ItemHeader';
import ItemCounter from './ItemCounter';
import CommonStyles from './Styles';


/* eslint react/no-unescaped-entities: 0 */

const Styles = {
  outerBox: {
    paddingLeft: 0,
  },
  input: {
    backgroundColor: 'transparent',
    boxShadow: '0 0 0',
    borderWidth: 0,
  },
  inputBox: {
    backgroundColor: '#F6F6F6',
    borderRadius: '5px',
    height: 52,
    paddingTop: 7,
  },
  sizePrefix: {
    fontSize: 20,
    color: '#239DFF',
  },
  sizePostfix: {
    fontSize: 14,
  },
  label: {
    display: 'none',
  },
  error: {
    fontSize: 14,
  },
};


const PageStyles = {
  submitButton: {
    width: '100%',
    backgroundColor: '#239DFF',
    fontWeight: '600',
    color: '#FFF',
    marginTop: 9,
    textShadow: 'none',
    height: 52,
    borderRadius: 3,
  },
  subTitle: {
    textAlign: 'center',
    fontSize: 18,
    color: '#239DFF',
    marginBottom: 15,
    marginTop: 15,
  },
  cardErrorHint: {
    color: 'red',
  },
};


const minNumberLength8 = minNumberLength(8);
const maxNumberLength9 = maxNumberLength(9);

class FormBankPaymentDetails extends React.Component {
  render() {
    const {
      handleBack, handleSubmit,
      submitting,
      page,
      // cardErrorFlag, cardErrorHint,
    } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <ItemHeader
          handleBack={handleBack}
        />
        <div className="login_wrapper">
          <ItemCounter
            page={page}
          />
          <div style={CommonStyles.mainArea}>
            <div style={{ textAlign: 'center', fontSize: 28, marginBottom: 50 }}>
              Bank & Payment Details
            </div>
            <div style={PageStyles.subTitle}>
              Banking Information
            </div>
            <div>
              <span>
                Nam porttitor blandit accumsan. Ut vel dictum sem, a pretium dui.
                In malesuada enim in dolor euismod.
              </span>
            </div>
            <div>
              <Field
                name="account.name"
                label=""
                style={{ display: 'none', ...Styles }}
                component={renderInput}
                placeholder="Account Name"
                required
                validate={[required]}
              />
              <Field
                name="account.bsb"
                label=""
                style={{ display: 'none', ...Styles }}
                component={renderInput}
                placeholder="Account BSB"
                required
                normalize={normalizeBsbNumber}
                validate={[required, fixedNumberLength6]}
              />
              <Field
                name="account.number"
                label=""
                style={{ display: 'none', ...Styles }}
                component={renderInput}
                placeholder="Account Number"
                required
                normalize={normalizeBankAccount}
                validate={[required, minNumberLength8, maxNumberLength9]}
              />
              {/* <div style={PageStyles.subTitle}>
                Payment Details
              </div>
              <Field
                name="card.number"
                label=""
                style={{ display: 'none', ...Styles }}
                component={renderInput}
                placeholder="Card Number"
                normalize={normalizeCreditCard}
                required
                validate={[required, fixedNumberLength16]}
              />
              <Field
                name="card.holder"
                label=""
                style={{ display: 'none', ...Styles }}
                component={renderInput}
                placeholder="Card Holder Name"
                required
                validate={[required]}
              /> */}
            </div>
            {/* <div className="row">
              <div className="col-xs-6">
                <Field
                  name="card.expireDate"
                  label=""
                  style={{ display: 'none', ...Styles }}
                  component={renderInput}
                  placeholder="MM/YYYY"
                  required
                  normalize={normalizeCardExpireDate}
                  validate={[required, validateMaskedCardExpireDate]}
                />
              </div>
              <div className="col-xs-6">
                <Field
                  name="card.cvc"
                  label=""
                  style={{ display: 'none', ...Styles }}
                  component={renderInput}
                  placeholder="CVC"
                  required
                  normalize={normalizeCcv}
                  validate={[required, numberValidate]}
                />
              </div>
            </div> */}
            {/* <div style={PageStyles.cardErrorHint}>
              {
                cardErrorFlag && cardErrorHint
              }
            </div> */}
            <div className="text-center">
              <SubmitButton
                type="submit"
                className="btn btn-default submit"
                submitting={submitting}
                submitLabel="Validating..."
                style={PageStyles.submitButton}
              >
                CONTINUE
              </SubmitButton>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

FormBankPaymentDetails.propTypes = {
  handleSubmit: func.isRequired,
  handleBack: func.isRequired,
  submitting: bool.isRequired,
  page: number.isRequired,
  cardErrorFlag: bool.isRequired,
  cardErrorHint: string.isRequired,
};

FormBankPaymentDetails.defaultProps = {

};


export default RegisterLayout(reduxForm({
  form: 'contractorRegister',
  enableReinitialize: false,
  destroyOnUnmount: false,
  validate,
})(FormBankPaymentDetails));
