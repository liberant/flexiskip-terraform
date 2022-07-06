
import React from 'react';
import PropTypes from 'prop-types';

import DataDetailsTable from './subcomponents/DataDetailsTable';
import { columnDefInactive } from './columnsDef';

class InactiveDetailsSubPage extends React.Component {
  render() {
    const { data, getData } = this.props;
    return (
      <div>
        <DataDetailsTable
          title="Inactive Business"
          columnDefs={columnDefInactive}
          dataset={data}
          getData={getData}
        />
      </div>
    );
  }
}

InactiveDetailsSubPage.propTypes = {
  data: PropTypes.any.isRequired,
  getData: PropTypes.func.isRequired,
};

InactiveDetailsSubPage.defaultProps = {

};

export default InactiveDetailsSubPage;
