import React from 'react';
import { Field, FieldArray } from 'redux-form';
import PropTypes from 'prop-types';
import shortid from 'shortid';

import {
  renderStaticText2Rows,
  renderInput,
  renderValueFieldDropdownList,
  required,
  renderDropdwonList,
  decimalAllowed,
  decimal,
  validateDayStartEndTime,
  validateAddress,
} from '../../../../common/components/form/reduxFormComponents';
import InputOpenTimeStyleField from '../../../../common/components/form/InputOpenTimeStyleField';
import AddressField from '../../../../common/components/form/AddressField';

import { formStyles } from './Styles';

const weekSet = [
  {
    name: 'monday',
    title: 'Monday',
    funcValidate: validateDayStartEndTime(0),
  },
  {
    name: 'tuesday',
    title: 'Tuesday',
    funcValidate: validateDayStartEndTime(1),
  },
  {
    name: 'wednesday',
    title: 'Wednesday',
    funcValidate: validateDayStartEndTime(2),
  },
  {
    name: 'thursday',
    title: 'Thursday',
    funcValidate: validateDayStartEndTime(3),
  },
  {
    name: 'friday',
    title: 'Friday',
    funcValidate: validateDayStartEndTime(4),
  },
  {
    name: 'saturday',
    title: 'Saturday',
    funcValidate: validateDayStartEndTime(5),
  },
  {
    name: 'sunday',
    title: 'Sunday',
    funcValidate: validateDayStartEndTime(6),
  },
];

const renderStaticOpenDays = ({
  input,
}) => {
  const openTime = (input.value && input.value.constructor === String) ?
    input.value : input.value.text;
  return (
    <span>
      {openTime}
    </span>
  );
};
renderStaticOpenDays.propTypes = {
  input: PropTypes.any.isRequired,
};

const renderWasteTypePrices = ({
  input,
}) => (
  <div style={{ padding: 10 }}>
    <div className="row">
      <div className="col-xs-6" style={{ fontWeight: '600' }}>
        Type
      </div>
      <div className="col-xs-6" style={{ fontWeight: '600' }}>
        Price
      </div>
    </div>
    {(
        input && input.value && input.value.constructor === Array) ? (
        input.value.map(i => (
          <div
            style={{ marginTop: 5 }}
            key={shortid.generate()}
          >
            <div className="row">
              <div className="col-xs-6">
                {i.wasteType}
              </div>
              <div className="col-xs-6">
                {
                  i.amount ? (
                    <span>
                        $&nbsp;{`${(parseFloat(i.amount)).toFixed(2)}`}&nbsp;/ton
                    </span>
                  ) : (
                    <span>
                      $ 0.00 /ton
                    </span>
                  )
                }

              </div>
            </div>
          </div>
        ))
      ) : null
    }
  </div>
);
renderWasteTypePrices.propTypes = {
  input: PropTypes.any.isRequired,
};

const renderCloseTime = ({
  label, labelStyle, style,
}) => (
  <div style={{ marginTop: '-9px' }}>
    <div className="form-group">
      <label className="control-label col-sm-12" htmlFor={label} style={labelStyle}>
        {required ? `${label} *` : `${label}`}
      </label>
      <div className="col-sm-12" style={{ lineHeight: '35px' }}>
        <span>
          <span className="form-control-static" style={style}>
            --:--
          </span>
        </span>
      </div>
    </div>
  </div>
);
renderCloseTime.propTypes = {
  label: PropTypes.string.isRequired,
  labelStyle: PropTypes.any,
  style: PropTypes.any.isRequired,
};
renderCloseTime.defaultProps = {
  labelStyle: {},
};

const renderWasteTypesItem = (props) => {
  const {
    isEdit, data,
    index,
    removeItem,
  } = props;

  return (
    <div className="row">
      <div className="col-xs-5 col-sm-5 col-md-5 col-lg-5">
        <Field
          name={`wasteTypes[${index}]`}
          label="Name"
          dropdownLabel="Choose A Type"
          data={data}
          textFieldName="name"
          showArray
          style={
            isEdit ? formStyles.dropdownList : {}
          }
          component={
            isEdit ? renderDropdwonList : renderStaticText2Rows
          }
          required
          validate={[required]}
        />
      </div>
      <div className="col-xs-5 col-sm-5 col-md-5 col-lg-5">
        <Field
          name={`amounts[${index}]`}
          label="Price"
          icon
          rightSide
          price
          dollar
          style={
            isEdit ? formStyles : {}
          }
          component={
            isEdit ? renderInput : renderStaticText2Rows
          }
          required
          normalize={decimalAllowed}
          validate={[required, decimal]}
        >
          <span>/ton</span>
        </Field>
      </div>
      <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
        <span
          className="handel-cross"
          style={{
            fontSize: 18,
            color: '#f06666',
            lineHeight: '89px',
            cursor: 'pointer',
          }}
          onClick={removeItem}
        />
      </div>
    </div>
  );
};

renderWasteTypesItem.propTypes = {
  isEdit: PropTypes.bool.isRequired,
  data: PropTypes.any.isRequired,
  index: PropTypes.any.isRequired,
  removeItem: PropTypes.func.isRequired,
};

const renderWasteTypes = ({
  fields, meta: { error },
  data = [], isEdit = false,
}) => (
  <div>
    {
      fields.map((charge, index) =>
        (
          <div key={shortid.generate()}>
            {/* <FormSection name={charge}> */}
            {renderWasteTypesItem({
                isEdit,
                data,
                charge,
                index,
                removeItem: () => fields.remove(index),
                })
            }
            {/* </FormSection> */}
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
        <span>Add more Waste Type</span>
      </span>
    </div>
  </div>
);

renderWasteTypes.propTypes = {
  isEdit: PropTypes.bool.isRequired,
  data: PropTypes.any.isRequired,
  fields: PropTypes.any.isRequired,
  meta: PropTypes.any.isRequired,
};

class DumpsiteDetailsUpperSubForm extends React.Component {
  render() {
    const {
      isEdit, councils, openDays, wasteTypes,
    } = this.props;

    return (
      <div>
        <div className="row">
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-5">
            <Field
              name="code"
              label="Dumpsite ID"
              style={
                isEdit ? formStyles : {}
              }
              component={
                isEdit ? renderInput :
                  renderStaticText2Rows
              }
              required
              validate={[required]}
            />
            <Field
              name="name"
              label="Dumpsite Name"
              style={
                isEdit ? formStyles : {}
              }
              component={
                isEdit ? renderInput :
                  renderStaticText2Rows
              }
              required
              validate={[required]}
            />
            <Field
              className="dumpsite-dropdown-box"
              name="council"
              label="Associated Council"
              style={
                isEdit ? { label: formStyles } : {}
              }
              component={
                isEdit ? renderValueFieldDropdownList : renderStaticText2Rows
              }
              data={councils}
              valueFieldName="_id"
              textFieldName="name"
              required
              valueArray
              validate={[required]}
            />
            <Field
              name="address"
              label="Dumpsite Address"
              style={
                isEdit ? formStyles : {}
              }
              component={
                isEdit ? AddressField :
                  renderStaticText2Rows
              }
              required
              validate={[required, validateAddress]}
            />
            <div className="row">
              <div className="col-xs-12">
                <Field
                  name="openDaysTitle"
                  label="Open Days"
                  component={renderStaticText2Rows}
                  style={{ display: 'initial' }}
                />
              </div>
            </div>
            {
              weekSet.map((w, i) => (
                <div className="row" key={shortid.generate()}>
                  {
                    isEdit ? (
                      <div>
                        <div className="col-xs-4 col-sm-4 col-md-4 col-lg-3">
                          <Field
                            name={`openDays[${i}].isOpen`}
                            label="Open"
                            type="checkbox"
                            checkboxTitle={`${w.title}`}
                            style={{ ...formStyles, label: { overflow: 'hidden' } }}
                            component={renderInput}
                          />
                        </div>
                        <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                          {
                            openDays[i] && openDays[i].isOpen ? (
                              <Field
                                className="dumpsite-dropdown-box"
                                name={`openDays[${i}].fromTime`}
                                label="From"
                                style={{ ...formStyles, label: { display: 'initial' } }}
                                required
                                component={InputOpenTimeStyleField}
                              />
                            ) : (
                              <Field
                                name={`openDays[${i}].fromTime`}
                                label="From"
                                style={{ ...formStyles, label: { display: 'initial' } }}
                                component={renderCloseTime}
                              />
                              )
                          }
                        </div>
                        <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                          {
                            openDays[i] && openDays[i].isOpen ? (
                              <Field
                                className="dumpsite-dropdown-box"
                                name={`openDays[${i}].toTime`}
                                label="To"
                                style={{ ...formStyles, label: { display: 'initial' } }}
                                required
                                component={InputOpenTimeStyleField}
                                // validate={[w.funcValidate]}
                              />
                            ) : (
                              <Field
                                name={`openDays[${i}].toTime`}
                                dayIndex={i}
                                label="To"
                                style={{ ...formStyles, label: { display: 'initial' } }}
                                component={renderCloseTime}
                              />
                              )
                          }
                        </div>
                      </div>
                    ) : (
                      <div style={{ padding: 10 }}>
                        <div className="col-xs-4 col-sm-4 col-md-4 col-lg-3">
                          {weekSet[i].title}
                        </div>
                        <div className="col-xs-8 col-sm-8 col-md-8 col-lg-8">
                          {
                            openDays[i] && openDays[i].isOpen ? (
                              <div>
                                <Field
                                  name={`openDays[${i}].fromTime`}
                                  component={renderStaticOpenDays}
                                />
                                &nbsp;-&nbsp;
                                <Field
                                  name={`openDays[${i}].toTime`}
                                  component={renderStaticOpenDays}
                                />
                              </div>
                            ) : (
                              <div>Closed</div>
                            )
                          }

                        </div>
                      </div>

                    )
                  }
                </div>
              ))
            }
          </div>
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-5">
            <div className="row">
              <div className="col-xs-12">
                <div style={{ fontWeight: '600', paddingLeft: 10, color: '#1d415d' }}>
                  Waste Type *
                </div>
              </div>
            </div>
            {/* <div className="row">
              <div className="col-xs-12">
                <Field
                  name="wasteType"
                  label="Waste Type"
                  component={renderStaticText2Rows}
                  style={{ display: 'initial' }}
                />
              </div>
            </div> */}
            {
              isEdit ? (
                <FieldArray
                  name="charges"
                  data={wasteTypes}
                  isEdit={isEdit}
                  component={renderWasteTypes}
                />
              ) : (
                <Field
                  name="charges"
                  data={wasteTypes}
                  component={renderWasteTypePrices}
                />
              )
            }
          </div>

        </div>

      </div>
    );
  }
}

DumpsiteDetailsUpperSubForm.propTypes = {
  isEdit: PropTypes.bool,
  openDays: PropTypes.any,
  wasteTypes: PropTypes.any,
  councils: PropTypes.array,
  // isAdd: PropTypes.bool,
};

DumpsiteDetailsUpperSubForm.defaultProps = {
  isEdit: false,
  openDays: [],
  wasteTypes: [{}],
  councils: [],
  // isAdd: false,
};

export default DumpsiteDetailsUpperSubForm;
