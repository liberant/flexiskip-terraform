import React from 'react';
import { withRouter } from 'react-router-dom';
import { func, array, bool } from 'prop-types';

import NewLicenceInformationSubForm from './NewLicenceInformationSubForm';
import NewDriverDetailsSubForm from './NewDriverDetailsSubForm';
import SimpleSaveButtons from './SimpleSaveButtons';

const styles = {
  title: {
    color: '#666666',
    fontWeight: '600',
    marginBottom: 20,
  },
};

class NewDriverSubForm extends React.Component {
  componentDidMount() {
    const { getCustomersList } = this.props;

    if (getCustomersList) {
      getCustomersList({
        limit: 10000, page: 1, type: 'contractor', url: 'bus-contractor',
      });
    }
  }

  render() {
    const { contractorList, handleSubmit, isSaving } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            {/* <div style={styles.title} >BUSINESS INFORMATION</div> */}
            <NewDriverDetailsSubForm
              isEdit
              isAdd
              isDriver
              contractorList={contractorList}
            />
          </div>
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-4">
            <div style={styles.title} >LICENCE INFORMATION</div>
            <NewLicenceInformationSubForm
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

NewDriverSubForm.propTypes = {
  getCustomersList: func.isRequired,
  handleSubmit: func.isRequired,
  contractorList: array.isRequired,
  isSaving: bool.isRequired,
};

NewDriverSubForm.defaultProps = {
};

export default withRouter(NewDriverSubForm);

