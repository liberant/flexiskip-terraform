import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import validate from 'validate.js';
import { compose } from 'redux';
import { connect } from 'react-redux';

import ImagesS3UploadField from '../../../common/components/form/ImagesS3UploadField';
import InputField from '../../../common/components/form/InputField';
import SwitchField from '../../../common/components/form/SwitchField';
import StateSelectField from './StateSelectField';
import PostCodesSelectField from './PostCodesSelectField';

const CouncilForm = ({ handleSubmit, selectedState }) => (
  <form onSubmit={handleSubmit} id="councilForm">
    <div className="w-panel w-form">
      <div className="w-title">
        <h2>Council Details</h2>
      </div>
      <div className="row">
        <div className="col-md-6">
          <Field
            label="Council ID"
            name="code"
            component={InputField}
          />
          <Field
            label="Council Name"
            name="name"
            component={InputField}
          />
          <div className="row">
            <div className="col-md-12">
              <Field
                label="State"
                name="state"
                component={StateSelectField}
              />
            </div>
          </div>
          <Field
            label="Post Codes"
            name="postCodes"
            selectedState={selectedState}
            component={PostCodesSelectField}
          />
          <Field
            label="Surcharge ($)"
            name="surcharge"
            component={InputField}
          />
          <Field
            label="Active"
            name="isActive"
            component={SwitchField}
          />
        </div>
        <div className="col-md-6">
          <Field
            label="Branding"
            name="branding"
            component={ImagesS3UploadField}
          />
        </div>
      </div>
    </div>
  </form>
);

CouncilForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  selectedState: PropTypes.string,
};

CouncilForm.defaultProps = {
  selectedState: '',
};

const selector = formValueSelector('councilForm');

export default compose(
  connect((state) => {
    const region = selector(state, 'state');
    return {
      selectedState: region,
    };
  }),
  reduxForm({
    form: 'councilForm',
    enableReinitialize: true,
    validate: (data) => {
      const constraints = {
        code: {
          presence: { allowEmpty: false, message: "^Council ID can't be blank" },
        },
        name: {
          presence: { allowEmpty: false, message: "^Council name can't be blank" },
        },
        state: {
          presence: { allowEmpty: false },
        },
        postCodes: {
          presence: { allowEmpty: false, message: "^Post codes can't be blank" },
        },
      };
      const errors = validate(data, constraints, { format: 'grouped' }) || {};
      return errors;
    },
  }),
)(CouncilForm);

