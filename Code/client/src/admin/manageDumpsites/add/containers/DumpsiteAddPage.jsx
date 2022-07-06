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
import DumpsiteForm from '../../components/DumpsiteForm';

class DumpsiteAddPage extends Component {
  static propTypes = {
    addDumpsite: PropTypes.func.isRequired,
    isSaving: PropTypes.bool.isRequired,
  }

  handleSubmit = async (values) => {
    try {
      await this.props.addDumpsite(values);
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
      openDays: [
        {
          isOpen: false,
          fromTime: '08:30 AM',
          toTime: '05:30 PM',
        },
        {
          isOpen: false,
          fromTime: '08:30 AM',
          toTime: '05:30 PM',
        },
        {
          isOpen: false,
          fromTime: '08:30 AM',
          toTime: '05:30 PM',
        },
        {
          isOpen: false,
          fromTime: '08:30 AM',
          toTime: '05:30 PM',
        },
        {
          isOpen: false,
          fromTime: '08:30 AM',
          toTime: '05:30 PM',
        },
        {
          isOpen: false,
          fromTime: '08:30 AM',
          toTime: '05:30 PM',
        },
        {
          isOpen: false,
          fromTime: '08:30 AM',
          toTime: '05:30 PM',
        },
      ],
    };

    return (
      <React.Fragment>
        <BackButton link="/admin/manage-dumpsites" label="Add Dumpsite" />
        <div className="top-toolbar text-right">
          <HandelButton
            label="Cancel Add"
            href="/admin/manage-dumpsites"
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
        <DumpsiteForm onSubmit={this.handleSubmit} initialValues={values} />
      </React.Fragment>
    );
  }
}

export default compose(
  AdminLayout,
  connect(
    state => ({
      isSaving: state.common.loading.addDumpsite || false,
    }),
    dispatch => bindActionCreators({
      addDumpsite: actions.addDumpsite,
    }, dispatch),
  ),
  withPermission('editDumpsite'),
)(DumpsiteAddPage);
