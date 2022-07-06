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
import DiscountForm from '../components/DiscountForm';

class DiscountAddPage extends Component {
  static propTypes = {
    addDiscount: PropTypes.func.isRequired,
    isSaving: PropTypes.bool.isRequired,
  }

  handleSubmit = async (values) => {
    try {
      await this.props.addDiscount(values);
    } catch (error) {
      throw new SubmissionError({
        ...error.errors,
        _error: error.message,
      });
    }
  }

  render() {
    const { isSaving } = this.props;
    const initVals = {
      products: [],
      regions: [],
    };

    return (
      <React.Fragment>
        <BackButton link="/admin/manage-discounts" label="Add Discount Code" />
        <div className="top-toolbar text-right">
          <HandelButton
            label="Cancel Add"
            href="/admin/manage-discounts"
            borderColor="red"
            iconColor="red"
            shadowColor="red"
            bgColor="white"
          >
            <span className="handel-cross" />
          </HandelButton>
          <HandelButton
            label="Save"
            form="discountForm"
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
        <DiscountForm onSubmit={this.handleSubmit} initialValues={initVals} />
      </React.Fragment>
    );
  }
}

export default compose(
  AdminLayout,
  connect(
    state => ({
      isSaving: state.common.loading.addDiscount || false,
    }),
    dispatch => bindActionCreators({
      addDiscount: actions.addDiscount,
    }, dispatch),
  ),
  withPermission('editDispute'),
)(DiscountAddPage);
