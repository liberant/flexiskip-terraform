import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import * as viewActions from '../../view/actions';
import * as updateActions from '../actions';
import { bindActionCreators } from '../../../../common/helpers';

import AdminLayout from '../../../hoc/AdminLayout';
import BackButton from '../../../../common/components/BackButton';
import ReportDetail from '../components/ReportDetail';
import ReportMessage from '../../view/components/ReportMessage';
import ReportedUser from '../../view/components/ReportedUser';
import AddNoteButton from '../../view/components/AddNoteButton';
import ReportedBy from '../../view/components/ReportedBy';
import ReportNotes from '../../view/components/ReportNotes';
import ReportImages from '../../view/components/ReportImages';
import HandelButton from '../../../../common/components/HandelButton';
import Spinner from '../../../../common/components/Spinner';
import { withPermission } from '../../../../common/hocs/PermissionRequired';

class DisputeEditPage extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    fetchDisputeDetail: PropTypes.func.isRequired,
    updateDispute: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
    dispute: PropTypes.object,
  }

  static defaultProps = {
    dispute: null,
  }

  componentDidMount() {
    const {
      fetchDisputeDetail,
      match,
    } = this.props;
    const { id } = match.params;
    fetchDisputeDetail(id);
  }

  render() {
    const {
      dispute,
      isLoading,
      updateDispute,
      isSaving,
      match,
    } = this.props;
    const { id: disputeId } = match.params;
    if (isLoading || dispute === null) return <Spinner />;

    return (
      <React.Fragment>
        <BackButton link={`/admin/disputes/${dispute._id}/view`} label={dispute.collectionRequest.code} />
        <div className="row">
          <div className="col-md-6">
            <div className="top-toolbar">
              <AddNoteButton disputeId={disputeId} />
            </div>
          </div>
          <div className="col-md-6 text-right">
            <div className="top-toolbar">
              <HandelButton
                label="Cancel Edit"
                href={`/admin/disputes/${dispute._id}/view`}
                borderColor="red"
                iconColor="red"
                shadowColor="red"
                bgColor="white"
              >
                <span className="handel-cross" />
              </HandelButton>
              <HandelButton
                label="Save"
                form="editDisputeForm"
                htmlType="submit"
                iconColor="white"
                bgColor="blue"
                borderColor="blue"
                shadowColor="blue"
                loading={isSaving}
              >
                <span className="handel-floppy-disk" />
              </HandelButton>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <ReportDetail dispute={dispute} onSubmit={updateDispute} />
          </div>
          <div className="col-md-6">
            <ReportMessage dispute={dispute} />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <ReportedUser dispute={dispute} />
          </div>
          <div className="col-md-6">
            <ReportedBy dispute={dispute} />
          </div>
        </div>
        <ReportImages dispute={dispute} />
        <ReportNotes disputeId={dispute._id} />
      </React.Fragment>
    );
  }
}

export default compose(
  AdminLayout,
  connect(
    state => ({
      dispute: state.admin.manageDisputes.view.dispute,
      isLoading: state.common.loading.fetchDisputeDetail || false,
      isSaving: state.common.loading.updateDispute || false,
    }),
    dispatch => bindActionCreators({
      fetchDisputeDetail: viewActions.fetchDisputeDetail,
      updateDispute: updateActions.updateDispute,
    }, dispatch),
  ),
  withPermission('editDispute'),
)(DisputeEditPage);
