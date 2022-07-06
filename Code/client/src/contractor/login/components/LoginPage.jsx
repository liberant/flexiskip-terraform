import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SubmissionError } from 'redux-form';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { login } from '../actions';
import LoginForm from './LoginForm';
import BlankLayout from '../../hoc/BlankLayout';
import { clearIdentity } from '../../../common/actions';


/* eslint react/require-default-props: 0 */

class LoginPage extends Component {
  state = {
    isAuthenticated: false,
    data: {
      loginId: 'contractor@mailinator.com',
      password: '',
    },
  }

  componentDidMount() {
    const { clearIdentity } = this.props;
    clearIdentity();
  }

  onSubmit = async (data) => {
    try {
      await this.props.login(data);
      this.setState({ isAuthenticated: true });
    } catch (error) {
      throw new SubmissionError({
        ...error.errors,
        _error: error.message,
      });
    }
  }

  render() {
    // const { from: returnUrl } = this.props.location.state ||
    // { from: { pathname: '/contractor/dashboard' } };
    return this.state.isAuthenticated ?
      <Redirect to="/contractor/dashboard" /> :
      <LoginForm onSubmit={this.onSubmit} initialValues={this.state.data} />;
  }
}

LoginPage.propTypes = {
  login: PropTypes.func.isRequired,
  clearIdentity: PropTypes.func.isRequired,
  // location: PropTypes.object,
};

export default compose(
  BlankLayout,
  connect(
    undefined,
    dispatch => ({
      login: (data) => {
        const action = login(data);
        dispatch(action);
        return action.promise;
      },
      clearIdentity: () => dispatch(clearIdentity()),
    }),
  ),
)(LoginPage);
