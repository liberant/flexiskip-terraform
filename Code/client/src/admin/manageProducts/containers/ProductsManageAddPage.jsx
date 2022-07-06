import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';

import { setTitle } from '../../../common/actions';
import { createProduct, getProductMaterialOptions, getProductWastTypesList } from '../actions';
import { withPreventingCheckHOC } from '../../../common/hocs';
import ProductDetailsForm from '../components/ProductDetailsForm';
import AdminLayout from '../../hoc/AdminLayout';
// import { materialAllowances } from '../constants/productDefs';
import SimpleConfirmDlg from '../../../common/components/SimpleConfirmDlg';


const ADD_PRODUCT_FORM = 'admin/addProductDetail';

const AddProductDetailsForm = compose(
  reduxForm({
    form: ADD_PRODUCT_FORM,
  }),
  withPreventingCheckHOC,
)(ProductDetailsForm);

class ProductsManageAddPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdd: true,
      isEdit: true,
      firstFetchFlag: true,
      modalIsOpen: false,
    };

    this.handleProductSubmit = this.handleProductSubmit.bind(this);
    this.handleSuccessCreate = this.handleSuccessCreate.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.reloadPage = this.reloadPage.bind(this);
  }


  componentDidMount() {
    const {
      setTitle, materialsAllowances,
      getProductMaterialOptions,
      getProductWastTypesList,
      wasteTypes,
    } = this.props;

    setTitle('');

    if (materialsAllowances.length < 1) {
      getProductMaterialOptions();
    }

    if (wasteTypes.length < 1) {
      getProductWastTypesList();
    }
  }

  shouldComponentUpdate(nextProps) {
    if (!nextProps.productsListLoaded && !this.state.firstFetchFlag) {
      return false;
    }

    return true;
  }

  async handleProductSubmit(values) {
    if (!values) {
      return;
    }

    const { materialsAllowances } = this.props;

    const {
      vendorCode,
      name,
      weight,
      price,
      postageSize,
      images,
      weightAllowance,
      quantity,
      wasteType,
      size,
      materialsAllowance,
      comment,
      busColPrice,
      businessPrice,
      resColPrice,
      residentialPrice,
      prefix,
      partnerDelivered,
    } = values;

    const s = [];
    if (materialsAllowance && Array.isArray(materialsAllowance)) {
      materialsAllowance.map((m, i) => {
        if (m) {
          s.push(materialsAllowances[i]);
        }

        return true;
      });
    }

    const data = {
      vendorCode,
      name,
      weight,
      price,
      postageSize,
      images,
      weightAllowance,
      quantity,
      wasteType,
      size,
      comment,
      materialsAllowance: s,
      status: 'In Stock',
      busColPrice,
      businessPrice,
      resColPrice,
      residentialPrice,
      prefix,
      partnerDelivered
    };

    await this.props.createProduct({ url: 'products', data });
  }

  handleSuccessCreate() {
    // await delay(ALERT_DISPLAY_DURATION);
    this.openModal();
    // this.props.history.push('/admin/manage-products');
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.props.history.push('/admin/manage-products');
  }

  reloadPage() {
    window.location.reload();
  }

  render() {
    const { modalIsOpen, isAdd, isEdit } = this.state;

    const { materialsAllowances, wasteTypes } = this.props;
    const { dirty, submitSucceeded } = this.props.form;
    if (!dirty && submitSucceeded && !modalIsOpen) {
      this.handleSuccessCreate();
    }

    return (
      <div className="x_panel_">
        <SimpleConfirmDlg
          modalIsOpen={modalIsOpen}
          title="Product Created"
          bottomTitle="Add Another Product"
          handleButtonClick={this.closeModal}
        />
        <AddProductDetailsForm
          initialValues={{
            partnerDelivered: false,
          }}
          addFlag={isAdd}
          editFlag={isEdit}
          wasteTypes={wasteTypes}
          materialsAllowances={materialsAllowances}
          onSubmit={this.handleProductSubmit}
        />
      </div>
    );
  }
}

ProductsManageAddPage.propTypes = {
  setTitle: PropTypes.func.isRequired,
  materialsAllowances: PropTypes.any.isRequired,
  getProductMaterialOptions: PropTypes.func.isRequired,
  productsListLoaded: PropTypes.bool.isRequired,
  createProduct: PropTypes.func.isRequired,
  history: PropTypes.any.isRequired,
  form: PropTypes.any.isRequired,
  wasteTypes: PropTypes.array.isRequired,
  getProductWastTypesList: PropTypes.func.isRequired,
};

ProductsManageAddPage.defaultProps = {
};

export default compose(
  AdminLayout,

  connect(
    state => ({
      productsListLoaded: state.common.requestFinished.productsList,
      products: state.admin.products,
      form: state.form['admin/addProductDetail'] || {},
      wasteTypes: state.admin.products.products.wasteTypes || [],
      materialsAllowances: state.admin.products.products.materialsAllowances || [],
    }),
    dispatch => ({
      // set page title
      setTitle: title => dispatch(setTitle(title)),

      createProduct: (data) => {
        const action = createProduct(data);
        dispatch(action);
        return action.promise;
      },
      getProductMaterialOptions: (data) => {
        const action = getProductMaterialOptions(data);
        dispatch(action);
        return action.promise;
      },
      getProductWastTypesList: (data) => {
        const action = getProductWastTypesList(data);
        dispatch(action);
        return action.promise;
      },

    }),
  ),
)(ProductsManageAddPage);
