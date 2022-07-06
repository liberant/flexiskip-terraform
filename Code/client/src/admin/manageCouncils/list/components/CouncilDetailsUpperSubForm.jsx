import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

import {
  renderStaticText2Rows,
  renderInput,
  renderValueFieldDropdownList,
  renderSwitchButton,
  renderStatusText2Rows,
  renderStaticImage,
  required,
  decimalAllowed,
  decimal,
  renderMultiSelect,
} from '../../../../common/components/form/reduxFormComponents';
import ImagesS3UploadField from '../../../../common/components/form/ImagesS3UploadField';


import { formStyles } from './Styles';

export const statesLocal = [
  {
    name: 'ACT',
    description: 'Australian Capital Territory',
    postCodes: [],
    _id: '0',
  },
  {
    name: 'NSW',
    description: 'New South Wales',
    postCodes: [],
    _id: '1',
  },
  {
    name: 'QLD',
    description: 'Queensland',
    postCodes: [],
    _id: '2',
  },
  {
    name: 'SA',
    description: 'South Australia',
    postCodes: [],
    _id: '3',
  },
  {
    name: 'TAS',
    description: 'Tasmania ',
    postCodes: [],
    _id: '4',
  },
  {
    name: 'VIC',
    description: 'Victoria',
    postCodes: [],
    _id: '5',
  },

  {
    name: 'WA',
    description: 'Western Australia',
    postCodes: [],
    _id: '6',
  },
];

export const renderStateStaticText2Rows = ({
  input, label, style, required, labelStyle,
}) => {
  let content = input.value;

  if (typeof (content) === 'string') {
    content = input.value;
  } else {
    content = input.value.name;
  }

  return (
    <div>
      <div className="form-group row" style={{ marginLeft: 0 }} >
        <label className="control-label col-sm-12" htmlFor={label} style={labelStyle}>
          {required ? `${label} *` : `${label}`}
        </label>
        <div className="col-sm-12">
          <div className="form-control-static" style={{ ...style }}>
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};

renderStateStaticText2Rows.propTypes = {
  input: PropTypes.any.isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  labelStyle: PropTypes.any,
  style: PropTypes.any,
};

renderStateStaticText2Rows.defaultProps = {
  required: false,
  labelStyle: {},
  style: {},
};


class CouncilDetailsUpperSubForm extends React.Component {
  render() {
    const {
      isEdit, regions, postcodes, states, initialValues,
    } = this.props;

    const councilStatus = (initialValues.status === 'Active');

    const stateList = (states && states.length > 0) ? states : statesLocal;
    return (
      <div>
        <div className="row">
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-5">
            <Field
              name="code"
              label="Council ID"
              component={
                isEdit ? renderInput : renderStaticText2Rows
              }
              style={
                isEdit ? formStyles : {}
              }
              required
              validate={[required]}
            />
            <Field
              name="name"
              label="Council Name"
              placeholder="This is Council Name"
              component={
                isEdit ? renderInput : renderStaticText2Rows
              }
              style={
                isEdit ? formStyles : {}
              }
              required
              validate={[required]}
            />
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <Field
                  className="add-council-box"
                  name="state"
                  label="State"
                  dropdownLabel="Choose A State"
                  valueFieldName="name"
                  textFieldName="description"
                  data={stateList}
                  style={
                    isEdit ? { ...formStyles } : {}
                  }
                  component={
                    isEdit ? renderValueFieldDropdownList : renderStateStaticText2Rows
                  }
                  placeholder=""
                  required
                  validate={[required]}
                />
              </div>
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <Field
                  className="add-council-box"
                  name="region"
                  label="Region"
                  dropdownLabel="Choose A Region"
                  valueFieldName="name"
                  textFieldName="name"
                  data={regions}
                  style={
                    isEdit ? { ...formStyles } : {}
                  }
                  component={
                    isEdit ? renderValueFieldDropdownList : renderStaticText2Rows
                  }
                  placeholder=""
                  required
                  validate={[required]}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12">
                <Field
                  name="postCodes"
                  label="Post Codes"
                  data={postcodes}
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
              <div className="col-xs-12">
                <Field
                  name="surcharge"
                  label="Surcharge"
                  component={
                    isEdit ? renderInput : renderStaticText2Rows
                  }
                  style={
                    isEdit ? { ...formStyles, label: { display: 'initial', color: '#666666' } } : {}
                  }
                  required
                  price
                  icon
                  validate={[required, decimal]}
                  normalize={decimalAllowed}
                >
                  <span>$</span>
                </Field>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12" style={{ paddingLeft: '20px' }}>
                {isEdit ?
                  <Field
                    name="status"
                    label="Status"
                    data={councilStatus}
                    component={
                      isEdit ? renderSwitchButton : {}
                    }
                    style={
                      isEdit ? { ...formStyles, label: { display: 'initial', color: '#666666' }, marginLeft: '-10px' } : {}
                    }
                  /> :
                      <div className="form-group row">
                        <label
                          className="control-label col-sm-12"
                          htmlFor="Status"
                          style={{
                            backgroundColor: 'transparent',
                            boxShadow: '0 0 0',
                            borderWidth: 0,
                            height: 20,
                          }}
                        >
                          Status
                        </label>
                        <div
                          className="col-sm-12"
                          style={{
                            backgroundColor: 'transparent',
                            boxShadow: '0 0 0',
                            borderWidth: 0,
                            height: 20,
                          }}
                        >
                          <span className="form-control-static">
                            {initialValues.status}
                          </span>
                        </div>
                      </div>
                }
              </div>
            </div>
          </div>
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-5">
            <Field
              name="branding"
              component={
                isEdit ? ImagesS3UploadField : renderStaticImage
              }
              style={
                isEdit ? {} : formStyles.staticImage
              }
            />
          </div>

        </div>

      </div>
    );
  }
}

CouncilDetailsUpperSubForm.propTypes = {
  isEdit: PropTypes.bool,
  // isAdd: PropTypes.bool,
  regions: PropTypes.array,
  postcodes: PropTypes.array,
  states: PropTypes.array,
  status: PropTypes.bool,
  initialValues: PropTypes.any,
};

CouncilDetailsUpperSubForm.defaultProps = {
  isEdit: false,
  regions: [],
  postcodes: [],
  states: [],
  status: true,
  initialValues: {},
  // isAdd: false,
};

export default CouncilDetailsUpperSubForm;
