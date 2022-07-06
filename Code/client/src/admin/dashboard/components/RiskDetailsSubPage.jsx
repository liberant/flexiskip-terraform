
import React from 'react';
import PropTypes from 'prop-types';

import DataDetailsTable from './subcomponents/DataDetailsTable';

import { columnDefRisk } from './columnsDef';

class RiskDetailsSubPage extends React.Component {
  render() {
    const { data, getData } = this.props;
    return (
      <div>
        <DataDetailsTable
          title="At Risk Business"
          columnDefs={columnDefRisk}
          dataset={data}
          getData={getData}
        />
      </div>
    );
  }
}

RiskDetailsSubPage.propTypes = {
  data: PropTypes.any.isRequired,
  getData: PropTypes.func.isRequired,
};

RiskDetailsSubPage.defaultProps = {

};

export default RiskDetailsSubPage;
