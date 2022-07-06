import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import validate from '../helpers';
import SubmitButton from '../../../common/components/form/SubmitButton';
import { renderInput } from '../../../common/components/form/reduxFormComponents';

import SingleMainBox from '../../../common/components/SingleMainBox';
import { MAIN_COLOR } from '../../../common/constants/styles';

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
  },
  icon: {
    color: MAIN_COLOR,
    fontSize: 20,
  },
};


const ResetPasswordForm = ({ onHandleClose, handleSubmit, submitting }) => (
  <SingleMainBox>
    <SingleMainBox.Header
      title="Forgot Password"
      handleClose={onHandleClose}
    />

    <SingleMainBox.Content>
      <form onSubmit={handleSubmit}>
        <div style={{
          fontSize: 14,
          marginBottom: 20,
          color: '#666666',
          margin: '50px auto 32px',
          }}
        >
          Enter your email address and we will send you password reset instructions
        </div>
        <div style={{ margin: 'auto', width: 360 }}>
          <div className="text-left">
            <Field name="email" component={renderInput} type="text" placeholder="Email" label="" icon style={Styles}>
              <span className="handel-mail" />
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
                borderRadius: 3,
              }}
            >
              RESET PASSWORD
            </SubmitButton>
          </div>

        </div>
      </form>

    </SingleMainBox.Content>
    <SingleMainBox.Footer />

  </SingleMainBox>
);

ResetPasswordForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  onHandleClose: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'adminResetPassword',
  validate,
})(ResetPasswordForm);
