import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import HandelButton from '../../../common/components/HandelButton';

import {
  CommonBSTable,
  SimpleNewConfirmDlg,
} from '../../../common/components';
import styles from './Styles';
import { columns } from './columnsDef';
// import { UserTypeEnum } from '../constants/userTypes';

/* eslint no-underscore-dangle: 0 */
/* eslint react/no-did-update-set-state: 0 */


class VehiclesTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0,
      loading: false,
      perPage: 10,

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
    };

    this.selectedSet = [];

    this.handleTabClick = this.handleTabClick.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handlePerPageChange = this.handlePerPageChange.bind(this);
    this.handleOnSelect = this.handleOnSelect.bind(this);
    this.handleOnSelectAll = this.handleOnSelectAll.bind(this);
    this.handleReactivation = this.handleReactivation.bind(this);
    this.handleSuspence = this.handleSuspence.bind(this);
    this.handleDeletion = this.handleDeletion.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleInactivation = this.handleInactivation.bind(this);
    this.handleSearch = this.handleSearch.bind(this);

    this.onHandleStartPopupDlg = this.onHandleStartPopupDlg.bind(this);
    this.onHandleConfirmPopupDlg = this.onHandleConfirmPopupDlg.bind(this);
    this.onHandleCancelPopupDlg = this.onHandleCancelPopupDlg.bind(this);
    this.onHandleSuccessPopupDlg = this.onHandleSuccessPopupDlg.bind(this);


    this.modalStartContent = {
      title: 'Are You Sure?',
      subTitle: 'By clicking ACTIVATE, those vehicle(s) will be activated.',
      buttonText: 'ACTIVATE',
      bottomTitle: 'Do not Activate',
      styles: {
        modal: { top: 430 },
        icon: { fontSize: 64, color: '#f06666' },
        title: {
          color: '#f06666',
        },
        buttonText: {
          color: 'white',
          backgroundColor: '#f06666',
        },
      },
      iconSpanName: 'handel-question',
      handleButtonClick: this.onHandleConfirmPopupDlg,
      handleNoButtonClick: this.onHandleCancelPopupDlg,
    };
    this.modalSuccessContent = {
      title: 'Vehicle(s) Activated',
      subTitle: 'The current vehicle(s) has been Activated',
      buttonText: 'OK',
      bottomTitle: '',
      styles: {
        modal: { top: 430 },
        icon: { fontSize: 64, color: '#239dff' },
        bottomTitle: {
          display: 'none',
        },
      },
      iconSpanName: 'handel-check-circle',
      handleButtonClick: this.onHandleSuccessPopupDlg,
    };
    this.modalFailContent = {
      title: 'Vehicle(s) Activated Failed',
      buttonText: 'OK',
      bottomTitle: '',
      styles: {
        modal: { top: 430 },
        icon: { fontSize: 64, color: '#f06666' },
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
      iconSpanName: 'handel-notify',
      handleButtonClick: this.onHandleCancelPopupDlg,
    };
    this.statusText = '';
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.vehicles !== this.props.vehicles) {
      this.selectedSet = [];
    }

    return true;
  }

  componentDidUpdate(prevProps) {
    const { vehicles } = this.props;

    if ((vehicles.vehicles !== prevProps.vehicles.vehicles)) {
      this.setState({ loading: false });
    }
  }

  onHandleStartPopupDlg() {
    if (!this.selectedSet.length) {
      return;
    }

    this.setState({
      modalIsOpen: true,
      modalContent: this.modalStartContent,
    });
  }

  async onHandleConfirmPopupDlg() {
    const { updateVehiclesStatus } = this.props;
    const { currentTab } = this.state;

    try {
      await updateVehiclesStatus({
        ids: this.selectedSet,
        url: columns[currentTab].url,
        status: this.statusText,
        userType: columns[currentTab].name,
      });

      this.setState({
        modalIsOpen: true,
        modalContent: this.modalSuccessContent,
      });
    } catch (error) {
      this.modalFailContent.subTitle = `Error occured: ${error.message}`;

      this.setState({
        modalIsOpen: true,
        modalContent: this.modalFailContent,
      });
    }
  }

  onHandleSuccessPopupDlg() {
    const { perPage } = this.state;
    this.setState(() => ({ modalIsOpen: false }));
    this.props.getData(perPage, 1);
  }

  onHandleCancelPopupDlg() {
    this.setState({
      modalIsOpen: false,
    });
  }

  handlePerPageChange(val) {
    const { s } = this.state;
    this.setState(() => ({ perPage: val }));
    this.props.getData(val, 1, s);
  }

  handlePageChange(page) {
    const { perPage, s } = this.state;
    this.setState(() => ({ loading: true }));
    this.props.getData(perPage, page, s);
  }

  handleSearch(event) {
    const { perPage } = this.state;
    const s = event.target.value;
    this.setState(() => ({ s, loading: true }));
    this.props.getData(perPage, 1, s);
  }

  handleTabClick(e, index) {
    const { perPage } = this.state;
    this.setState(() => ({ currentTab: index }));
    this.props.getData(perPage, 1);
  }

  handleTableChange(type, { page }) {
    const { perPage } = this.state;
    this.setState(() => ({ loading: true }));
    this.props.getData(perPage, page);
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

  handleInactivation() {
    this.modalStartContent = {
      ...this.modalStartContent,
      title: 'Are You Sure?',
      subTitle: 'By clicking INACTIVATE, those vehicle(s) will be inactivated.',
      buttonText: 'INACTIVATE',
      bottomTitle: 'Do not Inactivate',
    };

    this.modalSuccessContent = {
      ...this.modalSuccessContent,
      title: 'Vehicle(s) Inactivated',
      subTitle: 'The current vehicle(s) has been Inactivated',
    };

    this.modalFailContent = {
      ...this.modalFailContent,
      title: 'Vehicle(s) Inactivated Failed',
    };

    this.statusText = 'Inactive';

    this.onHandleStartPopupDlg();
  }

  handleReactivation() {
    this.modalStartContent = {
      ...this.modalStartContent,
      title: 'Are You Sure?',
      subTitle: 'By clicking ACTIVATE, those vehicle(s) will be activated.',
      buttonText: 'ACTIVATE',
      bottomTitle: 'Do not Activate',
    };

    this.modalSuccessContent = {
      ...this.modalSuccessContent,
      title: 'Vehicle(s) Activated',
      subTitle: 'The current vehicle(s) has been Activated',
    };

    this.modalFailContent = {
      ...this.modalFailContent,
      title: 'Vehicle(s) Activated Failed',
    };

    this.statusText = 'Active';

    this.onHandleStartPopupDlg();
  }

  handleSuspence() {
    this.modalStartContent = {
      ...this.modalStartContent,
      title: 'Are You Sure?',
      subTitle: 'By clicking SUSPEND, those vehicle(s) will be suspended.',
      buttonText: 'SUSPEND',
      bottomTitle: 'Do not Suspend',
    };

    this.modalSuccessContent = {
      ...this.modalSuccessContent,
      title: 'Vehicle(s) Suspended',
      subTitle: 'The current vehicle(s) has been Suspended',
    };

    this.modalFailContent = {
      ...this.modalFailContent,
      title: 'Vehicle(s) Suspended Failed',
    };

    this.statusText = 'Unavailable';

    this.onHandleStartPopupDlg();
  }

  handleDeletion() {
    this.modalStartContent = {
      ...this.modalStartContent,
      title: 'Are You Sure?',
      subTitle: 'By clicking DELETE, those vehicle(s) will be deleted.',
      buttonText: 'DELETE',
      bottomTitle: 'Do not Delete',
    };

    this.modalSuccessContent = {
      ...this.modalSuccessContent,
      title: 'Vehicle(s) Deleted',
      subTitle: 'The current vehicle(s) has been Deleted',
    };

    this.modalFailContent = {
      ...this.modalFailContent,
      title: 'Vehicle(s) Deleted Failed',
    };

    this.statusText = 'Removed';

    this.onHandleStartPopupDlg();
  }

  handleAdd() {
    this.props.history.push('/contractor/vehicles/add');
  }

  render() {
    const { vehicles } = this.props;
    const {
      currentTab, loading, perPage,
      modalIsOpen, modalContent,
    } = this.state;
    const stylesActive = {
      ...styles.usersTab,
      ...styles.usersTabActive,
    };
    const rowEvents = {
      onClick: (e, row) => {
        if (!((e.target.tagName === 'TD'
          && e.target.firstChild
          && e.target.firstChild.nodeName === 'INPUT'
        ) || (e.target.tagName === 'INPUT'))) {
          if (row.status === 'Active' || row.status === 'Unavailable') {
            this.props.history.push(`/contractor/vehicles/${row._id}`);
          }
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
          <span style={modalContent.styles.icon}>
            <span className={modalContent.iconSpanName} />
          </span>
        </SimpleNewConfirmDlg>
        <div style={{ ...styles.usersTabBoxOuter, marginTop: 30, marginBottom: 30 }}>
          <div style={styles.pageTitleBox}>
            <div>
              <h3 style={{ ...styles.pageTitle }}>
                Vehicles
              </h3>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              <div className="top-toolbar">
                <HandelButton
                  label="Reactivate"
                  onClick={this.handleReactivation}
                  iconColor="white"
                  bgColor="green"
                  borderColor="green"
                  shadowColor="green"
                >
                  <span className="handel-history" />
                </HandelButton>

                <HandelButton
                  label="Suspend"
                  onClick={this.handleSuspence}
                  iconColor="white"
                  bgColor="orange"
                  borderColor="orange"
                  shadowColor="orange"
                >
                  <span className="handel-suspend" />
                </HandelButton>

                <HandelButton
                  label="Delete"
                  onClick={this.handleDeletion}
                  iconColor="white"
                  bgColor="red"
                  borderColor="red"
                  shadowColor="red"
                >
                  <span className="handel-bin" />
                </HandelButton>
              </div>
            </div>

            <div className="col-md-4">
              <div className="top-toolbar text-right">
                <HandelButton
                  label="Add Vehicle"
                  onClick={this.handleAdd}
                  iconColor="white"
                  bgColor="blue"
                  borderColor="blue"
                  shadowColor="blue"
                >
                  <span className="handel-truck" />
                </HandelButton>
              </div>
            </div>
          </div>
        </div>
        <div style={{ ...styles.usersTabBoxOuter, display: 'none' }}>
          <div style={styles.usersTabBox}>
            {
              columns.map((column, index) => {
                if (currentTab === index) {
                  return (
                    <div
                      key={column.name}
                      style={stylesActive}
                      onClick={e => this.handleTabClick(e, index)}
                    >
                      {column.label}
                    </div>
                  );
                }
                return (
                  <div
                    key={column.name}
                    style={styles.usersTab}
                    onClick={e => this.handleTabClick(e, index)}
                  >
                    {column.label}
                  </div>
                );
              })
            }
          </div>
        </div>

        <CommonBSTable
          styles={styles}
          title="Vehicles"
          loading={loading}
          perPage={perPage}
          tableData={vehicles.vehicles}
          columns={columns[currentTab].columnsDef}
          rowEvents={rowEvents}
          paginationFlag
          handleTableChange={this.handleTableChange}
          handlePageChange={this.handlePageChange}
          handlePerPageChange={this.handlePerPageChange}
          handleOnSelect={this.handleOnSelect}
          handleOnSelectAll={this.handleOnSelectAll}
          handleSearch={this.handleSearch}
        />

      </div>
    );
  }
}

VehiclesTable.propTypes = {
  history: PropTypes.any.isRequired,
  getData: PropTypes.func.isRequired,
  vehicles: PropTypes.any.isRequired,
};

export default withRouter(VehiclesTable);
