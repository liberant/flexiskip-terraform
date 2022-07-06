import React, { Component } from 'react';
import { bool, func } from 'prop-types';
import { SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { setTitle } from '../../../common/actions';
import { saveProfile, loadProfile } from '../actions';
import Spinner from '../../../common/components/Spinner';
import ProfileForm from './ProfileForm';
import AdminLayout from '../../hoc/AdminLayout';

class ProfilePage extends Component {
  state = {
    initialFormValues: {},
  }

  async componentWillMount() {
    const { setTitle, loadProfile } = this.props;
    setTitle('Your profile settings');
    try {
      const response = await loadProfile();
      this.setState({
        initialFormValues: response.data,
      });
    } catch (error) {
      this.setState({ initialFormValues: {} });
    }
  }

  onSubmit = async (data) => {
    const { currentPassword, newPassword, repeatPassword } = data;

    if (newPassword !== repeatPassword) {
      throw new SubmissionError({
        repeatPassword: ['Two passwords should be Equal!'],
        newPassword: ['Two passwords should be Equal!'],
      });
    } else {
      try {
        const response = await this.props.saveProfile({
          currentPassword,
          newPassword,
        });
        this.setState({
          initialFormValues: response.data,
        });
      } catch (error) {
        throw new SubmissionError({
          ...error.errors,
          _error: error.message,
        });
      }
    }
  }

  render() {
    const { profileLoaded } = this.props;
    return (
      <div>
        {profileLoaded ? (
          <div className="x_panel">
            <ProfileForm onSubmit={this.onSubmit} initialValues={this.state.initialFormValues} />
          </div>
        ) : <Spinner />
        }
      </div>
    );
  }
}

ProfilePage.propTypes = {
  profileLoaded: bool,
  loadProfile: func.isRequired,
  saveProfile: func.isRequired,
  setTitle: func.isRequired,
};

ProfilePage.defaultProps = {
  profileLoaded: false,
};

export default compose(
  AdminLayout,
  connect(
    state => ({
      profileLoaded: state.common.requestFinished.loadProfile,
    }),
    dispatch => ({
      // set page title
      setTitle: title => dispatch(setTitle(title)),

      // load current profile data to form
      loadProfile: () => {
        const action = loadProfile();
        dispatch(action);
        return action.promise;
      },

      // update profile data
      saveProfile: (data) => {
        const action = saveProfile(data);
        dispatch(action);
        return action.promise;
      },
    }),
  ),
)(ProfilePage);
