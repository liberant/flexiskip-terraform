import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import styles from './Styles';
import { columns } from './columnsDef';
import SummaryDetailsSubPage from './SummaryDetailsSubPage';
import RevenueDetailsSubPage from './RevenueDetailsSubPage';
import RateDetailsSubPage from './RateDetailsSubPage';
import AverageTimeDetailsSubPage from './AverageTimeDetailsSubPage';
import JobsDetailsSubPage from './JobsDetailsSubPage';
import RiskDetailsSubPage from './RiskDetailsSubPage';
import InactiveDetailsSubPage from './InactiveDetailsSubPage';


class DashboardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0,
      perPage: 10,

      search: '',
    };

    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(e) {
    const { currentTab, perPage } = this.state;
    this.setState({ search: e.target.value });
    this.props.getData(
      perPage, 1,
      columns[currentTab].name,
      columns[currentTab].url,
      e.target.value,
    );
  }

  render() {

    const { getData } = this.props;

    return (
      <div>
        <div style={{ ...styles.usersTabBoxOuter, marginTop: 30 }}>
          <div style={styles.pageTitleBox}>
            <div>
              <h3 style={{ ...styles.pageTitle }}>
                Dashboard
              </h3>
              <div className="row">
                <div className="col-xs-12">
                  <SummaryDetailsSubPage />
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12">
                  <RevenueDetailsSubPage getData={getData} />
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                  <RateDetailsSubPage getData={getData} />
                </div>
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                  <AverageTimeDetailsSubPage getData={getData} />
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12">
                  <JobsDetailsSubPage getData={getData} />
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                  <RiskDetailsSubPage getData={getData} />
                </div>
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                  <InactiveDetailsSubPage getData={getData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DashboardPage.propTypes = {
  history: PropTypes.any.isRequired,
  dataset: PropTypes.any.isRequired,

  getData: PropTypes.func.isRequired,
};

export default withRouter(DashboardPage);
