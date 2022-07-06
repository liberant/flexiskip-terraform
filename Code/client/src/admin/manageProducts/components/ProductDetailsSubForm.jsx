import React from 'react';
import { Field } from 'redux-form';
import { array, bool } from 'prop-types';
import shortid from 'shortid';

import {
  renderSizeText2Rows,
  renderStaticText2Rows,
  renderInput,
  required,
  // numberOnly,
  decimalAllowed,
  decimal,
} from '../../../common/components/form/reduxFormComponents';
// import { materialAllowances } from '../constants/productDefs';

const Styles = {
  input: {
    backgroundColor: 'transparent',
    boxShadow: '0 0 0',
    borderWidth: 0,
  },
  inputBox: {
    backgroundColor: '#F6F6F6',
    borderRadius: '5px',
  },
  sizePrefix: {
    fontSize: 14,
  },
  sizePostfix: {
    fontSize: 14,
  },
  label: {
    display: 'none',
  },
};

class ProductDetailsSubForm extends React.Component {
  render() {
    const { materialsAllowances, isEdit } = this.props;

    return (
      <div>
        <div className="row">
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-4">

            {/* Full Product Size */}
            {isEdit ? (
              <div>
                <div className="row">
                  <div className="col-xs-12">
                    <div style={{ fontWeight: '600', paddingLeft: 10, color: '#1d415d' }}>
                      Full Product Size *
                    </div>
                    <div style={{ marginBottom: 5 }}>
                      <span style={{
                        fontSize: 12,
                        color: '#666666',
                        fontWeight: '600',
                        paddingLeft: 10,
                        }}
                      >
                        Size (mm)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                    <Field
                      name="size.length"
                      label=""
                      icon
                      component={renderInput}
                      style={Styles}
                      required
                      validate={[required, decimal]}
                      normalize={decimalAllowed}
                    >
                      <span style={Styles.sizePrefix}>L-</span>
                    </Field>
                  </div>
                  <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                    <Field
                      name="size.width"
                      label=""
                      icon
                      component={renderInput}
                      style={Styles}
                      required
                      validate={[required, decimal]}
                      normalize={decimalAllowed}
                    >
                      <span style={Styles.sizePrefix}>W-</span>
                    </Field>
                  </div>
                  <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                    <Field
                      name="size.height"
                      label=""
                      icon
                      component={renderInput}
                      style={Styles}
                      required
                      validate={[required, decimal]}
                      normalize={decimalAllowed}
                    >
                      <span style={Styles.sizePrefix}>H-</span>
                    </Field>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ paddingLeft: 10 }}>
                <div className="row">
                  <div className="col-xs-12">
                    <Field
                      name="size"
                      label="Full Product Size"
                      icon
                      component={renderSizeText2Rows}
                      style={Styles}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <Field
                  name="weightAllowance"
                  label="Weight Allowance (kilograms)"
                  component={
                    isEdit ? renderInput : renderStaticText2Rows
                  }
                  style={
                    isEdit ? { ...Styles, label: { display: 'initial' } } : {}
                  }
                  required
                  validate={[required, decimal]}
                  normalize={decimalAllowed}
                />
              </div>
            </div>

            {isEdit ? (
              <div>
                <div className="row">
                  <div className="col-xs-12">
                    <div style={{ fontWeight: '600', paddingLeft: 10, color: '#1d415d' }}>
                      Postage Product Size *
                    </div>
                    <div style={{ marginBottom: 5 }}>
                      <span style={{
                        fontSize: 12,
                        color: '#666666',
                        fontWeight: '600',
                        paddingLeft: 10,
                      }}
                      >
                        Size (mm)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                    <Field
                      name="postageSize.length"
                      label=""
                      icon
                      component={renderInput}
                      style={Styles}
                      validate={[required, decimal]}
                      normalize={decimalAllowed}
                    >
                      <span style={Styles.sizePrefix}>L-</span>
                    </Field>
                  </div>
                  <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                    <Field
                      name="postageSize.width"
                      label=""
                      icon
                      component={renderInput}
                      style={Styles}
                      validate={[required, decimal]}
                      normalize={decimalAllowed}
                    >
                      <span style={Styles.sizePrefix}>W-</span>
                    </Field>
                  </div>
                  <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                    <Field
                      name="postageSize.height"
                      label=""
                      icon
                      component={renderInput}
                      style={Styles}
                      validate={[required, decimal]}
                      normalize={decimalAllowed}
                    >
                      <span style={Styles.sizePrefix}>H-</span>
                    </Field>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ paddingLeft: 10 }}>
                <div className="row">
                  <div className="col-xs-12">
                    <Field
                      name="postageSize"
                      label="Postage Product Size"
                      icon
                      component={renderSizeText2Rows}
                      style={Styles}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Weight & Weight Allowance */}
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <Field
                  name="weight"
                  label="Weight (kilograms)"
                  component={
                    isEdit ? renderInput : renderStaticText2Rows
                  }
                  style={
                    isEdit ? { ...Styles, label: { display: 'initial' } } : {}
                  }
                  required
                  validate={[required, decimal]}
                  normalize={decimalAllowed}
                />
              </div>

            </div>

          </div>
          <div className="col-xs-0 col-sm-0 col-md-0 col-lg-1" />

          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            {/* Material Allowance */}
            <div>
              <div className="row">
                <div className="col-xs-12">
                  <Field
                    name="material"
                    label="Material Allowance"
                    component={renderStaticText2Rows}
                    style={{ display: 'initial' }}
                  />
                </div>
              </div>
              <div className="row">
                {materialsAllowances.map((m, i) => (
                  <div className="col-xs-6 col-sm-6 col-md-4 col-lg-4" key={shortid.generate()}>
                    <Field
                      key={shortid.generate()}
                      name={`materialsAllowance[${i}]`}
                      label={m}
                      type="checkbox"
                      disabled={!isEdit}
                      component={renderInput}
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    );
  }
}

ProductDetailsSubForm.propTypes = {
  materialsAllowances: array.isRequired,
  isEdit: bool,
};

ProductDetailsSubForm.defaultProps = {
  isEdit: false,
};

export default ProductDetailsSubForm;
