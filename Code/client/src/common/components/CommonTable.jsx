import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import PropTypes from 'prop-types';

import checkboxHOC from 'react-table/lib/hoc/selectTable';

import Select from 'react-select';

import CommonLocalDataTable from './CommonLocalDataTable';
import Pagination from './Pagination';


/* eslint react/prop-types: 0 */
/* eslint react/require-default-props: 0 */
/* eslint no-underscore-dangle: 0 */
/* eslint react/no-did-update-set-state: 0 */
/* eslint no-return-assign: 0 */
/* eslint no-unused-vars: 0 */


const defaultStyle = {
  tableBox: {
    background: '#fff',
    margin: '30px 0px 0px',
    padding: '10px 10px',
    borderRadius: '3px',
  },
  table: {
    borderLeft: '1px solid transparent',
    borderRight: '1px solid transparent',
  },
  title: { marginBottom: 20, color: '#045196' },
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
  footerBox: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 15,
    color: '#666666',
  },
};

const EmptyComponent = () => (<div />);

const CheckboxTable = checkboxHOC(ReactTable);

/* eslint no-unused-expressions:0 */

class CommonTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: [],
      selectAll: false,
      expanded: [],
      remainingTimeSet: [],
    };
    this.checkboxTable = null;
    this.updateRemainingTime = this.updateRemainingTime.bind(this);
    // this.toggleSelection = this.toggleSelection.bind(this);
    // this.toggleAll = this.toggleAll.bind(this);
    // this.isSelected = this.isSelected.bind(this);
  }

  componentDidMount() {
    this.timer = setInterval(this.updateRemainingTime, 1000);
  }

  componentDidUpdate(prevProps) {
    const tmpExpanded = [];
    const { data } = this.props;
    if (prevProps.expandAll !== this.props.expandAll) {
      if (this.props.expandAll) {
        if (data.data && data.data.length > 0) {
          tmpExpanded.length = data.data.length;
          tmpExpanded.fill(true);
        }
      } else {
        tmpExpanded.length = data.data.length;
        tmpExpanded.fill(false);
      }
      this.setState({
        expanded: tmpExpanded,
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  onExpandedChange = (expanded) => {
    this.setState({
      expanded,
    });
  }

  getTdProps = (state, rowInfo, column, instance) => ({
    onClick: (e, handleOriginal) => {
      if (column.id === 'expandedRow') {
        const tmpExpanded = this.state.expanded;
        if (tmpExpanded[rowInfo.index]) {
          tmpExpanded[rowInfo.index] = false;
          e.target.innerHTML = 'Details <i class="fa fa-caret-down" />';
        } else {
          tmpExpanded[rowInfo.index] = {};
          e.target.innerHTML = 'Collapse <i class="fa fa-caret-up" />';
        }

        this.setState({
          expanded: tmpExpanded,
        });
      }

      // IMPORTANT! React-Table uses onClick internally to trigger
      // events like expanding SubComponents and pivots.
      // By default a custom 'onClick' handler will override this functionality.
      // If you want to fire the original onClick handler, call the
      // 'handleOriginal' function.
      if (handleOriginal) {
        handleOriginal();
      }
    },
  })

  updateRemainingTime() {
    const { remainingTimeSet } = this.state;
    const { data } = this.props;
    let newRemainingTime = [];
    if (remainingTimeSet.length < data.data.length) {
      newRemainingTime = data.data.map(d => d.remainingTime);
    } else {
      newRemainingTime = remainingTimeSet.map(t => t - 1000);
    }
    this.setState({ remainingTimeSet: newRemainingTime });
  }

  toggleSelection = (key, shift, row) => {
    /*
      Implementation of how to manage the selection state is up to the developer.
      This implementation uses an array stored in the component state.
      Other implementations could use object keys, a Javascript Set, or Redux... etc.
    */
    // start off with the existing state
    let selection = [...this.state.selection];
    const keyIndex = selection.indexOf(key);
    // check to see if the key exists
    if (keyIndex >= 0) {
      // it does exist so we will remove it using destructing
      selection = [
        ...selection.slice(0, keyIndex),
        ...selection.slice(keyIndex + 1),
      ];
    } else {
      // it does not exist so add it
      selection.push(key);
    }
    // update the state
    this.setState({ selection });
    this.props.handleSelect && this.props.handleSelect(selection);
  };

  toggleAll = () => {
    /*
      'toggleAll' is a tricky concept with any filterable table
      do you just select ALL the records that are in your data?
      OR
      do you only select ALL the records that are in the current filtered data?

      The latter makes more sense because 'selection' is a visual thing for the user.
      This is especially true if you are going to implement a set of external functions
      that act on the selected information (you would not want to DELETE the wrong thing!).

      So, to that end, access to the internals of ReactTable are required to get what is
      currently visible in the table (either on the current page or any other page).

      The HOC provides a method call 'getWrappedInstance' to get a ref to the wrapped
      ReactTable and then get the internal state and the 'sortedData'.
      That can then be iterrated to get all the currently visible records and set
      the selection state.
    */
    const selectAll = !this.state.selectAll;
    const selection = [];
    if (selectAll) {
      // we need to get at the internals of ReactTable
      const wrappedInstance = this.checkboxTable.getWrappedInstance();
      // the 'sortedData' property contains the currently accessible
      // records based on the filter and sort
      const currentRecords = wrappedInstance.getResolvedState().sortedData;
      // we just push all the IDs onto the selection array
      currentRecords.forEach((item) => {
        selection.push(item._original._id);
      });
    }
    this.setState({ selectAll, selection });
    this.props.handleSelect && this.props.handleSelect(selection);
  };

  isSelected = key => this.state.selection.includes(key);

  renderSubComponent = (row) => {
    const { subColumns, handleSelectSub, selectRowFlag } = this.props;
    const subArray = (row && row.original && row.original.bins) ? row.original.bins : [];

    return (
      <div style={{ padding: '20px', backgroundColor: '#f6f6f6' }}>
        <CommonLocalDataTable
          selectRowFlag={selectRowFlag}
          data={subArray}
          columnsDef={subColumns}
          handleSelect={handleSelectSub}
        />
      </div>
    );
  }

  render() {
    const { toggleSelection, toggleAll, isSelected } = this;
    const {
      styles, children, noSubTable,
      data, columns, pageSize, isNotCheckboxTable,
      handlePageChange, handlePerPageChange,
      // getTrProps,
      loading,
    } = this.props;
    const {
      selectAll, expanded, remainingTimeSet,
    } = this.state;

    const dataSet = data.data.map((d, i) => {
      const tmp = Object.assign({}, d);
      tmp.remainingTime = remainingTimeSet[i];
      return tmp;
    });

    const checkboxProps = !isNotCheckboxTable ? {
      selectAll,
      isSelected,
      toggleSelection,
      toggleAll,
      selectType: 'checkbox',
      getTrProps: (s, r) => {
        // someone asked for an example of a background color change
        // here it is...
        if (!r) {
          return {};
        }
        const selected = this.isSelected(r.original._id);
        return {
          style: {
            backgroundColor: selected ? '#C8E6C9' : 'inherit',
            // color: selected ? 'red' : 'inherit',
          },
        };
      },
    } : {};

    // let { paginationFlag } = this.props;
    // if (!paginationFlag) {
    //   paginationFlag = false;
    // }

    return (
      <div>
        <div style={(styles && styles.tableBox) ? styles.tableBox : defaultStyle.tableBox}>
          <div style={defaultStyle.title}>
            {children}
          </div>
          {
            !isNotCheckboxTable ? (
              <CheckboxTable
                ref={r => (this.checkboxTable = r)}
                style={
                  (styles && styles.table) ? {
                    ...defaultStyle.table,
                    ...styles.table,
                  } : defaultStyle.table
                }
                className="-striped -highlight"
                data={dataSet || []}
                columns={columns}
                // pageSize={pageSize}
                defaultPageSize={pageSize || 10}
                pageSize={pageSize || 10}
                resizable={false}
                showPageSizeOptions={false}
                // getTrProps={getTrProps}
                showPagination={false}
                PaginationComponent={EmptyComponent}
                {
                ...checkboxProps
                }
                SubComponent={!noSubTable ? this.renderSubComponent : null}
                getTdProps={this.getTdProps}
                onExpandedChange={this.onExpandedChange}
                expanded={expanded}
                minRows={1}
                noDataText="Dataset is Empty"
              />
            ) : (
              <ReactTable
                style={
                  (styles && styles.table) ? {
                    ...defaultStyle.table,
                    ...styles.table,
                  } : defaultStyle.table
                }
                loading={loading}
                className="-striped -highlight"
                data={dataSet || []}
                columns={columns}
                // pageSize={pageSize}
                defaultPageSize={pageSize || 10}
                pageSize={pageSize || 10}
                resizable={false}
                showPageSizeOptions={false}
                // getTrProps={getTrProps}
                showPagination={false}
                PaginationComponent={EmptyComponent}
                SubComponent={!noSubTable ? this.renderSubComponent : null}
                getTdProps={this.getTdProps}
                onExpandedChange={this.onExpandedChange}
                expanded={expanded}
                minRows={1}
                noDataText="Dataset is Empty"
              />
            )
          }

        </div>
        {data.pagination && (
          <div>
            {(
              <div style={(styles && styles.footerBox) ?
                { ...defaultStyle.footerBox, ...styles.footerBox } :
                defaultStyle.footerBox
              }
              >
                <div style={{ display: 'block', marginTop: 15 }}>
                  <span
                    style={{
                      lineHeight: '36px',
                      fontSize: 16,
                      paddingRight: 15,
                      display: 'inline-block',
                      position: 'relative',
                      float: 'left',
                    }}
                  >
                    Show
                  </span>
                  <Select
                    simpleValue
                    className="page-select-box"
                    name="perPage"
                    placeholder="10 records"
                    clearable={false}
                    value={pageSize}
                    options={[
                      { value: 10, label: '10 records' },
                      { value: 20, label: '20 records' },
                      { value: 25, label: '25 records' },
                      { value: 50, label: '50 records' },
                      { value: 100, label: '100 records' },
                    ]}
                    onChange={handlePerPageChange}
                  />
                </div>

                {
                  (data.pagination.totalCount > data.pagination.perPage) ? (
                    <div>
                      <Pagination
                        page={data.pagination.currentPage}
                        pageCount={data.pagination.pageCount}
                        onChange={handlePageChange}
                      />
                    </div>) : null
                }
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

CommonTable.propTypes = {
  styles: PropTypes.shape({
    tableBox: PropTypes.any,
    title: PropTypes.any,
    search: PropTypes.any,
    table: PropTypes.any,
  }),
  title: PropTypes.string,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  data: PropTypes.any,
  paginationFlag: PropTypes.bool,
  pageSize: PropTypes.number,
  loading: PropTypes.bool,
  expandAll: PropTypes.bool,
  selectRowFlag: PropTypes.bool,
  isNotCheckboxTable: PropTypes.bool,
  noSubTable: PropTypes.bool,

  getTrProps: PropTypes.func,
  handleSelect: PropTypes.func,
  handleSelectSub: PropTypes.func,
  handlePageChange: PropTypes.func,
  handlePerPageChange: PropTypes.func,
};

CommonTable.defaultProps = {
  selectRowFlag: true,
  isNotCheckboxTable: false,
  noSubTable: false,
};

export default CommonTable;
