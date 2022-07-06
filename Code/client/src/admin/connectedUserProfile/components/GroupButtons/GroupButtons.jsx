import React from 'react';
import PropTypes from 'prop-types';

import { HandelButton } from '../../../../common/components';

import './GroupButtons.css';

class GroupButtons extends React.PureComponent {
  renderButtonReadView() {
    if (this.props.editMode) return null;
    return (
      <HandelButton
        label="Edit"
        borderColor="blue"
        bgColor="blue"
        shadowColor="blue"
        iconColor="white"
        onClick={this.props.handleEditOnclick}
      >
        <span className="handel-pencil" />
      </HandelButton>
    );
  }

  renderButtonEditMode() {
    if (!this.props.editMode) return null;
    return (
      <div className="top-toolbar">
        <HandelButton
          label="Cancel Edit"
          borderColor="red"
          bgColor="white"
          shadowColor="red"
          iconColor="red"
          onClick={this.props.handleCancelOnClick}
        >
          <span className="handel-cross" />
        </HandelButton>
        <HandelButton
          loading={this.props.loading}
          label="Save"
          borderColor="blue"
          bgColor="blue"
          shadowColor="blue"
          iconColor="white"
          onClick={this.props.handleSaveOnClick}
        >
          <span className="handel-floppy-disk" />
        </HandelButton>
      </div>
    );
  }

  render() {
    return (
      <div className="user-profile-group-buttons">
        {this.renderButtonReadView()}
        {this.renderButtonEditMode()}
      </div>
    );
  }
}

GroupButtons.propTypes = {
  editMode: PropTypes.bool.isRequired,
  handleEditOnclick: PropTypes.func.isRequired,
  handleCancelOnClick: PropTypes.func.isRequired,
  handleSaveOnClick: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

GroupButtons.defaultProps = {};

export default GroupButtons;
