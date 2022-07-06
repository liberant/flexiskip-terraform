import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import HandelButton from '../../../common/components/HandelButton';
import { withRequest } from '../../../common/hocs';
import { CommonConfirmDlg } from '../../../common/components';
import { modalContentsSuspension } from '../constants/modalDlgParams';

class SuspendVehicleButton extends Component {
  static propTypes = {
    vehicleId: PropTypes.string.isRequired,
    runAjax: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    success: PropTypes.bool.isRequired,
  }

  state = {
    isShowModal: false,
  }

  handleSuspend = () => {
    const { vehicleId, runAjax } = this.props;
    runAjax({
      url: `contractor/vehicles/${vehicleId}/status`,
      data: { status: 'Unavailable' },
    });
  }

  toggleModal = () => {
    this.setState({
      isShowModal: !this.state.isShowModal,
    });
  }

  render() {
    const { loading, success } = this.props;
    if (success) {
      return <Redirect to="/contractor/vehicles" />;
    }

    return (
      // <Popconfirm
      //   title="Are you sure suspend this vehicle?"
      //   onConfirm={this.handleSuspend}
      //   okText="Yes"
      //   cancelText="No"
      // >
      <React.Fragment>
        <HandelButton
          label="Suspend"
          loading={loading}
          borderColor="orange"
          iconColor="white"
          shadowColor="orange"
          bgColor="orange"
          onClick={this.toggleModal}
        >
          <span className="handel-suspend" />
        </HandelButton>

        <CommonConfirmDlg
          modalIsOpen={this.state.isShowModal}
          modalContents={{
            ...modalContentsSuspension,
            func: {
              handleProcess: this.handleSuspend,
            },
          }}
          handleCloseModal={this.toggleModal}
        />
      </React.Fragment>
      // </Popconfirm>
    );
  }
}

export default withRequest({
  autoExecute: false,
  requestOptions: {
    method: 'put',
  },
  mapProps: ({ execute, loading, response }) => ({
    runAjax: execute,
    success: response !== null,
    loading,
  }),
})(SuspendVehicleButton);

