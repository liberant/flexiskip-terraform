import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import validate from 'validate.js';
import { Input, Button } from 'antd';

import ErrorList from '../../../../common/components/form/ErrorList';

const { TextArea } = Input;


const TextAreaField = ({
  input,
  meta,
  ...otherProps
}) => {
  const { touched, error } = meta;
  const className = touched && error ? 'has-error' : '';
  return (
    <div className={`form-group ${className}`}>
      <TextArea {...input} className="form-control" {...otherProps} />
      {touched && <ErrorList errors={error} />}
    </div>
  );
};

TextAreaField.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
};

const AddNoteForm = ({ handleSubmit, submitting }) => (
  <form onSubmit={handleSubmit} className="w-form">
    <Field name="content" component={TextAreaField} rows={4} placeholder="Add your note here..." />
    <div className="text-center">
      <Button
        size="large"
        type="primary"
        loading={submitting}
        htmlType="submit"
      >
        SUBMIT
      </Button>
    </div>
  </form>
);

AddNoteForm.propTypes = {
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'addDisputeNote',
  enableReinitialize: true,
  validate: (data) => {
    const constraints = {
      content: {
        presence: { allowEmpty: false },
      },
    };
    return validate(data, constraints, { format: 'grouped' }) || {};
  },
})(AddNoteForm);

