import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { login } from '../actions';
import LoginForm from './LoginForm';
import SimplePageLayout from '../../hoc/SimplePageLayout';

/* eslint react/require-default-props: 0 */

class LoginPage extends Component {
  state = {
    data: {
      loginId: 'handel@mailinator.com',
      password: '',
    },
  }

  onSubmit = async (data) => {
    try {
      await this.props.login(data);
    } catch (error) {
      throw new SubmissionError({
        ...error.errors,
        _error: error.message,
      });
    }
  }

  render() {
    return (
      <LoginForm onSubmit={this.onSubmit} initialValues={this.state.data} />
    );
  }
}

LoginPage.propTypes = {
  login: PropTypes.func.isRequired,
};

export default compose(
  SimplePageLayout,
  connect(
    undefined,
    dispatch => ({
      login: (data) => {
        const action = login(data);
        dispatch(action);
        return action.promise;
      },
    }),
  ),
)(LoginPage);
