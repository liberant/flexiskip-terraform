import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';

import * as viewActions from '../../view/actions';
import * as updateActions from '../actions';
import { bindActionCreators } from '../../../../common/helpers';

import AdminLayout from '../../../hoc/AdminLayout';
import BackButton from '../../../../common/components/BackButton';
import HandelButton from '../../../../common/components/HandelButton';
import Spinner from '../../../../common/components/Spinner';
import CouncilForm from '../../components/CouncilForm';
import DumpsiteList from '../../view/components/DumpsiteList';
import DeleteCouncilButton from '../../components/DeleteCouncilButton';
import { withPermission } from '../../../../common/hocs/PermissionRequired';

class CouncilEditPage extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    fetchCouncilDetail: PropTypes.func.isRequired,
    updateCouncil: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
    council: PropTypes.object,
  }

  static defaultProps = {
    council: null,
  }

  componentDidMount() {
    const {
      fetchCouncilDetail,
      match,
    } = this.props;
    const { id } = match.params;
    fetchCouncilDetail(id);
  }

  handleSubmit = async (values) => {
    try {
      await this.props.updateCouncil(values);
    } catch (error) {
      throw new SubmissionError({
        ...error.errors,
        _error: error.message,
      });
    }
  }

  render() {
    const {
      council,
      isLoading,
      isSaving,
      match,
    } = this.props;
    const { id: councilId } = match.params;
    if (isLoading || council === null || council._id !== councilId) return <Spinner />;

    return (
      <React.Fragment>
        <BackButton link={`/admin/councils/${council._id}/view`} label={council.name} />
        <div className="row">
          <div className="col-md-6">
            <div className="top-toolbar">
              <DeleteCouncilButton council={council} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="top-toolbar text-right">
              <HandelButton
                label="Cancel Edit"
                href={`/admin/councils/${council._id}/view`}
                borderColor="red"
                iconColor="red"
                shadowColor="red"
                bgColor="white"
              >
                <span className="handel-cross" />
              </HandelButton>
              <HandelButton
                label="Save"
                form="councilForm"
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
        <CouncilForm onSubmit={this.handleSubmit} initialValues={council} />
        <DumpsiteList councilId={council._id} />
      </React.Fragment>
    );
  }
}

export default compose(
  AdminLayout,
  connect(
    state => ({
      council: state.admin.councils.view.council,
      isLoading: state.common.loading.fetchCouncilDetail || false,
      isSaving: state.common.loading.updateCouncil || false,
    }),
    dispatch => bindActionCreators({
      fetchCouncilDetail: viewActions.fetchCouncilDetail,
      updateCouncil: updateActions.updateCouncil,
    }, dispatch),
  ),
  withPermission('editCouncil'),
)(CouncilEditPage);
