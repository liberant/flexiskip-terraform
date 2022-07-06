import React from 'react';

/* eslint no-unused-vars: 0 */

import { CommonBSTable } from '../../../common/components';
import styles from './Styles';
import { columnsDrivers } from './columnsDef';

class DriversSubTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // loading: false,
      // perPage: 20,
    };

    this.handleTableChange = this.handleTableChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handlePerPageChange = this.handlePerPageChange.bind(this);
  }

  handlePerPageChange(val) {
    // const { currentTab } = this.state;

    this.setState(() => ({ perPage: val }));
    // this.props.getData(val, 1, columns[currentTab].name, columns[currentTab].url);
  }

  handleTableChange(type, {
    page, sizePerPage, filters, sortField, sortOrder,
  }) {
    // const { currentTab, perPage } = this.state;

    this.setState(() => ({ loading: true }));

    // this.props.getData(perPage, page, columns[currentTab].name, columns[currentTab].url);
  }

  handlePageChange(page) {
    // const { currentTab, perPage } = this.state;

    this.setState(() => ({ loading: true }));

    // this.props.getData(perPage, page, columns[currentTab].name, columns[currentTab].url);
  }

  render() {
    // const { data } = this.props;
    // const { loading, perPage } = this.state;

    return (
      <div>
        {/* <CommonBSTable
          styles={styles}
          title=""
          loading={loading}
          perPage={perPage}
          tableData={data || {}}
          columns={columnsRating}
          paginationFlag
        /> */}
      </div>
    );
  }
}

DriversSubTable.propTypes = {

};

DriversSubTable.defaultProps = {

};

export default DriversSubTable;
