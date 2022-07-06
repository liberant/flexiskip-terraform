import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';

import { validateLoginData as validate } from '../helpers';
import CheckboxField from '../../../common/components/form/CheckboxField';
import SubmitButton from '../../../common/components/form/SubmitButton';
import { renderInput, required, email } from '../../../common/components/form/reduxFormComponents';
import SingleMainBox from '../../../common/components/SingleMainBox';
import { MAIN_COLOR } from '../../../common/constants/styles';
import InputPasswordField from '../../../common/components/form/InputPasswordField';


const Styles = {
  outerBox: {
    marginBottom: 10,
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
  },
  icon: {
    color: MAIN_COLOR,
    lineHeight: '35px',
    fontSize: 20,
  },
  label: {
    display: 'none',
  },
};
const pageStyles = {
  box: {
    display: 'none',
  },
};

const LoginForm = ({ handleSubmit, submitting }) => (
  <SingleMainBox>
    <SingleMainBox.Header styles={pageStyles} />
    <SingleMainBox.Content>
      <form onSubmit={handleSubmit} style={{ margin: 'auto', width: 360 }}>
        <div className="text-center">
          <span style={{
            fontSize: 28,
            color: '#666666',
            display: 'inline-block',
            margin: '50px auto',
          }}
          >
            Sign In
          </span>
        </div>
        <div className="text-left">
          <Field name="loginId" component={renderInput} type="text" placeholder="Email" icon style={Styles} label="" validate={[required, email]}>
            <span className="handel-mail" />
          </Field>
        </div>
        <div className="text-left">
          <Field name="password" component={InputPasswordField} type="password" placeholder="Password" icon style={Styles} label="" validate={[required]} showRules={false}>
            <span className="handel-lock" />
          </Field>
        </div>
        <div className="text-left" style={{ display: 'none' }}>
          <Field name="remember" component={CheckboxField} label="Remember me" />
        </div>
        <div>
          <SubmitButton
            type="submit"
            className="btn btn-default submit"
            submitting={submitting}
            submitLabel="Logging..."
            style={{
              width: '100%',
              backgroundColor: MAIN_COLOR,
              fontWeight: '600',
              color: '#FFFFFF',
              height: '52px',
              borderRadius: 3,
            }}
          >
            SIGN IN
          </SubmitButton>
          <br />
          <Link
            className="reset_pass"
            to="/admin/reset-password"
            style={{
              float: 'none',
              color: MAIN_COLOR,
              display: 'block',
              marginRight: 0,
              fontWeight: '600',
              fontSize: 14,
            }}
          >
            Forgot Password?
          </Link>
        </div>
      </form>
    </SingleMainBox.Content>
  </SingleMainBox>
);

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default reduxForm({
  form: 'adminLogin',
  validate,
})(LoginForm);
