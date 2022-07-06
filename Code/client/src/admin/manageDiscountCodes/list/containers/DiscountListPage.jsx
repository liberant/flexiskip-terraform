import React, { Component } from 'react';
import { any, bool, func } from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { setTitle } from '../../../../common/actions';
import { withPermission } from '../../../../common/hocs/PermissionRequired';
import {
  getDiscountsList,
  getDiscountDetailsById,
  updateDiscountDetails,
  updateDiscountStatus,
} from '../actions';
import Spinner from '../../../../common/components/Spinner';

import DiscountsTable from '../components/DiscountsTable';
import AdminLayout from '../../../hoc/AdminLayout';

class DiscountsManagePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userType: 'discount',
      sizePerPage: 10,
      firstFetchFlag: true,
    };

    this.handleGetDiscountsList = this.handleGetDiscountsList.bind(this);
  }


  componentDidMount() {
    const { setTitle, getDiscountsList } = this.props;
    const { userType, sizePerPage } = this.state;

    setTitle('');
    getDiscountsList({
      limit: sizePerPage, page: 1, userType, url: 'coupons',
    });
  }

  // shouldComponentUpdate(nextProps) {
  //   if (!nextProps.discountsListLoaded && !this.state.firstFetchFlag) {
  //     return false;
  //   }

  //   return true;
  // }

  handleGetDiscountsList(limit, page, s) {
    const { getDiscountsList } = this.props;
    const { firstFetchFlag } = this.state;

    if (firstFetchFlag) {
      this.setState({ firstFetchFlag: false });
    }

    getDiscountsList({
      limit, page, s,
    });
  }

  render() {
    const {
      discountsListLoaded,
      discounts,
      updateDiscountStatus,
    } = this.props;
    const { firstFetchFlag } = this.state;

    if (firstFetchFlag && !discountsListLoaded) {
      return (
        <Spinner />
      );
    }

    return (
      <div className="x_panel_">
        <DiscountsTable
          dataset={discounts}
          getData={this.handleGetDiscountsList}
          updateDiscountStatus={updateDiscountStatus}
        />
      </div>
    );
  }
}

DiscountsManagePage.propTypes = {
  discountsListLoaded: bool,
  discounts: any,
  getDiscountsList: func.isRequired,
  // getDiscountDetailsById: func.isRequired,
  // updateDiscountDetails: func.isRequired,
  // deleteDiscountsList: func.isRequired,
  // deleteDiscountById: func.isRequired,
  updateDiscountStatus: func.isRequired,
  setTitle: func.isRequired,
};

DiscountsManagePage.defaultProps = {
  discountsListLoaded: false,
  discounts: {},
};

export default compose(
  AdminLayout,
  connect(
    state => ({
      discountsListLoaded: state.common.requestFinished.discountsList,
      discounts: { discounts: state.admin.discounts.list },
    }),
    dispatch => ({
      // set page title
      setTitle: title => dispatch(setTitle(title)),

      getDiscountsList: (data) => {
        const action = getDiscountsList(data);
        dispatch(action);
        return action.promise;
      },

      getDiscountDetailsById: (data) => {
        const action = getDiscountDetailsById(data);
        dispatch(action);
        return action.promise;
      },

      updateDiscountDetails: (data) => {
        const action = updateDiscountDetails(data);
        dispatch(action);
        return action.promise;
      },
      updateDiscountStatus: (data) => {
        const action = updateDiscountStatus(data);
        dispatch(action);
        return action.promise;
      },
    }),
  ),
  withPermission('listDiscountCode'),
)(DiscountsManagePage);
