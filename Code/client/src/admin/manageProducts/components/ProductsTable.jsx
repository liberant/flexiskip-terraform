import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  CommonBSTable,
  ActionButton,
  SimpleNewConfirmDlg,
} from '../../../common/components';
import styles from './Styles';
import { columns } from './columnsDef';
import PermissionRequired from '../../../common/hocs/PermissionRequired';
import { TIME_OUT_DEBOUNCE } from '../../../common/constants/params';
/* eslint no-underscore-dangle: 0 */
/* eslint react/no-did-update-set-state: 0 */


class ProductsTable extends Component {
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
    };

    this.selectedSet = [];

    this.handleTableChange = this.handleTableChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handlePerPageChange = this.handlePerPageChange.bind(this);
    this.handleOnSelect = this.handleOnSelect.bind(this);
    this.handleOnSelectAll = this.handleOnSelectAll.bind(this);
    this.handleUpdateInventory = this.handleUpdateInventory.bind(this);
    this.handleAdd = this.handleAdd.bind(this);

    this.onHandleDeleteRequest = this.onHandleDeleteRequest.bind(this);
    this.onHandleConfirmDeleteRequest = this.onHandleConfirmDeleteRequest.bind(this);
    this.onHandleCancelDeleteRequest = this.onHandleCancelDeleteRequest.bind(this);
    this.onHandleDeleteRequestSuccess = this.onHandleDeleteRequestSuccess.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { dataset } = this.props;

    if ((dataset.products !== prevProps.dataset.products)) {
      this.setState({ loading: false });
    }
  }

  onHandleDeleteRequest() {
    if (!this.selectedSet.length) {
      return;
    }

    const tmpModalContent = {
      title: 'Are You Sure?',
      subTitle: 'By clicking DELETE, those product(s) will be removed.',
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
    });
  }

  async onHandleConfirmDeleteRequest() {
    const { currentTab } = this.state;
    try {
      await this.props.deleteProductsList({
        ids: this.selectedSet,
        url: columns[currentTab].url,
        status: 'Removed',
      });

      const tmpModalContent = {
        title: 'Product(s) Deleted',
        subTitle: 'The current product(s) has been deleted',
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
        title: 'Product(s) Deleted Failed',
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
    this.handleUpdateInventory();
  }

  onHandleCancelDeleteRequest() {
    this.setState({
      deleteModalFlag: false,
      modalIsOpen: false,
    });
  }

  handleTableChange(type, { page }) {
    const { perPage } = this.state;
    this.setState(() => ({ loading: true }));
    this.props.getData(perPage, page);
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
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.props.getData(perPage, 1, s), TIME_OUT_DEBOUNCE);
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

  handleUpdateInventory() {
    const { perPage } = this.state;
    this.props.getData(perPage, 1);
  }

  handleAdd() {
    this.props.history.push('/admin/manage-products-add');
  }

  render() {
    const { dataset } = this.props;
    const {
      currentTab, loading, perPage,
      modalIsOpen, modalContent, deleteModalFlag,
    } = this.state;
    const rowEvents = {
      onClick: (e, row) => {
        if (!((e.target.tagName === 'TD'
                && e.target.firstChild
                && e.target.firstChild.nodeName === 'INPUT'
        ) || (e.target.tagName === 'INPUT'))) {
          this.props.history.push(`/admin/manage-products-edit/${row._id}`);
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

        <div style={{ ...styles.usersTabBoxOuter, marginTop: 30 }}>
          <div style={styles.pageTitleBox}>
            <div>
              <h3 style={{ ...styles.pageTitle }}>
                Product Management
              </h3>
            </div>

          </div>
          <PermissionRequired permission="editProduct">
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
                  handleClick={this.onHandleDeleteRequest}
                />
              </div>
              <div>
                <ActionButton
                  title="Add Product"
                  spanName="handel-product"
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
          tableData={dataset.products}
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

ProductsTable.propTypes = {
  history: PropTypes.any.isRequired,
  dataset: PropTypes.any.isRequired,
  deleteProductsList: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,
};

export default withRouter(ProductsTable);
