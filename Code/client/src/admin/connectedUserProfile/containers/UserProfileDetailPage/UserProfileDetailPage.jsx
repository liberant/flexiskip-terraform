import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reset } from 'redux-form';
import queryString from 'query-string';

import AdminLayout from '../../../hoc/AdminLayout';
import { Spinner } from '../../../../common/components';

import * as actions from '../../actions';
import * as selectors from '../../selectors';
import { USER_PROFILE_FORM } from '../../constants';

import { getUserTransactionHistory } from '../../../manageAccounts/actions';

import UserProfileDetailForm from '../UserProfileDetailForm/UserProfileDetailForm';

import './UserProfileDetailPage.css';

class UserProfileDetailPage extends React.Component {
  constructor(props) {
    super(props);

    this.handleEditOnclick = this.handleEditOnclick.bind(this);
    this.handleCancelOnClick = this.handleCancelOnClick.bind(this);
    this.handleSaveOnClick = this.handleSaveOnClick.bind(this);
  }

  componentDidMount() {
    const {
      match: {
        params: {
          id,
        },
      },
      getUserProfile,
      toggleEditMode,
      location: {
        search,
      },
    } = this.props;
    const searchValues = queryString.parse(search);

    if (searchValues.edit) {
      toggleEditMode();
    }

    getUserProfile(id);
  }

  componentDidUpdate(prevProps) {
    const {
      match: {
        params: {
          id,
        },
      },
      getUserProfile,
      editMode,
      toggleEditMode,
    } = this.props;

    if (id !== prevProps.match.params.id) {
      getUserProfile(id);

      if (editMode) {
        toggleEditMode();
      }
    }
  }

  componentWillUnmount() {
    const { resetData } = this.props;
    resetData();
  }

  handleCancelOnClick() {
    const { toggleEditMode, reset } = this.props;
    reset(USER_PROFILE_FORM);
    toggleEditMode();
  }

  handleEditOnclick() {
    const { toggleEditMode } = this.props;
    toggleEditMode();
  }

  handleSaveOnClick() {
    const {
      match: {
        params: {
          id,
        },
      },
      submitUserProfile,
    } = this.props;
    submitUserProfile(id);
  }

  render() {
    const {
      profile, editMode, isRequesting,
      userTransactionHistory,
      getUserTransactionHistory,
      submitData,
    } = this.props;
    return (
      <div className="x_panel_ user-profile-container">
        {
          isRequesting ? <Spinner /> : (
            <UserProfileDetailForm
              onSubmit={this.handleSaveOnClick}
              initialValues={profile}
              editMode={editMode}
              handleSaveOnClick={this.handleSaveOnClick}
              handleCancelOnClick={this.handleCancelOnClick}
              handleEditOnclick={this.handleEditOnclick}
              profile={profile}
              userTransactionHistory={userTransactionHistory}
              getUserTransactionHistory={getUserTransactionHistory}
              submitData={submitData}
            />
          )
        }
      </div>
    );
  }
}

UserProfileDetailPage.propTypes = {
  getUserProfile: PropTypes.func.isRequired,
  toggleEditMode: PropTypes.func.isRequired,

  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
  profile: PropTypes.object,

  editMode: PropTypes.bool.isRequired,
  isRequesting: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired,
  resetData: PropTypes.func.isRequired,
  submitUserProfile: PropTypes.func.isRequired,

  location: PropTypes.object.isRequired,

  userTransactionHistory: PropTypes.object.isRequired,
  getUserTransactionHistory: PropTypes.func.isRequired,
  submitData: PropTypes.object.isRequired,
};

UserProfileDetailPage.defaultProps = {
  profile: null,
};

const mapStateToProps = state => ({
  profile: selectors.selectUserDetail(state),
  isRequesting: selectors.selectUserDetailRequesting(state),
  error: selectors.selectUserDetailError(state),
  editMode: selectors.selectViewMode(state),
  userTransactionHistory: state.admin.accounts.customers.userTransactionHistory,
  submitData: selectors.selectUserDetailSubmit(state),
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    ...actions,
    getUserTransactionHistory,
    reset,
  }, dispatch),
});

export default compose(
  AdminLayout,
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(UserProfileDetailPage);
