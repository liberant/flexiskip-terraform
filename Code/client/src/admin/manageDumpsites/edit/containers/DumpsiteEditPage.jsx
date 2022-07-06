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
import DumpsiteForm from '../../components/DumpsiteForm';
import DeleteDumpsiteButton from '../../components/DeleteDumpsiteButton';
import { withPermission } from '../../../../common/hocs/PermissionRequired';

class DumpsiteEditPage extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    fetchDumpsiteDetail: PropTypes.func.isRequired,
    updateDumpsite: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
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

  handleSubmit = async (values) => {
    try {
      await this.props.updateDumpsite(values);
    } catch (error) {
      throw new SubmissionError({
        ...error.errors,
        _error: error.message,
      });
    }
  }

  render() {
    const {
      dumpsite,
      isLoading,
      isSaving,
      match,
    } = this.props;
    const { id: dumpsiteId } = match.params;
    if (isLoading || dumpsite === null || dumpsite._id !== dumpsiteId) return <Spinner />;

    return (
      <React.Fragment>
        <BackButton link={`/admin/dumpsites/${dumpsite._id}/view`} label={dumpsite.code} />
        <div className="row">
          <div className="col-md-6">
            <div className="top-toolbar">
              <DeleteDumpsiteButton dumpsite={dumpsite} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="top-toolbar text-right">
              <HandelButton
                label="Cancel Edit"
                href={`/admin/dumpsites/${dumpsite._id}/view`}
                borderColor="red"
                iconColor="red"
                shadowColor="red"
                bgColor="white"
              >
                <span className="handel-cross" />
              </HandelButton>
              <HandelButton
                label="Save"
                form="dumpsiteForm"
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
        <DumpsiteForm onSubmit={this.handleSubmit} initialValues={dumpsite} />
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
      isSaving: state.common.loading.updateDumpsite || false,
    }),
    dispatch => bindActionCreators({
      fetchDumpsiteDetail: viewActions.fetchDumpsiteDetail,
      updateDumpsite: updateActions.updateDumpsite,
    }, dispatch),
  ),
  withPermission('editDumpsite'),
)(DumpsiteEditPage);
