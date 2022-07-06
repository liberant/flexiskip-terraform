import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray, reduxForm, formValueSelector } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import validate from 'validate.js';

import ProductsSelectField from './ProductsSelectField';
import RegionsSelectField from './RegionsSelectField';
import ExtraProductsField from './ExtraProductsField';
import SelectField from '../../../../common/components/form/SelectField';
import DatePickerField from '../../../../common/components/form/DatePickerField';
import InputField from '../../../../common/components/form/InputField';
import CheckboxListField from '../../../../common/components/form/CheckboxListField';
import { statusOptions } from '../../../../common/constants/discount-statuses';
import { requestOptions } from '../../../../common/constants/discount-requests';
import { typeOptions } from '../../../../common/constants/discount-types';

function validateExtraProducts(value) {
  if (!Array.isArray(value)) {
    return 'is invalid, only array is accepted';
  }

  if (value.length === 0) {
    return "can't be blank";
  }

  const constraints = {
    product: {
      presence: { allowEmpty: false, message: "^Bonus product can't be blank" },
    },
    quantity: {
      presence: {
        allowEmpty: false, message: "^Bonus quantity can't be blank",
      },
      numericality: {
        greaterThan: 0,
        message: '^Quantity must be a number and greater than 0',
      },
    },
  };

  const itemErrors = value.map(item => validate(item, constraints, { format: 'grouped' }));
  return itemErrors.length > 0 ? itemErrors : undefined;
}

const DiscountForm = ({ handleSubmit, type }) => (
  <form onSubmit={handleSubmit} id="discountForm">
    <div className="w-panel w-form">
      <div className="w-title">
        <h2>Discount Code Detail</h2>
      </div>
      <div className="row">
        <div className="col-md-6">
          <Field
            name="status"
            component={SelectField}
            label="Status"
            placeholder="Select Status"
            options={statusOptions}
          />
          <div className="row">
            <div className="col-md-6">
              <Field
                name="dateStart"
                component={DatePickerField}
                label="Start Date"
              />
            </div>
            <div className="col-md-6">
              <Field
                name="dateEnd"
                component={DatePickerField}
                label="End Date"
              />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <Field
            label="Name"
            name="name"
            component={InputField}
          />
          <Field
            label="Code"
            name="code"
            component={InputField}
          />
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-6">
          <Field
            label="Apply Request"
            name="request"
            component={CheckboxListField}
            options={requestOptions}
          />
          <Field
            label="Discount Type"
            name="type"
            component={SelectField}
            options={typeOptions}
            placeholder="Please select"
          />
          {type === 'extra' && (
            <FieldArray
              name="extraProducts"
              component={ExtraProductsField}
            />
          )}
          {(type === 'percentage' || type === 'flat') && (
            <Field
              label={`Discount Amount ${type === 'flat' ? '($)' : '(%)'}`}
              name="discount"
              component={InputField}
            />
          )}
          <Field
            label="Apply To"
            name="products"
            multiple
            component={ProductsSelectField}
          />
          <Field
            label="Region Applied"
            name="regions"
            component={RegionsSelectField}
          />
        </div>
        <div className="col-md-6">
          <Field
            label="Maximum Usage"
            name="quantity"
            component={InputField}
          />
          <Field
            label="Minimum Product Quantity in an Order"
            name="minProdQty"
            component={InputField}
          />
          <Field
            label="Minimum Price of Order ($)"
            name="minPrice"
            component={InputField}
          />
        </div>
      </div>
    </div>
  </form>
);

DiscountForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  type: PropTypes.string,
};

DiscountForm.defaultProps = {
  type: '',
};

const selector = formValueSelector('discountForm');

export default compose(
  connect(state => ({
    type: selector(state, 'type'),
    status: selector(state, 'status'),
  })),
  reduxForm({
    form: 'discountForm',
    enableReinitialize: true,
    validate: (data) => {
      validate.validators.extraProducts = validateExtraProducts;
      const constraints = {
        status: {
          presence: { allowEmpty: false },
        },
        name: {
          presence: { allowEmpty: false },
        },
        dateStart: {
          presence: {
            allowEmpty: false, message: "^Start Date can't be blank",
          },
        },
        dateEnd: {
          presence: { allowEmpty: false, message: "^End Date can't be blank" },
        },
        code: {
          presence: { allowEmpty: false },
        },
        request: {
          presence: { allowEmpty: false, message: "^Apply Request can't be blank" },
        },
        type: {
          presence: { allowEmpty: false, message: "^Discount Type can't be blank" },
        },
        discount: {
          presence: data.type !== 'extra' ?
            { allowEmpty: false, message: "^Discount Amount type can't be blank" } :
            false,
          numericality: {
            greaterThanOrEqualTo: 0,
            message: '^Discount Amount must be a number and greater than 0',
          },
        },
        quantity: {
          presence: { allowEmpty: false, message: "^Maximum Usage can't be blank" },
          numericality: {
            greaterThanOrEqualTo: 0,
            message: '^Maximum Usage must be a number and greater than or equal to 0',
          },
        },
        minProdQty: {
          numericality: {
            greaterThanOrEqualTo: 0,
            message: '^Minximum Product must be a number and greater than or equal to 0',
          },
        },
        minPrice: {
          numericality: {
            greaterThanOrEqualTo: 0,
            message: '^Minximum Price must be a number and greater than or equal to 0',
          },
        },
        extraProducts: {
          extraProducts: data.type === 'extra',
        },
      };
      const errors = validate(data, constraints, { format: 'grouped' }) || {};
      // normalize error of `extraProducts` field for redux-form to display
      if (errors.extraProducts) {
        const realErrors = errors.extraProducts.filter(item => !!item);
        if (realErrors.length === 0) {
          delete errors.extraProducts;
        } else {
          errors.extraProducts._error = typeof realErrors[0] === 'string' ? realErrors[0] : '';
        }
      }
      return errors;
    },
  }),
)(DiscountForm);

