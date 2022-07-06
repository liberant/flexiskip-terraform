import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';

import { Field, reduxForm } from 'redux-form';
import { compose } from 'redux';
import InputField from '../../../common/components/form/InputField';
import ImagesS3UploadField from '../../../common/components/form/ImagesS3UploadField';
import SelectField from '../../../common/components/form/SelectField';
import TextAreaField from '../../../common/components/form/TextAreaField';
import CheckboxField from '../../../common/components/form/CheckboxField';
import { required, decimal, decimalAllowed, numberOnly } from '../../../common/components/form/reduxFormComponents';

const CouncilProductForm = ({ handleSubmit, wasteTypes, materialsAllowances }) => (
  <form onSubmit={handleSubmit} id="councilProductForm">
    <div className="w-panel w-form">
      <div className="w-title">
        <h2>Product Info</h2>
      </div>
      <div className="row">
        <div className="col-md-6">
          <Field
            label="Product Image"
            name="images"
            component={ImagesS3UploadField}
            validate={[required]}
          />
        </div>
        <div className="col-md-6">
          <Field
            name="vendorCode"
            label="Vendor Product Reference Code"
            component={InputField}
            validate={[required]}
          />
          <Field
            name="name"
            label="Product Name"
            component={InputField}
            validate={[required]}
          />
          <Field
            name="wasteType"
            label="Product Type"
            component={SelectField}
            options={wasteTypes}
            validate={[required]}
          />
          <Field
            name="quantity"
            label="Inventory"
            component={InputField}
            validate={[required]}
            normalize={numberOnly}
          />
          <div>
            <div><label>Product Price</label></div>
            <div
              className="col-md-6"
              style={{
                paddingLeft: 0,
              }}
            >
              <Field
                name="residentialPrice"
                label="Residential"
                component={InputField}
                validate={[required, decimal]}
                normalize={decimalAllowed}
                prefixIcon={(<span>$</span>)}
              />
            </div>
            <div
              className="col-md-6"
              style={{
                paddingRight: 0,
              }}
            >
              <Field
                name="businessPrice"
                label="Business"
                component={InputField}
                validate={[required, decimal]}
                normalize={decimalAllowed}
                prefixIcon={(<span>$</span>)}
              />
            </div>
          </div>
          <div>
            <div><label>Base Collection Price</label></div>
            <div
              className="col-md-6"
              style={{
                paddingLeft: 0,
              }}
            >
              <Field
                name="resColPrice"
                label="Residential"
                component={InputField}
                validate={[required, decimal]}
                normalize={decimalAllowed}
                prefixIcon={(<span>$</span>)}
              />
            </div>
            <div
              className="col-md-6"
              style={{
                paddingRight: 0,
              }}
            >
              <Field
                name="busColPrice"
                label="Business"
                component={InputField}
                validate={[required, decimal]}
                normalize={decimalAllowed}
                prefixIcon={(<span>$</span>)}
              />
            </div>
          </div>
          <Field
            name="comment"
            label="Additional Comment"
            component={TextAreaField}
          />
        </div>
      </div>
    </div>

    {/** Product details */}
    <div className="w-panel w-form">
      <div className="w-title">
        <h2>Product Details</h2>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div>
            <div><label>Full Product Size *</label></div>
            <div><label>Size (mm)</label></div>
            <div
              className="col-md-4"
              style={{
                paddingLeft: 0,
              }}
            >
              <Field
                name="size.length"
                component={InputField}
                prefixIcon={(<span>L-</span>)}
                validate={[required, decimal]}
                normalize={decimalAllowed}
              />
            </div>
            <div
              className="col-md-4"
              style={{
                paddingLeft: 0,
                paddingRight: 0,
              }}
            >
              <Field
                name="size.width"
                component={InputField}
                prefixIcon={(<span>W-</span>)}
                validate={[required, decimal]}
                normalize={decimalAllowed}
              />
            </div>
            <div
              className="col-md-4"
              style={{
                paddingRight: 0,
              }}
            >
              <Field
                name="size.height"
                component={InputField}
                prefixIcon={(<span>H-</span>)}
                validate={[required, decimal]}
                normalize={decimalAllowed}
              />
            </div>
          </div>
          <Field
            name="weightAllowance"
            label="Weight Allowance (kilograms)"
            component={InputField}
            validate={[required, decimal]}
            normalize={decimalAllowed}
          />
          <div>
            <div><label>Postage Product Size *</label></div>
            <div><label>Size (mm)</label></div>
            <div
              className="col-md-4"
              style={{
                paddingLeft: 0,
              }}
            >
              <Field
                name="postageSize.length"
                component={InputField}
                prefixIcon={(<span>L-</span>)}
                validate={[required, decimal]}
                normalize={decimalAllowed}
              />
            </div>
            <div
              className="col-md-4"
              style={{
                paddingLeft: 0,
                paddingRight: 0,
              }}
            >
              <Field
                name="postageSize.width"
                component={InputField}
                prefixIcon={(<span>W-</span>)}
                validate={[required, decimal]}
                normalize={decimalAllowed}
              />
            </div>
            <div
              className="col-md-4"
              style={{
                paddingRight: 0,
              }}
            >
              <Field
                name="postageSize.height"
                component={InputField}
                prefixIcon={(<span>H-</span>)}
                validate={[required, decimal]}
                normalize={decimalAllowed}
              />
            </div>
          </div>
          <Field
            name="weight"
            label="Weight (kilograms)"
            component={InputField}
            validate={[required, decimal]}
            normalize={decimalAllowed}
          />
        </div>

        {/* Material Allowance */}
        <div className="col-md-6">
          <div>
            <div><label>Material Allowance</label></div>
          </div>

          <div className="row">
            {materialsAllowances.map((m, i) => (
              <div
                className="col-xs-6 col-sm-6 col-md-4 col-lg-4"
                key={shortid.generate()}
                style={{
                  marginTop: 25,
                }}
              >
                <Field
                  key={shortid.generate()}
                  name={`materialsAllowance[${i}]`}
                  label={m}
                  type="checkbox"
                  component={CheckboxField}
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  </form>
);

CouncilProductForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  wasteTypes: PropTypes.array,
  materialsAllowances: PropTypes.array,
};

CouncilProductForm.defaultProps = {
  wasteTypes: [],
  materialsAllowances: [],
};

export default compose(reduxForm({
  form: 'councilProductForm',
  enableReinitialize: true,
}))(CouncilProductForm);

