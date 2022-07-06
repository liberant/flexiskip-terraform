import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';

// import { validateProfileData as validate } from '../helpers';
import SubmitButton from '../../../common/components/form/SubmitButton';
import {
  renderInput,
  required,
  minLength8,
  password,
} from '../../../common/components/form/reduxFormComponents';

const InputStyles = {
  input: {
    backgroundColor: 'transparent',
    boxShadow: '0 0 0',
    color: 'black',
    fontSize: 14,
    borderWidth: 0,
  },
  inputBox: {
    backgroundColor: '#F6F6F6',
    borderRadius: '5px',
    height: 52,
    paddingTop: 7,
  },
  icon: {
    color: '#239DFF',
  },
  label: {
    display: 'none',
  },
  error: {
    fontSize: 14,
  },
};

const ProfileForm = ({ handleSubmit, submitting }) => (
  <form onSubmit={handleSubmit}>
    <div>
      <legend>Account Information</legend>
      {/* <Field name="username" component={InputField} type="text" label="Username" disabled /> */}
      <Field
        name="email"
        component={renderInput}
        type="email"
        label="Email"
        disabled
        icon
        style={InputStyles}
      >
        <span className="handel-mail" />
      </Field>
    </div>
    <br />
    <div>
      <legend>Change password</legend>
      <div />
      <Field
        name="currentPassword"
        component={renderInput}
        type="password"
        placeholder="Current Password"
        icon
        style={InputStyles}
        label=""
        required
        validate={[required, minLength8, password]}
      >
        <span className="handel-lock" />
      </Field>
    </div>
    <div>
      <Field
        name="newPassword"
        component={renderInput}
        type="password"
        label=""
        placeholder="New Password"
        style={InputStyles}
        icon
        validate={[required, minLength8, password]}
      >
        <span className="handel-lock" />
      </Field>
    </div>
    <div>
      <Field
        name="repeatPassword"
        component={renderInput}
        type="password"
        label=""
        placeholder="Repeat Password"

        icon
        style={InputStyles}
        validate={[required, minLength8, password]}
      >
        <span className="handel-lock" />
      </Field>
    </div>
    <div className="form-group">
      <SubmitButton type="submit" className="btn btn-primary" submitting={submitting} submitLabel="Saving...">Save</SubmitButton>
    </div>
  </form>
);

ProfileForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default reduxForm({
  form: 'updateProfile',
  destoryOnUnmount: false,
  enableReinitialize: true,
})(ProfileForm);
