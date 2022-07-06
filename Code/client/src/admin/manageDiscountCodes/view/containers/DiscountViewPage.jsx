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
import DiscountView from '../components/DiscountView';
import PermissionRequired, { withPermission } from '../../../../common/hocs/PermissionRequired';
import DeleteDiscountButton from '../components/DeleteDiscountButton';

class DiscountViewPage extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    fetchDiscountDetail: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
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

  render() {
    const { discount, isLoading, match } = this.props;
    const { id: discountId } = match.params;
    if (isLoading || discount === null || discount._id !== discountId) return <Spinner />;

    return (
      <React.Fragment>
        <BackButton link="/admin/manage-discounts" label={discount.code} />
        <PermissionRequired permission="editDiscountCode">
          <div className="row">
            <div className="col-md-6">
              <div className="top-toolbar">
                <DeleteDiscountButton discount={discount} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="top-toolbar text-right">
                <HandelButton
                  label="Edit"
                  href={`/admin/discounts/${discount._id}/edit`}
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
        <DiscountView initialValues={discount} />
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
    }),
    dispatch => bindActionCreators({
      fetchDiscountDetail: actions.fetchDiscountDetail,
    }, dispatch),
  ),
  withPermission('viewDiscountCode'),
)(DiscountViewPage);
