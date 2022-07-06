import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

import {
  email,
  required,
  renderStaticImage,
  normalizeABNNumber,
  fixedNumberLength11,
  validateAddress,
} from '../../../common/components/form/reduxFormComponents';
import ImagesS3UploadField from '../../../common/components/form/ImagesS3UploadField';
import AddressField from '../../../common/components/form/AddressField';
import InputField from '../../../common/components/form/InputField';


const APP_BACKGROUND_COLOR = '#F6F6F6';

const Styles = {
  outerBox: {
    paddingLeft: 10,
  },
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

class NewBusinessDetailsSubForm extends React.Component {
  render() {
    const { isEdit } = this.props;
    return (
      <div className="w-form">
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
                  name="abn"
                  label="Business ABN"
                  component={InputField}
                  viewOnly={!isEdit}
                  required
                  normalize={normalizeABNNumber}
                  validate={[required, fixedNumberLength11]}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <Field
                  name="businessName"
                  label="Company Name"
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
                  name="businessEmail"
                  label="Business Email"
                  component={InputField}
                  viewOnly={!isEdit}
                  validate={[email]}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <Field
                  name="address"
                  label="Business Address"
                  component={AddressField}
                  viewOnly={!isEdit}
                  required
                  validate={[required, validateAddress]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

NewBusinessDetailsSubForm.propTypes = {
  isEdit: PropTypes.bool,
};

NewBusinessDetailsSubForm.defaultProps = {
  isEdit: false,
};

export default NewBusinessDetailsSubForm;
