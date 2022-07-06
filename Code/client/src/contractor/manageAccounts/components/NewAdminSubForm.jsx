import React from 'react';
import { func, bool } from 'prop-types';


import NewAdminDetailsSubForm from './NewAdminDetailsSubForm';
import SimpleSaveButtons from './SimpleSaveButtons';
import LicenceInformationSubForm from './LicenceInformationSubForm';


class NewAdminSubForm extends React.Component {
  render() {
    const { handleSubmit, isSaving } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <NewAdminDetailsSubForm
              isEdit
              isAdd
              isDriver
            />
          </div>
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-5">
            <div style={{
                fontSize: 16,
                color: '#239dff',
                fontWeight: 600,
                marginLeft: 10,
                marginBottom: 22,
              }}
            >
              Licence Information
            </div>
            <LicenceInformationSubForm
              isEdit
              isAdd
            />
          </div>

        </div>

        <div className="row">
          <SimpleSaveButtons
            handleSubmit={handleSubmit}
            isSaving={isSaving}
          />
        </div>
      </form>
    );
  }
}

NewAdminSubForm.propTypes = {
  handleSubmit: func.isRequired,
  isSaving: bool.isRequired,
};

NewAdminSubForm.defaultProps = {
};

export default NewAdminSubForm;
