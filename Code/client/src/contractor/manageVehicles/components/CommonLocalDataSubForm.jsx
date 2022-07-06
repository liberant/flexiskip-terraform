import React from 'react';
import { any, array, bool, func, shape, string } from 'prop-types';

/* eslint no-underscore-dangle: 0 */

import { CommonBSTable } from '../../../common/components';

import styles from './Styles';

class CommonLocalDataSubForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: props.data.slice(0, 10),
      orginData: props.data,
      pagination: {
        currentPage: 1,
        pageCount: Math.ceil(props.data.length / 10),
        perPage: 10,
        totalCount: props.data.length,
      },
    };

    this.selectedSet = [];

    this.handleTableChange = this.handleTableChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handlePerPageChange = this.handlePerPageChange.bind(this);
    this.handleOnSelect = this.handleOnSelect.bind(this);
    this.handleOnSelectAll = this.handleOnSelectAll.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if ((nextProps.data === this.props.data) && (nextState.data === this.state.data)) {
      return false;
    }
    return true;
  }

  componentWillUnmount() {
    const { handleSelect } = this.props;

    if (handleSelect) {
      handleSelect([], this.selectedSet);
    }
  }

  handlePerPageChange(val) {
    const tmpPagination = this.state.pagination;
    tmpPagination.perPage = val;
    tmpPagination.pageCount = Math.ceil(tmpPagination.totalCount / val);
    const tmpData = this.state.orginData.slice(0, val);

    this.setState(() => ({ pagination: tmpPagination, data: tmpData }));
  }

  handleTableChange() {
    // const { currentTab, perPage } = this.state;

    this.setState(() => ({ loading: true }));

    // this.props.getData(perPage, page, columns[currentTab].name, columns[currentTab].url);
  }

  handlePageChange(page) {
    const { pagination } = this.state;
    const tmpPagination = pagination;
    tmpPagination.currentPage = page;
    const tmpData = this.state.orginData.slice(
      pagination.perPage * (page - 1),
      (pagination.perPage * (page - 1)) + pagination.perPage,
    );

    this.setState(() => ({ pagination: tmpPagination, data: tmpData }));

    // this.props.getData(perPage, page, columns[currentTab].name, columns[currentTab].url);
  }

  handleOnSelect(row, isSelect) {
    const { handleSelect } = this.props;
    if (isSelect) {
      this.selectedSet.push(row._id);
      if (handleSelect) {
        handleSelect([row._id], []);
      }
    } else {
      this.selectedSet = this.selectedSet.filter(x => x !== row._id);
      if (handleSelect) {
        handleSelect([], [row._id]);
      }
    }
  }

  handleOnSelectAll(isSelect, rows) {
    const { handleSelect } = this.props;

    const ids = rows.map(r => r._id);
    if (isSelect) {
      this.selectedSet = ids;
      if (handleSelect) {
        handleSelect(ids, []);
      }
    } else {
      if (handleSelect) {
        handleSelect([], this.selectedSet);
      }
      this.selectedSet = [];
    }
  }

  render() {
    const { columnsDef, selectRow, selectRowFlag } = this.props;
    const {
      data,
      loading,
      pagination,
    } = this.state;

    const users = {
      data,
      pagination,
    };

    return (
      <div>
        <CommonBSTable
          styles={{ ...styles, headerBox: { display: 'none' } }}
          title=""
          loading={loading}
          perPage={pagination.perPage}
          tableData={users}
          columns={columnsDef}
          selectRow={selectRow}
          selectRowFlag={selectRowFlag}
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

CommonLocalDataSubForm.propTypes = {
  data: array,
  columnsDef: any.isRequired,
  selectRow: shape({
    mode: string,
    clickToSelect: bool,
    style: any,
  }),
  selectRowFlag: bool,
  handleSelect: func,
};

CommonLocalDataSubForm.defaultProps = {
  data: [],
  selectRow: {},
  selectRowFlag: true,
  handleSelect: null,
};

export default CommonLocalDataSubForm;
