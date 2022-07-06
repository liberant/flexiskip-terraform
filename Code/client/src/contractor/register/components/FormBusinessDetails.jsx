import React from 'react';
import { bool, func, number } from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { validateLoginData as validate } from '../helpers';
import SubmitButton from '../../../common/components/form/SubmitButton';
import AddressField from '../../../common/components/form/AddressField';


import {
  renderInput,
  required,
  email,
  normalizeABNNumber,
  normalizePhoneNumber10,
  fixedNumberLength11,
  fixedNumberLength10,
  geoAddress,
  validateAddress,
  // normalizePhoneNumber,
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
    color: '#555',
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
};


class FormBusinessDetails extends React.Component {
  render() {
    const {
      handleBack, handleSubmit,
      submitting,
      page,
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
          <div style={CommonStyles.mainArea} >
            <div style={{ textAlign: 'center', fontSize: 28, marginBottom: 50 }}>
              Business Details
            </div>
            <div>
              <Field
                name="company.abn"
                label=""
                style={{ display: 'none', ...Styles }}
                component={renderInput}
                placeholder="ABN"
                required
                normalize={normalizeABNNumber}
                validate={[required, fixedNumberLength11]}
              />
              <Field
                name="company.name"
                label=""
                style={{ display: 'none', ...Styles }}
                component={renderInput}
                placeholder="Company Name"
                required
                validate={[required]}
              />
              <Field
                name="company.address"
                label=""
                icon
                style={{ display: 'none', ...Styles }}
                component={AddressField}
                placeholder="Company Address"
                required
                validate={[required, validateAddress]}
              >
                <span style={{ ...Styles.sizePrefix, fontSize: 20 }}>
                  <span className="handel-Asset-27" />
                </span>
              </Field>
              <Field
                name="company.phone"
                label=""
                icon
                phone
                style={{ display: 'none', ...Styles }}
                component={renderInput}
                placeholder="Company Phone"
                normalize={normalizePhoneNumber10}
                required
                validate={[required, fixedNumberLength10]}
              >
                <span style={{ ...Styles.sizePrefix, fontSize: 20 }}>
                  {/* <i className="fa fa-mobile" /> */}
                  <span className="handel-mobile" />
                </span>
              </Field>
              <Field
                name="company.email"
                label=""
                icon
                style={{ display: 'none', ...Styles }}
                component={renderInput}
                placeholder="Company Email (optional)"
                validate={[email]}
              >
                <span style={{ ...Styles.sizePrefix, fontSize: 20 }}>
                  {/* <i className="fa fa-envelope-o" /> */}
                  <span className="handel-mail" />
                </span>
              </Field>
            </div>
            <div className="text-center">
              <SubmitButton
                type="submit"
                className="btn btn-default submit"
                submitting={submitting}
                submitLabel="Processing..."
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


FormBusinessDetails.propTypes = {
  handleSubmit: func.isRequired,
  handleBack: func.isRequired,
  submitting: bool.isRequired,
  page: number.isRequired,
};

FormBusinessDetails.defaultProps = {

};

export default RegisterLayout(reduxForm({
  form: 'contractorRegister',
  enableReinitialize: false,
  destroyOnUnmount: false,
  validate,
})(FormBusinessDetails));
