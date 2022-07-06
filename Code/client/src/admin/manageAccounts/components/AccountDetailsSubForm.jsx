import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

import {
  required,
  renderStaticText2Rows,
  renderDropdwonList,
} from '../../../common/components/form/reduxFormComponents';
import { statusUserTypes } from '../../../common/constants/styles';
import SelectField from '../../../common/components/form/SelectField';
import DatePickerField from '../../../common/components/form/DatePickerField';
import { roleDisplayOptions, roleSelectOptions } from '../constants/userTypes';
import InputField from '../../../common/components/form/InputField';

const APP_BACKGROUND_COLOR = '#F6F6F6';

const Styles = {
  input: {
    backgroundColor: 'transparent',
    boxShadow: '0 0 0',
    borderWidth: 0,
  },
  inputBox: {
    backgroundColor: APP_BACKGROUND_COLOR,
    borderRadius: '5px',
  },
  sizePrefix: {
    fontSize: 16,
  },
  sizePostfix: {
    fontSize: 14,
  },
  textarea: {
    backgroundColor: APP_BACKGROUND_COLOR,
    borderRadius: '5px',
  },
  dropdownList: {
    width: '100%',
    height: 34,
    borderWidth: 0,
    backgroundColor: APP_BACKGROUND_COLOR,
  },
};

class AccountDetailsSubForm extends React.Component {
  render() {
    const { isEdit, isAdmin } = this.props;
    return (
      <div className="w-form">
        <Field
          name="uId"
          label="User ID"
          component={InputField}
          viewOnly
        />
        <Field
          name="role"
          label="User Type"
          options={isAdmin ? roleSelectOptions : roleDisplayOptions}
          component={SelectField}
          viewOnly={!isEdit || !isAdmin}
          validate={[required]}
          required
        />

        <div className="row">
          <div className="col-xs-8">
            <Field
              name="status"
              label="Status"
              dropdownLabel="Choose Status"
              data={statusUserTypes}
              statusArrayName="user"
              style={
                isEdit ? Styles.dropdownList : {}
              }
              component={
                isEdit ? renderDropdwonList :
                renderStaticText2Rows
              }
              required
              validate={[required]}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-6">
            <Field
              name="createdAt"
              label="Date Joined"
              component={DatePickerField}
              viewOnly
            />
          </div>
          <div className="col-xs-6">
            <Field
              name="deletedAt"
              label="Inactive Date"
              component={DatePickerField}
              viewOnly
            />
          </div>
        </div>

      </div>
    );
  }
}

AccountDetailsSubForm.propTypes = {
  isEdit: PropTypes.bool,
  isAdmin: PropTypes.bool,
};

AccountDetailsSubForm.defaultProps = {
  isEdit: false,
  isAdmin: false,
};

export default AccountDetailsSubForm;
