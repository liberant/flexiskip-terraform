import React from 'react';
import PropTypes from 'prop-types';

import { ActionButton } from '../../../../common/components';

import './GroupButtons.css';

class GroupButtons extends React.PureComponent {
  renderButtonReadView() {
    if (this.props.editMode) return null;
    return (
      <ActionButton
        type="submit"
        title="Edit"
        spanName="handel-pencil"
        stylesExtra={{
          btnStyles: {
            backgroundColor: '#239DFF',
            boxShadow: '0 4px 8px 0 rgba(35, 157, 255, 0.3)',
            marginRight: 0,
          },
          titleStyles: {
            fontSize: 14,
          },
        }}
        handleClick={this.props.handleEditOnclick}
      />
    );
  }

  renderButtonEditMode() {
    if (!this.props.editMode) return null;
    return (
      <React.Fragment>
        <ActionButton
          title="Cancel Edit"
          spanName="handel-cross"
          stylesExtra={{
            boxStyles: {
              display: 'inline-block',
            },
            btnStyles: {
              border: '1px solid #f06666',
              color: '#f06666',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 4px 8px 0 rgba(102, 102, 102, 0.3)',
              marginRight: 0,
            },
            titleStyles: { paddingLeft: 5, fontSize: 14 },
          }}
          handleClick={this.props.handleCancelOnClick}
        />

        <ActionButton
          type="submit"
          title="Save"
          spanName="handel-floppy-disk"
          stylesExtra={{
            btnStyles: {
              backgroundColor: '#239DFF',
              boxShadow: '0 4px 8px 0 rgba(35, 157, 255, 0.3)',
              marginRight: 0,
            },
            titleStyles: {
              fontSize: 14,
            },
          }}
        />
      </React.Fragment>
    );
  }

  render() {
    return (
      <div className="vehicle-profile-group-buttons">
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
};

GroupButtons.defaultProps = {};

export default GroupButtons;
