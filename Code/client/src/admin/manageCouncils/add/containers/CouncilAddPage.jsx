import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { SubmissionError } from 'redux-form';

import * as actions from '../actions';
import { bindActionCreators } from '../../../../common/helpers';
import { withPermission } from '../../../../common/hocs/PermissionRequired';
import AdminLayout from '../../../hoc/AdminLayout';
import BackButton from '../../../../common/components/BackButton';
import HandelButton from '../../../../common/components/HandelButton';
import CouncilForm from '../../components/CouncilForm';

class CouncilAddPage extends Component {
  static propTypes = {
    addCouncil: PropTypes.func.isRequired,
    isSaving: PropTypes.bool.isRequired,
  }

  handleSubmit = async (values) => {
    try {
      await this.props.addCouncil(values);
    } catch (error) {
      throw new SubmissionError({
        ...error.errors,
        _error: error.message,
      });
    }
  }

  render() {
    const { isSaving } = this.props;
    const values = {
      isActive: true,
      postCodes: [],
    };
    return (
      <React.Fragment>
        <BackButton link="/admin/manage-councils" label="Add Council" />
        <div className="top-toolbar text-right">
          <HandelButton
            label="Cancel Add"
            href="/admin/manage-councils"
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
        <CouncilForm onSubmit={this.handleSubmit} initialValues={values} />
      </React.Fragment>
    );
  }
}

export default compose(
  AdminLayout,
  connect(
    state => ({
      isSaving: state.common.loading.addCouncil || false,
    }),
    dispatch => bindActionCreators({
      addCouncil: actions.addCouncil,
    }, dispatch),
  ),
  withPermission('editCouncil'),
)(CouncilAddPage);
