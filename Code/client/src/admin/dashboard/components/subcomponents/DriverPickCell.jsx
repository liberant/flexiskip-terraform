import React from 'react';
import PropTypes from 'prop-types';

/* eslint react/no-did-mount-set-state: 0 */
/* eslint react/no-did-update-set-state: 0 */

class DriverPickCell extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      driverList: [],
      selectedDriver: null,
    };

    this.reloadList = false;
    this.selectDriver = this.selectDriver.bind(this);
  }

  async componentDidMount() {
    const { getDriverList, jobId } = this.props;
    const driverList = await getDriverList(jobId);
    this.setState({ driverList });
  }

  async componentDidUpdate(prevProps) {
    const { shouldReloadList, getDriverList, jobId } = this.props;
    // when user have been assign to job => no need reload the driver
    if (!this.state.selectedDriver) {
      if (!this.reloadList && shouldReloadList && shouldReloadList !== prevProps.shouldReloadList) {
        const driverList = await getDriverList(jobId);
        this.setState({ driverList });
        this.reloadList = true;
      } else if (shouldReloadList === prevProps.shouldReloadList && this.reloadList) {
        this.reloadList = false;
      }
    }
  }

  get driverName() {
    const { driverList, selectedDriver } = this.state;
    const driver = driverList.find(driver => driver.uId === selectedDriver);
    return driver && (driver.name || driver.fullname);
  }

  selectDriver(e) {
    const { setJobDriver, jobId, forceReloadList } = this.props;

    if (setJobDriver && e.target.value) {
      const driver = e.target.value;
      this.setState({
        selectedDriver: driver,
      });
      setJobDriver({ jobId, driver });
    }
    // after assign job to driver => need to inform all other job need to reload driver
    // this action help to refresh and removed driver not satisfy the condition can accept jon
    forceReloadList();
  }

  render() {
    const { selectDriver } = this;
    const { driverList, selectedDriver } = this.state;

    if (selectedDriver && selectedDriver !== '') {
      return (
        <div>
          {this.driverName}
        </div>
      );
    }
    return (
      <div>
        <select
          style={{
            width: '90%',
            borderWidth: 0,
            backgroundColor: 'transparent',
            cursor: 'pointer',
          }}
          onChange={selectDriver}
          value={selectedDriver}
        >
          <option value="">Choose Driver</option>
          {driverList.map(d => (
            <option
              value={d.uId}
              title={d.email}
            >
              {d.name}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

DriverPickCell.propTypes = {
  jobId: PropTypes.string.isRequired,
  getDriverList: PropTypes.func.isRequired,
  setJobDriver: PropTypes.func.isRequired,
  forceReloadList: PropTypes.func.isRequired,
  shouldReloadList: PropTypes.bool.isRequired,
};

DriverPickCell.defaultProps = {

};

export default DriverPickCell;

