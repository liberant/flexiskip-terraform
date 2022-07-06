import React, { Component } from 'react';
import { any, func } from 'prop-types';
import { SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';

import { resetContractorPassword } from '../actions';
import ResetPasswordForm from '../components/ResetPasswordForm';
import SimplePageLayout from '../../hoc/SimplePageLayout';


class ResetPasswordPage extends Component {
  state = {
    isReset: false,
    data: {
      email: 'contractor@mailinator.com',
    },
    modalContent: {
      styles: { modal: { top: 430 } },
      title: 'Email Sent',
      subTitle: 'Password reset instructions is sent to',
      buttonText: 'CONTINUE',
      bottomTitle: 'Enter Different Email',
    },
  }

  onHandleClose = () => {
    this.props.history.push('/contractor/login');
  }

  onHandleRepeat = () => {
    this.setState({ isReset: false });
  }

  onSubmit = async (data) => {
    const tmpModalContent = this.state.modalContent;
    tmpModalContent.subTitle = `Password reset instructions is sent to <strong>${data.email}</strong>`;

    try {
      await this.props.resetPassword(data);
      this.setState({ isReset: true, modalContent: tmpModalContent });
    } catch (error) {
      throw new SubmissionError({
        ...error.errors,
        _error: error.message,
      });
    }
  }

  render() {
    const { isReset } = this.state;

    return isReset ?
      <Redirect to="/contractor/dashboard" /> :
      <ResetPasswordForm
        onSubmit={this.onSubmit}
        onHandleClose={this.onHandleClose}
        initialValues={this.state.data}
      />;
  }
}

ResetPasswordPage.propTypes = {
  resetPassword: func.isRequired,
  history: any.isRequired,
};

export default compose(
  SimplePageLayout,
  connect(
    undefined,
    dispatch => ({
      resetPassword: (data) => {
        const action = resetContractorPassword(data);
        dispatch(action);
        return action.promise;
      },
    }),
  ),
)(ResetPasswordPage);
