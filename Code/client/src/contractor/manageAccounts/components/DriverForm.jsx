import React from 'react';
import { withRouter } from 'react-router-dom';
import { any, array, bool, func } from 'prop-types';

import { SimpleCardLayout } from '../../../common/components';

import HeaderSubForm from './HeaderSubForm';
import AccountDetailsSubForm from './AccountDetailsSubForm';
import CustomerDetailsSubForm from './CustomerDetailsSubForm';
import LicenceInformationSubForm from './LicenceInformationSubForm';
import CommonLocalDataTable from '../../../common/components/CommonLocalDataTable';
import { columnsRating } from './columnsDef';

const Styles = {
  box: {
    height: 293,
  },
};

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
      isAdmin, dirty, ratings,
      onDelete,
    } = this.props;
    const name = data ? `${data.firstname || ''} ${data.lastname || ''}` : '';
    const code = (data && data.uId) ? data.uId : '';
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
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <SimpleCardLayout title="Account Details" styles={Styles}>
              <AccountDetailsSubForm
                isEdit={isEdit}
                isAdmin={isAdmin}
              />
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
          <SimpleCardLayout title="Licence Information">
            <LicenceInformationSubForm
              isEdit={isEdit}
            />
          </SimpleCardLayout>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <SimpleCardLayout
              title={`Ratings (${ratings.length}) `}
              ratingPoint={`${rating}`}
            >
              <CommonLocalDataTable
                selectRowFlag={false}
                data={ratings}
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
  isAdmin: bool,
  ratings: array.isRequired,
};

DriverForm.defaultProps = {
  dirty: false,
  isAdmin: false,
};

export default withRouter(DriverForm);
