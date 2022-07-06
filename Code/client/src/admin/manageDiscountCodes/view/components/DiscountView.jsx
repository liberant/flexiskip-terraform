import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray, reduxForm, formValueSelector } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';

import ProductsSelectField from '../../add/components/ProductsSelectField';
import RegionsSelectField from '../../add/components/RegionsSelectField';
import ExtraProductsField from '../../add/components/ExtraProductsField';
import SelectField from '../../../../common/components/form/SelectField';
import DatePickerField from '../../../../common/components/form/DatePickerField';
import InputField from '../../../../common/components/form/InputField';
import CheckboxListField from '../../../../common/components/form/CheckboxListField';
import DiscountStatus from '../../../../common/components/DiscountStatus';
import { requestOptions } from '../../../../common/constants/discount-requests';
import { typeOptions } from '../../../../common/constants/discount-types';

const DiscountView = ({ handleSubmit, type, status }) => (
  <form onSubmit={handleSubmit} id="discountForm">
    <div className="w-panel w-form">
      <div className="w-title">
        <h2>Discount Code Detail</h2>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="control-label">Status</label>
            <div className="form-control-static"><DiscountStatus value={status} /></div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <Field
                name="dateStart"
                component={DatePickerField}
                label="Start Date"
                viewOnly
              />
            </div>
            <div className="col-md-6">
              <Field
                name="dateEnd"
                component={DatePickerField}
                label="End Date"
                viewOnly
              />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <Field
            label="Name"
            name="name"
            component={InputField}
            viewOnly
          />
          <Field
            label="Code"
            name="code"
            component={InputField}
            viewOnly
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
            viewOnly
          />
          <Field
            label="Discount Type"
            name="type"
            component={SelectField}
            options={typeOptions}
            placeholder="Please select"
            viewOnly
          />
          {type === 'extra' && (
            <FieldArray
              name="extraProducts"
              component={ExtraProductsField}
              viewOnly
            />
          )}
          {(type === 'percentage' || type === 'flat') && (
            <Field
              label={`Discount Amount ${type === 'flat' ? '($)' : '(%)'}`}
              name="discount"
              component={InputField}
              viewOnly
            />
          )}
          <Field
            label="Apply To"
            name="products"
            component={ProductsSelectField}
            viewOnly
          />
          <Field
            label="Region Applied"
            name="regions"
            component={RegionsSelectField}
            viewOnly
          />
        </div>
        <div className="col-md-6">
          <Field
            label="Maximum Usage"
            name="quantity"
            component={InputField}
            viewOnly
          />
          <Field
            label="Minimum Product Quantity in an Order"
            name="minProdQty"
            component={InputField}
            viewOnly
          />
          <Field
            label="Minimum Price of Order ($)"
            name="minPrice"
            component={InputField}
            viewOnly
          />
        </div>
      </div>
    </div>
  </form>
);

DiscountView.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  type: PropTypes.string,
  status: PropTypes.string,
};

DiscountView.defaultProps = {
  status: '',
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
  }),
)(DiscountView);

