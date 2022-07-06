import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

import {
  required,
  normalizePhoneNumber10,
  email,
  phoneNumber,
} from '../../../common/components/form/reduxFormComponents';
import InputField from '../../../common/components/form/InputField';


class NewCustomerDetailsSubForm extends React.Component {
  render() {
    const { isEdit, isAdd } = this.props;
    return (
      <div className="w-form">
        <div className="row" style={{ fontSize: 14 }}>
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <Field
                  name="firstname"
                  label="First Name"
                  component={InputField}
                  viewOnly={!isEdit}
                  required
                  validate={[required]}
                />
              </div>
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <Field
                  name="lastname"
                  label="Last Name"
                  component={InputField}
                  viewOnly={!isEdit}
                  required
                  validate={[required]}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <Field
                  name="position"
                  label="Position"
                  component={InputField}
                  viewOnly={!isEdit}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <Field
                  name="email"
                  label="Email"
                  component={InputField}
                  viewOnly={!isEdit}
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
                  component={InputField}
                  viewOnly={!isEdit}
                  normalize={normalizePhoneNumber10}
                  required
                  validate={[required, phoneNumber]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

NewCustomerDetailsSubForm.propTypes = {
  isEdit: PropTypes.bool,
  isAdd: PropTypes.bool,
};

NewCustomerDetailsSubForm.defaultProps = {
  isEdit: false,
  isAdd: false,
};

export default NewCustomerDetailsSubForm;
