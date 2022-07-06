import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { delay } from 'redux-saga';

import { setTitle } from '../../../common/actions';
import { ALERT_DISPLAY_DURATION } from '../../../common/constants/params';

import {
  getProductDetailsById,
  updateProductDetails,
  deleteProductById,
  unmountClearProductDetails,
  getProductCouncilDefinations,
  createCouncilProduct,
  getCouncilProductList,
  updateCouncilProductStatusById,
  deleteCouncilProductById,
  getProductWastTypesList,
} from '../actions';

import { withPreventingCheckHOC } from '../../../common/hocs';
import AdminLayout from '../../hoc/AdminLayout';

// import { materialAllowances } from '../constants/productDefs';
import { Spinner } from '../../../common/components';
import SimpleNewConfirmDlg from '../../../common/components/SimpleNewConfirmDlg';
import CouncilCodeForm from '../components/CouncilCodeForm';
import ProductDetailsForm from '../components/ProductDetailsForm';


/* eslint no-restricted-globals: 0 */
/* eslint no-underscore-dangle: 0 */

const EDIT_PRODUCT_FORM = 'admin/editProductDetail';

const EditProductDetailsForm = compose(
  reduxForm({
    form: EDIT_PRODUCT_FORM,
    forceUnregisterOnUnmount: true,
    enableReinitialize: true,
  }),
  withPreventingCheckHOC,
)(ProductDetailsForm);

const COUNCIL_CODE_FORM = 'admin/addCouncilCode';

const AddCouncilCodeForm = compose(
  reduxForm({
    form: COUNCIL_CODE_FORM,
    forceUnregisterOnUnmount: true,
    enableReinitialize: true,
  }),
  withPreventingCheckHOC,
)(CouncilCodeForm);

const selector = formValueSelector(COUNCIL_CODE_FORM);


class ProductsManageEditPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      firstFetchFlag: true,
      userType: 'products',
      productId: this.props.match.params.id,

      modalIsOpen: false,
      modalContent: {
        styles: { modal: { top: 430 } },
        title: 'Email Sent',
        subTitle: 'Password reset instructions is sent to',
        buttonText: 'OK',
        bottomTitle: '',
        handleButtonClick: () => { },
        handleNoButtonClick: () => { },
      },

      dlgIsOpen: false,
    };

    this.pagination = {
      limit: 10,
      page: 1,
    };

    this.handleProductSubmit = this.handleProductSubmit.bind(this);
    this.handleSuccesUpdate = this.handleSuccesUpdate.bind(this);
    // this.handleDeletion = this.handleDeletion.bind(this);
    this.onHandleToggleEdit = this.onHandleToggleEdit.bind(this);

    this.onHandleDeleteRequest = this.onHandleDeleteRequest.bind(this);
    this.onHandleConfirmDeleteRequest = this.onHandleConfirmDeleteRequest.bind(this);
    this.onHandleCancelDeleteRequest = this.onHandleCancelDeleteRequest.bind(this);
    this.onHandleDeleteRequestSuccess = this.onHandleDeleteRequestSuccess.bind(this);

    this.onHandleAddCouncilCode = this.onHandleAddCouncilCode.bind(this);
    this.onHandleCloseCouncilCodeDlg = this.onHandleCloseCouncilCodeDlg.bind(this);
    this.addCouncilCode = this.addCouncilCode.bind(this);
    this.getCouncilProductList = this.getCouncilProductList.bind(this);
    this.updateCouncilProductStatusById = this.updateCouncilProductStatusById.bind(this);
    this.deleteCouncilProductById = this.deleteCouncilProductById.bind(this);
  }


  componentDidMount() {
    const {
      setTitle, getProductDetailsById, wasteTypes,
      councils, getProductCouncilDefinations,
      getProductWastTypesList, getCouncilProductList,
    } = this.props;
    const { userType, productId } = this.state;

    setTitle('');
    if (councils.length < 1) {
      getProductCouncilDefinations();
    }
    if (wasteTypes.length < 1) {
      getProductWastTypesList();
    }
    getProductDetailsById({
      userType,
      url: 'products',
      uid: productId,
    });
    getCouncilProductList({
      uid: productId,
      ...this.pagination,
    });
  }

  shouldComponentUpdate(nextProps) {
    if (!nextProps.productDetails && !this.state.firstFetchFlag) {
      return false;
    }

    return true;
  }

  componentWillUnmount() {
    this.props.unmountClearProductDetails();
  }

  onHandleAddCouncilCode() {
    this.setState({ dlgIsOpen: true });
    const bodyDom = window.document.getElementsByTagName('body');
    if (bodyDom) {
      bodyDom[0].style.overflow = 'hidden';
    }
  }

  onHandleCloseCouncilCodeDlg() {
    this.setState({ dlgIsOpen: false });
    const bodyDom = window.document.getElementsByTagName('body');
    if (bodyDom) {
      bodyDom[0].style.overflow = 'auto';
    }
    const datePicker = window.document.getElementsByClassName('rw-widget-picker rw-widget-container');
    if (datePicker && datePicker[0]) {
      datePicker[0].style.lineHeight = '44px';
    }
  }

  onHandleToggleEdit() {
    const { isEdit } = this.state;
    this.setState({
      isEdit: !isEdit,
    });
  }

  onHandleDeleteRequest() {
    const tmpModalContent = {
      title: 'Are You Sure?',
      subTitle: 'By clicking DELETE, this product will be removed.',
      buttonText: 'DELETE',
      bottomTitle: 'Do not Delete',
      styles: {
        title: {
          color: '#f06666',
        },
        buttonText: {
          color: 'white',
          backgroundColor: '#f06666',
        },
      },
      handleButtonClick: this.onHandleConfirmDeleteRequest,
      handleNoButtonClick: this.onHandleCancelDeleteRequest,
    };

    this.setState({
      modalIsOpen: true,
      modalContent: tmpModalContent,
      deleteModalFlag: true,
    });
  }

  async onHandleConfirmDeleteRequest() {
    const { productId, userType } = this.state;
    try {
      await this.props.deleteProductById({
        url: userType,
        uid: productId,
      });

      const tmpModalContent = {
        title: 'Product Deleted',
        subTitle: 'The current product has been deleted',
        buttonText: 'OK',
        bottomTitle: '',
        styles: {
          // modal: { top: 430 },
          bottomTitle: {
            display: 'none',
          },
        },
        handleButtonClick: this.onHandleDeleteRequestSuccess,
      };
      this.setState({
        modalIsOpen: true,
        modalContent: tmpModalContent,
        deleteModalFlag: false,
      });
    } catch (error) {
      const tmpModalContent = {
        title: 'Product Deleted Failed',
        subTitle: `Error occured: ${error.message}`,
        buttonText: 'OK',
        bottomTitle: '',
        styles: {
          title: {
            color: '#f06666',
          },
          buttonText: {
            color: 'white',
            backgroundColor: '#f06666',
          },
          bottomTitle: {
            display: 'none',
          },
        },
        handleButtonClick: this.onHandleCancelDeleteRequest,
      };

      this.setState({
        modalIsOpen: true,
        modalContent: tmpModalContent,
        deleteModalFlag: true,
      });
    }
  }

  onHandleDeleteRequestSuccess() {
    this.props.history.push('/admin/manage-products');
  }

  onHandleCancelDeleteRequest() {
    this.setState({
      deleteModalFlag: false,
      modalIsOpen: false,
    });
  }

  getCouncilProductList(perPage, page) {
    const { getCouncilProductList } = this.props;
    const { productId } = this.state;

    if (getCouncilProductList) {
      getCouncilProductList({
        uid: productId,
        limit: perPage,
        page,
      });

      this.pagination.limit = perPage;
      this.pagination.page = page;
    }
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
      status,
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
      status,
      busColPrice,
      businessPrice,
      resColPrice,
      residentialPrice,
      prefix,
      partnerDelivered,
    };

    const { productId, userType } = this.state;

    const response = await this.props.updateProductDetails({
      url: userType,
      uid: productId,
      data,
    });
    if (response.status === '200') {
      await delay(ALERT_DISPLAY_DURATION);
    }

    this.setState({ isEdit: false });
  }

  async handleSuccesUpdate() {
    await delay(ALERT_DISPLAY_DURATION);
    this.props.history.push('/admin/manage-products');
  }

  async addCouncilCode(values) {
    if (!values || !values.council || !this.props.product) {
      return;
    }

    const { createCouncilProduct, getCouncilProductList } = this.props;
    const { productId } = this.state;
    const {
      council, name,
      busBinPrice, busColPrice,
      resBinPrice, resColPrice,
      startDate, endDate,
      allowanceCountTotal, allowanceCountPerUnit,
    } = values;
    const data = {
      name,
      council: council._id,
      product: productId,
      busBinPrice,
      busColPrice,
      resBinPrice,
      resColPrice,
      quantity: allowanceCountTotal,
      qtyPerAddress: allowanceCountPerUnit,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    if (createCouncilProduct) {
      await createCouncilProduct(data);
      await getCouncilProductList({
        uid: productId,
        ...this.pagination,
      });
      this.onHandleCloseCouncilCodeDlg();
    }
  }


  async updateCouncilProductStatusById({ uid, status }) {
    const { updateCouncilProductStatusById, getCouncilProductList } = this.props;
    const { productId } = this.state;

    if (updateCouncilProductStatusById) {
      await updateCouncilProductStatusById({
        uid,
        status,
      });

      await getCouncilProductList({
        uid: productId,
        ...this.pagination,
      });
    }
  }

  async deleteCouncilProductById(id) {
    const { deleteCouncilProductById, getCouncilProductList } = this.props;
    const { productId } = this.state;

    if (deleteCouncilProductById) {
      await deleteCouncilProductById({
        uid: id,
      });
      await getCouncilProductList({
        uid: productId,
        ...this.pagination,
      });
    }
  }

  render() {
    const {
      productDetails, product, materialsAllowances,
      councils, council, wasteTypes, councilProducts,
      // form: { dirty, submitSucceeded },
    } = this.props;
    const {
      firstFetchFlag, isEdit,
      modalIsOpen, modalContent, deleteModalFlag,
      dlgIsOpen,
    } = this.state;

    if ((firstFetchFlag && !productDetails) || (JSON.stringify(product) === '{}')) {
      return (
        <Spinner />
      );
    }

    // if (!dirty && submitSucceeded) {
    //   this.handleSuccesUpdate();
    // }

    return (
      <div className="x_panel_">
        <SimpleNewConfirmDlg
          modalIsOpen={modalIsOpen}
          styles={modalContent.styles}
          title={modalContent.title}
          subTitle={modalContent.subTitle}
          buttonText={modalContent.buttonText}
          bottomTitle={modalContent.bottomTitle}
          handleButtonClick={modalContent.handleButtonClick}
          handleNoButtonClick={modalContent.handleNoButtonClick}
        >
          {
            deleteModalFlag ? (
              <span style={{ fontSize: 68, color: '#f06666' }}>
                <span className="handel-question" />
              </span>) : null
          }
        </SimpleNewConfirmDlg>
        <AddCouncilCodeForm
          dlgIsOpen={dlgIsOpen}
          councils={councils}
          council={council}
          product={product}
          onSubmit={this.addCouncilCode}
          handleCloseDlg={this.onHandleCloseCouncilCodeDlg}
        />
        <EditProductDetailsForm
          addFlag={false}
          editFlag={isEdit}
          data={{ name: product.name || '', code: product.code || '' }}
          councilProducts={councilProducts}
          materialsAllowances={materialsAllowances}
          initialValues={product}
          wasteTypes={wasteTypes}
          onSubmit={this.handleProductSubmit}
          handleDeletion={this.onHandleDeleteRequest}
          onToggleEdit={this.onHandleToggleEdit}
          handleAddCouncilCode={this.onHandleAddCouncilCode}
          getCouncilProductList={this.getCouncilProductList}
          updateCouncilProductStatusById={this.updateCouncilProductStatusById}
          deleteCouncilProductById={this.deleteCouncilProductById}
        />
      </div>
    );
  }
}

ProductsManageEditPage.propTypes = {
  productDetails: PropTypes.bool.isRequired,
  product: PropTypes.any.isRequired,
  materialsAllowances: PropTypes.any.isRequired,
  councils: PropTypes.array.isRequired,
  council: PropTypes.any.isRequired,
  councilProducts: PropTypes.any.isRequired,

  match: PropTypes.any.isRequired,
  history: PropTypes.any.isRequired,

  setTitle: PropTypes.func.isRequired,
  getProductDetailsById: PropTypes.func.isRequired,
  updateProductDetails: PropTypes.func.isRequired,
  deleteProductById: PropTypes.func.isRequired,
  unmountClearProductDetails: PropTypes.func.isRequired,
  getProductCouncilDefinations: PropTypes.func.isRequired,
  createCouncilProduct: PropTypes.func.isRequired,
  getCouncilProductList: PropTypes.func.isRequired,
  updateCouncilProductStatusById: PropTypes.func.isRequired,
  deleteCouncilProductById: PropTypes.func.isRequired,
  wasteTypes: PropTypes.array.isRequired,
  getProductWastTypesList: PropTypes.func.isRequired,
};

ProductsManageEditPage.defaultProps = {
};

export default compose(
  AdminLayout,

  connect(
    (state) => {
      let council = selector(state, 'council') || {};
      if (selector(state, 'council') && typeof (selector(state, 'council')) !== 'string' && !council.val) {
        const tmpCouncil = council;
        council = {
          val: tmpCouncil,
        };
      }

      return ({
        productDetails: state.common.requestFinished.productDetails || false,
        product: state.admin.products.products.product || {},
        councils: state.admin.products.products.councils || [],
        councilProducts: state.admin.products.products.councilProducts || [],
        council,
        form: state.form['admin/editProductDetail'] || {},
        wasteTypes: state.admin.products.products.wasteTypes || [],
        materialsAllowances: state.admin.products.products.materialsAllowances || [],
      });
    },
    dispatch => ({
      // set page title
      setTitle: title => dispatch(setTitle(title)),

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

      deleteProductById: (data) => {
        const action = deleteProductById(data);
        dispatch(action);
        return action.promise;
      },

      unmountClearProductDetails: () => {
        const action = unmountClearProductDetails();
        dispatch(action);
        return action.promise;
      },
      getProductCouncilDefinations: (data) => {
        const action = getProductCouncilDefinations(data);
        dispatch(action);
        return action.promise;
      },

      createCouncilProduct: (data) => {
        const action = createCouncilProduct(data);
        dispatch(action);
        return action.promise;
      },

      getCouncilProductList: (data) => {
        const action = getCouncilProductList(data);
        dispatch(action);
        return action.promise;
      },

      updateCouncilProductStatusById: (data) => {
        const action = updateCouncilProductStatusById(data);
        dispatch(action);
        return action.promise;
      },

      deleteCouncilProductById: (data) => {
        const action = deleteCouncilProductById(data);
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
)(ProductsManageEditPage);
