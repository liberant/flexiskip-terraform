import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import validate from '../helpers';
import SubmitButton from '../../../common/components/form/SubmitButton';
import {
  password,
  required, minLength8,
  maxLength256,
} from '../../../common/components/form/reduxFormComponents';
import SingleMainBox from '../../../common/components/SingleMainBox';
import { MAIN_COLOR } from '../../../common/constants/styles';
import InputPasswordField from '../../../common/components/form/InputPasswordField';


const Styles = {
  outerBox: {
    paddingLeft: 0,
  },
  input: {
    backgroundColor: 'transparent',
    boxShadow: '0 0 0',
    color: 'black',
    fontSize: 14,
  },
  inputBox: {
    backgroundColor: '#F6F6F6',
    borderRadius: '3px',
    height: 52,
    paddingTop: 7,
    width: 350,
  },
  icon: {
    color: MAIN_COLOR,
    fontSize: 20,
  },
};
const pageStyles = {
  close: {
    display: 'none',
  },
  title: {
    marginLeft: '33%',
  },
};

const ForgotPasswordForm = ({ handleSubmit, submitting, isSet }) => (
  <SingleMainBox>
    <SingleMainBox.Header
      title="Enter New Password"
      styles={pageStyles}
    />
    <SingleMainBox.Content>
      <form onSubmit={handleSubmit}>
        <div style={{ margin: 'auto', width: 360 }}>

          <div style={{
            fontSize: 14,
            marginBottom: 20,
            color: '#666666',
            margin: '50px auto 32px',
          }}
          >
            Enter a new password to use with this account
          </div>
          <div className="text-left">
            <Field
              name="password"
              component={InputPasswordField}
              type="password"
              placeholder="New Password"
              label=""
              icon
              style={Styles}
              validate={[required, minLength8, password, maxLength256]}
            >
              <span className="handel-lock" />
            </Field>
          </div>
          <div className="text-left">
            <Field
              name="newPassword"
              component={InputPasswordField}
              type="password"
              placeholder="Retype New Password"
              label=""
              icon
              style={Styles}
              required
              validate={[required, minLength8, password, maxLength256]}
            >
              <span className="handel-lock" />
            </Field>
          </div>
          <div>
            <SubmitButton
              type="submit"
              className="btn btn-default submit"
              submitting={submitting}
              submitLabel="Processing..."
              style={{
                width: '100%',
                backgroundColor: MAIN_COLOR,
                fontWeight: '600',
                color: '#FFFFFF',
                marginTop: 9,
                height: '52px',
              }}
            >
              {isSet ? 'SET PASSWORD' : 'RESET PASSWORD'}
            </SubmitButton>
          </div>
        </div>
      </form>
    </SingleMainBox.Content>
  </SingleMainBox>

);

ForgotPasswordForm.propTypes = {
  isSet: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default reduxForm({
  form: 'admin/ForgotPassword',
  validate,
})(ForgotPasswordForm);
