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
import DiscountForm from '../../add/components/DiscountForm';
import { withPermission } from '../../../../common/hocs/PermissionRequired';
import DeleteDiscountButton from '../../view/components/DeleteDiscountButton';

class DiscountEditPage extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    fetchDiscountDetail: PropTypes.func.isRequired,
    updateDiscount: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
    discount: PropTypes.object,
  }

  static defaultProps = {
    discount: null,
  }

  componentDidMount() {
    const {
      fetchDiscountDetail,
      match,
    } = this.props;
    const { id } = match.params;
    fetchDiscountDetail(id);
  }

  handleSubmit = async (values) => {
    try {
      await this.props.updateDiscount(values);
    } catch (error) {
      throw new SubmissionError({
        ...error.errors,
        _error: error.message,
      });
    }
  }

  render() {
    const {
      discount,
      isLoading,
      isSaving,
      match,
    } = this.props;
    const { id: discountId } = match.params;
    if (isLoading || discount === null || discount._id !== discountId) return <Spinner />;

    return (
      <React.Fragment>
        <BackButton link={`/admin/discounts/${discount._id}/view`} label={discount.code} />
        <div className="row">
          <div className="col-md-6">
            <div className="top-toolbar">
              <DeleteDiscountButton discount={discount} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="top-toolbar text-right">
              <HandelButton
                label="Cancel Edit"
                href={`/admin/discounts/${discount._id}/view`}
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
          </div>
        </div>
        <DiscountForm onSubmit={this.handleSubmit} initialValues={discount} />
      </React.Fragment>
    );
  }
}

export default compose(
  AdminLayout,
  connect(
    state => ({
      discount: state.admin.discounts.view.discount,
      isLoading: state.common.loading.fetchDiscountDetail || false,
      isSaving: state.common.loading.updateDiscount || false,
    }),
    dispatch => bindActionCreators({
      fetchDiscountDetail: viewActions.fetchDiscountDetail,
      updateDiscount: updateActions.updateDiscount,
    }, dispatch),
  ),
  withPermission('editDiscountCode'),
)(DiscountEditPage);
