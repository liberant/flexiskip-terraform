import React from 'react';
import { Field } from 'redux-form';

import { renderStaticText2Rows } from '../../../common/components/form/reduxFormComponents';

class LicenceInformationSubForm extends React.Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-xs-6">
            <Field
              name="licence.licenceNo"
              label="Licence No."
              component={renderStaticText2Rows}
            />
          </div>
          <div className="col-xs-6">
            <Field
              name="licence.licenceType"
              label="Licence Class"
              component={renderStaticText2Rows}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-6">
            <Field
              name="licence.dateOfIssued"
              label="Date of Issued"
              date
              component={renderStaticText2Rows}
            />
          </div>
          <div className="col-xs-6">
            <Field
              name="licence.expireDate"
              label="Expiry Date"
              date
              component={renderStaticText2Rows}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <Field
              name="licence.stateOfIssue"
              label="Licence State / Territory Issued"
              component={renderStaticText2Rows}
            />
          </div>
        </div>
      </div>
    );
  }
}

LicenceInformationSubForm.propTypes = {

};

LicenceInformationSubForm.defaultProps = {

};

export default LicenceInformationSubForm;
