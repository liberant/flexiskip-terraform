import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import HandelButton from '../../../../common/components/HandelButton';

import {
  CommonBSTable,
  SimpleNewConfirmDlg,
} from '../../../../common/components';
import styles from './../Styles';
import { columns } from './../columnsDef';
import './AccountsTable.css';
// import { UserTypeEnum } from '../constants/userTypes';

/* eslint no-underscore-dangle: 0 */
/* eslint react/no-did-update-set-state: 0 */


class AccountsTable extends Component {
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
      subTitle: 'By clicking ACTIVATE, those driver(s) will be activated.',
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
      title: 'Driver(s) Activated',
      subTitle: 'The current driver(s) has been Activated',
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
      title: 'Driver(s) Activated Failed',
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
    if (nextProps.accounts !== this.props.accounts) {
      this.selectedSet = [];
    }

    return true;
  }

  componentDidUpdate(prevProps) {
    const { accounts } = this.props;

    if ((accounts.customers !== prevProps.accounts.customers)) {
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
    const { updateCustomersStatus } = this.props;
    const { currentTab } = this.state;

    try {
      await updateCustomersStatus({
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
    const { s, perPage } = this.state;
    this.setState(() => ({ modalIsOpen: false }));
    this.props.getData(perPage, 1, s);
  }

  onHandleCancelPopupDlg() {
    this.setState({
      modalIsOpen: false,
    });
  }

  handleTabClick(e, index) {
    const { perPage } = this.state;
    this.setState(() => ({ currentTab: index }));
    this.props.getData(perPage, 1, '');
  }

  handleTableChange(type, { page }) {
    const { perPage } = this.state;
    this.setState(() => ({ loading: true }));
    this.props.getData(perPage, page, '');
  }

  handlePageChange(page) {
    const { perPage, s } = this.state;
    this.setState(() => ({ loading: true }));
    this.props.getData(perPage, page, s);
  }

  handlePerPageChange(val) {
    const { s } = this.state;
    this.setState(() => ({ perPage: val }));
    this.props.getData(val, 1, s);
  }

  handleSearch(event) {
    const { perPage } = this.state;
    const s = event.target.value;
    this.setState(() => ({ s, loading: true }));
    this.props.getData(perPage, 1, s);
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
      subTitle: 'By clicking INACTIVATE, those driver(s) will be inactivated.',
      buttonText: 'INACTIVATE',
      bottomTitle: 'Do not Inactivate',
    };

    this.modalSuccessContent = {
      ...this.modalSuccessContent,
      title: 'Driver(s) Inactivated',
      subTitle: 'The current driver(s) has been Inactivated',
    };

    this.modalFailContent = {
      ...this.modalFailContent,
      title: 'Driver(s) Inactivated Failed',
    };

    this.statusText = 'Inactive';

    this.onHandleStartPopupDlg();
  }

  handleReactivation() {
    this.modalStartContent = {
      ...this.modalStartContent,
      title: 'Are You Sure?',
      subTitle: 'By clicking ACTIVATE, those driver(s) will be activated.',
      buttonText: 'ACTIVATE',
      bottomTitle: 'Do not Activate',
    };

    this.modalSuccessContent = {
      ...this.modalSuccessContent,
      title: 'Driver(s) Activated',
      subTitle: 'The current driver(s) has been Activated',
    };

    this.modalFailContent = {
      ...this.modalFailContent,
      title: 'Driver(s) Activated Failed',
    };

    this.statusText = 'Active';

    this.onHandleStartPopupDlg();
  }

  handleSuspence() {
    this.modalStartContent = {
      ...this.modalStartContent,
      title: 'Are You Sure?',
      subTitle: 'By clicking SUSPEND, those driver(s) will be suspended.',
      buttonText: 'SUSPEND',
      bottomTitle: 'Do not Suspend',
    };

    this.modalSuccessContent = {
      ...this.modalSuccessContent,
      title: 'Driver(s) Suspended',
      subTitle: 'The current driver(s) has been Suspended',
    };

    this.modalFailContent = {
      ...this.modalFailContent,
      title: 'Driver(s) Suspended Failed',
    };

    this.statusText = 'Suspended';

    this.onHandleStartPopupDlg();
  }

  handleDeletion() {
    this.modalStartContent = {
      ...this.modalStartContent,
      title: 'Are You Sure?',
      subTitle: 'By clicking DELETE, those driver(s) will be deleted.',
      buttonText: 'DELETE',
      bottomTitle: 'Do not Delete',
    };

    this.modalSuccessContent = {
      ...this.modalSuccessContent,
      title: 'Driver(s) Deleted',
      subTitle: 'The current driver(s) has been Deleted',
    };

    this.modalFailContent = {
      ...this.modalFailContent,
      title: 'Driver(s) Deleted Failed',
    };

    this.statusText = 'Removed';

    this.onHandleStartPopupDlg();
  }

  handleAdd() {
    this.props.history.push('/contractor/add-driver');
  }

  render() {
    const { accounts } = this.props;
    const {
      currentTab, loading, perPage,
      modalIsOpen, modalContent,
    } = this.state;
    // const stylesActive = {
    //   ...styles.usersTab,
    //   ...styles.usersTabActive,
    // };
    const rowEvents = {
      onClick: (e, row) => {
        if (!((e.target.tagName === 'TD'
          && e.target.firstChild
          && e.target.firstChild.nodeName === 'INPUT'
        ) || (e.target.tagName === 'INPUT'))) {
          this.props.history.push(`/contractor/drivers/${row._id}`);
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
                Drivers
              </h3>
            </div>
          </div>
          <div className="account-table-button-group">
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
              label="Inactivate"
              onClick={this.handleInactivation}
              iconColor="white"
              bgColor="darkBlue"
              borderColor="darkBlue"
              color={{
                r: 29,
                g: 65,
                b: 93,
              }}
            >
              <span className="handel-cross-circle" />
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

            <HandelButton
              label="Add Driver"
              onClick={this.handleAdd}
              iconColor="white"
              bgColor="blue"
              borderColor="blue"
              color={{
                r: 35,
                g: 157,
                b: 255,
              }}
            >
              <span className="handel-users" />
            </HandelButton>
          </div>
        </div>

        <CommonBSTable
          styles={styles}
          title={columns[currentTab].label}
          loading={loading}
          perPage={perPage}
          tableData={accounts.customers}
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

AccountsTable.propTypes = {
  history: PropTypes.any.isRequired,
  getData: PropTypes.func.isRequired,
  accounts: PropTypes.any.isRequired,
  // Add: PropTypes.func,
};

AccountsTable.defaultProps = {
  // Add: null,
};

export default withRouter(AccountsTable);
