import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import * as actions from '../actions';
import { bindActionCreators } from '../../../../common/helpers';

import AdminLayout from '../../../hoc/AdminLayout';
import BackButton from '../../../../common/components/BackButton';
import HandelButton from '../../../../common/components/HandelButton';
import Spinner from '../../../../common/components/Spinner';
import DumpsiteView from '../components/DumpsiteView';
import PermissionRequired, { withPermission } from '../../../../common/hocs/PermissionRequired';
import DeleteDumpsiteButton from '../../components/DeleteDumpsiteButton';

class DumpsiteViewPage extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    fetchDumpsiteDetail: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    dumpsite: PropTypes.object,
  }

  static defaultProps = {
    dumpsite: null,
  }

  componentDidMount() {
    const {
      fetchDumpsiteDetail,
      match,
    } = this.props;
    const { id } = match.params;
    fetchDumpsiteDetail(id);
  }

  render() {
    const { dumpsite, isLoading, match } = this.props;
    const { id: dumpsiteId } = match.params;
    if (isLoading || dumpsite === null || dumpsite._id !== dumpsiteId) return <Spinner />;

    return (
      <React.Fragment>
        <BackButton link="/admin/manage-dumpsites" label={dumpsite.name} />
        <PermissionRequired permission="editDumpsite">
          <div className="row">
            <div className="col-md-6">
              <div className="top-toolbar">
                <DeleteDumpsiteButton dumpsite={dumpsite} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="top-toolbar text-right">
                <HandelButton
                  label="Edit"
                  href={`/admin/dumpsites/${dumpsite._id}/edit`}
                  borderColor="blue"
                  iconColor="white"
                  shadowColor="blue"
                  bgColor="blue"
                >
                  <span className="handel-pencil" />
                </HandelButton>
              </div>
            </div>
          </div>
        </PermissionRequired>
        <DumpsiteView initialValues={dumpsite} />
      </React.Fragment>
    );
  }
}

export default compose(
  AdminLayout,
  connect(
    state => ({
      dumpsite: state.admin.dumpsites.view.dumpsite,
      isLoading: state.common.loading.fetchDumpsiteDetail || false,
    }),
    dispatch => bindActionCreators({
      fetchDumpsiteDetail: actions.fetchDumpsiteDetail,
    }, dispatch),
  ),
  withPermission('viewDumpsite'),
)(DumpsiteViewPage);
