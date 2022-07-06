import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import {
  renderInput,
  renderStaticText2Rows,
  renderDatePicker,
  required,
  decimal,
  decimalAllowed,
  validateStartEndDate,
} from '../../../common/components/form/reduxFormComponents';

import { Styles } from './Styles';


class CouncilDetailsSubForm extends React.Component {
  render() {
    const { isAdd, isEdit, product } = this.props;

    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <Field
              name="name"
              label={isAdd ? 'Product Name' : 'Council Product Name'}
              placeholder=""
              component={
                isEdit ? renderInput : renderStaticText2Rows
              }
              style={
                isEdit ? { ...Styles, label: { color: '#666666' } } : {}
              }
              required
              validate={[required]}
            />
          </div>
        </div>
        <div className="row">
          <div style={{ fontWeight: '700', paddingLeft: 20 }}>
            Product Price
          </div>
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
            <Field
              name="resBinPrice"
              label="Residential"
              component={
                isEdit ? renderInput : renderStaticText2Rows
              }
              style={
                isEdit ? { ...Styles, label: { color: '#666666' } } : {}
              }
              required
              price
              labelStyle={{ color: '#666666', fontSize: 12 }}
              icon
              initialValues={product.residentialPrice}
              validate={[required, decimal]}
              normalize={decimalAllowed}
            >
              <span>$</span>
            </Field>
          </div>
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
            <Field
              name="busBinPrice"
              label="Business"
              component={
                isEdit ? renderInput : renderStaticText2Rows
              }
              style={
                isEdit ? { ...Styles, label: { color: '#666666' } } : {}
              }
              required
              price
              labelStyle={{ color: '#666666', fontSize: 12 }}
              icon
              initialValues={product.businessPrice}
              validate={[required, decimal]}
              normalize={decimalAllowed}
            >
              <span>$</span>
            </Field>
          </div>
        </div>

        {/* Base Collection Price */}
        <div className="row">
          <div style={{ fontWeight: '700', paddingLeft: 20 }}>
            Base Collection Price
          </div>
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
            <Field
              name="resColPrice"
              label="Residential"
              component={
                isEdit ? renderInput : renderStaticText2Rows
              }
              style={
                isEdit ? { ...Styles, label: { color: '#666666' } } : {}
              }
              required
              price
              labelStyle={{ color: '#666666', fontSize: 12 }}
              icon
              initialValues={product.resColPrice}
              validate={[required, decimal]}
              normalize={decimalAllowed}
            >
              <span>$</span>
            </Field>
          </div>
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
            <Field
              name="busColPrice"
              label="Business"
              component={
                isEdit ? renderInput : renderStaticText2Rows
              }
              style={
                isEdit ? { ...Styles, label: { color: '#666666' } } : {}
              }
              required
              price
              labelStyle={{ color: '#666666', fontSize: 12 }}
              icon
              initialValue={product.busColPrice}
              validate={[required, decimal]}
              normalize={decimalAllowed}
            >
              <span>$</span>
            </Field>
          </div>
        </div>

        <div className="row">
          <div className="col-xs-6">
            <Field
              name="allowanceCountTotal"
              label="Total"
              placeholder=""
              icon
              rightSide
              component={
                isEdit ? renderInput : renderStaticText2Rows
              }
              style={
                isEdit ? { ...Styles, label: { color: '#666666' } } : {}
              }
              required
              validate={[required]}
            >
              <span style={{ paddingLeft: 5 }}>products</span>
            </Field>
          </div>
          <div className="col-xs-6">
            <Field
              name="allowanceCountPerUnit"
              label="Per unit"
              placeholder=""
              icon
              rightSide
              component={
                isEdit ? renderInput : renderStaticText2Rows
              }
              style={
                isEdit ? { ...Styles, label: { color: '#666666' } } : {}
              }
              required
              validate={[required]}
            >
              <span style={{ paddingLeft: 5 }}>/address</span>
            </Field>
          </div>
        </div>
        <div className="row add-council-code-date-box">
          <div className="col-xs-6">
            <Field
              className="add-council-code-date-start-box"
              name="startDate"
              label="Start Date"
              placeholder=""
              date
              // style={Styles}
              component={
                isEdit ? renderDatePicker : renderStaticText2Rows
              }
              required
              validate={[required]}
            />
          </div>
          <div className="col-xs-6">
            <Field
              className="add-council-code-date-end-box"
              name="endDate"
              label="End Date"
              placeholder=""
              date
              // style={Styles}
              component={
                isEdit ? renderDatePicker : renderStaticText2Rows
              }
              required
              validate={[required, validateStartEndDate]}
            />
          </div>
        </div>

      </div>
    );
  }
}

CouncilDetailsSubForm.propTypes = {
  isAdd: PropTypes.bool,
  isEdit: PropTypes.bool,
  product: PropTypes.any.isRequired,
};

CouncilDetailsSubForm.defaultProps = {
  isAdd: true,
  isEdit: true,
};

export default CouncilDetailsSubForm;
