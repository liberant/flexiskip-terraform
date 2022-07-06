import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

import {
  email,
  normalizePhoneNumber10,
  fixedNumberLength10,
  required,
  renderStaticText2Rows,
  renderInput,
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


class AccountDetailsSubForm extends React.Component {
  render() {
    const { isEdit } = this.props;
    return (
      <div>
        <div className="row">
          <div className="col-xs-6">
            <Field
              name="firstname"
              label="First Name"
              style={
                isEdit ? Styles : {}
              }
              component={
                isEdit ? renderInput : renderStaticText2Rows
              }
              placeholder="First Name"
              required
              validate={[required]}
            />
          </div>
          <div className="col-xs-6">
            <Field
              name="lastname"
              label="Last Name"
              style={
                isEdit ? Styles : {}
              }
              component={
                isEdit ? renderInput : renderStaticText2Rows
              }
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
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <Field
              name="email"
              label="Email"
              style={
                isEdit ? Styles : {}
              }
              component={
                isEdit ? renderInput : renderStaticText2Rows
              }
              placeholder="Company Email"
              required
              validate={[required, email]}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <Field
              name="phone"
              label="Phone"
              style={
                isEdit ? Styles : { marginLeft: 15 }
              }
              component={
                isEdit ? renderInput : renderStaticText2Rows
              }
              icon
              phone
              placeholder="Contact Number"
              normalize={normalizePhoneNumber10}
              required
              validate={[required, fixedNumberLength10]}
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

AccountDetailsSubForm.propTypes = {
  isEdit: PropTypes.bool,
};

AccountDetailsSubForm.defaultProps = {
  isEdit: false,
};

export default AccountDetailsSubForm;
