import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';
import { Modal } from 'antd';

import * as actions from '../../actions';
import HandelButton from '../../../../common/components/HandelButton';
import AddNoteForm from './AddNoteForm';
import { bindActionCreators } from '../../../../common/helpers';

class AddNoteButton extends Component {
  static propTypes = {
    productRequests: PropTypes.object.isRequired,
    addBinRequestNote: PropTypes.func.isRequired,
  }

  state = {
    showModal: false,
  }

  handleSubmit = async (values) => {
    const { addBinRequestNote, productRequests } = this.props;
    try {
      await addBinRequestNote({
        ...values,
        binRequest: productRequests,
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
          closable={false}
          maskClosable={false}
          destroyOnClose
          title="Add Note"
          visible={showModal}
          onCancel={this.handleCancel}
          footer={null}
          className="w-modal"
        >
          {showModal && (
            <AddNoteForm
              onSubmit={this.handleSubmit}
              onCancel={this.handleCancel}
            />
          )}
        </Modal >
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  productRequests: state.admin.productRequests.productRequests.productRequests || {},
});

export default connect(
  mapStateToProps,
  dispatch => bindActionCreators({
    addBinRequestNote: actions.addBinRequestNote,
  }, dispatch),
)(AddNoteButton);

