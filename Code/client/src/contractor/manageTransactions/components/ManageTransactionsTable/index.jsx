import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  // CommonBSTable,
  CommonTable,
  InnerSearch,
} from '../../../../common/components';

import styles from './../Styles';
import { columns, columnsSubItems } from './../columnsDef';

import './ManageTransactionsTable.css';

/* eslint no-underscore-dangle: 0 */


class ManageTransactionsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0,
      perPage: 10,

      // selection: [],
      // selectAll: false,
      expandAll: false,
    };

    this.selectedSet = [];
    this.selectedBinSet = [];
    this.checkboxTable = null;

    this.handleTableChange = this.handleTableChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handlePerPageChange = this.handlePerPageChange.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    // this.handleOnSelect = this.handleOnSelect.bind(this);
    // this.handleOnSelectAll = this.handleOnSelectAll.bind(this);
    // this.handleDeletion = this.handleDeletion.bind(this);

    this.handleSelect = this.handleSelect.bind(this);
    this.onHandleExpandAll = this.onHandleExpandAll.bind(this);
    this.onHandleCollapseAll = this.onHandleCollapseAll.bind(this);

    this.handleSelectSub = this.handleSelectSub.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.dataset !== this.props.dataset) {
      this.selectedSet = [];
    }

    return true;
  }

  onHandleExpandAll() {
    this.setState({
      expandAll: true,
    });
  }

  onHandleCollapseAll() {
    this.setState({
      expandAll: false,
    });
  }

  handleTabClick(e, index) {
    const { perPage } = this.state;

    this.setState(() => ({ currentTab: index }));
    this.onHandleCollapseAll();

    this.props.getData(perPage, 1, columns[index].name, columns[index].url);
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

  handlePerPageChange(val) {
    const { s } = this.state;
    this.setState(() => ({ perPage: val }));
    this.props.getData(val, 1, s);
  }

  handleTableChange(type, {
    page, /* , sizePerPage, filters, sortField, sortOrder, */
  }) {
    const { perPage } = this.state;
    this.setState(() => ({ loading: true }));
    this.props.getData(perPage, page);
  }

  handleSelect(selection) {
    this.selectedSet = selection;
  }

  handleSelectSub(newSet, removedSet) {
    if (removedSet) {
      removedSet.forEach((r) => {
        this.selectedBinSet = this.selectedBinSet.filter(f => f !== r);
      });
    }
    if (newSet) {
      newSet.forEach((n) => {
        if (!this.selectedBinSet.includes(n)) {
          this.selectedBinSet.push(n);
        }
      });
    }
  }

  render() {
    const { dataset } = this.props;
    const {
      perPage,
      expandAll,
      currentTab,
    } = this.state;

    return (
      <div>


        <div style={{ ...styles.usersTabBoxOuter, marginTop: 30 }}>
          <div>
            <div>
              <h3>
                Transactions
              </h3>
            </div>

          </div>

        </div>

        <CommonTable
          title={columns[currentTab].label}
          data={dataset}
          columns={columns[currentTab].columnsDef}
          pageSize={perPage}
          isNotCheckboxTable
          // paginationFlag
          // loading={loading}
          isSubTable={false}
          selectRowFlag={false}
          expandAll={expandAll}
          handleSelect={this.handleSelect}
          handleSelectSub={this.handleSelectSub}
          subColumns={columnsSubItems}
          handlePageChange={this.handlePageChange}
          handlePerPageChange={this.handlePerPageChange}
        >
          <div className="manage-transaction-header-control">
            <div className="manage-transaction-header-title">
              {columns[currentTab].label}
            </div>
            <div className="manage-transaction-header-button-group">
              <div
                className="order-table-expdand-button"
                onClick={this.onHandleExpandAll}
              >
                Expand All
              </div>
              <div
                className="order-table-expdand-button"
                onClick={this.onHandleCollapseAll}
              >
                Collapse All
              </div>
            </div>
            <InnerSearch
              setSearch={this.handleSearch}
            />
          </div>
        </CommonTable>
      </div>
    );
  }
}

ManageTransactionsTable.propTypes = {
  // history: PropTypes.any.isRequired,
  dataset: PropTypes.any.isRequired,

  // deleteList: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,
};

export default withRouter(ManageTransactionsTable);
