import React from 'react';
import { Field, FieldArray, FormSection } from 'redux-form';
import PropTypes from 'prop-types';
import shortid from 'shortid';

import {
  renderStaticText2Rows,
  renderInput,
  renderDropdwonList,
  renderMultiSelect,
  required,
  numberOnly,
  decimal,
  decimalAllowed,
} from '../../../../common/components/form/reduxFormComponents';

import { CouncilTypeDefs } from '../../../../common/constants/commonTypes';

import { formStyles, extraStyles } from './Styles';

const renderPercentageField = (props) => {
  const { isEdit } = props;

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '85%' }}>
        <Field
          name="council"
          label="Council Amount"
          icon
          rightSide
          component={
            isEdit ? renderInput : renderStaticText2Rows
          }
          style={
            isEdit ? formStyles : {}
          }
          validate={[decimal]}
          normalize={decimalAllowed}
        >
          {
            isEdit ? null : '%'
          }
        </Field>

      </div>
      {
        isEdit ? (
          <div
            style={{
              lineHeight: '98px',
              paddingLeft: 15,
              fontSize: 14,
            }}
          >
            %
          </div>
        ) : null
      }

    </div>

  );
};
renderPercentageField.propTypes = {
  isEdit: PropTypes.bool.isRequired,
};


const renderExtraAmountField = (props) => {
  const { isEdit } = props;

  return (
    <div
      style={{ display: 'flex' }}
    >
      <div style={{ width: '85%' }}>
        <Field
          name="council"
          label="Council Amount"
          icon
          leftSide
          price
          component={
            isEdit ? renderInput : renderStaticText2Rows
          }
          style={
            isEdit ? formStyles : {}
          }
          validate={[decimal]}
          normalize={decimalAllowed}
        >
          {
            isEdit ? null : '$'
          }
        </Field>
      </div>

      {
        isEdit ? (
          <div
            style={{
              lineHeight: '98px',
              paddingLeft: 15,
              fontSize: 14,
            }}
          >
            $
          </div>
        ) : null
      }

    </div>
  );
};
renderExtraAmountField.propTypes = {
  isEdit: PropTypes.bool.isRequired,
};

const renderExtraProductsItem = (props) => {
  const { isEdit, data } = props;

  return (
    <div className="row">
      <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
        <Field
          name="product"
          label="Bonus Product"
          data={data}
          textFieldName="name"
          showArray
          style={
            isEdit ? formStyles : {}
          }
          component={
            isEdit ? renderMultiSelect : renderStaticText2Rows
          }
          required
          validate={[required]}
        />
      </div>
      <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
        <Field
          name="quantity"
          label="Quantity"
          style={
            isEdit ? formStyles : {}
          }
          component={
            isEdit ? renderInput : renderStaticText2Rows
          }
          required
          validate={[required]}
        />
      </div>
    </div>
  );
};

renderExtraProductsItem.propTypes = {
  isEdit: PropTypes.bool.isRequired,
  data: PropTypes.any.isRequired,
};

const renderExtraProducts = ({
  fields, meta: { error },
  data = [], isEdit = false,
}) => (
  <div>
    {
      fields.map(product =>
         (
           <div key={shortid.generate()}>
             <FormSection name={product}>
               {renderExtraProductsItem({ isEdit, data })}
             </FormSection>
           </div>
        ))
    }
    {error && <li className="error">{error}</li>}
    <div>
      <span
        style={{
          display: 'inline-block',
          cursor: 'pointer',
          color: '#239dff',
          fontWeight: '600',
          padding: '15px 10px',
        }}
        onClick={() => fields.push()}
      >
        <span
          className="handel-plus"
          style={{
            display: 'inline-block',
            fontSize: 16,
            paddingRight: 10,
          }}
        />
        <span>Add more Product</span>
      </span>
    </div>
  </div>
);
renderExtraProducts.propTypes = {
  isEdit: PropTypes.bool.isRequired,
  data: PropTypes.any.isRequired,
  fields: PropTypes.any.isRequired,
  meta: PropTypes.any.isRequired,
};

const renderStaticExtraProducts2Rows = ({
  input, label,
}) => {
  const { value } = input;

  return (
    <div>
      <div className="form-group">
        <label className="control-label col-sm-12" htmlFor={label}>
          {label}
        </label>
      </div>
      <div className="col-sm-12">
        <div>
          <span style={{
            ...extraStyles.extraProductsName,
            fontWeight: '600',
          }}
          >
            Bonus Product
          </span>
          <span style={{
            ...extraStyles.extraProductsQuantity,
            fontWeight: '600',
          }}
          >
            Quantity
          </span>
        </div>
        <div>
          {
            (value && value.constructor === Array) ? (
              value.map(v => (
                <div key={shortid.generate()}>
                  <span style={extraStyles.extraProductsName}>
                    {v.product.constructor === Array ? v.product[0].name : v.product.name}
                  </span>
                  <span style={extraStyles.extraProductsQuantity}>
                    {v.quantity}
                  </span>
                </div>
              ))
            ) : null
          }
        </div>
      </div>
    </div>
  );
};

renderStaticExtraProducts2Rows.propTypes = {
  input: PropTypes.any.isRequired,
  label: PropTypes.string.isRequired,
};

const renderExtraField = (props) => {
  const { isEdit, data } = props;

  return (
    <div>
      {
        isEdit ? (
          <FieldArray
            name="extraProducts"
            data={data}
            isEdit={isEdit}
            component={renderExtraProducts}
          />
        ) : (
          <Field
            label="Extra Products"
            name="extraProducts"
            component={renderStaticExtraProducts2Rows}
          />
        )
      }

    </div>
  );
};
renderExtraField.propTypes = {
  isEdit: PropTypes.bool.isRequired,
  data: PropTypes.any.isRequired,
};

const CouncilTypeComponents = {
  percentage: renderPercentageField,
  'exact amount': renderExtraAmountField,
  extra: renderExtraField,
};


class CouncilDetailsLowerSubForm extends React.Component {
  render() {
    const {
      isEdit, isAdd, councilType,
      products, regions,
    } = this.props;
    const tmpCouncilType = (councilType && councilType.constructor === String) ?
      councilType.trim().toLowerCase() : 'percentage';

    return (
      <div>
        <div className="row">
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-5">
            <div style={{ marginTop: '-10px' }}>
              <Field
                name="material"
                label="Apply Request"
                component={renderStaticText2Rows}
                style={{ display: 'initial' }}
              />
            </div>
            <div className="row" style={{ height: 88 }}>
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <Field
                  name="request[0]"
                  label="Bin Request"
                  type="checkbox"
                  disabled={!isEdit && !isAdd}
                  component={renderInput}
                />
              </div>
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <Field
                  name="request[1]"
                  label="Collection Request"
                  type="checkbox"
                  disabled={!isEdit && !isAdd}
                  component={renderInput}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <Field
                  name="type"
                  label="Council Type"
                  dropdownLabel="Choose Council Type"
                  data={CouncilTypeDefs}
                  style={
                    isEdit ? formStyles.dropdownList : {}
                  }
                  component={
                    isEdit ? renderDropdwonList :
                      renderStaticText2Rows
                  }
                  required
                  validate={[required]}
                />

              </div>
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                {
                  CouncilTypeComponents[`${tmpCouncilType}`]({ isEdit, data: products })
                }
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <Field
                  name="products"
                  label="Apply To"
                  data={products}
                  textFieldName="name"
                  showArray
                  style={
                    isEdit ? { label: formStyles.datePicker } : {}
                  }
                  component={
                    isEdit ? renderMultiSelect : renderStaticText2Rows
                  }
                  required
                  validate={[required]}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <Field
                  name="regions"
                  label="Region Applied"
                  data={regions}
                  textFieldName="name"
                  showArray
                  style={
                    isEdit ? { label: formStyles.datePicker } : {}
                  }
                  component={
                    isEdit ? renderMultiSelect : renderStaticText2Rows
                  }
                  required
                  validate={[required]}
                />
              </div>
            </div>
          </div>
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-5">
            <Field
              name="quantity"
              label="Maximum Usage"
              component={
                isEdit ? renderInput : renderStaticText2Rows
              }
              style={
                isEdit ? formStyles : {}
              }
              required
              normalize={numberOnly}
              validate={[required]}
            />
            <Field
              name="minProdQty"
              label="Minimum Qty of Products in an Order"
              component={
                isEdit ? renderInput : renderStaticText2Rows
              }
              style={
                isEdit ? formStyles : {}
              }
              required
              normalize={numberOnly}
              validate={[required]}
            />
            <Field
              name="minPrice"
              label="Minimum Price of Order"
              component={
                isEdit ? renderInput : renderStaticText2Rows
              }
              style={
                isEdit ? formStyles : {}
              }
              icon
              required
              validate={[required, decimal]}
              normalize={decimalAllowed}
            >
              <span style={formStyles.sizePrefix}>$</span>
            </Field>
          </div>

        </div>

      </div>
    );
  }
}

CouncilDetailsLowerSubForm.propTypes = {
  isEdit: PropTypes.bool,
  isAdd: PropTypes.bool,
  councilType: PropTypes.string,
  products: PropTypes.array,
  regions: PropTypes.array,
};

CouncilDetailsLowerSubForm.defaultProps = {
  isEdit: false,
  isAdd: false,
  councilType: 'Percentage',
  products: [],
  regions: [],
};

export default CouncilDetailsLowerSubForm;
