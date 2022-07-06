import React, { Component } from 'react';
import { any, func } from 'prop-types';
import { SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { resetPassword } from '../actions';
import ResetPasswordForm from '../components/ResetPasswordForm';
import SimplePageLayout from '../../hoc/SimplePageLayout';
import SimpleConfirmDlg from '../../../common/components/SimpleConfirmDlg';


class ResetPasswordPage extends Component {
  state = {
    isReset: false,
    data: {
      email: '',
    },
    modalContent: {
      styles: { modal: { top: 430 } },
      title: 'Email Sent',
      subTitle: 'Password reset instructions is sent to',
      buttonText: 'CONTINUE',
      bottomTitle: '',
    },
  }

  onHandleClose = () => {
    this.props.history.push('/');
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
    const { modalContent, isReset } = this.state;

    return isReset ?
      <SimpleConfirmDlg
        modalIsOpen={isReset}
        styles={modalContent.styles}
        title={modalContent.title}
        subTitle={modalContent.subTitle}
        buttonText={modalContent.buttonText}
        bottomTitle={modalContent.bottomTitle}
        handleButtonClick={this.onHandleClose}
        handleNoButtonClick={this.onHandleClose}
      /> :
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
        const action = resetPassword(data);
        dispatch(action);
        return action.promise;
      },
    }),
  ),
)(ResetPasswordPage);
