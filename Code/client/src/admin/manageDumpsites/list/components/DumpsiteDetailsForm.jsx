import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { any, array, bool, func, string } from 'prop-types';

import { SimpleCardLayout, ActionButton } from '../../../../common/components';
import styles, { stylesDetails } from './Styles';
import DumpsiteDetailsUpperSubForm from './DumpsiteDetailsUpperSubForm';
import PermissionRequired from '../../../../common/hocs/PermissionRequired';

/* eslint no-unused-expressions: 0 */

const BackPreviousPage = props => (
  <div style={{ display: 'flex', marginLeft: 30 }}>
    <Link to="/admin/manage-dumpsites" style={stylesDetails.backArrowBox}>
      <div
        style={{
          fontSize: 48,
        }}
      >
        <span className="handel-chevron-circle-left" />
      </div>
    </Link>
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
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
    addFlag,
    editFlag,
    handleDeletion,
    handleCancel,
    handleSave,
    handleToggleEdit,
  } = props;
  const toggleShowEditStyle = editFlag ? styles.showMeBtn : styles.hideMe;
  const toggleShowAddStyle = !addFlag ? styles.showMe : styles.hideMe;
  const saveBtnIconName = editFlag ? 'handel-floppy-disk' : 'handel-pencil';
  const cancelBtnLabel = addFlag ? 'Cancel Add' : 'Cancel Edit';
  const saveBtnLabel = (addFlag || editFlag) ? 'Save' : 'Edit';

  return (
    <div
      style={
        addFlag ? styles.actionButtonAddBox : styles.actionButtonBox
      }
    >
      <div style={toggleShowAddStyle}>
        <ActionButton
          title="Delete"
          spanName="handel-bin"
          stylesExtra={{
            boxStyles: {
              marginLeft: 64,
              // ...toggleShowAddStyle,
            },
            btnStyles: {
              backgroundColor: '#f06666',
              boxShadow: '0 4px 8px 0 rgba(240, 102, 102, 0.3)',
            },
          }}
          handleClick={handleDeletion}
        />
      </div>
      <div>
        <ActionButton
          title={cancelBtnLabel}
          spanName="handel-cross"
          stylesExtra={{
            boxStyles: {
              marginLeft: 64,
              ...toggleShowEditStyle,
            },
            btnStyles: {
              border: '1px solid #f06666',
              color: '#f06666',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 4px 8px 0 rgba(102, 102, 102, 0.3)',
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
            },
          }}
          handleClick={
            (addFlag || editFlag) ? handleSave : handleToggleEdit
          }
        />
      </div>
    </div>
  );
};

ActionButtons.propTypes = {
  addFlag: bool.isRequired,
  editFlag: bool.isRequired,
  handleDeletion: func.isRequired,
  handleCancel: func.isRequired,
  handleSave: func.isRequired,
  handleToggleEdit: func.isRequired,
};

class DumpsiteDetailsForm extends Component {
  constructor(props) {
    super(props);

    this.handleDeletion = this.handleDeletion.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleToggleEdit = this.handleToggleEdit.bind(this);
    this.handleDeletion = this.handleDeletion.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  handleDeletion() {
    this.props.handleDeletion && this.props.handleDeletion();
  }

  handleCancel() {
    const { dirty, onToggleEdit, addFlag } = this.props;
    if (dirty || addFlag) {
      this.props.history.push('/admin/manage-dumpsites');
    } else {
      onToggleEdit();
    }
  }

  handleSave(e) {
    const { editFlag, handleSubmit, onToggleEdit } = this.props;

    if (editFlag) {
      handleSubmit();
    } else {
      onToggleEdit(e);
    }
    this.props.handleSubmit();
  }

  handleToggleEdit(e) {
    this.props.onToggleEdit();
    e.preventDefault();
  }

  render() {
    const {
      addFlag, editFlag, data,
      wasteTypes, councils,
      handleSubmit, openDays,
    } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <div className="row" style={stylesDetails.headerBox}>
          <div className="back-previous-box col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <BackPreviousPage
              name={!addFlag ? (data && data.name) : 'Add Dumpsite'}
              code={!addFlag ? (data && data.code) : ''}
            />
          </div>
        </div>
        <PermissionRequired permission="editDumpsite">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ textAlign: 'right' }} >
              <ActionButtons
                addFlag={addFlag}
                editFlag={editFlag}
                handleDeletion={this.handleDeletion}
                handleCancel={this.handleCancel}
                handleSave={e => this.handleSave(e)}
                handleToggleEdit={e => this.handleToggleEdit(e)}
              />
            </div>
          </div>
        </PermissionRequired>
        <div className="row">
          <div className="col-xs-12">
            <SimpleCardLayout title="Dumpsite Details">
              <DumpsiteDetailsUpperSubForm
                isEdit={editFlag}
                isAdd={addFlag}
                councils={councils}
                wasteTypes={wasteTypes}
                openDays={openDays}
              />
            </SimpleCardLayout>
          </div>
        </div>
      </form>
    );
  }
}

DumpsiteDetailsForm.propTypes = {
  editFlag: bool,
  addFlag: bool,
  data: any,
  dirty: bool,
  history: any.isRequired,
  handleSubmit: func.isRequired,
  handleDeletion: func,
  onToggleEdit: func,
  wasteTypes: array,
  councils: array,
  openDays: any,
};

DumpsiteDetailsForm.defaultProps = {
  editFlag: false,
  addFlag: false,
  data: {},
  handleDeletion: null,
  onToggleEdit: null,
  dirty: false,
  wasteTypes: [],
  councils: [],
  openDays: [],
};

export default withRouter(DumpsiteDetailsForm);
