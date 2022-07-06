import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

import {
  renderStaticText2Rows,
  required,
  renderDropdwonList,
  renderDatePicker,
  renderStaticImage,
} from '../../../common/components/form/reduxFormComponents';
import ImagesS3UploadField from '../../../common/components/form/ImagesS3UploadField';
import AdsSectionField from '../../../common/components/form/AdsSectionField';

import { statusAdvertisingTypes } from '../../../common/constants/styles';

import { formStyles } from './Styles';

const validateStartDateEndDate = (value, allValues) => {
  const { startDate, endDate } = allValues;

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return 'End Date Error';
    }
  }

  return undefined;
};

class AdvertisingDetailsUpperSubForm extends React.Component {
  render() {
    const { isEdit, section } = this.props;

    return (
      <div>
        <div className="row">
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-5">
            <Field
              name="status"
              label="Status"
              dropdownLabel="Choose Status"
              data={statusAdvertisingTypes}
              statusArrayName="advertising"
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
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <Field
                  name="startDate"
                  label="Start Date"
                  date
                  style={
                    isEdit ? { label: formStyles.datePicker } : {}
                  }
                  component={
                    isEdit ? renderDatePicker : renderStaticText2Rows
                  }
                  required
                  validate={[required]}
                />
              </div>
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <Field
                  name="endDate"
                  label="End Date"
                  date
                  style={
                    isEdit ? { label: formStyles.datePicker } : {}
                  }
                  component={
                    isEdit ? renderDatePicker : renderStaticText2Rows
                  }
                  required
                  validate={[required, validateStartDateEndDate]}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <Field
                  name="section"
                  label="Section"
                  style={
                    isEdit ? { formStyles } : {}
                  }
                  icon
                  component={
                    isEdit ? AdsSectionField : renderStaticText2Rows
                  }
                  required
                  validate={[required]}
                >
                  <span
                    className={
                      section.trim().toLowerCase().includes('horizontal') ?
                        'handel-horizontal' : 'handel-vertical'
                    }
                    style={{ paddingRight: 5 }}
                  />
                </Field>
              </div>
            </div>
          </div>
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-5">
            <Field
              name="image"
              label="Image"
              component={
                isEdit ? ImagesS3UploadField : renderStaticImage
              }
              style={
                isEdit ? {} : formStyles.staticImage
              }
              required
              validate={[required]}
            />
          </div>

        </div>

      </div>
    );
  }
}

AdvertisingDetailsUpperSubForm.propTypes = {
  isEdit: PropTypes.bool,
  section: PropTypes.string,
  // isAdd: PropTypes.bool,
};

AdvertisingDetailsUpperSubForm.defaultProps = {
  isEdit: false,
  section: 'horizontal',
  // isAdd: false,
};

export default AdvertisingDetailsUpperSubForm;
