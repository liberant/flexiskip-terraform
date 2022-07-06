import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

import {
  renderInput,
  required,
  normalizePhoneNumber10,
  phoneNumber,
  renderStaticText2Rows,
  email,
} from '../../../common/components/form/reduxFormComponents';
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
    fontSize: 14,
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
  staticImage: {
    width: 100,
    height: 100,
    marginTop: 15,
    border: 'solid 2px #e2eaf0',
    borderRadius: 100,
  },
};

class NewBusinessContractorContactDetailsSubForm extends React.Component {
  render() {
    const { isEdit, isAdd } = this.props;
    return (
      <div className="w-form">
        <div className="row" style={{ fontSize: 14 }}>
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <Field
                  name="isDriver"
                  label="Also a driver"
                  type="checkbox"
                  component={
                    isAdd ? renderInput : renderStaticText2Rows
                  }
                  style={
                    isAdd ? Styles : {}
                  }
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <Field
                  name="contact.firstname"
                  label="First Name"
                  component={InputField}
                  viewOnly={!isEdit}
                  required
                  validate={[required]}
                />
              </div>
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <Field
                  name="contact.lastname"
                  label="Last Name"
                  component={InputField}
                  viewOnly={!isEdit}
                  required
                  validate={[required]}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <Field
                  name="contact.email"
                  label="Email"
                  component={InputField}
                  viewOnly={!isEdit}
                  required
                  validate={[required, email]}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <Field
                  name="contact.phone"
                  label="Phone"
                  component={InputField}
                  viewOnly={!isEdit}
                  normalize={normalizePhoneNumber10}
                  required
                  validate={[required, phoneNumber]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

NewBusinessContractorContactDetailsSubForm.propTypes = {
  isEdit: PropTypes.bool,
  isAdd: PropTypes.bool,
};

NewBusinessContractorContactDetailsSubForm.defaultProps = {
  isEdit: false,
  isAdd: false,
};

export default NewBusinessContractorContactDetailsSubForm;
