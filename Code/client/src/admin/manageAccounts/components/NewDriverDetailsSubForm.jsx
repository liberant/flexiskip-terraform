import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

import {
  email,
  required,
  renderStaticText2Rows,
  normalizePhoneNumber10,
  renderInput,
  phoneNumber,
  renderStaticImage,
  renderValueFieldDropdownList,
} from '../../../common/components/form/reduxFormComponents';
import ImagesS3UploadField from '../../../common/components/form/ImagesS3UploadField';


import { formStyles } from './Styles';

class NewDriverDetailsSubForm extends React.Component {
  getOrganisationsFromContractors(contractors) {
    const orgs = [];
    contractors
      // filter active contractors
      .filter(c => c.status === 'Active' && typeof c.organisation === 'object')
      // get contractor's organisation
      .map(c => ({
        _id: c.organisation._id,
        name: c.organisation.name,
      }))
      // remove duplicated
      .forEach((o) => {
        if (!orgs.find(o2 => o2._id === o._id)) {
          orgs.push(o);
        }
      });
    return orgs;
  }

  render() {
    const { isEdit, contractorList } = this.props;
    const organisations = this.getOrganisationsFromContractors(contractorList);
    return (
      <div>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4">
            <Field
              name="avatar"
              component={ImagesS3UploadField}
              viewOnly={!isEdit}
              required
            />
          </div>
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8">
            <div className="row">
              <div className="col-xs-6">
                <Field
                  name="isAdmin"
                  label="Also an Admin"
                  type="checkbox"
                  component={renderInput}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <Field
                  name="firstname"
                  label="First Name"
                  component={
                    isEdit ? renderInput : renderStaticText2Rows
                  }
                  style={
                    isEdit ? formStyles : {}
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
                    isEdit ? formStyles : {}
                  }
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
                  component={renderInput}
                  style={formStyles}
                  required
                  email
                  validate={[required, email]}
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
                    isEdit ? formStyles : { marginLeft: 15 }
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
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <Field
                  name="organisation"
                  label="Belong to Contractor"
                  dropdownLabel="Choose A Contractor"
                  valueFieldName="id"
                  textFieldName="name"
                  data={organisations}
                  component={renderValueFieldDropdownList}
                  style={formStyles}
                  placeholder=""
                  required
                  validate={[required]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

NewDriverDetailsSubForm.propTypes = {
  isEdit: PropTypes.bool,
  contractorList: PropTypes.array.isRequired,
};

NewDriverDetailsSubForm.defaultProps = {
  isEdit: false,
};

export default NewDriverDetailsSubForm;
