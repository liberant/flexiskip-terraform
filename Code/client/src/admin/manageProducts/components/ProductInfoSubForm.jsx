import React from 'react';
import { Field } from 'redux-form';
import { any, bool } from 'prop-types';


import {
  renderStaticText2Rows,
  renderInput,
  renderTextArea,
  renderDropdwonList,
  numberOnly,
  required,
  renderStaticImage2Rows,
  decimalAllowed,
  decimal,
} from '../../../common/components/form/reduxFormComponents';

import {
  statusProductStockTypes,
  APP_BACKGROUND_COLOR,
} from '../../../common/constants/styles';

import ImagesS3UploadField from '../../../common/components/form/ImagesS3UploadField';
import RadioGroup from '../../../common/components/form/RadioGroup';
import CheckBox from '../../../common/components/form/CheckboxField';

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
    fontSize: 16,
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
    // border: 'solid 2px #e2eaf0',
    // borderRadius: 100,
  },
};

class ProductInfoSubForm extends React.Component {
  render() {
    const { isEdit, isAdd, wasteTypes } = this.props;
    // const displayStyle = isEdit ? 'inherit' : 'none';
    const displayAddStyle = isAdd ? 'none' : 'inherit';

    return (
      <div>
        <div className="row">
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-4">
            <div className="row" style={{ display: displayAddStyle }}>
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-5">
                <Field
                  name="code"
                  label="Product Code"
                  component={renderStaticText2Rows}
                />
              </div>
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <Field
                  name="createdBy"
                  label="Created By"
                  // initialValue={isAdd ? null : 'Admin'}
                  component={renderStaticText2Rows}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-8" style={{ display: displayAddStyle }}>
                <Field
                  name="status"
                  label="Status"
                  dropdownLabel="Choose Status"
                  data={statusProductStockTypes}
                  statusArrayName="productStock"
                  style={
                    isEdit ? Styles.dropdownList : {}
                  }
                  component={
                    isEdit ? renderDropdwonList :
                      renderStaticText2Rows
                  }
                  required
                  validate={
                    !isAdd ? [required] : []
                  }
                />
              </div>
            </div>
            <div className="row" style={{ display: displayAddStyle }}>
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-5">
                <Field
                  name="createdAt"
                  label="Date Created"
                  date
                  component={renderStaticText2Rows}
                />
              </div>
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <Field
                  name="deletedAt"
                  label="Date Removed"
                  date
                  component={renderStaticText2Rows}
                />
              </div>
            </div>

            <div className="row">
              {
                isEdit ? (
                  <div className="col-xs-12" style={{ paddingLeft: 20 }}>
                    <div>
                      <Field
                        name="images"
                        label="Product Image"
                        component={ImagesS3UploadField}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="col-xs-12" style={{ paddingLeft: 10 }}>
                    <div>
                      <Field
                        name="images"
                        label="Product Image"
                        component={renderStaticImage2Rows}
                        style={Styles.staticImage}
                      />
                    </div>
                  </div>
                )
              }

            </div>
          </div>

          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-offset-1 col-lg-4">
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <Field
                  name="vendorCode"
                  label="Vendor Product Reference Code"
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
                  name="name"
                  label="Product Name"
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
                {
                  isEdit ? (
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ paddingLeft: 10 }}>
                      <Field
                        required
                        name="wasteType"
                        label="Product Type"
                        dropdownLabel="Choose Type"
                        data={wasteTypes}
                        component={renderDropdwonList}
                        style={Styles.dropdownList}
                        validate={[required]}
                      />
                    </div>
                  ) : (
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                      <Field
                        required
                        name="wasteType"
                        label="Product Type"
                        component={renderStaticText2Rows}
                      />
                    </div>
                  )
                }
              </div>
            </div>

            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <Field
                    name="partnerDelivered"
                    label="Partner Delivered"
                    component={CheckBox}
                    disabled={
                      isEdit || isAdd ? false : true
                    }
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <Field
                  name="quantity"
                  label="Inventory"
                  component={
                    isEdit ? renderInput : renderStaticText2Rows
                  }
                  style={
                    isEdit ? Styles : {}
                  }
                  normalize={numberOnly}
                  required
                  validate={[required]}
                />
              </div>
            </div>

            {/* Product Price */}
            <div className="row">
              <div style={{ fontWeight: '600', paddingLeft: 20, color: '#1d415d' }}>
                Product Price
              </div>

              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <Field
                  name="residentialPrice"
                  label="Residential"
                  component={
                    isEdit ? renderInput : renderStaticText2Rows
                  }
                  style={
                    isEdit ? { ...Styles, label: { display: 'initial', color: '#666666' } } : {}
                  }
                  required
                  price
                  labelStyle={{ color: '#666666', fontSize: 12 }}
                  icon
                  validate={[required, decimal]}
                  normalize={decimalAllowed}
                >
                  <span>$</span>
                </Field>
              </div>
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <Field
                  name="businessPrice"
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
                  validate={[required, decimal]}
                  normalize={decimalAllowed}
                >
                  <span>$</span>
                </Field>
              </div>
            </div>

            {/* Base Collection Price */}
            <div className="row">

              <div style={{ fontWeight: '600', paddingLeft: 20, color: '#1d415d' }}>
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
                  validate={[required, decimal]}
                  normalize={decimalAllowed}
                >
                  <span>$</span>
                </Field>
              </div>
            </div>

            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <Field
                  name="comment"
                  label="Additional Comment"
                  component={
                    isEdit ? renderTextArea : renderStaticText2Rows
                  }
                  style={
                    isEdit ? Styles : {}
                  }
                />
              </div>
            </div>

            {
              isAdd ?
              <Field
                component={RadioGroup}
                name="prefix"
                required
                label="Email template"
                options={[
                  { title: 'Standard', value: 'standard' },
                  { title: 'Gold Coast', value: 'gc' },
                ]}
                validate={[required]}
              />
              :
              <Field
                name="prefix"
                label="Email Template"
                dropdownLabel="Choose Email Template"
                data={[
                  { title: 'Standard', value: 'standard' },
                  { title: 'Gold Coast', value: 'gc' },
                ]}
                style={(isEdit) ? Styles.dropdownList : {}}
                prefix
                component={(isEdit) ? renderDropdwonList : renderStaticText2Rows}
                required
                validate={[required]}
              />
            }
          </div>
        </div>
      </div>
    );
  }
}

ProductInfoSubForm.propTypes = {
  isEdit: bool,
  isAdd: bool,
  wasteTypes: any,
};

ProductInfoSubForm.defaultProps = {
  isEdit: false,
  isAdd: false,
  wasteTypes: [],
};

export default ProductInfoSubForm;
