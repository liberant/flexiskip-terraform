import React from 'react';
import { bool, func, number } from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { validateLoginData as validate } from '../helpers';
import SubmitButton from '../../../common/components/form/SubmitButton';
import {
  renderInput,
  required,
  email,
  normalizePhoneNumber10,
  fixedNumberLength10,
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
};

class FormPrimaryContactDetails extends React.Component {
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
          <div style={CommonStyles.mainArea}>
            <div style={{ textAlign: 'center', fontSize: 20, marginBottom: 20 }}>
              Primary Contact Details
            </div>
            <div>
              <div className="row">
                <div className="col-xs-6">
                  <Field
                    name="contact.firstname"
                    label=""
                    icon
                    style={{ display: 'none', ...Styles }}
                    component={renderInput}
                    placeholder="First Name"
                    required
                    validate={[required]}
                  >
                    <span style={{ ...Styles.sizePrefix, fontSize: 16 }}>
                      {/* <i className="fa fa-user-o" /> */}
                      <span className="handel-user" />
                    </span>
                  </Field>
                </div>
                <div className="col-xs-6">
                  <Field
                    name="contact.lastname"
                    label=""
                    icon
                    style={{ display: 'none', ...Styles }}
                    component={renderInput}
                    placeholder="Last Name"
                    required
                    validate={[required]}
                  >
                    <span style={{ ...Styles.sizePrefix, fontSize: 16 }}>
                      {/* <i className="fa fa-user-o" /> */}
                      <span className="handel-user" />
                    </span>
                  </Field>
                </div>
              </div>
              <Field
                name="contact.phone"
                label=""
                icon
                style={{ display: 'none', ...Styles }}
                component={renderInput}
                placeholder="Contact Number"
                normalize={normalizePhoneNumber10}
                required
                validate={[required, fixedNumberLength10]}
              >
                <span style={{ ...Styles.sizePrefix, fontSize: 16 }}>
                  {/* <i className="fa fa-mobile" /> */}
                  <span className="handel-mobile" />
                </span>
              </Field>
              <Field
                name="email"
                label=""
                icon
                style={{ display: 'none', ...Styles }}
                component={renderInput}
                placeholder="Email"
                required
                validate={[required, email]}
              >
                <span style={{ ...Styles.sizePrefix, fontSize: 16 }}>
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
            <div className="text-center">
              <Field
                name="isDriver"
                type="checkbox"
                label="I am also a driver"
                component={renderInput}
                style={{ label: { color: '#239DFF' } }}
              />
            </div>
            <div className="text-center" style={{ marginBottom: 174 }}>
              <span>
                You will be able to add other Adminstrative users accounts for your business
                after completing your registration. Go to your Profile to add users.
              </span>
            </div>
          </div>
        </div>
      </form>
    );
  }
}


FormPrimaryContactDetails.propTypes = {
  handleSubmit: func.isRequired,
  handleBack: func.isRequired,
  submitting: bool.isRequired,
  page: number.isRequired,
};

FormPrimaryContactDetails.defaultProps = {

};

export default RegisterLayout(reduxForm({
  form: 'contractorRegister',
  enableReinitialize: false,
  destroyOnUnmount: false,
  validate,
})(FormPrimaryContactDetails));
