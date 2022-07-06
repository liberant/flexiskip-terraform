import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

import {
  required,
  normalizePhoneNumber10,
  phoneNumber,
  renderStaticImage,
  email,
  validateAddress,
  renderStaticText2Rows,
  renderDropdwonList
} from '../../../common/components/form/reduxFormComponents';
import httpClient from "../../../common/http";

import ImagesS3UploadField from '../../../common/components/form/ImagesS3UploadField';
import AddressField from '../../../common/components/form/AddressField';
import SelectField from '../../../common/components/form/SelectField';
import InputField from '../../../common/components/form/InputField';
import RadioGroup from '../../../common/components/form/RadioGroup';
import { roleSelectOptions } from '../constants/userTypes';

class CouncilOfficerDetailsSubForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      isEdit, isAdmin, councilList
    } = this.props;
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
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <Field
                  name="firstname"
                  label="First Name"
                  component={InputField}
                  viewOnly={!isEdit}
                  required
                  validate={[required]}
                />
              </div>
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <Field
                  name="lastname"
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
                  name="council"
                  label="Council"
                  // component={RegionsSelectField}
                  component={SelectField}
                  showSearch
                  placeholder="Select a council"
                  options={councilList}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  viewOnly={!isEdit}
                  required
                  validate={[required]}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <Field
                  name="email"
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
                  name="phone"
                  label="Phone"
                  component={InputField}
                  viewOnly={!isEdit}
                  normalize={normalizePhoneNumber10}
                  validate={[required, phoneNumber]}
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CouncilOfficerDetailsSubForm.propTypes = {
  isEdit: PropTypes.bool,
  isDriver: PropTypes.bool,
  isAdmin: PropTypes.bool,
};

CouncilOfficerDetailsSubForm.defaultProps = {
  isEdit: false,
  isDriver: false,
  isAdmin: false,
};

export default CouncilOfficerDetailsSubForm;
