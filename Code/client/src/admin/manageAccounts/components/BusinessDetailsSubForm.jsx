import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

import {
  // email,
  renderInput,
  renderTextArea,
  required,
  phoneNumber,
  renderStaticText2Rows,
  renderStaticImage,
  normalizeABNNumber,
  fixedNumberLength11,
  normalizePhoneNumber10,
  validateAddress,
} from '../../../common/components/form/reduxFormComponents';
import ImagesS3UploadField from '../../../common/components/form/ImagesS3UploadField';
import AddressField from '../../../common/components/form/AddressField';


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

class BusinessDetailsSubForm extends React.Component {
  render() {
    const { isEdit} = this.props;
    return (
      <div>
        <div className="row" style={{ fontSize: 14 }}>
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-4">
            <Field
              name="avatar"
              component={ImagesS3UploadField}
              viewOnly={!isEdit}
            />
          </div>
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8">
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <Field
                  name="organisation.abn"
                  label="Business ABN"
                  component={
                    isEdit ? renderInput : renderStaticText2Rows
                  }
                  style={
                    isEdit ? Styles : {}
                  }
                  required
                  normalize={normalizeABNNumber}
                  validate={[required, fixedNumberLength11]}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <Field
                  name="organisation.name"
                  label="Company Name"
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
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <Field
                  name="organisation.address"
                  label="Address"
                  component={
                    isEdit ? AddressField : renderStaticText2Rows
                  }
                  style={
                    isEdit ? Styles : {}
                  }
                  required
                  validate={[required, validateAddress]}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <Field
                  name="organisation.email"
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
                  normalize={normalizePhoneNumber10}
                  required
                  icon
                  phone
                  validate={[required, phoneNumber]}
                >
                  <span style={{ fontSize: 16, color: '#239dff' }}>
                    <span className="handel-mobile" />
                  </span>
                </Field>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 0 20px 20px' }}>
                <span style={{ fontWeight: 700 }}>In Rotation</span>
                <Field
                  name="organisation.inRotation"
                  component="input"
                  type="checkbox"
                  disabled={!isEdit}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <Field
                  name="organisation.runsheet.url"
                  label="Runsheet url"
                  component={
                    isEdit ? renderInput : renderStaticText2Rows
                  }
                  style={
                    isEdit ? Styles : {}
                  }
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <Field
                  name="organisation.runsheet.password"
                  label="Runsheet password"
                  component={
                    isEdit ? renderInput : renderStaticText2Rows
                  }
                  style={
                    isEdit ? Styles : {}
                  }
                />
              </div>
            </div>
            <div className="row">
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
            </div>
          </div>
        </div>
      </div>
    );
  }
}

BusinessDetailsSubForm.propTypes = {
  isEdit: PropTypes.bool,
  inRotation: PropTypes.any,
  onChangeInRotation: PropTypes.func,
};

BusinessDetailsSubForm.defaultProps = {
  isEdit: false,
};

export default BusinessDetailsSubForm;
