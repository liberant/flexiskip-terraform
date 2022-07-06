import React from 'react';
import { Field, formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  renderStaticText2Rows,
  renderStaticImage,
  phoneNumber,
  normalizePhoneNumber10,
  validateAddress,
} from '../../../common/components/form/reduxFormComponents';
import AddressField from '../../../common/components/form/AddressField';

import { formatUserType } from '../../../common/helpers';


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
    borderRadius: '100%',
  },
};

class CustomerDetailsSubForm extends React.Component {
  render() {
    const { isEdit, status, userRoles } = this.props;
    return (
      <div>
        <div className="row" style={{ fontSize: 14 }}>
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-4">
            <Field
              name="customer.avatar"
              component={renderStaticImage}
              style={Styles.staticImage}
            />
          </div>
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8">
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <Field
                  name="customer.firstname"
                  label="First Name"
                  component={renderStaticText2Rows}
                />
              </div>
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <Field
                  name="customer.lastname"
                  label="Last Name"
                  component={renderStaticText2Rows}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-10">
                <Field
                  name="customer.userTypeLabel"
                  label="Customer Type"
                  dropdownLabel="Choose Type"
                  data={formatUserType(userRoles)}
                  component={renderStaticText2Rows}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-10">
                <Field
                  name="shippingAddress"
                  label="Delivery Address"
                  component={
                    isEdit ? AddressField : renderStaticText2Rows
                  }
                  style={
                    isEdit ? Styles : {}
                  }
                  disabled={status !== 'Pending'}
                  validate={[validateAddress]}
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
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-10">
                <Field
                  name="customer.phone"
                  label="Phone"
                  component={renderStaticText2Rows}
                  icon
                  phone
                  normalize={normalizePhoneNumber10}
                  validate={[phoneNumber]}
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
  status: PropTypes.string,
  userRoles: PropTypes.array,
};

CustomerDetailsSubForm.defaultProps = {
  isEdit: false,
  status: '',
  userRoles: ['residentialCustomer'],
};

const selector = formValueSelector('admin/editProductRequestsDetail');

export default connect((state) => {
  const status = selector(state, 'status');
  return {
    status,
  };
})(CustomerDetailsSubForm);
