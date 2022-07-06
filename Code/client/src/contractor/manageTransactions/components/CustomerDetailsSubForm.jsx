import React from 'react';
import { Field } from 'redux-form';

import {
  required,
  normalizePhoneNumber10,
  phoneNumber,
  renderStaticText2Rows,
  renderStaticImage,
} from '../../../common/components/form/reduxFormComponents';

const Styles = {
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
    return (
      <div>
        <div className="row" style={{ fontSize: 14 }}>
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-4">
            <Field
              name="avatar"
              component={renderStaticImage}
              style={Styles.staticImage}
              required
            />
          </div>
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8">
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <Field
                  name="firstname"
                  label="First Name"
                  component={renderStaticText2Rows}
                />
              </div>
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <Field
                  name="lastname"
                  label="Last Name"
                  component={renderStaticText2Rows}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <Field
                  name="userTypeLabel"
                  label="Customer Type"
                  dropdownLabel="Choose Type"
                  component={renderStaticText2Rows}
                  required
                  validate={[required]}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <Field
                  name="address"
                  label="Collection Address"
                  component={renderStaticText2Rows}
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
                  component={renderStaticText2Rows}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <Field
                  name="phone"
                  label="Phone"
                  component={renderStaticText2Rows}
                  style={{ marginLeft: 15 }}
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
};

CustomerDetailsSubForm.defaultProps = {
};

export default CustomerDetailsSubForm;
