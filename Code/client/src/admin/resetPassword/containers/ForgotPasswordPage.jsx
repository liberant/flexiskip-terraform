import React, { Component } from 'react';
import { any, func } from 'prop-types';
import { SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { updatePassword } from '../actions';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import SimplePageLayout from '../../hoc/SimplePageLayout';
import SimpleConfirmDlg from '../../../common/components/SimpleConfirmDlg';


class ForgotPasswordPage extends Component {
  constructor(props) {
    super(props);

    const { location } = this.props;
    this.state = {
      isReset: false,
      isSet: location.pathname.includes('set-password'),
      token: location.search.replace('?token=', ''),
      modalContent: {
        styles: { modal: { top: 430 } },
        title: location.pathname.includes('set-password') ? 'Password Set' : 'Password Changed',
        subTitle: location.pathname.includes('set-password') ? 'Your new password has been set' : 'Your password is successfully reset',
        buttonText: 'SIGN IN',
        bottomTitle: '',
      },
    };
  }


  onHandleClose = () => {
    this.props.history.push('/');
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
    const { isReset, isSet, modalContent } = this.state;

    return this.state.isReset ?
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
      <ForgotPasswordForm
        isSet={isSet}
        onSubmit={this.onSubmit}
      />;
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
        const action = updatePassword(data);
        dispatch(action);
        return action.promise;
      },
    }),
  ),
)(ForgotPasswordPage);
