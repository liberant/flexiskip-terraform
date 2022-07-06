import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

import {
  required,
  normalizePhoneNumber10,
  phoneNumber,
  email,
  validateAddress,
} from '../../../common/components/form/reduxFormComponents';
import ImagesS3UploadField from '../../../common/components/form/ImagesS3UploadField';
import AddressField from '../../../common/components/form/AddressField';
import SelectField from '../../../common/components/form/SelectField';
import InputField from '../../../common/components/form/InputField';
import { roleSelectOptions } from '../../manageAccounts/constants/userTypes';

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
    fontSize: 14,
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
  staticImage: {
    width: 100,
    height: 100,
    marginTop: 15,
    border: 'solid 2px #e2eaf0',
    borderRadius: 100,
  },
};

class CustomerDetailsSubForm extends React.Component {
  render() {
    const {
      isEdit, isDriver, isAdmin,
    } = this.props;
    return (
      <div className="w-form">
        <div className="row" style={{ fontSize: 14 }}>
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-4">
            <Field
              name="avatar"
              component={ImagesS3UploadField}
              viewOnly={!isEdit}
            />
          </div>
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8">
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
            {
              !isDriver ? (
                <div className="row">
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <Field
                      name="organisation.address"
                      label="Address"
                      component={AddressField}
                      viewOnly={!isEdit}
                      required
                      validate={[required, validateAddress]}
                    />
                  </div>
                </div>
              ) : null
            }

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
                  validate={[required, phoneNumber]}
                  required
                  phone
                />
              </div>
            </div>
            {isAdmin && (
              <Field
                name="role"
                label="User Type"
                options={roleSelectOptions}
                component={SelectField}
                validate={[required]}
                style={Styles}
                required
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

CustomerDetailsSubForm.propTypes = {
  isEdit: PropTypes.bool,
  isDriver: PropTypes.bool,
  isAdmin: PropTypes.bool,
};

CustomerDetailsSubForm.defaultProps = {
  isEdit: false,
  isDriver: false,
  isAdmin: false,
};

export default CustomerDetailsSubForm;
