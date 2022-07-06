import React from 'react';
import { compose } from 'redux';
import moment from 'moment';
import axios from 'axios';
import fileDownload from 'js-file-download';

import httpClient from "../../../common/http";
import { withPermission } from '../../../common/hocs/PermissionRequired';

import AdminLayout from '../../hoc/AdminLayout';
import { HandelButton } from '../../../common/components';
import { Modal, message, Button } from 'antd';
import PermissionRequired from '../../../common/hocs/PermissionRequired';

import { API_URL } from '../../../common/constants/params';


class ReportPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exporting: false
    };
    this.handleDownload = this.handleDownload.bind(this);
  }

  async handleDownload(reportName) {
    if (!reportName) return;
    this.setState(() => ({ exporting: true }));
    const timestamp = moment().format('DD-MM-YYYY-HHmmss');
    try {
      const url = `admin/reports/export-csv`;
      const params = { reportName }
      const response = await httpClient.get(url, { params });
      fileDownload(response.data, `${reportName}-${timestamp}.csv`)
      message.success(`Exported successfully!`);
    } catch (e){
      message.error(`Failed to export.`);
    } finally {
      this.setState(() => ({ exporting: false }));
    }
  }

  render() {
    const {
      exporting,
    } = this.state;

    return (
      <div className="x_panel_">
        <h1 className="p-title">Reports</h1>
        <div style={{marginTop: 30 }}>
          <PermissionRequired permission="listProductRequest">

            <div className="row">
              <div className="col-xs-12 col-md-4 text-justify">
                <h2>List of GC customers not having collection requests for active GC bin requests</h2>
              </div>
              <div className="col-xs-12 col-md-6">
                <HandelButton
                  iconColor="white"
                  bgColor="blue"
                  borderColor="blue"
                  shadowColor="blue"
                  onClick={() => {
                    this.handleDownload('no-cr-gc-customer')
                  }}
                  loading={exporting}
                >
                  <span className="handel-download" />
                </HandelButton>
              </div>
            </div>
            <hr />

          </PermissionRequired>
        </div>
      </div>
    );
  }
}

export default compose(
  AdminLayout,
  withPermission('listProductRequest'),
)(ReportPage);
