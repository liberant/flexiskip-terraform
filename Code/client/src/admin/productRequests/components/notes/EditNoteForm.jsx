import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import validate from 'validate.js';
import { Button } from 'antd';

import TextAreaField from '../../../../common/components/form/TextAreaField';
import styles from './NoteItem.m.css';

const EditNoteForm = ({
  handleSubmit, submitting, onCancel,
}) => (
  <form onSubmit={handleSubmit} className="w-form">
    <Field name="content" component={TextAreaField} rows={4} placeholder="Add your note here..." />
    <div className={styles.buttons} >
      <Button
        size="large"
        shape="circle"
        loading={submitting}
        htmlType="submit"
        className={styles.btnBlue}
      >
        {!submitting && (<span className="handel-floppy-disk" />)}
      </Button>
      <Button
        size="large"
        shape="circle"
        onClick={onCancel}
        htmlType="button"
        className={styles.btnRed}
      >
        <span className="handel-cross" />
      </Button>
    </div>
  </form>
);

EditNoteForm.propTypes = {
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default reduxForm({
  validate: (data) => {
    const constraints = {
      content: {
        presence: { allowEmpty: false },
      },
    };
    return validate(data, constraints, { format: 'grouped' }) || {};
  },
})(EditNoteForm);

