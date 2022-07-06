import React from 'react';
import { withRouter } from 'react-router-dom';
import { any, bool, func } from 'prop-types';

import { SimpleCardLayout } from '../../../common/components';

import HeaderSubForm from './HeaderSubForm';
import AccountDetailsSubForm from './AccountDetailsSubForm';
import CouncilOfficerDetailsSubForm from './CouncilOfficerDetailsSubForm';

class CouncilOfficerForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleResetPassword = this.handleResetPassword.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleToggleEdit = this.handleToggleEdit.bind(this);
    this.handleDeletion = this.handleDeletion.bind(this);
  }

  handleResetPassword() {
    this.props.onResetPassword();
  }

  handleSave() {
    this.props.handleSubmit();
  }

  handleToggleEdit() {
    this.props.onToggleEdit();
  }

  handleDeletion() {
    this.props.onDelete();
  }

  render() {
    const {
      data, isEdit, handleSubmit,
      dirty, onDelete, councilList
    } = this.props;
    // const name = data ? `${data.firstname} ${data.lastname}` : '';
    const name = data ? 'Council Officer' : '';
    const code = (data && data.uId) ? data.uId : '';

    return (
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <HeaderSubForm
              code={code}
              name={name}
              isEdit={isEdit}
              isDirty={dirty}
              handleResetPassword={this.handleResetPassword}
              handleSave={this.handleSave}
              handleToggleEdit={this.handleToggleEdit}
              handleDeletion={onDelete}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <SimpleCardLayout title="Account Details">
              <AccountDetailsSubForm
                isEdit={isEdit}
              />
            </SimpleCardLayout>
          </div>
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <SimpleCardLayout title="Officer Details">
              <CouncilOfficerDetailsSubForm
                councilList={councilList}
                isEdit={isEdit}
              />
            </SimpleCardLayout>
          </div>
        </div>
      </form>
    );
  }
}

CouncilOfficerForm.propTypes = {
  data: any.isRequired,
  isEdit: bool.isRequired,
  dirty: bool,
  handleSubmit: func.isRequired,
  onResetPassword: func.isRequired,
  onToggleEdit: func.isRequired,
  onDelete: func.isRequired,
};

CouncilOfficerForm.defaultProps = {
  dirty: false,
};

export default withRouter(CouncilOfficerForm);
