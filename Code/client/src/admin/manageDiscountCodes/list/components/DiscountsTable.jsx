import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  CommonBSTable,
  ActionButton,
  SimpleNewConfirmDlg,
} from '../../../../common/components';
import styles from './Styles';
import { columns } from './columnsDef';
import PermissionRequired from '../../../../common/hocs/PermissionRequired';
import { TIME_OUT_DEBOUNCE } from '../../../../common/constants/params';

/* eslint no-unused-vars: 0 */
/* eslint no-underscore-dangle: 0 */
/* eslint react/no-did-update-set-state: 0 */
/* eslint no-restricted-globals: 0 */
/* eslint no-alert: 0 */


class DiscountsTable extends Component {
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

    this.handleTableChange = this.handleTableChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handlePerPageChange = this.handlePerPageChange.bind(this);
    this.handleOnSelect = this.handleOnSelect.bind(this);
    this.handleOnSelectAll = this.handleOnSelectAll.bind(this);
    this.handleUpdateInventory = this.handleUpdateInventory.bind(this);
    this.handleAdd = this.handleAdd.bind(this);

    this.handleReactivation = this.handleReactivation.bind(this);
    this.handleInactivation = this.handleInactivation.bind(this);

    this.onHandleStartPopupDlg = this.onHandleStartPopupDlg.bind(this);
    this.onHandleConfirmPopupDlg = this.onHandleConfirmPopupDlg.bind(this);
    this.onHandleCancelPopupDlg = this.onHandleCancelPopupDlg.bind(this);
    this.onHandleSuccessPopupDlg = this.onHandleSuccessPopupDlg.bind(this);
    this.handleSearch = this.handleSearch.bind(this);


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

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (nextProps.accounts !== this.props.accounts) {
  //     this.selectedSet = [];
  //   }

  //   return true;
  // }

  componentDidUpdate(prevProps, prevState) {
    const { dataset } = this.props;

    if ((dataset.discounts !== prevProps.dataset.discounts)) {
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
    const { updateDiscountStatus } = this.props;
    const { currentTab } = this.state;

    try {
      await updateDiscountStatus({
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
    const { currentTab, perPage, s } = this.state;
    this.setState(() => ({ modalIsOpen: false }));
    this.props.getData(perPage, 1, s);
  }

  onHandleCancelPopupDlg() {
    this.setState({
      modalIsOpen: false,
    });
  }


  handleInactivation() {
    this.modalStartContent = {
      ...this.modalStartContent,
      title: 'Are You Sure?',
      subTitle: 'By clicking INACTIVATE, those discount code(s) will be inactivated.',
      buttonText: 'INACTIVATE',
      bottomTitle: 'Do not Inactivate',
    };

    this.modalSuccessContent = {
      ...this.modalSuccessContent,
      title: 'Discount Code(s) Inactivated',
      subTitle: 'The current discount code(s) has been Inactivated',
    };

    this.modalFailContent = {
      ...this.modalFailContent,
      title: 'Discount code(s) Inactivated Failed',
    };

    this.statusText = 'Inactive';

    this.onHandleStartPopupDlg();
  }

  handleReactivation(e) {
    this.modalStartContent = {
      ...this.modalStartContent,
      title: 'Are You Sure?',
      subTitle: 'By clicking ACTIVATE, those discount code(s) will be activated.',
      buttonText: 'ACTIVATE',
      bottomTitle: 'Do not Activate',
    };

    this.modalSuccessContent = {
      ...this.modalSuccessContent,
      title: 'Discount code(s) Activated',
      subTitle: 'The current discount code(s) has been Activated',
    };

    this.modalFailContent = {
      ...this.modalFailContent,
      title: 'Discount code(s) Activated Failed',
    };

    this.statusText = 'Active';

    this.onHandleStartPopupDlg();
  }

  handleTableChange(type, {
    page, sizePerPage, filters, sortField, sortOrder,
  }) {
    const { currentTab, perPage, s } = this.state;
    this.setState(() => ({ loading: true }));
    this.props.getData(perPage, page, s);
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
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.props.getData(perPage, 1, s), TIME_OUT_DEBOUNCE);
  }

  handlePerPageChange(val) {
    const { s } = this.state;
    this.setState(() => ({ perPage: val }));
    this.props.getData(val, 1, s);
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

  handleUpdateInventory(e) {
    const { currentTab, perPage, s } = this.state;
    this.props.getData(perPage, 1, s);
  }

  handleAdd(e) {
    this.props.history.push('/admin/discounts/add');
  }

  render() {
    const { dataset } = this.props;
    const {
      currentTab, loading, perPage,
      modalIsOpen, modalContent,
    } = this.state;
    const rowEvents = {
      onClick: (e, row, rowIndex) => {
        if (!((e.target.tagName === 'TD'
                && e.target.firstChild
                && e.target.firstChild.nodeName === 'INPUT'
        ) || (e.target.tagName === 'INPUT'))) {
          this.props.history.push(`/admin/discounts/${row._id}/view`);
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
                Discount Codes
              </h3>
            </div>

          </div>
          <PermissionRequired permission="editDiscountCode">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
            >
              <div>
                <ActionButton
                  title="Reactivate"
                  spanName="handel-history"
                  stylesExtra={{
                    btnStyles: {
                      backgroundColor: '#72c814',
                      boxShadow: '0 4px 8px 0 rgba(114, 200, 20, 0.4)',
                    },
                  }}
                  handleClick={this.handleReactivation}
                />
                <ActionButton
                  title="Inactive"
                  spanName="handel-suspend"
                  stylesExtra={{
                    btnStyles: {
                      backgroundColor: '#f06666',
                      boxShadow: '0 4px 8px 0 rgba(240, 102, 102, 0.3)',
                    },
                  }}
                  handleClick={this.handleInactivation}
                />
              </div>
              <div>
                <ActionButton
                  title="Add Discount"
                  spanName="handel-coupon"
                  stylesExtra={{
                    btnStyles: {
                      backgroundColor: '#239dff',
                      color: '#FFFFFF',
                      boxShadow: '0 4px 8px 0 rgba(35, 157, 255, 0.3)',
                    },
                  }}
                  handleClick={this.handleAdd}
                />
              </div>
            </div>
          </PermissionRequired>
        </div>

        <CommonBSTable
          styles={styles}
          title={columns[currentTab].label}
          loading={loading}
          perPage={perPage}
          tableData={dataset.discounts}
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

DiscountsTable.propTypes = {
  history: PropTypes.any.isRequired,
  dataset: PropTypes.any.isRequired,

  getData: PropTypes.func.isRequired,
  updateDiscountStatus: PropTypes.func.isRequired,
};

export default withRouter(DiscountsTable);
