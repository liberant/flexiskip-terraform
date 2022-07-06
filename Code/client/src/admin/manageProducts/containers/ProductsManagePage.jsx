import React, { Component } from 'react';
import { any, bool, func } from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { setTitle } from '../../../common/actions';
import { withPermission } from '../../../common/hocs/PermissionRequired';
import {
  getProductsList,
  getProductDetailsById,
  updateProductDetails,
  deleteProductsList,
  deleteProductById,
  updateProductStatusById,
} from '../actions';
import Spinner from '../../../common/components/Spinner';

import ProductsTable from '../components/ProductsTable';
import AdminLayout from '../../hoc/AdminLayout';

class ProductsManagePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sizePerPage: 10,
      firstFetchFlag: true,
    };

    this.handleGetProductsList = this.handleGetProductsList.bind(this);
  }


  componentDidMount() {
    const { setTitle, getProductsList } = this.props;
    const { sizePerPage } = this.state;

    setTitle('');
    getProductsList({
      limit: sizePerPage, page: 1,
    });
  }

  // shouldComponentUpdate(nextProps) {
  //   if (!nextProps.productsListLoaded && !this.state.firstFetchFlag) {
  //     return false;
  //   }

  //   return true;
  // }

  handleGetProductsList(limit, page, s) {
    const { getProductsList } = this.props;
    const { firstFetchFlag } = this.state;

    if (firstFetchFlag) {
      this.setState({ firstFetchFlag: false });
    }

    getProductsList({
      limit, page, s,
    });
  }

  render() {
    const {
      productsListLoaded,
      products,
      deleteProductById,
      updateProductStatusById,
      deleteProductsList,
    } = this.props;
    const { firstFetchFlag } = this.state;

    if (firstFetchFlag && !productsListLoaded) {
      return (
        <Spinner />
      );
    }

    return (
      <div className="x_panel_">
        <ProductsTable
          dataset={products}
          getData={this.handleGetProductsList}
          deleteProductById={deleteProductById}
          updateProductStatusById={updateProductStatusById}
          deleteProductsList={deleteProductsList}
        />
      </div>
    );
  }
}

ProductsManagePage.propTypes = {
  productsListLoaded: bool,
  products: any,
  getProductsList: func.isRequired,
  // getProductDetailsById: func.isRequired,
  // updateProductDetails: func.isRequired,
  deleteProductsList: func.isRequired,
  deleteProductById: func.isRequired,
  updateProductStatusById: func.isRequired,
  setTitle: func.isRequired,
};

ProductsManagePage.defaultProps = {
  productsListLoaded: false,
  products: {},
};

export default compose(
  AdminLayout,
  connect(
    state => ({
      productsListLoaded: state.common.requestFinished.productsList,
      products: state.admin.products,
    }),
    dispatch => ({
      // set page title
      setTitle: title => dispatch(setTitle(title)),

      getProductsList: (data) => {
        const action = getProductsList(data);
        dispatch(action);
        return action.promise;
      },

      getProductDetailsById: (data) => {
        const action = getProductDetailsById(data);
        dispatch(action);
        return action.promise;
      },

      updateProductDetails: (data) => {
        const action = updateProductDetails(data);
        dispatch(action);
        return action.promise;
      },

      deleteProductsList: (data) => {
        const action = deleteProductsList(data);
        dispatch(action);
        return action.promise;
      },

      deleteProductById: (data) => {
        const action = deleteProductById(data);
        dispatch(action);
        return action.promise;
      },

      updateProductStatusById: (data) => {
        const action = updateProductStatusById(data);
        dispatch(action);
        return action.promise;
      },

    }),
  ),
  withPermission('listProduct'),
)(ProductsManagePage);
