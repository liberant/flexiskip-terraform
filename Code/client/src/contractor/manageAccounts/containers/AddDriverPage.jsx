import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { CommonConfirmDlg } from '../../../common/components';
import { setTitle } from '../../../common/actions';

import AddAccountForm from '../components/AddAccountForm';
import AdminLayout from '../../hoc/AdminLayout';
import { createDriver } from '../actions';
import { modalUserCreate } from '../constants/modalDlgParams';


class AddDriverPage extends React.Component {
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
    if (!data) {
      return;
    }

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

  async handleProcessCreation() {
    const { createDriver } = this.props;
    const { data } = this.state.modalContents;

    const { avatar, ...rest } = data;

    this.setState({
      modalIsOpen: false,
    });
    await createDriver({
      data: {
        status: 'Pending',
        avatar: ((avatar && avatar.constructor === Array) ? avatar[0] : avatar),
        ...rest,
      },
    });
    this.props.history.push('/contractor/drivers');
  }

  handleSuccessCreation() {
    this.props.history.push('/contractor/drivers');
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

AddDriverPage.propTypes = {
  createDriver: PropTypes.func.isRequired,
  history: PropTypes.any.isRequired,
};

AddDriverPage.defaultProps = {
};

export default compose(
  AdminLayout,
  connect(
    state => ({
      form: state.form,
    }),
    dispatch => ({
      setTitle: title => dispatch(setTitle(title)),
      createDriver: (data) => {
        const action = createDriver(data);
        dispatch(action);
        return action.promise;
      },
    }),
  ),
)(AddDriverPage);
