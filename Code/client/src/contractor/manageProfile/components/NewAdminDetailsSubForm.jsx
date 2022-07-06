import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

import {
  email,
  required,
  renderStaticText2Rows,
  normalizePhoneNumber10,
  renderInput,
  phoneNumber,
} from '../../../common/components/form/reduxFormComponents';

// import { statusUserTypes } from '../../../common/constants/styles';

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

const renderDriverRoleAdmin = (props) => {
  const { input } = props;
  if (input.value) {
    return (
      <span>Also an Admin</span>
    );
  }

  return null;
};
renderDriverRoleAdmin.propTypes = {
  input: PropTypes.any.isRequired,
};

const renderDriverRolePrimaryContact = (props) => {
  const { input } = props;
  if (input.value) {
    return (
      <span> & Primary Contact</span>
    );
  }

  return null;
};
renderDriverRolePrimaryContact.propTypes = {
  input: PropTypes.any.isRequired,
};

class NewAdminDetailsSubForm extends React.Component {
  render() {
    const { isEdit } = this.props;
    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            {
              isEdit ? (
                <div className="row">
                  <div className="col-xs-6">
                    <Field
                      name="isDriver"
                      label="Also a Driver"
                      type="checkbox"
                      component={renderInput}
                    />
                  </div>
                  <div className="col-xs-6">
                    <Field
                      name="isPrimary"
                      label="Also a Primary Contact"
                      type="checkbox"
                      component={renderInput}
                    />
                  </div>
                </div>
              ) : (
                <div className="row">
                  <div className="col-xs-12" style={{ paddingLeft: 20 }}>
                    <Field
                      name="isAdmin"
                      label=""
                      component={renderDriverRoleAdmin}
                    />
                    <Field
                      name="isPrimary"
                      label=""
                      component={renderDriverRolePrimaryContact}
                    />
                  </div>
                </div>
              )
            }
          </div>
        </div>
        <div className="row">
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
            <Field
              name="firstname"
              label="First Name"
              component={
                isEdit ? renderInput : renderStaticText2Rows
              }
              style={
                isEdit ? Styles : {}
              }
              required
              validate={[required]}
            />
          </div>
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
            <Field
              name="lastname"
              label="Last Name"
              component={
                isEdit ? renderInput : renderStaticText2Rows
              }
              style={
                isEdit ? Styles : {}
              }
              required
              validate={[required]}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <Field
              name="email"
              label="Email"
              component={renderInput}
              style={Styles}
              required
              email
              validate={[required, email]}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <Field
              name="phone"
              label="Phone"
              component={
                isEdit ? renderInput : renderStaticText2Rows
              }
              style={
                isEdit ? Styles : { marginLeft: 15 }
              }
              normalize={normalizePhoneNumber10}
              required
              icon
              phone
              validate={[required, phoneNumber]}
            >
              <span style={{ fontSize: 16, color: '#239dff' }}>
                <span className="handel-mobile" />
              </span>
            </Field>
          </div>
        </div>

      </div>
    );
  }
}

NewAdminDetailsSubForm.propTypes = {
  isEdit: PropTypes.bool,
  // isAdmin: PropTypes.bool,
};

NewAdminDetailsSubForm.defaultProps = {
  isEdit: false,
  isAdmin: false,
};

export default NewAdminDetailsSubForm;
