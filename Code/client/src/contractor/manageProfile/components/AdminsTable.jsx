import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CommonBSTable } from '../../../common/components';
import styles from './Styles';
import { columns } from './columnsDef';
// import { UserTypeEnum } from '../constants/userTypes';

/* eslint no-underscore-dangle: 0 */
/* eslint react/no-did-update-set-state: 0 */


class AdminsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0,
      loading: false,
      perPage: 10,
    };

    this.selectedSet = [];

    this.handleTabClick = this.handleTabClick.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handlePerPageChange = this.handlePerPageChange.bind(this);
    this.handleOnSelect = this.handleOnSelect.bind(this);
    this.handleOnSelectAll = this.handleOnSelectAll.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.selectedSet = [];
      const { handleGetSelected } = this.props;
      if (handleGetSelected) {
        handleGetSelected(this.selectedSet);
      }
    }

    return true;
  }

  // componentDidUpdate(prevProps) {
  //   const { accounts } = this.props;

  //   if ((accounts.customers !== prevProps.accounts.customers)) {
  //     this.setState({ loading: false });
  //   }
  // }

  handlePerPageChange(val) {
    const { currentTab } = this.state;

    this.setState(() => ({ perPage: val }));
    this.props.getData(val, 1, columns[currentTab].name, columns[currentTab].url);
  }

  handleTabClick(e, index) {
    const { perPage } = this.state;

    this.setState(() => ({ currentTab: index }));

    this.props.getData(perPage, 1, columns[index].name, columns[index].url);
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
    const { handleGetSelected } = this.props;

    if (isSelect) {
      this.selectedSet.push(row._id);
    } else {
      this.selectedSet = this.selectedSet.filter(x => x !== row._id);
    }
    if (handleGetSelected) {
      handleGetSelected(this.selectedSet);
    }
  }

  handleOnSelectAll(isSelect, rows) {
    const { handleGetSelected } = this.props;
    const ids = rows.map(r => r._id);
    if (isSelect) {
      this.selectedSet = ids;
    } else {
      this.selectedSet = [];
    }

    if (handleGetSelected) {
      handleGetSelected(this.selectedSet);
    }
  }

  render() {
    const { data, rowEvents, columnsDef } = this.props;
    const {
      loading, perPage,
    } = this.state;

    return (
      <div>
        <CommonBSTable
          styles={styles}
          loading={loading}
          perPage={perPage}
          tableData={data}
          columns={columnsDef}
          rowEvents={rowEvents}
          paginationFlag
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

AdminsTable.propTypes = {
  columnsDef: PropTypes.any.isRequired,
  rowEvents: PropTypes.any.isRequired,
  getData: PropTypes.func.isRequired,
  data: PropTypes.any.isRequired,
  handleGetSelected: PropTypes.func,
};

AdminsTable.defaultProps = {
  handleGetSelected: null,
};

export default AdminsTable;
