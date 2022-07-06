import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

import {
  renderStaticText2Rows,
  renderInput,
  renderDropdwonList,
  renderDatePicker,
  required,
} from '../../../../common/components/form/reduxFormComponents';

import { statusDiscountTypes } from '../../../../common/constants/styles';
import { formStyles } from './Styles';

class DiscountDetailsUpperSubForm extends React.Component {
  render() {
    const { isEdit } = this.props;

    return (
      <div>
        <div className="row">
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-5">
            <Field
              name="status"
              label="Status"
              dropdownLabel="Choose Status"
              data={statusDiscountTypes}
              statusArrayName="discount"
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
                  name="dateStart"
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
                  name="dateEnd"
                  label="End Date"
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
            </div>
          </div>
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-5">
            <Field
              name="name"
              label="Name"
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
              name="code"
              label="Code"
              component={
                isEdit ? renderInput : renderStaticText2Rows
              }
              style={
                isEdit ? formStyles : {}
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

DiscountDetailsUpperSubForm.propTypes = {
  isEdit: PropTypes.bool,
  // isAdd: PropTypes.bool,
};

DiscountDetailsUpperSubForm.defaultProps = {
  isEdit: false,
  // isAdd: false,
};

export default DiscountDetailsUpperSubForm;
