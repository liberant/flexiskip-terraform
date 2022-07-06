import React from 'react';

import { string, bool, array, number, shape, func, any, node } from 'prop-types';
import BootstrapTable from 'react-bootstrap-table-next';
// import paginationFactory from 'react-bootstrap-table2-paginator';
// import filterFactory, { textFilter, Comparator } from 'react-bootstrap-table2-filter';
import overlayFactory from 'react-bootstrap-table2-overlay';
import Select from 'react-select';

import InnerSearch from './InnerSearch';
import Pagination from './Pagination';

/* eslint react/prop-types: 0 */
/* eslint react/require-default-props: 0 */
/* eslint no-unused-expressions: 0 */


const defaultStyle = {
  tableBox: {
    background: '#fff', margin: '0px 0px', padding: '10px 5px',
  },
  table: {
    borderLeft: '1px solid transparent',
    borderRight: '1px solid transparent',
  },
  title: {
    marginBottom: 20,
    color: '#045196',
    fontWeight: 600,
    fontSize: 24,
  },
  search: {
    position: 'relative',
    float: 'right',
    marginTop: '-24px',
    backgroundColor: '#F6F6F6',
  },
  searchRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  headerBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: 'solid 2px #e2eaf0',
    marginBottom: 20,
  },
  footerBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 15px',
  },
};

const defaultSelectRow = {
  mode: 'checkbox',
  clickToSelect: true,
  style: { backgroundColor: '#c8e6c9' },
};

class RemoteAll extends React.Component {
  constructor(props) {
    super(props);

    this.handleOnSelect = this.handleOnSelect.bind(this);
    this.handleOnSelectAll = this.handleOnSelectAll.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange() {

  }

  handleOnSelect(row, isSelect) {
    this.props.handleOnSelect && this.props.handleOnSelect(row, isSelect);
  }

  handleOnSelectAll(isSelect, rows) {
    this.props.handleOnSelectAll && this.props.handleOnSelectAll(isSelect, rows);
  }


  render() {
    const {
      data, onTableChange, loading,
      columns, selectRow = defaultSelectRow,
      rowEvents, selectRowFlag, keyField,
      options, expandableRow, expandComponent,
      expandColumnOptions,
    } = this.props;
    const selectRowSet = {
      ...defaultSelectRow,
      ...selectRow,
      onSelect: this.handleOnSelect,
      onSelectAll: this.handleOnSelectAll,
    };

    if (selectRowFlag) {
      return (
        <div>
          <BootstrapTable
            options={options}
            expandableRow={expandableRow}
            expandComponent={expandComponent}
            expandColumnOptions={expandColumnOptions}
            remote={{ pagination: false, sort: true, filter: false }}
            keyField={keyField || '_id'}
            data={data}
            columns={columns}
            selectRow={selectRowSet}
            rowEvents={rowEvents}
            // filter={filterFactory()}
            // pagination={paginationFactory({ page, sizePerPage, totalSize })}
            onTableChange={onTableChange}
            onChange={this.onChange}
            striped
            hover
            condensed
            bordered={false}
            loading={loading}
            overlay={overlayFactory({ spinner: true, background: 'rgba(192,192,192,0.3)' })}
            noDataIndication="Dataset is Empty"
          />
        </div>
      );
    }

    return (
      <div>
        <BootstrapTable
          options={options}
          expandableRow={expandableRow}
          expandComponent={expandComponent}
          expandColumnOptions={expandColumnOptions}
          remote={{ pagination: false, sort: true, filter: false }}
          keyField={keyField || '_id'}
          data={data}
          columns={columns}
          rowEvents={rowEvents}
          // filter={filterFactory()}
          // pagination={paginationFactory({ page, sizePerPage, totalSize })}
          onTableChange={onTableChange}
          onChange={this.onChange}
          striped
          hover
          condensed
          bordered={false}
          loading={loading}
          overlay={overlayFactory({ spinner: true, background: 'rgba(192,192,192,0.3)' })}
          noDataIndication="Dataset is Empty"
        />
      </div>
    );
  }
}

RemoteAll.propTypes = {
  data: array.isRequired,
  columns: array.isRequired,
  onTableChange: func.isRequired,
  handleOnSelect: func,
  handleOnSelectAll: func,
  options: any,
  expandableRow: bool,
  expandComponent: node,
  expandColumnOptions: any,
};
RemoteAll.defaultPropTypes = {
  options: {},
  expandableRow: false,
  expandComponent: null,
  expandColumnOptions: {},
};

const CommonBSTable = (props) => {
  const {
    styles, loading, tableData, columns, selectRow, perPage = 10,
    title, children, rowEvents, selectRowFlag = true, keyField,
    options, expandableRow, expandComponent, expandColumnOptions,
    handleTableChange, handlePageChange, handlePerPageChange,
    handleOnSelect, handleOnSelectAll, handleSearch,
  } = props;

  const tmpTableData = {
    data: (tableData && tableData.data) ? tableData.data : [],
    pagination: {
      currentPage: (tableData && tableData.pagination && tableData.pagination.currentPage)
        ? tableData.pagination.currentPage : 1,
      perPage: (tableData && tableData.pagination && tableData.pagination.perPage)
        ? tableData.pagination.perPage : 10,
      pageCount: (tableData && tableData.pagination && tableData.pagination.pageCount)
        ? tableData.pagination.pageCount : 1,
      totalCount: (tableData && tableData.pagination && tableData.pagination.totalCount)
        ? tableData.pagination.totalCount : 1,
    },
  };

  return (
    <div>
      <div style={(styles && styles.tableBox) ? styles.tableBox : defaultStyle.tableBox}>
        <div className="common-table-box">
          <div style={(styles && styles.headerBox) ?
              { ...defaultStyle.headerBox, ...styles.headerBox } :
              defaultStyle.headerBox
            }
          >
            <div className="text-left " style={(styles && styles.title) ? { ...defaultStyle.title, ...styles.title } : defaultStyle.title}>
              {title}
            </div>
            <div id="search-box" style={(styles && styles.search) ? { ...defaultStyle.search, ...styles.search } : defaultStyle.search} />
            <div style={(styles && styles.searchRow) ?
              { ...defaultStyle.searchRow, ...styles.searchRow } :
              defaultStyle.searchRow}
            >
              <InnerSearch setSearch={handleSearch} />
              {children}
            </div>
          </div>
        </div>
        <RemoteAll
          options={options}
          expandableRow={expandableRow}
          expandComponent={expandComponent}
          expandColumnOptions={expandColumnOptions}
          keyField={keyField}
          loading={loading}
          data={tmpTableData.data}
          columns={columns}
          selectRow={selectRow}
          selectRowFlag={selectRowFlag}
          page={tmpTableData.pagination.currentPage}
          sizePerPage={tmpTableData.pagination.perPage}
          totalSize={tmpTableData.pagination.totalCount}
          rowEvents={rowEvents}
          onTableChange={handleTableChange}
          handleOnSelect={handleOnSelect}
          handleOnSelectAll={handleOnSelectAll}
        />
      </div>
      {(tmpTableData.pagination.totalCount > tmpTableData.pagination.perPage) ? (
        <div style={(styles && styles.footerBox) ?
          { ...defaultStyle.footerBox, ...styles.footerBox } :
          defaultStyle.footerBox
        }
        >
          <div style={{ display: 'flex' }}>
            <span style={{ lineHeight: '36px', fontSize: 16, paddingRight: 15 }}>Show</span>
            <Select
              simpleValue
              className="page-select-box"
              name="perPage"
              placeholder="10 records"
              clearable={false}
              value={perPage || 10}
              options={[
                { value: 10, label: '10 records' },
                { value: 20, label: '20 records' },
                { value: 50, label: '50 records' },
                { value: 100, label: '100 records' },
              ]}
              onChange={handlePerPageChange}
            />
          </div>
          <div style={{ textAlign: 'right' }}>
            <Pagination
              page={tmpTableData.pagination.currentPage}
              pageCount={tmpTableData.pagination.pageCount}
              onChange={handlePageChange}
            />
          </div>
        </div>
      ) : null }

    </div>

  );
};

CommonBSTable.propTypes = {
  styles: shape({
    tableBox: any,
    title: any,
    search: any,
    table: any,
  }),
  title: string,
  keyField: string,
  loading: bool.isRequired,
  columns: array.isRequired,
  selectRow: shape({
    mode: string,
    clickToSelect: bool,
    style: any,
  }),
  tableData: shape({
    data: array,
    pagination: shape({
      currentPage: number,
      perPage: number,
      pageCount: number,
      totalCount: number,
    }),
  }),
  handlePageChange: func.isRequired,
  handleTableChange: func.isRequired,
  handlePerPageChange: func.isRequired,
  handleOnSelect: func,
  handleOnSelectAll: func,
  handleSearch: func,
};
CommonBSTable.defaultPropTypes = {
  tableData: {
    data: [],
    pagination: {
      currentPage: 1,
      perPage: 10,
      pageCount: 1,
      totalCount: 1,
    },
  },
  handleSearch: null,
};

export default CommonBSTable;
