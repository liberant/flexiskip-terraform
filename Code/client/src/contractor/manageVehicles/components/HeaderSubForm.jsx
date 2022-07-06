import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes, { any, bool, func, string } from 'prop-types';

import { HandelButton } from '../../../common/components';
import styles, { stylesDetails } from './Styles';

const BackPreviousPage = props => (
  <div style={{ display: 'flex' }}>
    <Link to="/contractor/vehicles" style={stylesDetails.backArrowBox}>
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
    handleCancel,
    handleSave,
    handleDeletion,
    handleSuspend,
  } = props;
  const toggleShowStyle = editFlag ? styles.showMe : styles.hideMe;
  const saveBtnIconName = editFlag ? 'handel-floppy-disk' : 'handel-pencil';
  const saveBtnLabel = editFlag ? 'Save' : 'Edit';
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 20,
        marginLeft: 34,
        marginRight: 34,
      }}
    >
      <div>
        <HandelButton
          label="Suspend"
          onClick={handleSuspend}
          bgColor="orange"
          iconColor="white"
          containerStyle={{
            marginRight: 25,
          }}
        >
          <span className="handel-suspend" />
        </HandelButton>
        <HandelButton
          label="Delete"
          onClick={handleDeletion}
          bgColor="red"
          iconColor="white"
          containerStyle={{
            marginLeft: 25,
          }}
        >
          <span className="handel-bin" />
        </HandelButton>
      </div>

      <div>
        <HandelButton
          label="Cancel Edit"
          onClick={handleCancel}
          bgColor="white"
          iconColor="red"
          borderColor="red"
          containerStyle={{
            ...toggleShowStyle,
            marginRight: 25,
          }}
        >
          <span className="handel-cross" />
        </HandelButton>

        <HandelButton
          label={saveBtnLabel}
          onClick={handleSave}
          bgColor="blue"
          containerStyle={{
            marginRight: 0,
            marginLeft: 25,
          }}
        >
          <span className={saveBtnIconName} />
        </HandelButton>
      </div>

    </div>
  );
};

ActionButtons.propTypes = {
  editFlag: bool.isRequired,
  handleCancel: func.isRequired,
  handleSave: func.isRequired,
  handleDeletion: func.isRequired,
  handleSuspend: func.isRequired,
};


class HeaderSubForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleCancel = this.handleCancel.bind(this);
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
      this.props.history.push('/contractor/vehicles');
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

  render() {
    const {
      name, code, isEdit, vehicle,
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
            vehicle={vehicle}
            editFlag={isEdit}
            handleCancel={this.handleCancel}
            handleSave={this.handleSave}
            handleToggleEdit={this.handleToggleEdit}
            handleDeletion={this.handleDeletion}
            handleSuspend={this.props.handleSuspend}
          />
        </div>
      </div>
    );
  }
}

HeaderSubForm.propTypes = {
  code: any.isRequired,
  vehicle: PropTypes.object.isRequired,
  name: string.isRequired,
  isEdit: bool.isRequired,
  isDirty: bool,
  history: any.isRequired,
  handleSave: func.isRequired,
  handleToggleEdit: func.isRequired,
  handleDeletion: func.isRequired,
  handleSuspend: func.isRequired,
};

HeaderSubForm.defaultProps = {
  isDirty: false,
};

export default withRouter(HeaderSubForm);
