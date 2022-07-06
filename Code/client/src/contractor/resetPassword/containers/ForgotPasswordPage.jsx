import React, { Component } from 'react';
import { any, func } from 'prop-types';
import { SubmissionError } from 'redux-form';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';

import {
  updateContractorPassword,
  updatedProcessing,
} from '../actions';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import SimplePageLayout from '../../hoc/SimplePageLayout';


class ForgotPasswordPage extends Component {
  state = {
    isReset: false,
    token: this.props.location.search.replace('?token=', ''),
  }

  onHandleClose = () => {
    this.props.history.push('/contractor/dashboard');
  }

  onSubmit = async (data) => {
    if (data.password !== data.newPassword) {
      throw new SubmissionError({
        password: ['Two passwords should be Equal!'],
        newPassword: ['Two passwords should be Equal!'],
      });
    } else {
      try {
        await this.props.updatePassword({
          token: this.state.token,
          password: data.password,
        });
        this.setState({ isReset: true });
      } catch (error) {
        throw new SubmissionError({
          ...error.errors,
          _error: error.message,
        });
      }
    }
  }

  render() {
    const { isReset } = this.state;

    return isReset ?
      <Redirect to="/contractor/dashboard" /> :
      <ForgotPasswordForm onSubmit={this.onSubmit} />;
  }
}

ForgotPasswordPage.propTypes = {
  updatePassword: func.isRequired,
  location: any.isRequired,
  history: any.isRequired,
};

export default compose(
  SimplePageLayout,
  connect(
    undefined,
    dispatch => ({
      updatePassword: (data) => {
        const action = updateContractorPassword(data);
        dispatch(action);
        return action.promise;
      },
      updatedProcessing: data => dispatch(updatedProcessing(data)),
    }),
  ),
)(ForgotPasswordPage);
