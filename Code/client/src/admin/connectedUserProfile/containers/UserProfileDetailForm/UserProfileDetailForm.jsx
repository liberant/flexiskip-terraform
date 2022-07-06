import React from 'react';
import { reduxForm, submit } from 'redux-form';
import PropTypes from 'prop-types';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { withPreventingCheckHOC } from '../../../../common/hocs';
import AccountDetailsSubForm from '../../../manageAccounts/components/AccountDetailsSubForm';
import CustomerDetailsSubForm from '../../components/CustomerDetailsSubForm';
import UserTitle from '../../components/UserTitle/UserTitle';
import GroupButtons from '../../components/GroupButtons/GroupButtons';
import { SimpleCardLayout } from '../../../../common/components';
import CommonLocalDataTable from '../../../../common/components/CommonLocalDataTable';
import TransactionHistory from '../../../manageAccounts/components/TransactionHistory/TransactionHistory';

import { USER_PROFILE_FORM } from '../../constants';
import { columnsRating } from '../../../manageAccounts/components/columnsDef';

/* eslint no-underscore-dangle:0 */

class UserProfileDetailForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSaveOnClick = this.handleSaveOnClick.bind(this);
  }

  handleSaveOnClick() {
    const { submit } = this.props;
    submit(USER_PROFILE_FORM);
  }

  render() {
    const {
      editMode, profile,
      getUserTransactionHistory,
      userTransactionHistory,
      submitData,
    } = this.props;
    /* eslint prefer-destructuring: 0 */
    if (profile && profile.roles && profile.roles.length) {
      profile.role = profile.roles[0];
    }

    const rating = (profile && profile.ratings && profile.ratings.length > 0) ?
      (profile.ratings.reduce((total, rating) =>
        (total + rating.point >> 0), 0)) / profile.ratings.length
      : 0;

    return (
      <div>
        <UserTitle
          type="User"
          user={profile}
        />
        <GroupButtons
          editMode={editMode}
          handleEditOnclick={this.props.handleEditOnclick}
          handleCancelOnClick={this.props.handleCancelOnClick}
          handleSaveOnClick={this.handleSaveOnClick}
          loading={submitData.requesting}
        />
        <form className="row">
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <SimpleCardLayout title="Account Details">
              <AccountDetailsSubForm isEdit={editMode} />
            </SimpleCardLayout>
          </div>

          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <SimpleCardLayout title="Customer Details">
              <CustomerDetailsSubForm
                isEdit={editMode}
              />
            </SimpleCardLayout>
          </div>
        </form>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <SimpleCardLayout title="Rating" ratingPoint={rating}>
              <CommonLocalDataTable
                selectRowFlag={false}
                data={profile && profile.ratings}
                columnsDef={columnsRating}
              />
            </SimpleCardLayout>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <TransactionHistory
              getUserTransactionHistory={getUserTransactionHistory}
              userTransactionHistory={userTransactionHistory}
            />
          </div>
        </div>
      </div>
    );
  }
}

UserProfileDetailForm.propTypes = {
  editMode: PropTypes.bool.isRequired,
  handleEditOnclick: PropTypes.func.isRequired,
  handleCancelOnClick: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,

  getUserTransactionHistory: PropTypes.func.isRequired,
  userTransactionHistory: PropTypes.object.isRequired,
  submitData: PropTypes.object.isRequired,
  submit: PropTypes.func.isRequired,
};

UserProfileDetailForm.defaultProps = {};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    submit,
  }, dispatch),
});

export default compose(
  reduxForm({
    form: USER_PROFILE_FORM,
    forceUnregisterOnUnmount: true,
    enableReinitialize: true,
  }),
  withPreventingCheckHOC,
  connect(null, mapDispatchToProps),
)(UserProfileDetailForm);
