import React from 'react';
import { bool, func, number } from 'prop-types';
import { Field, reduxForm } from 'redux-form';
// import { StripeProvider, Elements } from 'react-stripe-elements';

import { validateLoginData as validate } from '../helpers';
import SubmitButton from '../../../common/components/form/SubmitButton';
import {
  renderInput,
  required,
  number as numberValidate,
  fixedNumberLength10,
  email,
  normalizePhoneNumber10,
  numberNormalize,
  renderDropdwonList,
  renderDatePicker,
  validateDriverDOB,
  validatePastDate,
  validateExpiryDateIssueDate,
} from '../../../common/components/form/reduxFormComponents';
import RegisterLayout from '../../hoc/RegisterLayout';

import ItemHeader from './ItemHeader';
import ItemCounter from './ItemCounter';

/* eslint react/no-unescaped-entities: 0 */
const LicenseClasses = [
  'Class LR', 'Class MR', 'Class HR', 'Class HC', 'Class MC',
];
const LicenseTypes = [
  'Type 1', 'Type 2', 'Type 3', 'Type 4',
];

const states = [
  'Queensland',
  'New South Wales',
  'Victoria',
  'South Australia',
  'Western Australia',
  'Northern Australia Territory',
  'Tasmania ',
  'Australian Capital Territory',
];

const APP_BACKGROUND_COLOR = '#F6F6F6';

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
  dropdownList: {
    width: '100%',
    height: 52,
    border: '1px solid #F6F6F6',
    borderRadius: '5px',
    backgroundColor: APP_BACKGROUND_COLOR,
    dropdownOuter: {
      marginLeft: 0,
    },
  },
  dropdownListIcon: {
    listBox: {
      width: '100%',
      height: 52,
      borderRadius: '5px',
      backgroundColor: APP_BACKGROUND_COLOR,
    },
    icon: {
      fontSize: 16,
      lineHeight: '52px',
    },
    select: {
      width: '94%',
      backgroundColor: APP_BACKGROUND_COLOR,
      border: '1px solid #F6F6F6',
      borderTopRightRadius: 5,
      borderBottomRightRadius: 5,
    },
    width: '94%',
    backgroundColor: APP_BACKGROUND_COLOR,
    border: '1px solid #F6F6F6',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    dropdownOuter: {
      marginLeft: 0,
    },
  },
  datePicker: {
    color: '#8B9DAD',
    marginBottom: 5,
    fontWeight: 'bold',
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
  },
  subTitle: {
    textAlign: 'center',
    fontSize: 18,
    color: '#239DFF',
    marginBottom: 10,
  },
  cardErrorHint: {
    color: 'red',
  },
};

class FormDriversCreate extends React.Component {
  render() {
    const {
      handleBack, handleSubmit, handleCloseAddDriver,
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
          <div style={{
              background: '#E9F5FF',
              borderTopLeftRadius: '5px',
              borderTopRightRadius: '5px',
              lineHeight: '50px',
              width: 800,
              margin: 'auto',
            }}
          >
            <div onClick={handleCloseAddDriver} style={{ cursor: 'pointer', display: 'inline-block', marginLeft: 20 }}>
              <span style={{ ...Styles.sizePrefix, fontSize: 20 }}>
                <i className="fa fa-remove" />
              </span>
              <span style={{
                  color: '#239DFF',
                  fontSize: 16,
                  display: 'inline-block',
                  marginLeft: 5,
                }}
              >
                Close
              </span>
            </div>
            <div style={{ display: 'inline-block', marginLeft: '33%', fontSize: 28 }}>
              <span>Add Driver</span>
            </div>
          </div>
          <div style={{
              padding: '50px 200px 60px',
              background: 'white',
              width: 800,
              margin: 'auto',
              borderBottomLeftRadius: 3,
              borderBottomRightRadius: 3,
            }}
          >

            <div style={{ textAlign: 'center', fontSize: 18, marginBottom: 20 }}>
              Driver Personal Details
            </div>
            <div>
              <div className="row">
                <div className="col-xs-6">
                  <Field
                    name="driver.firstname"
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
                    name="driver.lastname"
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
              <div className="row">
                <div className="col-xs-6">
                  <Field
                    name="driver.phone"
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
                </div>
                <div className="col-xs-6">
                  <Field
                    name="driver.dob"
                    label=""
                    style={{ label: Styles.datePicker, outerBox: { paddingLeft: 0 } }}
                    component={renderDatePicker}
                    placeholder="DOB"
                    required
                    validate={[required, validateDriverDOB]}
                  />
                </div>
              </div>

              <Field
                name="driver.email"
                label=""
                icon
                style={{ display: 'none', ...Styles }}
                component={renderInput}
                placeholder="Company Email"
                required
                validate={[required, email]}
              >
                <span style={{ ...Styles.sizePrefix, fontSize: 16 }}>
                  {/* <i className="fa fa-envelope-o" /> */}
                  <span className="handel-mail" />
                </span>
              </Field>
            </div>

            <div style={{ textAlign: 'center', fontSize: 18, marginBottom: 20 }}>
              License Details
            </div>
            <div>
              <Field
                name="driver.licence.licenceNo"
                label=""
                style={{ display: 'none', ...Styles }}
                component={renderInput}
                placeholder="Licence No."
                normalize={numberNormalize}
                required
                validate={[required, numberValidate]}
              />

              <div className="row">
                <div className="col-xs-6">
                  <Field
                    name="driver.licence.licenceClass"
                    label=""
                    style={Styles.dropdownList}
                    dropdownLabel="Licence Class"
                    data={LicenseClasses}
                    component={renderDropdwonList}
                    placeholder="Licence Class"
                    required
                    validate={[required]}
                  />
                </div>
                <div className="col-xs-6">
                  <Field
                    name="driver.licence.licenceType"
                    label=""
                    style={Styles.dropdownList}
                    dropdownLabel="Licence Type"
                    data={LicenseTypes}
                    component={renderDropdwonList}
                    placeholder="Licence Type"
                    required
                    validate={[required]}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-xs-6">
                  <Field
                    name="driver.licence.dateOfIssued"
                    label=""
                    style={{ label: Styles.datePicker, outerBox: { paddingLeft: 0 } }}
                    component={renderDatePicker}
                    placeholder="Date of Issue"
                    required
                    validate={[required, validatePastDate]}
                  />
                </div>
                <div className="col-xs-6">
                  <Field
                    name="driver.licence.expiryDate"
                    label=""
                    style={{ label: Styles.datePicker, outerBox: { paddingLeft: 0 } }}
                    component={renderDatePicker}
                    placeholder="Expiry Date"
                    required
                    validate={[required, validateExpiryDateIssueDate]}
                  />
                </div>
              </div>
              <Field
                name="driver.licence.stateIssue"
                label=""
                icon
                style={Styles.dropdownListIcon}
                dropdownLabel="State of Issue"
                data={states}
                component={renderDropdwonList}
                placeholder="State of Issue"
                required
                validate={[required]}
              >
                <span style={{ ...Styles.sizePrefix, fontSize: 16 }}>
                  <span className="handel-Asset-27" />
                </span>
              </Field>

            </div>

            <div className="text-center">
              <SubmitButton
                type="submit"
                className="btn btn-default submit"
                submitting={submitting}
                submitLabel="Adding..."
                style={PageStyles.submitButton}
              >
                ADD DRIVER
              </SubmitButton>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

FormDriversCreate.propTypes = {
  handleSubmit: func.isRequired,
  handleBack: func.isRequired,
  handleCloseAddDriver: func.isRequired,
  submitting: bool.isRequired,
  page: number.isRequired,
};

FormDriversCreate.defaultProps = {

};


export default RegisterLayout(reduxForm({
  form: 'contractorRegister',
  enableReinitialize: false,
  destroyOnUnmount: false,
  validate,
})(FormDriversCreate));
