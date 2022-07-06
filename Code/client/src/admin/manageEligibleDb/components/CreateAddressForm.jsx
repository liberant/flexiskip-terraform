import React from "react";
import PropTypes from "prop-types";
import { Field, reduxForm, formValueSelector } from "redux-form";
import validate from 'validate.js';

import { Button } from "antd";
import InputField from "../../../common/components/form/InputField";
import Spinner from "../../../common/components/Spinner";

import {
  required,
  numberOnly,
} from "../../../common/components/form/reduxFormComponents";

import { connect } from 'react-redux';

class CreateAddressForm extends React.Component {
  constructor(props) {
    super(props);
  }

  normalizeNumber(value){
    const normalized = numberOnly(value);
    return !normalized ? normalized : Number(normalized);
  }

  buildFullAddress(unit_no = '<UNIT NO>', address_1 = '<ADDRESS>', city = '<CITY>', postcode = '<POSTCODE>'){
    let fullAddress = '';
    if ((address_1 != '<ADDRESS>' || city != '<CITY>' || postcode != '<POSTCODE>') && unit_no == '<UNIT NO>') unit_no = '';

    if (unit_no) fullAddress = `${unit_no} / ${address_1}, ${city}, ${postcode}`;
    else fullAddress = `${address_1}, ${city}, ${postcode}`;
    return fullAddress;
  }

  render() {
    const {
      handleSubmit,
      submitting,
      normalizeNumber,

      unit_no,
      address_1,
      city,
      postcode,
    } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <div className="w-form">
          <div className="row">
            <div className="col-xs-6">
              <Field
                name="customer_no"
                label="Customer No"
                component={InputField}
                normalize={this.normalizeNumber}
                required
                validate={[required]}
              />

              <Field
                name="unit_no"
                label="Unit No"
                component={InputField}
                normalize={this.normalizeNumber}
              />

              <Field
                name="address_1"
                label="Address 1"
                component={InputField}
                required
                validate={[required]}
              />

              <Field
                name="address_2"
                label="Address 2"
                component={InputField}
              />
            </div>

            <div className="col-xs-6">
              <Field
                name="class_electoral_division"
                label="Class Electoral Division"
                component={InputField}
                normalize={this.normalizeNumber}
                required
                validate={[required]}
              />

              <Field
                name="city"
                label="City"
                component={InputField}
                required
                validate={[required]}
              />

              <Field
                name="postcode"
                label="Postcode"
                component={InputField}
                normalize={this.normalizeNumber}
                required
                validate={[required]}
              />

              <Field
                name="full_address"
                label="Full Address"
                component={InputField}
                input={{value: this.buildFullAddress(unit_no, address_1, city, postcode)}}
                readOnly
                disabled
              />
            </div>
          </div>

          <div className="row">
            <div className="col-xs-6" style={{ margin: "0 auto", float: "none" }}>
            {submitting ? (
              <Spinner />
            ) : (
              <Button
                style={{ display: "inline-block", marginTop: "50px" }}
                size="large"
                type="primary"
                htmlType="submit"
                block
              >
                Create
              </Button>
            )}
            </div>
          </div>
        </div>
      </form>
    );
  }
}

const CREATE_ADDRESS_FORM = "admin/createAddress";
CreateAddressForm = reduxForm({
  form: CREATE_ADDRESS_FORM,
  validate: (data) => {
    const constraints = {
      customer_no: {
        presence: { allowEmpty: false },
        numericality: true,
      },
      address_1: {
        presence: { allowEmpty: false },
      },
      city: {
        presence: { allowEmpty: false },
      },
      postcode: {
        presence: { allowEmpty: false },
      },
      class_electoral_division: {
        presence: { allowEmpty: false },
      },
    };

    const errors = validate(data, constraints, { format: 'grouped' }) || {};
    return errors;
  },
})(CreateAddressForm);

const selector = formValueSelector(CREATE_ADDRESS_FORM)
CreateAddressForm = connect(
  state => {
    const { unit_no, address_1, city, postcode } = selector(state, 'unit_no', 'address_1', 'city', 'postcode')
    return {
      unit_no,
      address_1,
      city,
      postcode,
    }
  }
)(CreateAddressForm)

export default CreateAddressForm
