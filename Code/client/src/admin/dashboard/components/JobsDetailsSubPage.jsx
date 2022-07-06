
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import DataDetailsTable from './subcomponents/DataDetailsTable';
import DriverPickCell from './subcomponents/DriverPickCell';
import { withInterval } from '../../../common/hocs';

import {
  fullDateTimeFormatter,
  remainingTimeFormatter,
} from '../../../common/components/BSTableFormatters';

/* eslint no-underscore-dangle:0 */

const RemainingTimeComponent = withInterval(1000);

class JobsDetailsSubPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldReloadList: false,
    };
    this.forceReloadList = this.forceReloadList.bind(this);
  }
  forceReloadList(rowId) {
    const { updateDashboardJobManual, data } = this.props;
    return () => {
      this.setState({
        shouldReloadList: true,
      });

      // turn off reload after 1s
      setTimeout(() => {
        this.setState({
          shouldReloadList: false,
        });

        // remove the changed item.
        const removeIndex = data.data.findIndex((da => da._id === rowId));
        if (removeIndex !== -1) {
          data.data.splice(removeIndex, 1);
          data.pagination.totalCount -= 1;
        }
        // Update prop data
        updateDashboardJobManual(data);
      }, 1000);
    };
  }
  render() {
    const {
      data,
      getData,
      getDriverList,
      setJobDriver,
    } = this.props;
    return (
      <div>
        <DataDetailsTable
          title="Jobs awaiting collection"
          columnDefs={[
            {
              title: 'Collection Ref',
              key: 'code',
              dataIndex: 'code',
              render: (text, row) => (
                <Link
                  key={row._id}
                  to={{
                    pathname: `/admin/collection-requests-view/${row._id}`,
                    state: { fromDashboard: true },
                  }}
                >
                  {text}
                </Link>
              ),
            },
            {
              title: 'Request Date',
              key: 'createdAt',
              dataIndex: 'createdAt',
              render: (text, row) => (
                <Link
                  key={row._id}
                  to={{
                    pathname: `/admin/collection-requests-view/${row._id}`,
                    state: { fromDashboard: true },
                  }}
                >
                  {fullDateTimeFormatter(text)}
                </Link>
              ),
            },
            {
              title: 'Driver',
              key: 'driverProfile',
              dataIndex: 'driverProfile',
              render: (text, row) => (
                <DriverPickCell
                  jobId={row._id}
                  getDriverList={getDriverList}
                  setJobDriver={setJobDriver}
                  forceReloadList={this.forceReloadList(row._id)}
                  shouldReloadList={this.state.shouldReloadList}
                />
              ),
            },
            {
              title: 'Remaining Time',
              key: 'remainingTime',
              dataIndex: 'remainingTime',
              render: (text, row) => (
                <Link
                  key={row._id}
                  to={{
                    pathname: `/admin/collection-requests-view/${row._id}`,
                    state: { fromDashboard: true },
                  }}
                >
                  <RemainingTimeComponent callback={() => remainingTimeFormatter(row)} />
                </Link>
              ),
            },
          ]}
          dataset={data}
          getData={getData}
        />
      </div>
    );
  }
}

JobsDetailsSubPage.propTypes = {
  data: PropTypes.any.isRequired,
  getData: PropTypes.func.isRequired,
  getDriverList: PropTypes.func.isRequired,
  setJobDriver: PropTypes.func.isRequired,
  updateDashboardJobManual: PropTypes.func.isRequired,
};

JobsDetailsSubPage.defaultProps = {

};

export default JobsDetailsSubPage;
