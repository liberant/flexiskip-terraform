import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

import {
  renderInput,
  required,
  normalizePhoneNumber10,
  phoneNumber,
  renderStaticText2Rows,
  renderStaticImage,
  renderDropdwonList,
} from '../../../common/components/form/reduxFormComponents';

import { userTypes } from '../constants/collectionRequestsDefs';


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
    const { isEdit, userType } = this.props;
    return (
      <div>
        <div className="row" style={{ fontSize: 14 }}>
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-4">
            <Field
              name="customer.avatar"
              component={renderStaticImage}
              style={Styles.staticImage}
              required
            />
          </div>
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8">
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <Field
                  name={`customer.${userType}Profile.firstname`}
                  label="First Name"
                  component={renderStaticText2Rows}
                />
              </div>
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <Field
                  name={`customer.${userType}Profile.lastname`}
                  label="Last Name"
                  component={renderStaticText2Rows}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <Field
                  name="customer.userTypeLabel"
                  label="Customer Type"
                  dropdownLabel="Choose Type"
                  data={userTypes}
                  component={
                    isEdit ? renderDropdwonList : renderStaticText2Rows
                  }
                  style={
                    isEdit ? Styles.dropdownList : {}
                  }
                  required
                  validate={[required]}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <Field
                  name={`customer.${userType}Profile.address`}
                  label="Delivery Address"
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
                  name="customer.email"
                  label="Email"
                  component={renderStaticText2Rows}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <Field
                  name={`customer.${userType}Profile.phone`}
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
        </div>
      </div>
    );
  }
}

CustomerDetailsSubForm.propTypes = {
  isEdit: PropTypes.bool,
  userType: PropTypes.string,
};

CustomerDetailsSubForm.defaultProps = {
  isEdit: false,
  userType: 'residentialCustomer',
};

export default CustomerDetailsSubForm;
