import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { any, bool, func, string } from 'prop-types';

import { SimpleCardLayout, ActionButton } from '../../../common/components';
import CommonLocalDataTable from '../../../common/components/CommonLocalDataTable';

import styles, { stylesDetails } from './Styles';
import { columnsItems } from './columnsDef';
import CouncilDetailsSubForm from './CouncilDetailsSubForm';
import CouncilLocationSubForm from './CouncilLocationSubForm';
import PermissionRequired from '../../../common/hocs/PermissionRequired';


/* eslint no-unused-expressions: 0 */

const BackPreviousPage = props => (
  <div style={{ display: 'flex', marginLeft: 30 }}>
    <div style={stylesDetails.backArrowBox} onClick={() => props.history.goBack()}>
      <div
        style={{
          fontSize: 48,
          cursor: 'pointer',
        }}
      >
        <span className="handel-chevron-circle-left" />
      </div>
    </div>
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
  history: any.isRequired,
};

const ActionButtons = (props) => {
  const {
    addFlag, editFlag,
    handleDeletion,
    handleCancel, handleSave,
    handleToggleEdit,
    handleChangeStatus,
  } = props;
  const toggleShowEditStyle = editFlag ? styles.showMeBtn : styles.hideMe;
  const toggleShowAddStyle = !addFlag ? styles.showMe : styles.hideMe;
  const saveBtnIconName = editFlag ? 'handel-floppy-disk' : 'handel-pencil';
  const cancelBtnLabel = addFlag ? 'Cancel Add' : 'Cancel Edit';
  const saveBtnLabel = (addFlag || editFlag) ? 'Save' : 'Edit';

  return (
    <div
      style={addFlag ? styles.actionButtonAddBox : styles.actionButtonBox}
    >
      <div style={toggleShowAddStyle}>
        <ActionButton
          title="Disable Product"
          spanName="handel-suspend"
          stylesExtra={{
            boxStyles: {
              marginLeft: 64,
              marginRight: 0,
            },
            btnStyles: {
              backgroundColor: '#f6ba1a',
              boxShadow: '0 4px 8px 0 rgba(246, 186, 26, 0.3)',
            },
          }}
          handleClick={handleChangeStatus}
        />
        <ActionButton
          title="Remove Product"
          spanName="handel-bin"
          stylesExtra={{
            boxStyles: {
              marginLeft: 30,
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
  handleChangeStatus: func.isRequired,
  handleDeletion: func.isRequired,
  handleCancel: func.isRequired,
  handleSave: func.isRequired,
  handleToggleEdit: func.isRequired,
};

class CouncilProductDetailsForm extends Component {
  constructor(props) {
    super(props);

    this.handleDeletion = this.handleDeletion.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleToggleEdit = this.handleToggleEdit.bind(this);
    this.handleDeletion = this.handleDeletion.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
  }

  handleChangeStatus() {
    this.props.handleChangeStatus && this.props.handleChangeStatus();
  }

  handleDeletion() {
    this.props.handleDeletion && this.props.handleDeletion();
  }

  handleCancel() {
    const { dirty, onToggleEdit, addFlag } = this.props;
    if (dirty || addFlag) {
      this.props.history.push('/admin/manage-products');
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
  }


  handleSearch() {

  }

  handleToggleEdit(e) {
    this.props.onToggleEdit();
    e.preventDefault();
  }

  render() {
    const {
      addFlag, editFlag, data,
      council, councils, history,
      handleSubmit,
    } = this.props;
    const titleColor = !addFlag ? '#1d415d' : '#239dff';

    return (
      <form onSubmit={handleSubmit}>
        <div className="row" style={stylesDetails.headerBox}>
          <div className="back-previous-box col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <BackPreviousPage
              name={!addFlag ? (data && data.name) : ''}
              code={!addFlag ? (data && data.code) : ''}
              history={history}
            />
          </div>
        </div>
        <PermissionRequired permission="editProduct">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ textAlign: 'right' }} >
              <ActionButtons
                addFlag={addFlag}
                editFlag={editFlag}
                handleChangeStatus={this.handleChangeStatus}
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
            <SimpleCardLayout title="Council Product">
              <div className="row">
                <div className="col-xs-6 col-sm-6 col-md-6 col-lg-5">
                  <div style={
                      !addFlag ? { paddingLeft: 8 } : {}
                    }
                  >
                    {
                      !addFlag ? (
                        <span className="handel-document" style={{ fontSize: 20 }} />
                      ) : null
                    }
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: 20,
                        margin: '10px 0px 20px 10px',
                        color: titleColor,
                      }}
                    >
                      Details
                    </span>
                  </div>
                  <div>
                    <CouncilDetailsSubForm
                      isEdit={editFlag}
                      product={data}
                    />
                  </div>
                </div>
                <div className="col-xs-6 col-sm-6 col-md-6 col-lg-5">
                  <div style={
                      !addFlag ? { paddingLeft: 8 } : {}
                    }
                  >
                    {
                      !addFlag ? (
                        <span className="handel-Asset-27" style={{ fontSize: 20 }} />
                      ) : null
                    }
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: 20,
                        margin: '10px 0px 20px 10px',
                        color: titleColor,
                      }}
                    >
                      Location
                    </span>
                  </div>
                  <div>
                    <CouncilLocationSubForm
                      council={council}
                      councils={councils}
                      isEdit={editFlag}
                      isAdd={addFlag}
                    />
                  </div>
                </div>
              </div>

            </SimpleCardLayout>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <SimpleCardLayout
              title="Used Address"
              searchFlag
              onHandleSearch={this.handleSearch}
            >
              <CommonLocalDataTable
                data={(data && data.usedTimes) || []}
                columnsDef={columnsItems}
                selectRowFlag={false}
              />
            </SimpleCardLayout>
          </div>
        </div>
      </form>
    );
  }
}

CouncilProductDetailsForm.propTypes = {
  editFlag: bool,
  addFlag: bool,
  data: any,
  dirty: bool,
  history: any.isRequired,
  councils: any.isRequired,
  council: any.isRequired,
  handleSubmit: func.isRequired,
  onToggleEdit: func,
  handleChangeStatus: func.isRequired,
  handleDeletion: func.isRequired,
};

CouncilProductDetailsForm.defaultProps = {
  editFlag: false,
  addFlag: false,
  data: {},
  onToggleEdit: null,
  dirty: false,
  product: {},
};

export default withRouter(CouncilProductDetailsForm);
