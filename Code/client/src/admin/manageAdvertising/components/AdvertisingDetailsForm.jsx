import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { any, bool, func, string } from 'prop-types';
import { noop } from 'lodash';

import { SimpleCardLayout, ActionButton } from '../../../common/components';
import styles, { stylesDetails } from './Styles';
import AdvertisingDetailsUpperSubForm from './AdvertisingDetailsUpperSubForm';
import AdvertisingDetailsLowerSubForm from './AdvertisingDetailsLowerSubForm';
import PermissionRequired from '../../../common/hocs/PermissionRequired';

/* eslint no-unused-expressions: 0 */

const BackPreviousPage = props => (
  <div style={{ display: 'flex', marginLeft: 30 }}>
    <Link to="/admin/manage-advertising" style={stylesDetails.backArrowBox}>
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
    isPublish,
    isEdit,
    handleDeletion,
    handleCancel,
    handleSave,
    handleToggleEdit,
    handlePreview,
    handlePublish,
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
          title="Remove"
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
          title="Preview"
          spanName="handel-view"
          stylesExtra={{
            boxStyles: {
              marginLeft: 64,
              // ...toggleShowAddStyle,
            },
            btnStyles: {
              color: '#239dff',
              backgroundColor: '#fffff',
              boxShadow: '0 4px 8px 0 rgba(35, 157, 255, 0.3)',
              padding: '14px 15px',
            },
            iconStyles: {
              fontSize: 25,
            },
          }}
          handleClick={handlePreview}
        />
        {
          isPublish && (
            <ActionButton
              title="Publish"
              spanName="handel-send"
              stylesExtra={{
                boxStyles: {
                  // marginLeft: 64,
                  // ...toggleShowAddStyle,
                },
                btnStyles: {
                  backgroundColor: '#72c814',
                  boxShadow: '0 4px 8px 0 rgba(114, 200, 20, 0.4)',
                },
              }}
              handleClick={handlePublish}
            />
          )
        }
        <ActionButton
          title={cancelBtnLabel}
          spanName="handel-cross"
          stylesExtra={{
            boxStyles: {
              // marginLeft: 64,
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

        {
          isEdit && (
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
          )
        }
      </div>
    </div>
  );
};

ActionButtons.propTypes = {
  addFlag: bool.isRequired,
  editFlag: bool.isRequired,
  isPublish: bool.isRequired,
  isEdit: bool.isRequired,
  handleDeletion: func.isRequired,
  handleCancel: func.isRequired,
  handleSave: func.isRequired,
  handleToggleEdit: func.isRequired,
  handlePreview: func.isRequired,
  handlePublish: func.isRequired,
};

class AdvertisingDetailsForm extends Component {
  constructor(props) {
    super(props);

    this.handleDeletion = this.handleDeletion.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleToggleEdit = this.handleToggleEdit.bind(this);
    this.handleDeletion = this.handleDeletion.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
    this.handlePublish = this.handlePublish.bind(this);
  }

  handlePreview() {
    const { handlePreview } = this.props;
    if (handlePreview) {
      handlePreview();
    } else {
      const currentPath = window.location.pathname;
      if (currentPath.includes('edit')) {
        window.open(currentPath.replace('edit', 'preview'), '_blank');
      }
    }
  }

  handlePublish() {
    const { publishAdvertising } = this.props;
    publishAdvertising();
  }

  handleDeletion() {
    this.props.handleDeletion && this.props.handleDeletion();
  }

  handleCancel() {
    const { dirty, onToggleEdit, addFlag } = this.props;
    if (dirty || addFlag) {
      this.props.history.push('/admin/manage-advertising');
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
      addFlag, editFlag, data, section, isPublish, isEdit,
      handleSubmit,
    } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <div className="row" style={stylesDetails.headerBox}>
          <div className="back-previous-box col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <BackPreviousPage
              name={!addFlag ? (data && data.name) : 'Add Advertising'}
              code={!addFlag ? (data && data.code) : ''}
            />
          </div>
        </div>
        <PermissionRequired permission="editAdvertising">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ textAlign: 'right' }} >
              <ActionButtons
                addFlag={addFlag}
                editFlag={editFlag}
                isPublish={isPublish}
                isEdit={isEdit}
                handleDeletion={this.handleDeletion}
                handleCancel={this.handleCancel}
                handleSave={e => this.handleSave(e)}
                handleToggleEdit={e => this.handleToggleEdit(e)}
                handlePreview={this.handlePreview}
                handlePublish={this.handlePublish}
              />
            </div>
          </div>
        </PermissionRequired>
        <div className="row">
          <div className="col-xs-12">
            <SimpleCardLayout title="Details">
              <AdvertisingDetailsUpperSubForm
                isEdit={editFlag}
                isAdd={addFlag}
                section={section}
              />
            </SimpleCardLayout>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <SimpleCardLayout title="Details">
              <AdvertisingDetailsLowerSubForm
                isEdit={editFlag}
                isAdd={addFlag}
              />
            </SimpleCardLayout>
          </div>
        </div>
      </form>
    );
  }
}

AdvertisingDetailsForm.propTypes = {
  editFlag: bool,
  addFlag: bool,
  isPublish: bool,
  isEdit: bool,
  data: any,
  dirty: bool,
  history: any.isRequired,
  handleSubmit: func.isRequired,
  handleDeletion: func,
  onToggleEdit: func,
  section: string,
  handlePreview: func.isRequired,
  publishAdvertising: func,
};

AdvertisingDetailsForm.defaultProps = {
  editFlag: false,
  addFlag: false,
  isPublish: false,
  isEdit: false,
  data: {},
  handleDeletion: null,
  onToggleEdit: null,
  dirty: false,
  section: 'Horizontal',
  publishAdvertising: noop,
};

export default withRouter(AdvertisingDetailsForm);
