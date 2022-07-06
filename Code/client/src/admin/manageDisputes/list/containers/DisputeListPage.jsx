import React, { Component } from 'react';
import { compose } from 'redux';
import DisputeListTableView from './DisputeListTableView';
import AdminLayout from '../../../hoc/AdminLayout';

class DisputeListPage extends Component {
  render() {
    return (
      <React.Fragment>
        <h1 className="p-title">Disputes</h1>

        <DisputeListTableView titleInside="Report" />

      </React.Fragment>
    );
  }
}

export default compose(AdminLayout)(DisputeListPage);
