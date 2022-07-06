import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';
import { Modal } from 'antd';

import * as actions from '../actions';
import HandelButton from '../../../../common/components/HandelButton';
import AddNoteForm from './AddNoteForm';
import { bindActionCreators } from '../../../../common/helpers';

class AddNoteButton extends Component {
  static propTypes = {
    disputeId: PropTypes.string.isRequired,
    addDisputeNote: PropTypes.func.isRequired,
  }

  state = {
    showModal: false,
  }

  handleSubmit = async (values) => {
    const { disputeId, addDisputeNote } = this.props;
    try {
      await addDisputeNote({
        ...values,
        dispute: disputeId,
      });
      this.setState({ showModal: false });
    } catch (error) {
      throw new SubmissionError({
        ...error.errors,
        _error: error.message,
      });
    }
  }

  handleCancel = () => {
    this.setState({ showModal: false });
  }

  showModal = () => {
    this.setState({ showModal: true });
  }

  render() {
    const { showModal } = this.state;
    return (
      <React.Fragment>
        <HandelButton
          label="Add Note"
          onClick={this.showModal}
          iconColor="white"
          bgColor="blue"
          borderColor="blue"
          shadowColor="blue"
        >
          <span className="handel-comment" />
        </HandelButton>
        <Modal
          title="Add Note"
          visible={showModal}
          onCancel={this.handleCancel}
          footer={null}
          className="w-modal"
        >
          {showModal && <AddNoteForm onSubmit={this.handleSubmit} />}
        </Modal >
      </React.Fragment>
    );
  }
}

export default connect(
  undefined,
  dispatch => bindActionCreators({
    addDisputeNote: actions.addDisputeNote,
  }, dispatch),
)(AddNoteButton);

