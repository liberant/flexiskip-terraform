import React from 'react';
import { func, bool } from 'prop-types';


import CustomerDetailsSubForm from './CustomerDetailsSubForm';
import SimpleSaveButtons from './SimpleSaveButtons';


class NewHandelAdminSubForm extends React.Component {
  render() {
    const { handleSubmit, isSaving } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <CustomerDetailsSubForm
              isEdit
              isAdd
              isAdmin
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

NewHandelAdminSubForm.propTypes = {
  handleSubmit: func.isRequired,
  isSaving: bool.isRequired,
};

NewHandelAdminSubForm.defaultProps = {
};

export default NewHandelAdminSubForm;
