import React from 'react';
import { withRouter } from 'react-router-dom';
import { any, bool, func } from 'prop-types';

import { SimpleCardLayout, RatingCardLayout } from '../../../common/components';

import HeaderSubForm from './HeaderSubForm';
import AccountDetailsSubForm from './AccountDetailsSubForm';
import CustomerDetailsSubForm from './CustomerDetailsSubForm';
import LicenceInformationSubForm from './LicenceInformationSubForm';
import CommonLocalDataTable from '../../../common/components/CommonLocalDataTable';
import { columnsLinkedContractorBusiness, columnsRating } from './columnsDef';

class DriverForm extends React.Component {
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
      dirty, onDelete,
    } = this.props;
    const name = data ? `${data.firstname} ${data.lastname}` : '';
    const code = (data && data.uId) ? data.uId : '';
    const businesses = [{ ...data.organisation, linkedOn: data.createdAt }];
    const rating = data && data.rating ? data.rating : 0;

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
              shouldRedirectNativeSystem={this.props.shouldRedirectNativeSystem}
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
            <SimpleCardLayout title="Licence Information">
              <LicenceInformationSubForm />
            </SimpleCardLayout>
          </div>
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <SimpleCardLayout title="Driver Details">
              <CustomerDetailsSubForm
                isEdit={isEdit}
                isDriver
              />
            </SimpleCardLayout>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <SimpleCardLayout title="Linked Contractor Business">
              <CommonLocalDataTable
                data={businesses}
                columnsDef={columnsLinkedContractorBusiness}
                selectRowFlag={false}
              />
            </SimpleCardLayout>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <SimpleCardLayout title="Rating" ratingPoint={`${rating}`}>
              <CommonLocalDataTable
                selectRowFlag={false}
                data={data.ratings}
                columnsDef={columnsRating}
              />
            </SimpleCardLayout>
          </div>
        </div>
      </form>
    );
  }
}

DriverForm.propTypes = {
  data: any.isRequired,
  isEdit: bool.isRequired,
  dirty: bool,
  handleSubmit: func.isRequired,
  onResetPassword: func.isRequired,
  onToggleEdit: func.isRequired,
  onDelete: func.isRequired,
  shouldRedirectNativeSystem: bool,
};

DriverForm.defaultProps = {
  dirty: false,
  shouldRedirectNativeSystem: false,
};

export default withRouter(DriverForm);
