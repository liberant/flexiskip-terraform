import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { setTitle } from '../../../common/actions';
import { DownloadButton, HandelButton } from '../../../common/components';
import { withPermission } from '../../../common/hocs/PermissionRequired';
import AdminLayout from '../../hoc/AdminLayout';
import DisputeListTableView from '../../manageDisputes/list/containers/DisputeListTableView';
import { getDashboardDriverListByJobId, getDashboardInactive, getDashboardJobs, getDashboardRisk, getDashboardSummary, getExportToGoogleSheet, setDashboardJobDriver, updateDashboardJobManual } from '../actions';
import DataStudioReport from '../components/GoogleDataStudio';
import InactiveDetailsSubPage from '../components/InactiveDetailsSubPage';
import JobsDetailsSubPage from '../components/JobsDetailsSubPage';
import RiskDetailsSubPage from '../components/RiskDetailsSubPage';
import Statistics from '../components/Statistics';


/* eslint no-underscore-dangle: 0 */

class Dashboard extends React.Component {

  constructor(props) {
    super(props);

    const { common, history } = props;
    if (common.identity.userType !== 'SUPERADMIN') {
      if (common.identity.userType === 'contractor' && common.identity.isLoggedIn) {
        history.push('/contractor/dashboard');
      } else {
        history.push('/contractor/login');
      }
    }

    this.fetchJobData = this.fetchJobData.bind(this);
    this.fetchRiskData = this.fetchRiskData.bind(this);
    this.fetchInactiveData = this.fetchInactiveData.bind(this);

    this.getDriverList = this.getDriverList.bind(this);
    this.setJobDriver = this.setJobDriver.bind(this);
    this.exportToGoogleSheetHandler = this.exportToGoogleSheetHandler.bind(this);
  }

  componentDidMount() {
    const {
      setTitle,
      getDashboardSummary,
      getDashboardJobs,
      getDashboardRisk,
      getDashboardInactive,
    } = this.props;

    setTitle('');

    if (getDashboardSummary) {
      getDashboardSummary();
    }
    if (getDashboardJobs) {
      getDashboardJobs({ limit: 10, page: 1 });
    }
    if (getDashboardRisk) {
      getDashboardRisk({ limit: 10, page: 1 });
    }
    if (getDashboardInactive) {
      getDashboardInactive({ limit: 10, page: 1 });
    }
  }

  async getDriverList(jobId) {
    const { getJobDriverList } = this.props;

    const result = await getJobDriverList({ jobId });

    let drivers = [];
    if (result.data && result.data.constructor === Array) {
      drivers = result.data.map(r => ({ uId: r._id, name: r.fullname, email: r.email }));
    }

    return drivers;
  }

  async setJobDriver(jobDriver) {
    const { setJobDriver } = this.props;

    if (setJobDriver) {
      await setJobDriver(jobDriver);
    }

    return true;
  }


  fetchJobData(perPage, page, search) {
    const { getDashboardJobs } = this.props;
    if (getDashboardJobs) {
      getDashboardJobs({ limit: perPage, page, search });
    }
  }

  fetchRiskData(perPage, page, search) {
    const { getDashboardRisk } = this.props;
    if (getDashboardRisk) {
      getDashboardRisk({ limit: perPage, page, search });
    }
  }

  fetchInactiveData(perPage, page, search) {
    const { getDashboardInactive } = this.props;
    if (getDashboardInactive) {
      getDashboardInactive({ limit: perPage, page, search });
    }
  }

  exportToGoogleSheetHandler() {
    const { getExportToGoogleSheet } = this.props;
    if (getExportToGoogleSheet) {
      getExportToGoogleSheet();
    }
  }

  render() {
    const {
      summary,
      revenue, rate, averageTime,
      jobList, riskList, inactiveList,
      updateDashboardJobManual,
    } = this.props;

    const { data, pagination } = jobList;
    const now = moment()._d.getTime();

    const remainingTimeSet = data.map(d => (moment(d.collectBy)._d.getTime() - now));

    const updatedJobList = {};
    // eslint-disable-next-line max-len
    updatedJobList.data = data.map((j, i) => Object.assign({ remainingTime: remainingTimeSet[i] }, j));
    updatedJobList.pagination = pagination;

    return (
      <div>
        <div
          style={{
            margin: '38px 0 52px 0',
          }}
        >
          <span
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: '#1d415d',
            }}
          >
            Dashboard
          </span>
        </div>
        <div className="top-toolbar">
          <DownloadButton
            label="Collection Summary"
            href="/admin/reports/activity"
          />
          <DownloadButton
            label="Product Summary"
            href="/admin/reports/activityBin"
          />
          <DownloadButton
            label="Councils Discount Summary"
            href="/admin/reports/council-discount-code"
          />
          <HandelButton
            onClick={this.exportToGoogleSheetHandler}
            label="Export to Googlesheet"
            iconColor="white"
            bgColor="blue"
            borderColor="blue"
            shadowColor="blue"
          >
            <span className="handel-open-link" />
          </HandelButton>
        </div>

        <DataStudioReport />

        <Statistics data={summary} />
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <JobsDetailsSubPage
              data={updatedJobList}
              getData={this.fetchJobData}
              getDriverList={this.getDriverList}
              setJobDriver={this.setJobDriver}
              updateDashboardJobManual={updateDashboardJobManual}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6">
            <RiskDetailsSubPage data={riskList} getData={this.fetchRiskData} />
          </div>
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6">
            <InactiveDetailsSubPage
              data={inactiveList}
              getData={this.fetchInactiveData}
            />
          </div>
        </div>
        {/* Disputes */}
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <DisputeListTableView titleInside="Disputes" />
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  setTitle: PropTypes.func.isRequired,
  common: PropTypes.any.isRequired,
  history: PropTypes.any.isRequired,
  summary: PropTypes.any,
  jobList: PropTypes.any,
  riskList: PropTypes.any,
  inactiveList: PropTypes.any,

  getDashboardSummary: PropTypes.func.isRequired,
  getDashboardJobs: PropTypes.func.isRequired,
  getDashboardRisk: PropTypes.func.isRequired,
  getDashboardInactive: PropTypes.func.isRequired,

  getJobDriverList: PropTypes.func.isRequired,
  setJobDriver: PropTypes.func.isRequired,
  updateDashboardJobManual: PropTypes.func.isRequired,
};

Dashboard.defaultProps = {
  summary: {},
  jobList: {
    data: [],
    pagination: {
      currentPage: 1,
      pageCount: 1,
      perPage: 10,
      totalCount: 1,
    },
  },
  riskList: {
    data: [],
    pagination: {
      currentPage: 1,
      pageCount: 1,
      perPage: 10,
      totalCount: 1,
    },
  },
  inactiveList: {
    data: [],
    pagination: {
      currentPage: 1,
      pageCount: 1,
      perPage: 10,
      totalCount: 1,
    },
  },
};

export default compose(
  AdminLayout,
  connect(
    state => ({
      common: state.common,
      summary: state.admin.dashboard.dashboard.summary || {},
      jobList: state.admin.dashboard.dashboard.jobList || {
        data: [],
        pagination: {
          currentPage: 1,
          pageCount: 1,
          perPage: 10,
          totalCount: 1,
        },
      },
      riskList: state.admin.dashboard.dashboard.riskList || {
        data: [],
        pagination: {
          currentPage: 1,
          pageCount: 1,
          perPage: 10,
          totalCount: 1,
        },
      },
      inactiveList: state.admin.dashboard.dashboard.inactiveList || {
        data: [],
        pagination: {
          currentPage: 1,
          pageCount: 1,
          perPage: 10,
          totalCount: 1,
        },
      },
    }),
    dispatch => ({
      ...bindActionCreators({
        updateDashboardJobManual,
      }, dispatch),
      setTitle: title => dispatch(setTitle(title)),
      getDashboardSummary: (data) => {
        const action = getDashboardSummary(data);
        dispatch(action);
        return action.promise;
      },
      getDashboardJobs: (data) => {
        const action = getDashboardJobs(data);
        dispatch(action);
        return action.promise;
      },
      getDashboardRisk: (data) => {
        const action = getDashboardRisk(data);
        dispatch(action);
        return action.promise;
      },
      getDashboardInactive: (data) => {
        const action = getDashboardInactive(data);
        dispatch(action);
        return action.promise;
      },
      setJobDriver: (data) => {
        const action = setDashboardJobDriver(data);
        dispatch(action);
        return action.promise;
      },
      getJobDriverList: (data) => {
        const action = getDashboardDriverListByJobId(data);
        dispatch(action);
        return action.promise;
      },
      getExportToGoogleSheet: (data) => {
        const action = getExportToGoogleSheet(data);
        dispatch(action);
        return action.promise;
      },
    }),
  ),
  withPermission('dashboard'),
)(Dashboard);
