import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray, reduxForm, formValueSelector } from 'redux-form';
import validate from 'validate.js';
import { compose } from 'redux';
import { connect } from 'react-redux';

import CouncilSelectField from './CouncilSelectField';
import OpenDaysField from './OpenDaysField';
import WasteTypesField from './WasteTypesField';
import AddressField from '../../../common/components/form/AddressField';
import InputField from '../../../common/components/form/InputField';
import { validateAddress } from '../../../common/components/form/reduxFormComponents';

function validateCharges(value) {
  if (!Array.isArray(value)) {
    return "Waste Type can't be blank";
  }

  if (value.length === 0) {
    return "Waste Type can't be blank";
  }

  const constraints = {
    wasteType: {
      presence: { allowEmpty: false, message: "^Waste Type can't be blank" },
    },
    price: {
      presence: {
        allowEmpty: false, message: "^Price can't be blank",
      },
      numericality: {
        greaterThan: 0,
        message: '^Price must be a number and greater than 0',
      },
    },
  };

  const itemErrors = value.map(item => validate(item, constraints, { format: 'grouped' }));
  return itemErrors.length > 0 ? itemErrors : undefined;
}

const DumpsiteForm = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit} id="dumpsiteForm">
    <div className="w-panel w-form">
      <div className="w-title">
        <h2>Dumpsite Details</h2>
      </div>
      <div className="row">
        <div className="col-md-6">
          <Field
            label="Dumpsite ID"
            name="code"
            component={InputField}
          />
          <Field
            label="Dumpsite Name"
            name="name"
            component={InputField}
          />
          <Field
            label="Associated Council"
            name="council"
            component={CouncilSelectField}
            showSearch
          />
          <Field
            label="Dumpsite Address"
            name="address"
            component={AddressField}
            validate={[validateAddress]}
          />
          <FieldArray
            label="Open Days"
            name="openDays"
            component={OpenDaysField}
            rerenderOnEveryChange
          />
        </div>
        <div className="col-md-6">
          <Field
            label="Website"
            name="website"
            component={InputField}
          />
          <Field
            label="Price List"
            name="priceListUrl"
            component={InputField}
          />
          <FieldArray
            label="Waste Type"
            name="charges"
            component={WasteTypesField}
          />
        </div>
      </div>
    </div>
  </form>
);

DumpsiteForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

DumpsiteForm.defaultProps = {
};

const selector = formValueSelector('dumpsiteForm');

export default compose(
  connect(state => ({
    type: selector(state, 'type'),
    status: selector(state, 'status'),
  })),
  reduxForm({
    form: 'dumpsiteForm',
    enableReinitialize: true,
    validate: (data) => {
      validate.validators.charges = validateCharges;
      const constraints = {
        code: {
          presence: { allowEmpty: false, message: "^Dumpsite ID can't be blank" },
        },
        name: {
          presence: { allowEmpty: false, message: "^Dumpsite Name can't be blank" },
        },
        address: {
          presence: { allowEmpty: false, message: "^Dumpsite Address can't be blank" },
        },
        charges: {
          charges: true,
        },
      };
      const errors = validate(data, constraints, { format: 'grouped' }) || {};
      // normalize error of `wasteTypes` field for redux-form to display
      if (errors.charges) {
        const realErrors = errors.charges.filter(item => !!item);
        if (realErrors.length === 0) {
          delete errors.charges;
        } else {
          errors.charges._error = typeof realErrors[0] === 'string' ? realErrors[0] : '';
        }
      }
      return errors;
    },
  }),
)(DumpsiteForm);

