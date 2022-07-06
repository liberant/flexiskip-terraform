import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import shortid from 'shortid';
import { setTab, getCustomersList } from '../actions';
import {
  CommonBSTable,
  SimpleNewConfirmDlg,
} from '../../../common/components';
import styles from './Styles';
import { columns } from './columnsDef';
import PermissionRequired from '../../../common/hocs/PermissionRequired';
import Spinner from '../../../common/components/Spinner';
import HandelButton from '../../../common/components/HandelButton';
import { TIME_OUT_DEBOUNCE } from '../../../common/constants/params';
/* eslint no-underscore-dangle: 0 */
/* eslint react/no-did-update-set-state: 0 */
/* eslint no-restricted-globals: 0 */
/* eslint no-alert: 0 */


class AccountsTable extends Component {
  static propTypes = {
    setTab: PropTypes.func.isRequired,
    getData: PropTypes.func.isRequired,
    accounts: PropTypes.object,
    currentTab: PropTypes.number.isRequired,
    isLoading: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    apiAccessToken: PropTypes.string.isRequired,
  }

  static defaultProps = {
    accounts: {},
  }

  constructor(props) {
    super(props);
    this.state = {
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
      subTitle: 'By clicking ACTIVATE, those user(s) will be activated.',
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
      title: 'User(s) Activated',
      subTitle: 'The current user(s) has been Activated',
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
      title: 'User(s) Activated Failed',
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

  componentDidMount() {
    this.handleTabClick(null, this.props.currentTab);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.accounts !== this.props.accounts) {
      this.selectedSet = [];
    }
    return true;
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
    const { updateCustomersStatus, currentTab } = this.props;
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
    const { perPage, s } = this.state;
    const { currentTab } = this.props;
    this.setState(() => ({ modalIsOpen: false }));
    this.getUsers(perPage, 1, columns[currentTab].name, columns[currentTab].url, s);
  }

  onHandleCancelPopupDlg() {
    this.setState({
      modalIsOpen: false,
    });
  }

  getUsers(limit, page, userType, url, s) {
    const { getData } = this.props;
    getData({
      limit, page, type: userType, url, s,
    });
  }

  handleColDownload = () => {
    let url = `/api/v1/admin/reports/customer-col?token=${this.props.apiAccessToken}`;
    if (this.selectedSet.length > 0) {
      url += `&customers=${this.selectedSet.join(',')}`;
    }
    window.location = url;
  }

  handleProDownload = () => {
    let url = `/api/v1/admin/reports/customer?token=${this.props.apiAccessToken}`;
    if (this.selectedSet.length > 0) {
      url += `&customers=${this.selectedSet.join(',')}`;
    }
    window.location = url;
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
      subTitle: 'By clicking INACTIVATE, those user(s) will be inactivated.',
      buttonText: 'INACTIVATE',
      bottomTitle: 'Do not Inactivate',
    };

    this.modalSuccessContent = {
      ...this.modalSuccessContent,
      title: 'User(s) Inactivated',
      subTitle: 'The current user(s) has been Inactivated',
    };

    this.modalFailContent = {
      ...this.modalFailContent,
      title: 'User(s) Inactivated Failed',
    };

    this.statusText = 'Inactive';

    this.onHandleStartPopupDlg();
  }

  handleReactivation() {
    this.modalStartContent = {
      ...this.modalStartContent,
      title: 'Are You Sure?',
      subTitle: 'By clicking ACTIVATE, those user(s) will be activated.',
      buttonText: 'ACTIVATE',
      bottomTitle: 'Do not Activate',
    };

    this.modalSuccessContent = {
      ...this.modalSuccessContent,
      title: 'User(s) Activated',
      subTitle: 'The current user(s) has been Activated',
    };

    this.modalFailContent = {
      ...this.modalFailContent,
      title: 'User(s) Activated Failed',
    };

    this.statusText = 'Active';

    this.onHandleStartPopupDlg();
  }

  handleSuspence() {
    this.modalStartContent = {
      ...this.modalStartContent,
      title: 'Are You Sure?',
      subTitle: 'By clicking SUSPEND, those user(s) will be suspended.',
      buttonText: 'SUSPEND',
      bottomTitle: 'Do not Suspend',
    };

    this.modalSuccessContent = {
      ...this.modalSuccessContent,
      title: 'User(s) Suspended',
      subTitle: 'The current user(s) has been Suspended',
    };

    this.modalFailContent = {
      ...this.modalFailContent,
      title: 'User(s) Suspended Failed',
    };

    this.statusText = 'Suspended';

    this.onHandleStartPopupDlg();
  }

  handleDeletion() {
    this.modalStartContent = {
      ...this.modalStartContent,
      title: 'Are You Sure?',
      subTitle: 'By clicking DELETE, those user(s) will be deleted.',
      buttonText: 'DELETE',
      bottomTitle: 'Do not Delete',
    };

    this.modalSuccessContent = {
      ...this.modalSuccessContent,
      title: 'User(s) Deleted',
      subTitle: 'The current user(s) has been Deleted',
    };

    this.modalFailContent = {
      ...this.modalFailContent,
      title: 'User(s) Deleted Failed',
    };

    this.statusText = 'Removed';

    this.onHandleStartPopupDlg();
  }

  handleAdd() {
    this.props.history.push('/admin/manage-accounts/add-user');
  }

  handleTabClick(e, index) {
    const { perPage, s } = this.state;
    this.props.setTab(index);
    this.getUsers(perPage, 1, columns[index].name, columns[index].url, s);
  }

  handlePerPageChange(val) {
    const { s } = this.state;
    const { currentTab } = this.props;
    this.setState(() => ({ perPage: val }));
    this.getUsers(val, 1, columns[currentTab].name, columns[currentTab].url, s);
  }

  handleTableChange(type, { page }) {
    const { perPage, s } = this.state;
    const { currentTab } = this.props;
    this.getUsers(perPage, page, columns[currentTab].name, columns[currentTab].url, s);
  }

  handlePageChange(page) {
    const { perPage, s } = this.state;
    const { currentTab } = this.props;
    this.getUsers(perPage, page, columns[currentTab].name, columns[currentTab].url, s);
  }

  handleSearch(event) {
    const { perPage } = this.state;
    const { currentTab } = this.props;
    const s = event.target.value;
    this.setState({ s });
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.getUsers(
      perPage, 1, columns[currentTab].name,
      columns[currentTab].url, s,
    ), TIME_OUT_DEBOUNCE);
  }

  handleOnSelect(row, isSelect) {
    // console.log(row)
    if (isSelect) {
      this.selectedSet.push(row._id);
    } else {
      this.selectedSet = this.selectedSet.filter(x => x !== row._id);
    }
  }

  render() {
    const { accounts, currentTab, isLoading } = this.props;
    // console.log('accounts :>> ', accounts);
    const {
      perPage,
      modalIsOpen,
      modalContent,
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
          this.props.history.push(`/admin/manage-accounts/${columns[currentTab].url}/${row._id}`);
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
        <div style={{ ...styles.usersTabBoxOuter, marginTop: 30 }}>
          <div style={styles.pageTitleBox}>
            <div>
              <h3 style={{ ...styles.pageTitle }}>
                Manage Accounts
              </h3>
            </div>
          </div>
          <PermissionRequired permission="editAccount">
            <div className="row">
              <div className="col-md-6">
                <div className="top-toolbar">
                  <HandelButton
                    label="Reactivate"
                    onClick={this.handleReactivation}
                    borderColor="green"
                    iconColor="white"
                    shadowColor="green"
                    bgColor="green"
                  >
                    <span className="handel-history" />
                  </HandelButton>

                  <HandelButton
                    label="Suspend"
                    onClick={this.handleSuspence}
                    borderColor="orange"
                    shadowColor="orange"
                    bgColor="orange"
                    iconColor="white"
                  >
                    <span className="handel-suspend" />
                  </HandelButton>

                  <HandelButton
                    label="Delete"
                    onClick={this.handleDeletion}
                    borderColor="red"
                    shadowColor="red"
                    bgColor="red"
                    iconColor="white"
                  >
                    <span className="handel-bin" />
                  </HandelButton>
                </div>
              </div>
              <div className="col-md-6">
                <div className="top-toolbar text-right">
                  <HandelButton
                    label="Collection Report"
                    onClick={this.handleColDownload}
                    iconColor="white"
                    bgColor="blue"
                    borderColor="blue"
                    shadowColor="blue"
                    visible={currentTab === 0 || currentTab === 1}
                  >
                    <span className="handel-download" />
                  </HandelButton>

                  <HandelButton
                      label="Product Report"
                      onClick={this.handleProDownload}
                      iconColor="white"
                      bgColor="blue"
                      borderColor="blue"
                      shadowColor="blue"
                      visible={currentTab === 0 || currentTab === 1}
                  >
                    <span className="handel-download" />
                  </HandelButton>

                  <HandelButton
                    label="Add User"
                    onClick={this.handleAdd}
                    bgColor="blue"
                    borderColor="blue"
                    shadowColor="blue"
                    iconColor="white"
                  >
                    <span className="handel-users" />
                  </HandelButton>
                </div>
              </div>
            </div>
          </PermissionRequired>
        </div>
        <div style={styles.usersTabBoxOuter}>
          <div style={styles.usersTabBox}>
            {
              columns.map((column, index) => {
                if (currentTab === index) {
                  return (
                    <div
                      key={shortid.generate()}
                      style={stylesActive}
                      onClick={e => this.handleTabClick(e, index)}
                    >
                      {column.label}
                    </div>
                  );
                }
                return (
                  <div
                    key={shortid.generate()}
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
          title={columns[currentTab].label}
          loading={isLoading}
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

export default compose(
  withRouter,
  connect(
    state => ({
      currentTab: state.admin.accounts.customers.tab,
      isLoading: !state.common.requestFinished.customersList,
      accounts: state.admin.accounts,
      apiAccessToken: state.common.identity.token.value,
    }),
    dispatch => ({
      getData: (data) => {
        const action = getCustomersList(data);
        dispatch(action);
        return action.promise;
      },
      // change current tab
      setTab: tabIndex => dispatch(setTab(tabIndex)),
    }),
  ),
)(AccountsTable);
