import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import moment from 'moment';


import { getFormattedDate } from '../../../common/utils/common';
import PermissionRequired from '../../../common/hocs/PermissionRequired';

import {
  CommonBSTable,
  SimpleNewConfirmDlg,
} from '../../../common/components';

// import { dateFormatter } from '../../../common/components/BSTableFormatters';
import styles from './Styles';
import { columns } from './columnsDef';

/* eslint no-underscore-dangle: 0 */
/* eslint react/no-did-update-set-state: 0 */
/* eslint no-unused-vars:0 */


export function periodFormatter(cell, row) {
  if (!row) {
    return (<div />);
  }

  const startTime = new Date(row.startDate);
  const endTime = new Date(row.endDate);
  const intervalMS = endTime - startTime;
  const intervalDay = intervalMS > 0 ? Math.ceil(intervalMS / (24 * 60 * 60 * 1000)) : 0;
  const periodYear = Math.floor(intervalDay / 365);
  const periodMonth = Math.floor((intervalDay - (periodYear * 365)) / 30);
  const periodDay = intervalDay - (periodYear * 365) - (periodMonth * 30);

  return (
    <div dataid={row._id}>
      {
        periodYear ? (
          <span dataid={row._id}>
            {`${periodYear} Year`}{periodYear > 1 ? ('s') : null}
          </span>
        ) : null
      }
      {
        periodMonth ? (
          <span dataid={row._id}>
            {periodYear ? ', ' : null}
            {`${periodMonth} Month`}
            {periodMonth > 1 ? ('s') : null}
          </span>
        ) : (
          <span dataid={row._id}>
            {periodYear ? ', ' : null}
          </span>
        )
      }
      {
        periodDay ? (
          <span dataid={row._id}>
            {periodMonth ? ', ' : null}
            {`${periodDay} Day`}
            {periodDay > 1 ? ('s') : null}
          </span>
        ) : (
          <span dataid={row._id}>
            {(!periodYear && !periodMonth) ? ('---') : null}
          </span>
        )
      }
    </div>
  );
}

const actionStyles = {
  binIcon: {
    padding: '5px 5px',
    border: '0px solid rgb(35, 157, 255)',
    color: 'rgb(249, 252, 254)',
    backgroundColor: 'rgb(240, 102, 102)',
    cursor: 'pointer',
    borderRadius: 36,
    boxShadow: 'rgba(240, 102, 102, 0.3) 0px 4px 8px 0px',
    marginRight: 8,
  },
  binLabel: {
    color: 'rgb(240, 102, 102)',
    display: 'inline-block',
  },
  disableIcon: {
    padding: '5px 5px',
    border: '0px solid rgb(35, 157, 255)',
    color: 'rgb(249, 252, 254)',
    backgroundColor: 'rgb(246, 186, 26)',
    cursor: 'pointer',
    borderRadius: 36,
    boxShadow: 'rgba(246, 186, 26, 0.3) 0px 4px 8px 0px',
    marginRight: 8,
  },
  disableLabel: {
    color: 'rgb(246, 186, 26)',
    marginRight: 26,
    display: 'inline-block',
  },
};

function cellFormater(cell, row) {
  if (!cell) {
    return (<div />);
  }

  return (
    <div dataid={row._id}>
      {cell}
    </div>
  );
}

function dateCellFormatter(cell, row) {
  if (!cell) {
    return (<div />);
  }

  return (
    <div dataid={row._id}>
      { getFormattedDate(moment.utc(cell).local().format('YYYY-MM-DD HH:mm:ss').substr(0, 10))}
    </div>
  );
}

function actionFormater(cell, row) {
  return (
    <PermissionRequired permission="editProduct">
      <div>
        <span>
          <span
            dataid={row._id}
            datatype="disable"
            className="handel-suspend"
            style={actionStyles.disableIcon}
          />
          <span
            dataid={row._id}
            datatype="disable"
            style={actionStyles.disableLabel}
          >
            Disable
          </span>
        </span>
        <span>
          <span
            dataid={row._id}
            datatype="delete"
            className="handel-bin"
            style={actionStyles.binIcon}
          />
          <span
            dataid={row._id}
            datatype="delete"
            style={actionStyles.binLabel}
          >
            Delete
          </span>
        </span>
      </div>
    </PermissionRequired>
  );
}

class CouncilProductsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0,
      loading: false,
      perPage: 10,

      deleteModalFlag: false,
      modalIsOpen: false,
      modalContent: {
        styles: { modal: { top: 430 } },
        title: 'Email Sent',
        subTitle: 'Password reset instructions is sent to',
        buttonText: 'OK',
        bottomTitle: '',
        handleButtonClick: () => { },
        handleNoButtonClick: () => { },
      },

      councilProductId: '',
    };

    this.selectedSet = [];

    this.columnsCoucilCodes = [
      {
        dataField: 'name',
        text: 'Product Name',
        // headerStyle: { width: 94 },
        style: { ...styles.truncate, ...styles.cellCursor, paddingTop: 10 },
        formatter: cellFormater,
        events: {
          onClick: (e) => {
            if (e && e.target) {
              const uid = e.target.getAttribute('dataid');
              if (uid) {
                this.props.history.push(`/admin/manage-council-products-edit/${uid}`);
              }
            }
          },
        },
      },
      {
        dataField: 'council.name',
        text: 'Council Name',
        style: { ...styles.truncate, ...styles.cellCursor, paddingTop: 10 },
        formatter: cellFormater,
        events: {
          onClick: (e) => {
            if (e && e.target) {
              const uid = e.target.getAttribute('dataid');
              if (uid) {
                this.props.history.push(`/admin/manage-council-products-edit/${uid}`);
              }
            }
          },
        },
      },
      {
        dataField: 'startDate',
        text: 'Start Date',
        style: { ...styles.truncate, ...styles.cellCursor, paddingTop: 10 },
        formatter: dateCellFormatter,
        events: {
          onClick: (e) => {
            if (e && e.target) {
              const uid = e.target.getAttribute('dataid');
              if (uid) {
                this.props.history.push(`/admin/manage-council-products-edit/${uid}`);
              }
            }
          },
        },
      },
      {
        dataField: 'endDate',
        text: 'Period',
        style: { ...styles.truncate, ...styles.cellCursor },
        formatter: periodFormatter,
        events: {
          onClick: (e) => {
            if (e && e.target) {
              const uid = e.target.getAttribute('dataid');
              if (uid) {
                this.props.history.push(`/admin/manage-council-products-edit/${uid}`);
              }
            }
          },
        },
      },
      {
        dataField: '_id',
        text: 'Actions',
        style: { ...styles.truncate, ...styles.cellCursor },
        formatter: actionFormater.bind(this),
        events: {
          onClick: (e) => {
            if (e && e.target) {
              const uid = e.target.getAttribute('dataid');
              const dataType = e.target.getAttribute('datatype');
              if (uid && dataType) {
                if (dataType.includes('disable')) {
                  this.onHandleDisableRequest(uid);
                } else if (dataType.includes('delete')) {
                  this.onHandleDeleteRequest(uid);
                }
              }
            }
          },
        },
      },
    ];

    this.handleTableChange = this.handleTableChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handlePerPageChange = this.handlePerPageChange.bind(this);
    this.handleOnSelect = this.handleOnSelect.bind(this);
    this.handleOnSelectAll = this.handleOnSelectAll.bind(this);

    this.onHandleDeleteRequest = this.onHandleDeleteRequest.bind(this);
    this.onHandleConfirmDeleteRequest = this.onHandleConfirmDeleteRequest.bind(this);
    this.onHandleCancelDeleteRequest = this.onHandleCancelDeleteRequest.bind(this);
    this.onHandleDeleteRequestSuccess = this.onHandleDeleteRequestSuccess.bind(this);

    this.onHandleDisableRequest = this.onHandleDisableRequest.bind(this);
    this.onHandleConfirmDisableRequest = this.onHandleConfirmDisableRequest.bind(this);
    this.onHandleCancelDisableRequest = this.onHandleCancelDisableRequest.bind(this);
    this.onHandleDisableRequestSuccess = this.onHandleDisableRequestSuccess.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { dataset } = this.props;

    if ((dataset.products !== prevProps.dataset.products)) {
      this.setState({ loading: false });
    }
  }

  onHandleDeleteRequest(uid) {
    const tmpModalContent = {
      title: 'Are You Sure?',
      subTitle: 'By clicking DELETE, this council product will be removed.',
      buttonText: 'DELETE',
      bottomTitle: 'Do not Delete',
      styles: {
        title: {
          color: '#f06666',
        },
        buttonText: {
          color: 'white',
          backgroundColor: '#f06666',
        },
      },
      handleButtonClick: this.onHandleConfirmDeleteRequest,
      handleNoButtonClick: this.onHandleCancelDeleteRequest,
    };

    this.setState({
      modalIsOpen: true,
      modalContent: tmpModalContent,
      deleteModalFlag: true,
      councilProductId: uid,
    });
  }

  async onHandleConfirmDeleteRequest() {
    const { councilProductId } = this.state;
    try {
      await this.props.deleteData(councilProductId);

      const tmpModalContent = {
        title: 'Product(s) Deleted',
        subTitle: 'The current council product has been deleted',
        buttonText: 'OK',
        bottomTitle: '',
        styles: {
          // modal: { top: 430 },
          bottomTitle: {
            display: 'none',
          },
        },
        handleButtonClick: this.onHandleDeleteRequestSuccess,
      };
      this.setState({
        modalIsOpen: true,
        modalContent: tmpModalContent,
        deleteModalFlag: false,
      });
    } catch (error) {
      const tmpModalContent = {
        title: 'Council Product Deleted Failed',
        subTitle: `Error occured: ${error.message}`,
        buttonText: 'OK',
        bottomTitle: '',
        styles: {
          title: {
            color: '#f06666',
          },
          buttonText: {
            color: 'white',
            backgroundColor: '#f06666',
          },
          bottomTitle: {
            display: 'none',
          },
        },
        handleButtonClick: this.onHandleCancelDeleteRequest,
      };

      this.setState({
        modalIsOpen: true,
        modalContent: tmpModalContent,
        deleteModalFlag: true,
      });
    }
  }

  onHandleDeleteRequestSuccess() {
    this.setState({ modalIsOpen: false });
    // this.handleUpdateInventory();
  }

  onHandleCancelDeleteRequest() {
    this.setState({
      deleteModalFlag: false,
      modalIsOpen: false,
    });
  }


  onHandleDisableRequest(uid) {
    const tmpModalContent = {
      title: 'Are You Sure?',
      subTitle: 'By clicking DISABLE, this council product will be disabled.',
      buttonText: 'DISABLE',
      bottomTitle: 'Do not Disable',
      styles: {
        title: {
          color: '#f06666',
        },
        buttonText: {
          color: 'white',
          backgroundColor: '#f06666',
        },
      },
      handleButtonClick: this.onHandleConfirmDisableRequest,
      handleNoButtonClick: this.onHandleCancelDisableRequest,
    };

    this.setState({
      modalIsOpen: true,
      modalContent: tmpModalContent,
      deleteModalFlag: true,
      councilProductId: uid,
    });
  }

  async onHandleConfirmDisableRequest() {
    const { councilProductId } = this.state;
    try {
      await this.props.updateData({
        uid: councilProductId,
        status: 'Unavailable',
      });

      const tmpModalContent = {
        title: 'Product(s) Disabled',
        subTitle: 'The current council product has been disabled',
        buttonText: 'OK',
        bottomTitle: '',
        styles: {
          // modal: { top: 430 },
          bottomTitle: {
            display: 'none',
          },
        },
        handleButtonClick: this.onHandleDisableRequestSuccess,
      };
      this.setState({
        modalIsOpen: true,
        modalContent: tmpModalContent,
        deleteModalFlag: false,
      });
    } catch (error) {
      const tmpModalContent = {
        title: 'Council Product Disabled Failed',
        subTitle: `Error occured: ${error.message}`,
        buttonText: 'OK',
        bottomTitle: '',
        styles: {
          title: {
            color: '#f06666',
          },
          buttonText: {
            color: 'white',
            backgroundColor: '#f06666',
          },
          bottomTitle: {
            display: 'none',
          },
        },
        handleButtonClick: this.onHandleCancelDisableRequest,
      };

      this.setState({
        modalIsOpen: true,
        modalContent: tmpModalContent,
        deleteModalFlag: true,
      });
    }
  }

  onHandleDisableRequestSuccess() {
    this.setState({ modalIsOpen: false });
    // this.handleUpdateInventory();
  }

  onHandleCancelDisableRequest() {
    this.setState({
      deleteModalFlag: false,
      modalIsOpen: false,
    });
  }

  handlePerPageChange(val) {
    const { currentTab } = this.state;

    this.setState(() => ({ perPage: val }));
    this.props.getData(val, 1, columns[currentTab].name, columns[currentTab].url);
  }

  handleTableChange(type, { page }) {
    const { currentTab, perPage } = this.state;

    this.setState(() => ({ loading: true }));

    this.props.getData(perPage, page, columns[currentTab].name, columns[currentTab].url);
  }

  handlePageChange(page) {
    const { currentTab, perPage } = this.state;

    this.setState(() => ({ loading: true }));

    this.props.getData(perPage, page, columns[currentTab].name, columns[currentTab].url);
  }

  handleOnSelect(row, isSelect) {
    if (isSelect) {
      this.selectedSet.push(row._id);
    } else {
      this.selectedSet = this.selectedSet.filter(x => x !== row._id);
    }
  }

  handleOnSelectAll(isSelect, rows) {
    const ids = rows.map(r => r._id);
    if (isSelect) {
      this.selectedSet = ids;
    } else {
      this.selectedSet = [];
    }
  }

  render() {
    const { dataset } = this.props;
    const {
      loading, perPage,
      modalIsOpen, modalContent, deleteModalFlag,
    } = this.state;
    const rowEvents = {
      onClick: (e, row) => {
        if (!((e.target.tagName === 'TD'
                && e.target.firstChild
                && e.target.firstChild.nodeName === 'INPUT'
        ) || (e.target.tagName === 'INPUT'))) {
          // this.props.history.push(`/admin/manage-products-edit/${row._id}`);
        }
      },
    };

    return (
      <div>
        <SimpleNewConfirmDlg
          modalIsOpen={modalIsOpen}
          styles={modalContent.styles}
          title={modalContent.title}
          subTitle={modalContent.subTitle}
          buttonText={modalContent.buttonText}
          bottomTitle={modalContent.bottomTitle}
          handleButtonClick={modalContent.handleButtonClick}
          handleNoButtonClick={modalContent.handleNoButtonClick}
        >
          {
            deleteModalFlag ? (
              <span style={{ fontSize: 68, color: '#f06666' }}>
                <span className="handel-question" />
              </span>) : null
          }
        </SimpleNewConfirmDlg>


        <CommonBSTable
          styles={{ ...styles, headerBox: { display: 'none' } }}
          loading={loading}
          perPage={perPage}
          tableData={dataset}
          columns={this.columnsCoucilCodes}
          rowEvents={rowEvents}
          selectRowFlag={false}
          paginationFlag
          noHeader
          handleTableChange={this.handleTableChange}
          handlePageChange={this.handlePageChange}
          handlePerPageChange={this.handlePerPageChange}
          handleOnSelect={this.handleOnSelect}
          handleOnSelectAll={this.handleOnSelectAll}
        />

      </div>
    );
  }
}

CouncilProductsTable.propTypes = {
  history: PropTypes.any.isRequired,
  dataset: PropTypes.any.isRequired,
  getData: PropTypes.func.isRequired,
  deleteData: PropTypes.func.isRequired,
  updateData: PropTypes.func.isRequired,
};

CouncilProductsTable.defaultProps = {
};

export default withRouter(CouncilProductsTable);
