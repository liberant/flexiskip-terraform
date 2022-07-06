import React from 'react';
import { func } from 'prop-types';


import NewAdminDetailsSubForm from './NewAdminDetailsSubForm';
import SimpleSaveButtons from './SimpleSaveButtons';


class NewAdminSubForm extends React.Component {
  render() {
    const { handleSubmit } = this.props;

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
        </div>

        <div className="row">
          <SimpleSaveButtons
            handleSubmit={handleSubmit}
          />
        </div>
      </form>
    );
  }
}

NewAdminSubForm.propTypes = {
  handleSubmit: func.isRequired,
};

NewAdminSubForm.defaultProps = {
};

export default NewAdminSubForm;
