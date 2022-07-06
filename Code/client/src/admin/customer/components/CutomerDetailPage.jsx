import React, { Component } from 'react';
import { bool, func } from 'prop-types';
import { SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { setTitle } from '../../../common/actions';
import { saveProfile, loadProfile } from '../actions';
import Spinner from '../../../common/components/Spinner';
import CustomerDetailForm from './CustomerDetailForm';
import AdminLayout from '../../hoc/AdminLayout';

class CutomerDetailPage extends Component {
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
    try {
      const response = await this.props.saveProfile(data);
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

  render() {
    const { profileLoaded } = this.props;
    return (
      <div>
        {profileLoaded ? (
          <div className="x_panel">
            <CustomerDetailForm
              onSubmit={this.onSubmit}
              initialValues={this.state.initialFormValues}
            />
          </div>
        ) : <Spinner />
        }
      </div>
    );
  }
}

CutomerDetailPage.propTypes = {
  profileLoaded: bool,
  loadProfile: func.isRequired,
  saveProfile: func.isRequired,
  setTitle: func.isRequired,
};

CutomerDetailPage.defaultProps = {
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
)(CutomerDetailPage);
