import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { HandelButton, DownloadButton } from '../../../common/components';
import AdminLayout from '../../hoc/AdminLayout';
import { setTitle } from '../../../common/actions';
import {
  getDashboardSummary,
  getDashboardRevenue,
} from '../actions';
import SummaryDetailsSubPage from '../components/SummaryDetailsSubPage';


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

    this.filterRevenueData = this.filterRevenueData.bind(this);
  }

  componentDidMount() {
    const {
      setTitle,
      getDashboardSummary,
      getDashboardRevenue,
    } = this.props;

    setTitle('');
    if (getDashboardSummary) {
      getDashboardSummary();
    }
    if (getDashboardRevenue) {
      getDashboardRevenue();
    }
  }

  filterRevenueData(data) {
    const { getDashboardRevenue } = this.props;
    const { startDate, endDate } = data;

    if (getDashboardRevenue) {
      getDashboardRevenue({
        from: startDate,
        to: endDate,
      });
    }
  }

  render() {
    const {
      summary,
    } = this.props;

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
        <div className="row">
          <div className="col-md-6">
            <div className="top-toolbar">
              <HandelButton
                label="Add Driver"
                href="/contractor/add-driver"
                iconColor="white"
                bgColor="blue"
                borderColor="blue"
                shadowColor="blue"
              >
                <span className="handel-user" />
              </HandelButton>

              <HandelButton
                label="Add Vehicle"
                href="/contractor/vehicles/add"
                iconColor="white"
                bgColor="blue"
                borderColor="blue"
                shadowColor="blue"
              >
                <span className="handel-truck" />
              </HandelButton>
            </div>
          </div>
          <div className="col-md-6">
            <div className="top-toolbar text-right">
              <DownloadButton
                label="Activity Report"
                href="/contractor/reports/transaction"
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12">
            <SummaryDetailsSubPage data={summary} />
          </div>
        </div>
      </div>);
  }
}

Dashboard.propTypes = {
  setTitle: PropTypes.func.isRequired,
  common: PropTypes.any.isRequired,
  history: PropTypes.any.isRequired,
  summary: PropTypes.any,

  getDashboardSummary: PropTypes.func.isRequired,
  getDashboardRevenue: PropTypes.func.isRequired,

};

Dashboard.defaultProps = {
  summary: {},
};

export default compose(
  AdminLayout,
  connect(
    state => ({
      common: state.common,
      summary: state.contractor.dashboard.dashboard.summary || {},
      revenue: state.contractor.dashboard.dashboard.revenue || [],
    }),
    dispatch => ({
      setTitle: title => dispatch(setTitle(title)),
      getDashboardSummary: (data) => {
        const action = getDashboardSummary(data);
        dispatch(action);
        return action.promise;
      },
      getDashboardRevenue: (data) => {
        const action = getDashboardRevenue(data);
        dispatch(action);
        return action.promise;
      },

    }),
  ),
)(Dashboard);
