import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

import {
  renderStaticText2Rows,
  renderInput,
  renderDropdwonList,
  renderDatePicker,
  required,
  validatePastDate,
  validateFutureDate,
} from '../../../common/components/form/reduxFormComponents';

import { formStyles } from './Styles';

const VehicleClasses = [
  'Class LR', 'Class MR', 'Class HR', 'Class HC', 'Class MC',
];

const states = [
  'Queensland',
  'New South Wales',
  'Victoria',
  'South Australia',
  'Western Australia',
  'Northern Australia Territory',
  'Tasmania ',
  'Australian Capital Territory',
];

class LicenceInformationSubForm extends React.Component {
  render() {
    const { isEdit } = this.props;
    return (
      <div>
        <div className="row">
          <div className="col-xs-6">
            <Field
              name="licence.licenceNo"
              label="Licence No."
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
          <div className="col-xs-6">
            <Field
              name="licence.licenceClass"
              label="Licence Class"
              dropdownLabel="Vehicle Class"
              data={VehicleClasses}
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
        </div>
        <div className="row">
          <div className="col-xs-6">
            <Field
              name="licence.dateOfIssued"
              label="Date of Issue"
              date
              style={
                isEdit ? { label: formStyles.datePicker } : {}
              }
              component={
                isEdit ? renderDatePicker : renderStaticText2Rows
              }
              required
              validate={[required, validatePastDate]}
            />
          </div>
          <div className="col-xs-6">
            <Field
              name="licence.expiryDate"
              label="Expiry Date"
              date
              style={
                isEdit ? { label: formStyles.datePicker } : {}
              }
              component={
                isEdit ? renderDatePicker : renderStaticText2Rows
              }
              required
              validate={[required, validateFutureDate]}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <Field
              name="licence.stateOfIssue"
              label="Licence State / Territory Issued"
              dropdownLabel="State of Issue"
              data={states}
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
        </div>
      </div>
    );
  }
}

LicenceInformationSubForm.propTypes = {
  isEdit: PropTypes.bool,
};

LicenceInformationSubForm.defaultProps = {
  isEdit: false,
};

export default LicenceInformationSubForm;
