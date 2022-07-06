import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import validate from 'validate.js';

import InputField from '../../../common/components/form/InputField';
import SelectField from '../../../common/components/form/SelectField';
import WasteTypeChecboxList from './WasteTypeChecboxList';
import HandelButton from '../../../common/components/HandelButton';

const VEHICLE_CLASSES = [
  {
    value: 'Class LR',
    label: 'Class LR',
  },
  {
    value: 'Class MR',
    label: 'Class MR',
  },
  {
    value: 'Class HR',
    label: 'Class HR',
  },
  {
    value: 'Class HC',
    label: 'Class HC',
  },
  {
    value: 'Class MC',
    label: 'Class MC',
  },
];

const AddVehicleForm = ({ handleSubmit, handleCancel }) => (
  <div>
    <div className="top-toolbar">
      <HandelButton
        label="Cancel Add"
        onClick={handleCancel}
        borderColor="red"
        iconColor="red"
        shadowColor="red"
        bgColor="white"
      >
        <span className="handel-cross" />
      </HandelButton>
      <HandelButton
        label="Save"
        onClick={handleSubmit}
        iconColor="white"
        bgColor="blue"
        borderColor="blue"
        shadowColor="blue"
      >
        <span className="handel-floppy-disk" />
      </HandelButton>
    </div>

    <form onSubmit={handleSubmit} className="w-panel w-form">

      <div className="w-title"><h2>Vehicle Information</h2></div>

      <div className="vehicle-info-grid-container">
        <div className="vehicle-info-grid-item">
          <div className="content col-md-4">
            <div className="row">
              <Field name="class" component={SelectField} options={VEHICLE_CLASSES} placeholder="Choose Class" placeholder="Choose Class" label="Vehicle Class" />

              <Field name="model" component={InputField} placeholder="Vehicle Name" label="Vehicle Name" />

              <Field name="regNo" component={InputField} type="text" placeholder="Vehicle Registration No." label="Rego No." />
            </div>

          </div>
        </div>
        <div className="vehicle-info-grid-item">
          <Field name="wasteTypes" component={WasteTypeChecboxList} label="Product Types" />
        </div>
      </div>
    </form>
  </div>
);

const ReduxAddVehicleForm = reduxForm({
  form: 'addVehicleForm',
  validate: (data) => {
    const constraints = {
      regNo: {
        presence: { message: '^Vehicle registration no. can\'t be blank', allowEmpty: false },
      },
      wasteTypes: {
        presence: { message: '^Product types must be selected', allowEmpty: false },
      },
    };
    return validate(data, constraints, { format: 'grouped' }) || {};
  },
})(AddVehicleForm);

AddVehicleForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

export default ReduxAddVehicleForm;
