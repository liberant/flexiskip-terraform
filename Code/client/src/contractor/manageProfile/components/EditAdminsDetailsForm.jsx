import React from 'react';
import { withRouter } from 'react-router-dom';
import { any, bool, func } from 'prop-types';

import { SimpleCardLayout } from '../../../common/components';

import HeaderAdminDetailsSubForm from './HeaderAdminDetailsSubForm';
import AccountDetailsSubForm from './AccountDetailsSubForm';
import AdminAccountStatusSubForm from './AdminAccountStatusSubForm';

class EditAdminsDetailsForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleSave = this.handleSave.bind(this);
    this.handleToggleEdit = this.handleToggleEdit.bind(this);
  }

  handleSave() {
    this.props.handleSubmit();
  }

  handleToggleEdit() {
    this.props.onToggleEdit();
  }


  render() {
    const {
      data, isEdit, handleSubmit,
      dirty,
    } = this.props;
    const name = data ? `${data.firstname || ''} ${data.lastname || ''}` : '';
    const code = (data && data.uId) ? data.uId : '';

    return (
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <HeaderAdminDetailsSubForm
              code={code}
              name={name}
              isEdit={isEdit}
              isDirty={dirty}
              handleSave={this.handleSave}
              handleToggleEdit={this.handleToggleEdit}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <SimpleCardLayout title="Account Details">
              <AdminAccountStatusSubForm
                isEdit={isEdit}
              />
            </SimpleCardLayout>
          </div>
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <SimpleCardLayout title="Admin Details">
              <AccountDetailsSubForm
                isEdit={isEdit}
              />
            </SimpleCardLayout>
          </div>
        </div>
      </form>
    );
  }
}

EditAdminsDetailsForm.propTypes = {
  data: any.isRequired,
  isEdit: bool.isRequired,
  dirty: bool,
  handleSubmit: func.isRequired,
  onToggleEdit: func.isRequired,
};

EditAdminsDetailsForm.defaultProps = {
  dirty: false,
};

export default withRouter(EditAdminsDetailsForm);
