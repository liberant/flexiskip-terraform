import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';

import AppDownload from './statistic/AppDownload';
import TotalCustomer from './statistic/TotalCustomer';
import TotalPartner from './statistic/TotalPartner';

class Statistics extends React.Component {
  render() {
    const { data } = this.props;
    const widgets = [
      <AppDownload value={data.appDownloadCount} percent={data.appDownloadSinceLastMonth} />,
      <TotalCustomer value={data.customerCount} percent={data.customerSinceLastMonth} />,
      <TotalPartner value={data.contractorCount} />,
    ];
    return (
      <div className="row">
        {widgets.map(widget => (
          <div className="col-xs-12 col-sm-4" key={shortid.generate()}>
            {widget}
          </div>
        ))}
      </div>
    );
  }
}

Statistics.propTypes = {
  data: PropTypes.any.isRequired,
};

Statistics.defaultProps = {

};

export default Statistics;
