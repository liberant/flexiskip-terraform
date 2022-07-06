import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import shortid from 'shortid';

import {
  // CommonBSTable,
  CommonTable,
  InnerSearch,
  DownloadButton,
} from '../../../common/components';

import styles from './Styles';
import { columns, columnsSubItems } from './columnsDef';
import Calendar from '../../../common/components/Calendar';
import { getEndOfDay, getStartOfDay } from '../../../common/utils';

/* eslint no-underscore-dangle: 0 */
/* eslint react/no-did-update-set-state: 0 */

class ManageTransactionsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0,
      perPage: 10,

      // selection: [],
      // selectAll: false,
      expandAll: false,
      search: '',
    };

    this.selectedSet = [];
    this.selectedBinSet = [];
    this.checkboxTable = null;
    this.startDate = '';
    this.endDate = '';

    this.handleTableChange = this.handleTableChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handlePerPageChange = this.handlePerPageChange.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
    // this.handleOnSelect = this.handleOnSelect.bind(this);
    // this.handleOnSelectAll = this.handleOnSelectAll.bind(this);
    // this.handleDeletion = this.handleDeletion.bind(this);

    this.handleSelect = this.handleSelect.bind(this);
    this.onHandleExpandAll = this.onHandleExpandAll.bind(this);
    this.onHandleCollapseAll = this.onHandleCollapseAll.bind(this);

    this.handleSelectSub = this.handleSelectSub.bind(this);
    this.handleCalendarChange = this.handleCalendarChange.bind(this);

    this.handleSearch = this.handleSearch.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.dataset !== this.props.dataset) {
      this.selectedSet = [];
    }

    return true;
  }

  componentDidUpdate(prevProps) {
    const { dataset } = this.props;

    if ((dataset !== prevProps.dataset)) {
      this.setState({ loading: false });
    }
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

  get getDownloadURL() {
    const { currentTab, search } = this.state;

    const from = this.startDate ? this.startDate : moment().subtract(5, 'months').startOf('month');
    const to = this.endDate ? this.endDate : moment().endOf('month');

    const paramStartDate = `&startDate=${encodeURIComponent(getStartOfDay(from))}`;
    const paramEndDate = `&endDate=${encodeURIComponent(getEndOfDay(to))}`;
    const paramSearch = `&s=${search || ''}`;

    return `/admin/transactions-csv?&type=${columns[currentTab].name}${paramStartDate}${paramEndDate}${paramSearch}`;
  }

  handleTabClick(e, index) {
    const { perPage } = this.state;
    const { startDate, endDate } = this;

    this.setState(() => ({ currentTab: index, search: '' }));
    this.onHandleCollapseAll();

    this.props.getData(perPage, 1, columns[index].name, columns[index].url, startDate, endDate);
  }

  handlePerPageChange(val) {
    const { currentTab, search } = this.state;
    const { startDate, endDate } = this;

    this.setState(() => ({ perPage: val }));
    this.props.getData(
      val, 1, columns[currentTab].name, columns[currentTab].url,
      startDate, endDate, search,
    );
  }

  handleTableChange(type, {
    page, /* , sizePerPage, filters, sortField, sortOrder, */
  }) {
    const { currentTab, perPage, search } = this.state;
    const { startDate, endDate } = this;

    this.setState(() => ({ loading: true }));

    this.props.getData(
      perPage, page, columns[currentTab].name, columns[currentTab].url,
      startDate, endDate, search,
    );
  }

  handlePageChange(page) {
    const { currentTab, perPage, search } = this.state;
    const { startDate, endDate } = this;

    this.setState(() => ({ loading: true }));

    this.props.getData(
      perPage, page, columns[currentTab].name, columns[currentTab].url,
      startDate, endDate, search,
    );
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

  handleCalendarChange(data) {
    const { startDate, endDate } = data;
    if (!startDate || !endDate) {
      return;
    }

    const { currentTab, perPage, search } = this.state;

    this.startDate = startDate.substr(0, 10);
    this.endDate = endDate.substr(0, 10);

    const { filterData } = this.props;
    if (filterData) {
      this.setState(() => ({ loading: true }));
      filterData({
        perPage,
        page: 1,
        name: columns[currentTab].name,
        startDate: this.startDate,
        endDate: this.endDate,
        search: search || '',
      });
    }
  }

  handleSearch(e) {
    const { currentTab, perPage } = this.state;
    this.setState({ search: e.target.value });
    this.props.getData(
      perPage, 1,
      columns[currentTab].name,
      columns[currentTab].url,
      this.startDate,
      this.endDate,
      e.target.value,
    );
  }

  render() {
    const { dataset } = this.props;
    const {
      perPage,
      expandAll,
      currentTab,
      loading,
    } = this.state;
    const stylesActive = {
      ...styles.usersTab,
      ...styles.usersTabActive,
    };

    return (
      <div>
        <div style={{ ...styles.usersTabBoxOuter, marginTop: 30 }}>
          <div style={styles.pageTitleBox}>
            <div>
              <h3 style={{ ...styles.pageTitle }}>
                Transactions
              </h3>
            </div>

          </div>

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
            <DownloadButton
              containerStyle={styles.downloadButton}
              label="Download.CSV"
              href={this.getDownloadURL}
            />
          </div>
        </div>

        <CommonTable
          title={columns[currentTab].label}
          data={dataset}
          columns={columns[currentTab].columnsDef}
          pageSize={perPage}
          isNotCheckboxTable
          isSubTable={false}
          selectRowFlag={false}
          noSubTable
          expandAll={expandAll}
          handleSelect={this.handleSelect}
          handleSelectSub={this.handleSelectSub}
          subColumns={columnsSubItems}
          handlePageChange={this.handlePageChange}
          handlePerPageChange={this.handlePerPageChange}
          loading={loading}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              color: '#239dff',
              margin: '10px 24px',
            }}
            >
              <div style={{
                fontSize: 20,
                marginRight: 20,
              }}
              >
                {columns[currentTab].label}
              </div>
            </div>
            <div style={{ display: 'flex' }}>
              <Calendar
                filterData={this.handleCalendarChange}
              />
              <InnerSearch
                mainBoxStyles={{
                  margin: '15px 26px',
                }}
                setSearch={this.handleSearch}
              />
            </div>
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
  filterData: PropTypes.func,
};

ManageTransactionsTable.defaultProps = {
  filterData: null,
};

export default withRouter(ManageTransactionsTable);
