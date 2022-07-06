import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { any, bool, func, string } from 'prop-types';

import { ActionButton } from '../../../common/components';
import styles, { stylesDetails } from './Styles';

const BackPreviousPage = props => (
  <div style={{ display: 'flex' }}>
    <Link to="/contractor/drivers" style={stylesDetails.backArrowBox}>
      <div style={stylesDetails.backBox}>
        <span className="handel-chevron-circle-left" />
      </div>
    </Link>
    <div>
      <div style={stylesDetails.backTitle}>
        {props.name}
      </div>
      <div style={stylesDetails.backText}>
        {props.code}
      </div>
    </div>
  </div>
);

BackPreviousPage.propTypes = {
  name: string.isRequired,
  code: string.isRequired,
};

const ActionButtons = (props) => {
  const {
    editFlag,
    resetPasswordFlag,
    handleResetPassword,
    handleCancel,
    handleSave,
    handleDeletion,
  } = props;
  const toggleShowStyle = editFlag ? styles.showMe : styles.hideMe;
  const saveBtnIconName = editFlag ? 'handel-floppy-disk' : 'handel-pencil';
  const saveBtnLabel = editFlag ? 'Save' : 'Edit';
  const toggleShowResetBtnStyle = resetPasswordFlag ? styles.showMe : styles.hideMe;
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 20,
        marginLeft: 34,
      }}
    >
      <div>
        <ActionButton
          title="Reset Password"
          spanName="handel-reset-password"
          stylesExtra={{
            btnStyles: {
              color: '#239dff',
              border: 'solid 1px #239dff',
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 8px 0 rgba(102, 102, 102, 0.3)',
              marginRight: 0,
            },
            boxStyles: toggleShowResetBtnStyle,

          }}
          handleClick={handleResetPassword}
        />
        <ActionButton
          title="Delete"
          spanName="handel-bin"
          stylesExtra={{
            btnStyles: {
              backgroundColor: '#f06666',
              boxShadow: '0 4px 8px 0 rgba(240, 102, 102, 0.3)',
              marginRight: 0,
            },
          }}
          handleClick={handleDeletion}
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
            titleStyles: { ...styles.buttonText },
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
          }}
          handleClick={handleSave}
        />
      </div>


    </div>
  );
};

ActionButtons.propTypes = {
  editFlag: bool.isRequired,
  resetPasswordFlag: bool.isRequired,
  handleResetPassword: func.isRequired,
  handleCancel: func.isRequired,
  handleSave: func.isRequired,
  handleDeletion: func.isRequired,
};


class HeaderSubForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleCancel = this.handleCancel.bind(this);
    this.handleResetPassword = this.handleResetPassword.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleToggleEdit = this.handleToggleEdit.bind(this);
    this.handleDeletion = this.handleDeletion.bind(this);
  }

  handleDeletion() {
    this.props.handleDeletion();
  }

  handleCancel() {
    const { isDirty } = this.props;
    if (isDirty) {
      this.props.history.push('/contractor/drivers');
    } else {
      this.props.handleToggleEdit();
    }
  }

  handleResetPassword() {
    this.props.handleResetPassword();
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

  render() {
    const {
      name, code, isEdit,
      resetPasswordFlag,
    } = this.props;

    return (
      <div>
        <div className="back-previous-box col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <BackPreviousPage
            name={name}
            code={code}
          />
        </div>
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <ActionButtons
            editFlag={isEdit}
            resetPasswordFlag={resetPasswordFlag}
            handleResetPassword={this.handleResetPassword}
            handleCancel={this.handleCancel}
            handleSave={this.handleSave}
            handleToggleEdit={this.handleToggleEdit}
            handleDeletion={this.handleDeletion}
          />
        </div>
      </div>
    );
  }
}

HeaderSubForm.propTypes = {
  code: any.isRequired,
  name: string.isRequired,
  isEdit: bool.isRequired,
  isDirty: bool,
  resetPasswordFlag: bool,
  history: any.isRequired,
  handleResetPassword: func.isRequired,
  handleSave: func.isRequired,
  handleToggleEdit: func.isRequired,
  handleDeletion: func.isRequired,
};

HeaderSubForm.defaultProps = {
  isDirty: false,
  resetPasswordFlag: true,
};

export default withRouter(HeaderSubForm);
