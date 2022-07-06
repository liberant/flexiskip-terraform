import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

import {
  renderInput,
  normalizePhoneNumber10,
  required,
  numberOnly,
  phoneNumber,
  renderStaticText2Rows,
  renderStaticImage,
} from '../../../common/components/form/reduxFormComponents';
import ImagesS3UploadField from '../../../common/components/form/ImagesS3UploadField';


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

class CustomerDetailsSubForm extends React.Component {
  render() {
    const { isEdit, isDriver } = this.props;
    return (
      <div>
        <div className="row" style={{ fontSize: 14 }}>
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-4">
            <Field
              name="avatar"
              component={
                isEdit ? ImagesS3UploadField : renderStaticImage
              }
              style={
                isEdit ? {} : Styles.staticImage
              }
              required
            />
          </div>
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8">
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <Field
                  name="firstname"
                  label="First Name"
                  component={
                    isEdit ? renderInput : renderStaticText2Rows
                  }
                  style={
                    isEdit ? Styles : {}
                  }
                  required
                  validate={[required]}
                />
              </div>
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <Field
                  name="lastname"
                  label="Last Name"
                  component={
                    isEdit ? renderInput : renderStaticText2Rows
                  }
                  style={
                    isEdit ? Styles : {}
                  }
                  required
                  validate={[required]}
                />
              </div>
            </div>
            {
              !isDriver ? (
                <div className="row">
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <Field
                      name="address"
                      label="Address"
                      component={
                        isEdit ? renderInput : renderStaticText2Rows
                      }
                      style={
                        isEdit ? Styles : {}
                      }
                      required
                      validate={[required]}
                    />
                  </div>
                </div>
              ) : null
            }

            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <Field
                  name="email"
                  label="Email"
                  component={renderStaticText2Rows}
                  style={Styles}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <Field
                  name="phone"
                  label="Phone"
                  component={
                    isEdit ? renderInput : renderStaticText2Rows
                  }
                  style={
                    isEdit ? Styles : { marginLeft: 15 }
                  }
                  required
                  icon
                  phone
                  normalize={normalizePhoneNumber10}
                  validate={[required, phoneNumber]}
                >
                  <span style={{ fontSize: 16, color: '#239dff' }}>
                    <span className="handel-mobile" />
                  </span>
                </Field>
              </div>
            </div>
            {/* <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <Field
                  name="note"
                  label="Note"
                  component={
                    isEdit ? renderTextArea : renderStaticText2Rows
                  }
                  style={
                    isEdit ? Styles : {}
                  }
                />
              </div>
            </div> */}
          </div>
        </div>
      </div>
    );
  }
}

CustomerDetailsSubForm.propTypes = {
  isEdit: PropTypes.bool,
  isDriver: PropTypes.bool,
};

CustomerDetailsSubForm.defaultProps = {
  isEdit: false,
  isDriver: false,
};

export default CustomerDetailsSubForm;
