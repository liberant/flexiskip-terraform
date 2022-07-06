import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';

import ImagesS3UploadField from '../../../../common/components/form/ImagesS3UploadField';
import InputField from '../../../../common/components/form/InputField';
import SelectField from '../../../../common/components/form/SelectField';
import SwitchField from '../../../../common/components/form/SwitchField';
import StateSelectField from '../../components/StateSelectField';

function getPostCodeOptions(allStates, currentState) {
  if (!currentState) return [];
  const state = allStates.find(item => item.name === currentState);
  if (!state) return [];
  return state.postCodes.map(pc => ({ label: pc, value: pc }));
}

const CouncilView = ({ handleSubmit, state, states }) => {
  const postCodeOptions = getPostCodeOptions(states, state);
  return (
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
              viewOnly
            />
            <Field
              label="Council Name"
              name="name"
              component={InputField}
              viewOnly
            />
            <div className="row">
              <div className="col-md-12">
                <Field
                  label="State"
                  name="state"
                  component={StateSelectField}
                  viewOnly
                />
              </div>
            </div>
            <Field
              label="Post Codes"
              name="postCodes"
              component={SelectField}
              options={postCodeOptions}
              mode="multiple"

              viewOnly
            />
            <Field
              label="Surcharge ($)"
              name="surcharge"
              component={InputField}
              viewOnly
            />
            <Field
              label="Active"
              name="isActive"
              component={SwitchField}
              viewOnly
            />
          </div>
          <div className="col-md-6">
            <Field
              label="Branding"
              name="branding"
              component={ImagesS3UploadField}
              viewOnly
            />
          </div>
        </div>
      </div>
    </form>
  );
};

CouncilView.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  state: PropTypes.string,
  states: PropTypes.array.isRequired,
};

CouncilView.defaultProps = {
  state: '',
};

const selector = formValueSelector('councilForm');

export default compose(
  connect(state => ({
    states: state.admin.councils.list.states,
    state: selector(state, 'state'),
  })),
  reduxForm({
    form: 'councilForm',
    enableReinitialize: true,
  }),
)(CouncilView);

