import React from 'react';
import { any, array, bool, func, shape, string } from 'prop-types';

/* eslint no-underscore-dangle: 0 */

import { CommonBSTable } from './index';

const styles = {
  tableBox: {
    background: '#fff', margin: '0px 15px', padding: '0px 15px',
  },
  table: {
    borderLeft: '1px solid transparent',
    borderRight: '1px solid transparent',
    borderTop: '1px solid transparent',
  },

  title: {
    color: '#239DFF',
    fontWeight: 400,
  },

  pageTitle: {
    color: '#1D415D',
  },

  pageTitleBox: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '30px',
  },

  header: {
    color: '#239DFF',
    fontSize: 13,
    fontWeight: 400,
  },
  checkbox: {
    fontSize: 20,
    fontWeight: 400,
  },

  cell: {
    cursor: 'pointer',
    textAlign: 'center',
  },

  truncate: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  usersTabBoxOuter: {
    padding: '10px 15px',
  },

  usersTabBox: {
    borderBottom: '0px solid black',
  },

  usersTab: {
    display: 'inline-block',
    lineHeight: '14px',
    fontSize: 14,
    padding: '10px 15px',
    border: '1px solid #DCE1E6',
    color: '#666666',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    marginRight: 10,
    borderRadius: '3px',
    height: 34,
    width: 180,
    textAlign: 'center',
  },
  usersTabActive: {
    color: '#FFFFFF',
    backgroundColor: '#239DFF',
  },
  deleteButton: {
    minWidth: 100,
    backgroundColor: '#F06666',
    color: '#FFFFFF',
    border: '1px solid #F06666',
    height: 30,
    fontSize: 18,
    borderRadius: 3,
  },
  deleteIcon: {
    marginRight: 5,
  },
  searchRow: {
    display: 'initial',
  },

  actionReactivateButton: {
    display: 'inline-block',
    lineHeight: '26px',
    fontSize: 14,
    padding: '10px 15px',
    border: '0px solid #72C814',
    color: '#F9FCFE',
    backgroundColor: '#72C814',
    cursor: 'pointer',
    marginRight: 10,
    borderRadius: '3px',
  },
  actionSuspendButton: {
    display: 'inline-block',
    lineHeight: '26px',
    fontSize: 14,
    padding: '10px 15px',
    border: '0px solid #EEBF15',
    color: '#F9FCFE',
    backgroundColor: '#EEBF15',
    cursor: 'pointer',
    marginRight: 10,
    borderRadius: '3px',
  },
  actionDeleteButton: {
    display: 'inline-block',
    lineHeight: '26px',
    fontSize: 14,
    padding: '10px 15px',
    border: '0px solid #F06666',
    color: '#F9FCFE',
    backgroundColor: '#F06666',
    cursor: 'pointer',
    marginRight: 10,
    borderRadius: '3px',
  },
  actionAddButton: {
    display: 'inline-block',
    lineHeight: '26px',
    fontSize: 14,
    padding: '10px 15px',
    border: '0px solid #239DFF',
    color: '#FFFFFF',
    backgroundColor: '#239DFF',
    cursor: 'pointer',
    marginRight: 10,
    borderRadius: '3px',
  },
  buttonText: {
    paddingLeft: 5,
  },
  cellCursor: {
    cursor: 'pointer',
  },

  showMe: {
    display: 'inline-block',
  },
  hideMe: {
    display: 'none',
  },
};

class CommonLocalDataTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: (props && props.data) ? props.data.slice(0, 10) : [],
      orginData: (props && props.data) ? props.data : [],
      pagination: {
        currentPage: 1,
        pageCount: (props && props.data && props.data.length)
          ? Math.ceil(props.data.length / 10) : 1,
        perPage: 10,
        totalCount: (props && props.data && props.data.length) ? props.data.length : 1,
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
    if (nextProps.data !== this.props.data) {
      this.setState({
        data: nextProps.data,
      });
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
    const { handleSelect, handleGetSelected } = this.props;
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

    if (handleGetSelected) {
      handleGetSelected(this.selectedSet);
    }
  }

  handleOnSelectAll(isSelect, rows) {
    const { handleSelect, handleGetSelected } = this.props;

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

    if (handleGetSelected) {
      handleGetSelected(this.selectedSet);
    }
  }

  render() {
    const {
      columnsDef,
      rowEvents,
      selectRow,
      selectRowFlag,
      stylesExtra,
    } = this.props;
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
          styles={{
            ...styles,
            headerBox: { display: 'none' },
            padding:0,
            ...stylesExtra,
          }}
          title=""
          loading={loading}
          perPage={pagination.perPage}
          tableData={users}
          columns={columnsDef}
          rowEvents={rowEvents}
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

CommonLocalDataTable.propTypes = {
  data: array,
  columnsDef: any.isRequired,
  selectRow: shape({
    mode: string,
    clickToSelect: bool,
    style: any,
  }),
  selectRowFlag: bool,
  handleSelect: func,
  handleGetSelected: func,
  stylesExtra: any,
  rowEvents: any,
};

CommonLocalDataTable.defaultProps = {
  data: [],
  selectRow: {},
  selectRowFlag: true,
  handleSelect: null,
  handleGetSelected: null,
  stylesExtra: {},
  rowEvents: {},
};

export default CommonLocalDataTable;
