import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { CommonConfirmDlg } from '../../../common/components';
import { setTitle } from '../../../common/actions';

import AddAccountForm from '../components/AddAccountForm';
import AdminLayout from '../../hoc/AdminLayout';
import { createAdminUser } from '../actions';
import { modalUserCreate } from '../constants/modalDlgParams';


class AddAdminUserPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      modalContents: {
        start: {},
        success: {},
        fail: {},
      },
    };

    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.onHandleCreation = this.onHandleCreation.bind(this);
    this.handleProcessCreation = this.handleProcessCreation.bind(this);
    this.handleSuccessCreation = this.handleSuccessCreation.bind(this);
  }

  onHandleCreation(data, url) {
    const tmpModalContents = {
      ...modalUserCreate,
      func: {
        handleProcess: this.handleProcessCreation,
        handleSuccess: this.handleSuccessCreation,
      },
      data,
      url,
    };

    this.setState({
      modalIsOpen: true,
      modalContents: tmpModalContents,
    });
  }

  handleCloseModal() {
    this.setState({
      modalIsOpen: false,
    });
  }

  handleProcessCreation() {
    const { createAdminUser } = this.props;
    const { data } = this.state.modalContents;

    return createAdminUser({ data });
  }

  handleSuccessCreation() {
    this.props.history.push('/contractor/profile');
  }


  render() {
    const { modalIsOpen, modalContents } = this.state;

    return (
      <div className="x_panel_">
        <CommonConfirmDlg
          modalIsOpen={modalIsOpen}
          modalContents={modalContents}
          handleCloseModal={this.handleCloseModal}
        />

        <AddAccountForm
          onHandleSubmit={this.onHandleCreation}
        />
      </div>
    );
  }
}

AddAdminUserPage.propTypes = {
  createAdminUser: PropTypes.func.isRequired,
  history: PropTypes.any.isRequired,
};

AddAdminUserPage.defaultProps = {
};

export default compose(
  AdminLayout,
  connect(
    state => ({
      form: state.form,
    }),
    dispatch => ({
      setTitle: title => dispatch(setTitle(title)),
      createAdminUser: (data) => {
        const action = createAdminUser(data);
        dispatch(action);
        return action.promise;
      },
    }),
  ),
)(AddAdminUserPage);
