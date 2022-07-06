import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray, reduxForm } from 'redux-form';

import CouncilSelectField from '../../components/CouncilSelectField';
import OpenDaysField from '../../components/OpenDaysField';
import WasteTypesField from '../../components/WasteTypesField';
import AddressField from '../../../../common/components/form/AddressField';
import InputField from '../../../../common/components/form/InputField';

const LinkField = (props) => {
  const {
    input,
    label,
  } = props;
  return (
    <div className="form-group">
      <label className="control-label">{label}</label>
      <p className="form-control-static">
        <a href={input.value} target="_blank">{input.value}</a>
      </p>
    </div>
  );
};

LinkField.propTypes = {
  label: PropTypes.string.isRequired,
  input: PropTypes.object.isRequired,
};

const DumpsiteView = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit} id="dumpsiteForm">
    <div className="w-panel w-form">
      <div className="w-title">
        <h2>Dumpsite Details</h2>
      </div>
      <div className="row">
        <div className="col-md-6">
          <Field
            label="Dumpsite ID"
            name="code"
            component={InputField}
            viewOnly
          />
          <Field
            label="Dumpsite Name"
            name="name"
            component={InputField}
            viewOnly
          />
          <Field
            label="Associated Council"
            name="council"
            component={CouncilSelectField}
            viewOnly
          />
          <Field
            label="Dumpsite Address"
            name="address"
            component={AddressField}
            viewOnly
          />
          <FieldArray
            label="Open Days"
            name="openDays"
            component={OpenDaysField}
            rerenderOnEveryChange
            viewOnly
          />
        </div>
        <div className="col-md-6">
          <Field
            label="Website"
            name="website"
            component={LinkField}
          />
          <Field
            label="Price List"
            name="priceListUrl"
            component={LinkField}
          />
          <FieldArray
            label="Waste Type"
            name="charges"
            component={WasteTypesField}
            viewOnly
          />
        </div>
      </div>
    </div>
  </form>
);

DumpsiteView.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

DumpsiteView.defaultProps = {
};

export default reduxForm({
  form: 'dumpsiteForm',
  enableReinitialize: true,
})(DumpsiteView);

