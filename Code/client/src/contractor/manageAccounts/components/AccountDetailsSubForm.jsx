import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

import {
  required,
  renderStaticText2Rows,
  renderDropdwonList,
  renderInput,
} from '../../../common/components/form/reduxFormComponents';

import { statusUserTypes } from '../../../common/constants/styles';

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

const renderDriverRoleAdmin = (props) => {
  const { input } = props;
  if (input.value) {
    return (
      <span>Also an Admin</span>
    );
  }

  return null;
};
renderDriverRoleAdmin.propTypes = {
  input: PropTypes.any.isRequired,
};

const renderDriverRolePrimaryContact = (props) => {
  const { input } = props;
  if (input.value) {
    return (
      <span> & Primary Contact</span>
    );
  }

  return null;
};
renderDriverRolePrimaryContact.propTypes = {
  input: PropTypes.any.isRequired,
};

class AccountDetailsSubForm extends React.Component {
  render() {
    const { isEdit, isAdmin } = this.props;
    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            {
              isEdit ? (
                <div className="row">
                  <div className="col-xs-6">
                    <Field
                      name="isAdmin"
                      label="Also an Admin"
                      type="checkbox"
                      component={renderInput}
                    />
                  </div>
                  {
                    isAdmin ? (
                      <div className="col-xs-6">
                        <Field
                          name="isPrimary"
                          label="Also a Primary Contact"
                          type="checkbox"
                          component={renderInput}
                        />
                      </div>
                    ) : null
                  }
                </div>
              ) : (
                <div className="row">
                  <div className="col-xs-12" style={{ paddingLeft: 20 }}>
                    <Field
                      name="isAdmin"
                      label=""
                      component={renderDriverRoleAdmin}
                    />
                    <Field
                      name="isPrimary"
                      label=""
                      component={renderDriverRolePrimaryContact}
                    />
                  </div>
                </div>
              )
            }
          </div>
        </div>
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
              date
              component={renderStaticText2Rows}
            />
          </div>
          <div className="col-xs-6">
            <Field
              name="deletedAt"
              label="Inactive Date"
              date
              component={renderStaticText2Rows}
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
