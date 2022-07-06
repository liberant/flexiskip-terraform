import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CommonTable, InnerSearch } from '../../../common/components';
import Styles from './Styles';
// import { columnsJobAssignment } from './columnsDef';
import { dateFormatter } from '../../../common/components/BSTableFormatters';
import { TIME_OUT_DEBOUNCE } from '../../../common/constants/params';

/* eslint no-underscore-dangle: 0 */
/* eslint react/no-did-update-set-state: 0 */


class JobsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      perPage: 10,
      page: 1,
      s: '',
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handlePerPageChange = this.handlePerPageChange.bind(this);
    this.assignJob = this.assignJob.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { unassignedJobs } = this.props;
    if ((unassignedJobs !== prevProps.unassignedJobs)) {
      this.setState({ loading: false });
    }
  }

  handleSearch(event) {
    const { perPage } = this.state;
    const s = event.target.value;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setState({ s, loading: true });
      this.props.getData(perPage, 1, s);
    }, TIME_OUT_DEBOUNCE);
  }

  handleTableChange(type, { newPage }) {
    const { perPage, s } = this.state;
    this.setState({ loading: true, page: newPage });
    this.props.getData(perPage, newPage, s);
  }

  handlePageChange(newPage) {
    const { perPage, s } = this.state;
    this.setState({ loading: true, page: newPage });
    this.props.getData(perPage, newPage, s);
  }

  handlePerPageChange(val) {
    const { s } = this.state;
    this.setState(() => ({ loading: true, perPage: val }));
    this.props.getData(val, 1, s);
  }

  assignJob(e) {
    const { value: driverId, dataset: { jobId } } = e.target;
    const { page, perPage, s } = this.state;
    this.props.assignJobHandler({
      driverId, jobId, page, limit: perPage, s,
    });
  }

  render() {
    const { unassignedJobs, driverList, title } = this.props;

    const headerStyles = {
      textAlign: 'left',
      fontWeight: '600',
      display: 'block',
    };

    const {
      loading, perPage,
    } = this.state;

    return (
      <div>
        <CommonTable
          styles={Styles}
          loading={loading}
          pageSize={perPage}
          data={unassignedJobs}
          noSubTable
          isNotCheckboxTable
          columns={[
            {
              accessor: 'code',
              Header: <span style={headerStyles}>CR Number</span>,
              style: { ...Styles.truncate, ...Styles.cellCursor },
            },
            {
              accessor: 'collectBy',
              Header: <span style={headerStyles}>Due Date</span>,
              style: { ...Styles.truncate, ...Styles.cellCursor },
              formatter: dateFormatter,
            },
            {
              accessor: 'collectionAddress',
              Header: <span style={headerStyles}>Address</span>,
              style: { ...Styles.truncate, ...Styles.cellCursor },
            },
            {
              accessor: 'items.length',
              Header: <span style={headerStyles}>Number Bags</span>,
              style: { ...Styles.truncate, ...Styles.cellCursor },
            },
            {
              accessor: 'driver._id',
              Header: <span style={headerStyles}>Assigned driver</span>,
              style: { ...Styles.truncate, ...Styles.cellCursor },
              Cell: row => (
                <select
                  style={{
                    width: '90%',
                    borderWidth: 0,
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                  }}
                  onChange={this.assignJob}
                  data-job-id={row.original._id}
                  value={row.original.driver ? row.original.driver._id : ''}
                >
                  <option value="">Choose Driver</option>
                  {driverList.map(d => (
                    <option value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              ),
            },
            {
              accessor: 'comments',
              Header: <span style={headerStyles}>Comments</span>,
              style: { ...Styles.truncate, ...Styles.cellCursor },
            },
            {
              accessor: 'status',
              Header: <span style={headerStyles}>Status</span>,
              style: { ...Styles.truncate, ...Styles.cellCursor },
            },
          ]}
          handleSearch={this.handleSearch}
          handlePageChange={this.handlePageChange}
          handlePerPageChange={this.handlePerPageChange}
          paginationFlag
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
          >
            <div>
              <div style={{
                fontSize: 24,
                color: '#239dff',
              }}
              >
                {title}
              </div>

            </div>
            <div>
              <InnerSearch
                mainBoxStyles={{
                  color: '#73879C',
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

JobsTable.propTypes = {
  getData: PropTypes.func.isRequired,
  assignJobHandler: PropTypes.func.isRequired,
  unassignedJobs: PropTypes.object.isRequired,
  driverList: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};

export default JobsTable;
