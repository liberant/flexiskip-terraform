import React from 'react';
import { withRouter } from 'react-router-dom';
import { any, bool, func, string } from 'prop-types';

import { ActionButton } from '../../../common/components';
import styles, { stylesDetails } from './Styles';

const BackPreviousPage = props => (
  <div style={{ display: 'flex' }}>
    <div style={stylesDetails.backTitle}>
      <div>
        Profile
      </div>

    </div>
    {
      props && props.status && props.status === 'Suspended' ? (
        <div style={stylesDetails.statusText}>Suspended</div>
      ) : null
    }
  </div>
);

BackPreviousPage.propTypes = {
  status: string.isRequired,
};

const ActionButtons = (props) => {
  const {
    editFlag,
    suspendFlag,
    handleCancel,
    handleSave,
    handleSuspend,
    handleUnsuspend,
    handleInactive,
  } = props;
  const toggleShowStyle = editFlag ? styles.showMe : styles.hideMe;
  const saveBtnIconName = editFlag ? 'handel-floppy-disk' : 'handel-pencil';
  const saveBtnLabel = editFlag ? 'Save' : 'Edit';
  const toggleShowSuspendBtnStyle = !suspendFlag ? styles.showMe : styles.hideMe;
  const toggleShowReactiveBtnStyle = suspendFlag ? styles.showMe : styles.hideMe;
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 53,
        marginLeft: 34,
      }}
    >
      <div>
        <ActionButton
          title="Suspend"
          spanName="handel-suspend"
          stylesExtra={{
            btnStyles: {
              color: '#ffffff',
              border: 'solid 1px #f6ba1a',
              backgroundColor: '#f6ba1a',
              boxShadow: '0 4px 8px 0 rgba(246, 186, 26,, 0.3)',
              marginRight: 0,
            },
            titleStyles: {
              fontSize: 14,
            },
            boxStyles: toggleShowSuspendBtnStyle,

          }}
          handleClick={handleSuspend}
        />
        <ActionButton
          title="Unsuspend"
          spanName="handel-history"
          stylesExtra={{
            btnStyles: {
              color: '#ffffff',
              border: 'solid 1px #72c814',
              backgroundColor: '#72c814',
              boxShadow: '0 4px 8px 0 rgba(114, 200, 20, 0.4)',
              marginRight: 0,
            },
            titleStyles: {
              fontSize: 14,
            },
            boxStyles: toggleShowReactiveBtnStyle,

          }}
          handleClick={handleUnsuspend}
        />
        <ActionButton
          title="Inactive"
          spanName="handel-user-no"
          stylesExtra={{
            btnStyles: {
              backgroundColor: '#f06666',
              boxShadow: '0 4px 8px 0 rgba(240, 102, 102, 0.3)',
              marginRight: 0,
            },
            titleStyles: {
              fontSize: 14,
            },
          }}
          handleClick={handleInactive}
        />
      </div>

      <div>
        <ActionButton
          title="Cancel Edit"
          spanName="handel-cross"
          stylesExtra={{
            boxStyles: {
              ...toggleShowStyle,
            },
            btnStyles: {
              border: '1px solid #f06666',
              color: '#f06666',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 4px 8px 0 rgba(102, 102, 102, 0.3)',
              marginRight: 0,
            },
            titleStyles: { ...styles.buttonText, fontSize: 14 },
          }}
          handleClick={handleCancel}
        />

        <ActionButton
          type="submit"
          title={saveBtnLabel}
          spanName={saveBtnIconName}
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
          handleClick={handleSave}
        />
      </div>


    </div>
  );
};

ActionButtons.propTypes = {
  editFlag: bool.isRequired,
  suspendFlag: bool.isRequired,
  handleCancel: func.isRequired,
  handleSave: func.isRequired,
  handleInactive: func.isRequired,
  handleSuspend: func.isRequired,
  handleUnsuspend: func.isRequired,
};


class HeaderSubForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleCancel = this.handleCancel.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleToggleEdit = this.handleToggleEdit.bind(this);

    this.handleSuspend = this.handleSuspend.bind(this);
    this.handleUnsuspend = this.handleUnsuspend.bind(this);
    this.handleInactive = this.handleInactive.bind(this);
  }

  handleCancel() {
    const { isDirty } = this.props;
    if (isDirty) {
      this.props.history.push('/contractor/dashboard');
    } else {
      this.props.handleToggleEdit();
    }
  }

  handleSave(e) {
    const { isEdit, handleSave, handleToggleEdit } = this.props;

    if (isEdit) {
      handleSave();
    } else {
      handleToggleEdit();
      e.preventDefault();
    }
  }

  handleToggleEdit() {
    this.props.handleToggleEdit();
  }

  handleSuspend() {
    this.props.handleSuspend();
  }

  handleUnsuspend() {
    this.props.handleUnsuspend();
  }

  handleInactive() {
    this.props.handleInactive();
  }

  render() {
    const {
      isEdit, suspendFlag, status,
    } = this.props;

    return (
      <div>
        <div className="back-previous-box col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <BackPreviousPage status={status} />
        </div>
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <ActionButtons
            editFlag={isEdit}
            suspendFlag={suspendFlag}
            handleCancel={this.handleCancel}
            handleSave={this.handleSave}
            handleToggleEdit={this.handleToggleEdit}
            handleSuspend={this.handleSuspend}
            handleUnsuspend={this.handleUnsuspend}
            handleInactive={this.handleInactive}
          />
        </div>
      </div>
    );
  }
}

HeaderSubForm.propTypes = {
  isEdit: bool.isRequired,
  suspendFlag: bool.isRequired,
  isDirty: bool,
  history: any.isRequired,
  status: string.isRequired,
  handleSave: func.isRequired,
  handleToggleEdit: func.isRequired,
  handleInactive: func.isRequired,
  handleSuspend: func.isRequired,
  handleUnsuspend: func.isRequired,
};

HeaderSubForm.defaultProps = {
  isDirty: false,
};

export default withRouter(HeaderSubForm);
