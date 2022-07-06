import React from 'react';
import { withRouter } from 'react-router-dom';
import { func, bool } from 'prop-types';

import NewBusinessContractorContactDetailsSubForm from './NewBusinessContractorContactDetailsSubForm';
import NewBusinessContractorInformationSubForm from './NewBusinessContractorInformationSubForm';
import SimpleSaveButtons from './SimpleSaveButtons';

const styles = {
  title: {
    color: '#666666',
    fontWeight: '600',
    marginBottom: 20,
  },
};

class NewBusinessContractorSubForm extends React.Component {
  render() {
    const { handleSubmit, isSaving } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <div style={styles.title} >BUSINESS INFORMATION</div>
            <NewBusinessContractorInformationSubForm
              isEdit
            />
          </div>
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-4">
            <div style={styles.title} >CONTACT INFORMATION</div>
            <NewBusinessContractorContactDetailsSubForm
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

NewBusinessContractorSubForm.propTypes = {
  handleSubmit: func.isRequired,
  isSaving: bool.isRequired,
};

NewBusinessContractorSubForm.defaultProps = {
};

export default withRouter(NewBusinessContractorSubForm);

