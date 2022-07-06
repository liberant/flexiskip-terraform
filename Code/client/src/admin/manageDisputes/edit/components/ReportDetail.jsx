import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import validate from 'validate.js';

import SelectField from '../../../../common/components/form/SelectField';
import statuses from '../../../../common/constants/dispute-statuses';

const statusOptions = statuses.map(status => ({
  label: status,
  value: status,
}));

const ReportDetail = ({ handleSubmit, dispute }) => (
  <form onSubmit={handleSubmit} id="editDisputeForm">
    <div className="w-panel w-form">
      <div className="w-title">
        <h2>Report Details</h2>
      </div>
      <Field name="status" component={SelectField} label="Status" options={statusOptions} />
      <div className="form-group">
        <label className="control-label">Collection Reference</label>
        <p className="form-control-static">{dispute.collectionRequest.code}</p>
      </div>
    </div>
  </form>
);

ReportDetail.propTypes = {
  dispute: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

ReportDetail.defaultProps = {
};

export default compose(
  connect(state => ({
    initialValues: state.admin.manageDisputes.view.dispute,
  })),
  reduxForm({
    form: 'updateDispute',
    validate: (data) => {
      const constraints = {
        status: {
          presence: { allowEmpty: false },
        },
      };
      return validate(data, constraints, { format: 'grouped' }) || {};
    },
    enableReinitialize: true,
  }),
)(ReportDetail);

