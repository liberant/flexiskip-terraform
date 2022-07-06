import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Table, Pagination } from 'antd';
import SearchBox from '../../../../common/components/form/SearchBox';
import PageSelector from '../../../../common/components/form/PageSelector';
import DisputeStatus from '../../../../common/components/DisputeStatus';
import {
  ActionButton,
  SimpleNewConfirmDlg,
  CommonTable,
  InnerSearch,
} from '../../../../common/components';
import styles from './Styles';
import { columns } from './columnsDef';
import PermissionRequired from '../../../../common/hocs/PermissionRequired';
import './Styles.css';

/* eslint no-unused-vars: 0 */
/* eslint no-underscore-dangle: 0 */
/* eslint react/no-did-update-set-state: 0 */
/* eslint no-restricted-globals: 0 */
/* eslint no-alert: 0 */


class CouncilsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0,
      loading: false,
      perPage: 10,
      s: '',
      status: '',

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
      selectedSet: [],
    };

    this.handleTableChange = this.handleTableChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handlePerPageChange = this.handlePerPageChange.bind(this);
    this.handleOnSelect = this.handleOnSelect.bind(this);
    this.handleUpdateInventory = this.handleUpdateInventory.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleSearch = this.handleSearch.bind(this);

    this.handleReactivation = this.handleReactivation.bind(this);
    this.handleInactivation = this.handleInactivation.bind(this);

    this.onHandleStartPopupDlg = this.onHandleStartPopupDlg.bind(this);
    this.onHandleConfirmPopupDlg = this.onHandleConfirmPopupDlg.bind(this);
    this.onHandleCancelPopupDlg = this.onHandleCancelPopupDlg.bind(this);
    this.onHandleSuccessPopupDlg = this.onHandleSuccessPopupDlg.bind(this);

    this.handleShowAllCouncils = this.handleShowAllCouncils.bind(this);
    this.handleShowActiveOnly = this.handleShowActiveOnly.bind(this);


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

  componentDidUpdate(prevProps, prevState) {
    const { dataset } = this.props;

    if ((dataset.councils !== prevProps.dataset.councils)) {
      this.setState({ loading: false });
    }
  }

  onHandleStartPopupDlg() {
    if (!this.state.selectedSet.length) {
      return;
    }

    this.setState({
      modalIsOpen: true,
      modalContent: this.modalStartContent,
    });
  }

  async onHandleConfirmPopupDlg() {
    const { updateCouncilStatus } = this.props;
    const { currentTab } = this.state;

    try {
      await updateCouncilStatus({
        ids: this.state.selectedSet,
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
    const { perPage, status } = this.state;
    this.setState(() => ({ modalIsOpen: false, loading: true }));
    this.props.getData(perPage, 1, '', status);
  }

  onHandleCancelPopupDlg() {
    this.setState({
      modalIsOpen: false,
    });
  }

  getRowProps = record => ({
    onClick: this.handelRowClick.bind(this, record),
  })

  handleInactivation() {
    this.modalStartContent = {
      ...this.modalStartContent,
      title: 'Are You Sure?',
      subTitle: 'By clicking DELETE, those council(s) will be deleted.',
      buttonText: 'DELETE',
      bottomTitle: 'Do not Delete',
    };

    this.modalSuccessContent = {
      ...this.modalSuccessContent,
      title: 'Council(s) Deleted',
      subTitle: 'The current council(s) has been deleted',
    };

    this.modalFailContent = {
      ...this.modalFailContent,
      title: 'Council Deleted Failed',
    };

    this.statusText = 'Removed';

    this.onHandleStartPopupDlg();
  }

  handleReactivation(e) {
    this.modalStartContent = {
      ...this.modalStartContent,
      title: 'Are You Sure?',
      subTitle: 'By clicking ACTIVATE, those council(s) will be activated.',
      buttonText: 'ACTIVATE',
      bottomTitle: 'Do not Activate',
    };

    this.modalSuccessContent = {
      ...this.modalSuccessContent,
      title: 'Council(s) Activated',
      subTitle: 'The current council(s) has been Activated',
    };

    this.modalFailContent = {
      ...this.modalFailContent,
      title: 'Council(s) Activated Failed',
    };

    this.statusText = 'Active';

    this.onHandleStartPopupDlg();
  }

  handlePerPageChange(val) {
    const { s, status } = this.state;
    this.setState(() => ({ perPage: val }));
    this.props.getData(val, 1, s, status);
  }

  handlePageChange(page) {
    const { perPage, s, status } = this.state;
    this.setState(() => ({ loading: true }));
    this.props.getData(perPage, page, s, status);
  }

  handleSearch(text) {
    const { perPage, status } = this.state;
    this.setState(() => ({ s: text, loading: true }));
    this.props.getData(perPage, 1, text, status);
  }

  handleShowAllCouncils() {
    const { perPage, s } = this.state;
    this.setState(() => ({ loading: true, status: '' }));
    this.props.getData(perPage, 1, s);
  }

  handleShowActiveOnly() {
    const { perPage, s } = this.state;
    this.setState(() => ({ loading: true, status: 'active' }));
    this.props.getData(perPage, 1, s, 'active');
  }

  handleTableChange(type, {
    page, sizePerPage, filters, sortField, sortOrder,
  }) {
    const { currentTab, perPage, status } = this.state;

    this.setState(() => ({ loading: true }));

    this.props.getData(perPage, page, '', status);
  }

  handleOnSelect(selectedRowKeys) {
    this.setState({
      selectedSet: selectedRowKeys,
    });
  }

  handleUpdateInventory(e) {
    const {
      currentTab, perPage, s,
      status,
    } = this.state;

    this.props.getData(perPage, 1, s, status);
  }

  handleAdd(e) {
    this.props.history.push('/admin/councils/add');
  }

  handelRowClick(record) {
    this.props.history.push(`/admin/councils/${record._id}/view`);
  }

  render() {
    const { dataset } = this.props;
    const {
      currentTab, loading,
      modalIsOpen, modalContent,
    } = this.state;

    const pagination = {
      current: dataset.councils.pagination.currentPage,
      pageSize: dataset.councils.pagination.perPage,
      total: dataset.councils.pagination.totalCount,
    };
    const pageSizes = [
      { label: '10 records', value: 10 },
      { label: '20 records', value: 20 },
      { label: '50 records', value: 50 },
      { label: '100 records', value: 100 },
    ];

    return (
      <React.Fragment>
        <h1 className="p-title">Council</h1>

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
          <PermissionRequired permission="editCouncil">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
            >
              <div>
                <ActionButton
                  title="Delete"
                  spanName="handel-bin"
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
                  title="Add Council"
                  spanName="handel-pin-fulfill"
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

        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              color: '#239dff',
              margin: '20px 0 5px',
            }}
          >
            <div style={{
              display: 'flex',
              fiexDirection: 'row',
            }}
            >
              <div
                className="order-table-expdand-button"
                onClick={this.handleShowAllCouncils}
              >
                All Councils
              </div>
              <div
                className="order-table-expdand-button"
                onClick={this.handleShowActiveOnly}
              >
                Active Only
              </div>
            </div>
          </div>
        </div>

        <div className="w-panel">
          <div className="w-title">
            <h2>Council</h2>
            <SearchBox onSearch={this.handleSearch} />
          </div>

          <Table
            rowSelection={{
              selectedRowKeys: this.state.selectedSet,
              onChange: this.handleOnSelect,
            }}
            className="row-clickable councils-table"
            dataSource={dataset.councils.data}
            columns={columns[currentTab].columnsDef}
            loading={loading}
            rowKey="_id"
            pagination={false}
            onRow={this.getRowProps}
          />
        </div>

        <div className="bottom-toolbar">
          <PageSelector
            pageSizes={pageSizes}
            value={pagination.pageSize}
            onChange={this.handlePerPageChange}
          />
          <Pagination className="w-pagination" {...pagination} onChange={this.handlePageChange} />
        </div>

      </React.Fragment>
    );
  }
}

CouncilsTable.propTypes = {
  history: PropTypes.any.isRequired,
  dataset: PropTypes.any.isRequired,

  getData: PropTypes.func.isRequired,
  updateCouncilStatus: PropTypes.func.isRequired,
};

export default withRouter(CouncilsTable);
