import React, { Component } from 'react';
import { bool, func, object } from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import axios from 'axios';
import { message, Modal } from 'antd';
import { withRouter } from 'react-router-dom';

import { setTitle } from '../../../common/actions';
import { withPermission } from '../../../common/hocs/PermissionRequired';
import {
  getProductRequestsList,
  getProductRequestsDetailsById,
  changeCurrentTab,
  changePerPage,
  updateSearchValue,
  updateFilterState,
  updateLocationKey,
  changeViewMode,
  importProductOrder,
  updateBinDeliveryStatusById,
  createProductRequest,
  updateProductRequestDraft,
} from '../actions';
// Product actions
import { getProductsList } from '../../manageProducts/actions';
// Customer actions
import { getCustomersList } from '../../manageAccounts/actions';
// Discount code
import { getDiscountsList } from '../../manageDiscountCodes/list/actions';
import Spinner from '../../../common/components/Spinner';

import ProductRequestsTable from '../components/ProductRequestsTable';
import AdminLayout from '../../hoc/AdminLayout';
import { printQRCodes } from '../utils';
import ProductRequestForm from '../components/ProductRequestForm';
import httpClient from '../../../common/http';
import { notification } from "antd";

/* eslint react/require-default-props: 0 */
/* eslint react/prop-types: 0 */
/* eslint no-unused-expressions: 0 */
/* eslint no-underscore-dangle: 0 */
/* eslint react/no-did-update-set-state: 0 */
/* eslint no-param-reassign: 0 */


notification.config({
    duration: 1,
  });
class ProductRequestsManagePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sizePerPage: 10,
      firstFetchFlag: true,
      modalIsOpen: false,
      openRequestModal: false,
      dataAddress: null,
      dataProducts: null,
      customerInfo: null,
      classElectoralDivision: null,
      customerNo: null,
      isLoadingPrintQrCode: false
    };

    this.handleGetProductRequestsList = this.handleGetProductRequestsList.bind(
      this
    );
    this.onHandlePrintQRCode = this.onHandlePrintQRCode.bind(this);
    this.handleButtonCancelClick = this.handleButtonCancelClick.bind(this);
    this.handleAddAddress = this.handleAddAddress.bind(this);
  }

  componentDidMount() {
    const {
      setTitle,
      getProductRequestsList,
      productRequests: { locationKey },
      location: { key },
      updateLocationKey,
    } = this.props;

    if (locationKey === null || (locationKey && locationKey !== key)) {
      const { sizePerPage } = this.state;

      setTitle("");
      getProductRequestsList({
        limit: sizePerPage,
        page: 1,
      });
    }
    updateLocationKey(key);
  }

  componentDidUpdate(prevProps) {
    const {
      importProductOrderData: { requesting, data, error },
      productRequests: { createProductRequest },
    } = this.props;

    /** Show dialog */
    if (
      requesting === false &&
      prevProps.importProductOrderData.requesting === true
    ) {
      const modalContent = {
        ...this.state.modalContent,
        title: "",
        subTitle: "",
      };
      if (data !== null && error === null) {
        modalContent.title = "The import order was successed";
      } else {
        modalContent.title = "The import order was failed";
        modalContent.subTitle = error.message;
      }
      this.setState({
        modalIsOpen: true,
        modalContent,
      });
    }

    // Modal for create product request
    if (
      createProductRequest.product &&
      createProductRequest.error === null &&
      createProductRequest.requesting === false &&
      prevProps.productRequests.createProductRequest.requesting
    ) {
      // refresh product requests
      const { sizePerPage } = this.state;
      const {
        changeViewMode,
        productRequests: {
          viewMode,
          search,
          filters,
          pagination: {
            perPage,
          },
        },
      } = this.props;
      const status = viewMode ? 'Pending,In Progress' : '';

      setTitle("");
      this.props.getProductRequestsList({
        limit: perPage,
        page: 1,
        search,
        status,
        filters
      });

      this.openSuccessModal(createProductRequest.product);
      this.setState({
        openRequestModal: false,
      });
    }
  }

  onCreateProductRequest = () => {
    const {
      productRequests: { createProductRequest },
    } = this.props;
    this.props.getProductsList({ limit: 1000, page: 1 });
    this.props.getDiscountsList({ limit: 1000, page: 1 });
    if (
      !createProductRequest.productRequestDraft._id ||
      createProductRequest.product
    ) {
      this.props.updateProductRequestDraft();
    }
    this.setState({
      openRequestModal: true,
    });
  };

  async onHandlePrintQRCode(selectedSet, selectedBinSet) {
    // check selectedSet & selectedBinSet
    if (selectedSet.length < 1 && selectedBinSet.length < 1) {
      return;
    }

    const { productRequests } = this.props;
    // const { getProductRequestsList } = this.props;
    // const { sizePerPage } = this.state;
    let binSets = [];

    // generate the bin set
    if (selectedSet.length > 0) {
      // get every bins
      productRequests.data.forEach((s) => {
        if (selectedSet.includes(s._id)) {
          s.bins.forEach((ts) => binSets.push(ts._id));
        }
      });
    }

    if (binSets.length > 0 && selectedBinSet.length > 0) {
      const tmpBinSets = [];
      selectedBinSet.forEach((s) => {
        if (!binSets.includes(s)) {
          tmpBinSets.push(s);
        }
      });

      if (tmpBinSets.length > 0) {
        binSets = binSets.concat(tmpBinSets);
      }
    } else {
      binSets = binSets.concat(selectedBinSet);
    }

    // get QR Code Images.
    let qrSets;
    try {
      this.setState({
        isLoadingPrintQrCode: true
      })
      qrSets = await httpClient.post("/admin/bins/qrcode", { ids: binSets });
      this.setState({
        isLoadingPrintQrCode: false
      })
    } catch (error) {
      this.setState({
        isLoadingPrintQrCode: false
      })
      const errMessage = error.response
        ? error.response.data.message
        : error.message;
      message.error(errMessage);
      return;
    }

    if (
      qrSets.data &&
      qrSets.data.constructor === Array &&
      qrSets.data.length > 0
    ) {
      let content = "";
      qrSets.data.forEach((q) => {
        content = `<div style="height: 210px; width: 210px;display: flex;justify-content: center;align-items: center;"><span style="display: inline-block;text-align:center;width: 170px;"><img src=${q.qrCodeImage} alt=${q.code} crossOrigin="anonymous" class="qrcode-print" /> <div>${q.code}</div><div>${q.name}</div><div>${q.binRequest.code}</div></span></div>`;
        printQRCodes({
          content,
          title: `${q.code} - ${q.name} - ${q.binRequest.code}`,
        });
      });
    }

    // getProductRequestsList({
    //   limit: sizePerPage, page: 1,
    // });
  }

  openSuccessModal = (product = {}) => {
    const secondsToGo = 3;
    const modal = Modal.success({
      centered: true,
      iconType: "none",
      content: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            marginLeft: "-38px",
          }}
        >
          <div style={{ fontSize: "48px", color: "#239dff" }}>
            <span className="handel-check-circle" />
          </div>
          <div
            style={{
              color: "#666",
              fontSize: "18px",
              fontWeight: 600,
              marginBottom: "20px",
            }}
          >
            Product Request Created
          </div>
          <div style={{ color: "#666", fontSize: "14px" }}>Order ID</div>
          <div
            style={{
              color: "#239dff",
              fontSize: "32px",
              fontWeight: 600,
              marginBottom: "40px",
            }}
          >
            {product.code}
          </div>
        </div>
      ),
      okButtonProps: {
        style: {
          position: "absolute",
          bottom: 10,
          left: "50%",
          transform: "translate(-50%)",
          marginBottom: 15,
          width: "200px",
        },
      },
      maskClosable: true,
      onOk: () => {
        modal.destroy();
        // redirect to detail page
        const { history } = this.props;
        history.push(`/admin/product-requests-edit/${product._id}`);
      },
      onCancel: () => {
        modal.destroy();
        // redirect to detail page
        const { history } = this.props;
        history.push(`/admin/product-requests-edit/${product._id}`);
      },
    });
    setTimeout(() => {
      modal.destroy();
      // redirect to detail page
      const { history } = this.props;
      history.push(`/admin/product-requests-edit/${product._id}`);
    }, secondsToGo * 1000);
  };

  getSelectedProduct = values => {
    this.setState({
      dataProducts: values
    })
  }
  getCustomerInfo = value => {
    this.setState({
      customerInfo: value
    })
  }


  handleSubmit = (values) => {
    const {
      productRequestDraft,
    } = this.props.productRequests.createProductRequest;
    let tmpProductRequestDraft = {
      ...productRequestDraft,
      ...values,
      class_electoral_division: this.state.classElectoralDivision,
      customer_no: this.state.customerNo,
    };
    if(this.state.customerInfo.prefix === "standard"){
      const isGccElement = (item) => item.prefix === "gc"
      const isGccElementStatus = this.state.dataProducts.some(isGccElement)
      if(isGccElementStatus){
        notification.warning({
            message: "Warning",
            description:
              "Standard customers can't order GCC product. Please remove GCC product in your product list.",
          });
      }else{
        this.props.createProductRequest(tmpProductRequestDraft);
      }
    }else{
      this.props.createProductRequest(tmpProductRequestDraft);
    }
  };

  handleAddAddress(dataAddress) {
    if (dataAddress) {
      this.setState({
        dataAddress,
        classElectoralDivision: dataAddress.class_electoral_division,
        customerNo: dataAddress.customer_no,
      });
    }
  }

  handleButtonCancelClick() {
    const { getProductRequestsList, importProductOrderData } = this.props;
    const { sizePerPage } = this.state;

    this.setState(
      {
        modalIsOpen: false,
      },
      () => {
        /** Re-fresh list data */
        if (importProductOrderData.data) {
          getProductRequestsList({
            limit: sizePerPage,
            page: 1,
          });
        }
      }
    );
  }

  handleGetProductRequestsList(limit, page, name, url, search, status = "", filters = {}) {
    const { getProductRequestsList } = this.props;
    const { firstFetchFlag } = this.state;
    const { flexiskipFilter, partnerDeliveredFilter } = filters;

    firstFetchFlag && this.setState({ firstFetchFlag: false });
    getProductRequestsList({
      limit,
      page,
      name,
      url,
      search,
      status,
      filters
    });
  }

  renderFailedImport() {
    const { importProductOrderData } = this.props;
    if (importProductOrderData.error) {
      let errors = null;
      if (
        importProductOrderData.error.errors &&
        importProductOrderData.error.errors.errors
      ) {
        errors = importProductOrderData.error.errors.errors.map((err) => {
          const deepCloneError = { ...err };
          const line = `At line ${deepCloneError.line}`;
          delete deepCloneError.line;
          return (
            <div>
              {Object.values(deepCloneError).join(", ")} {line}
            </div>
          );
        });
      }

      return (
        <div>
          Import failed:{" "}
          {importProductOrderData.error && importProductOrderData.error.message}
          <div>{errors}</div>
        </div>
      );
    }
    return null;
  }

  render() {
    const {
      productRequestsListLoaded,
      productRequests,
      importProductOrderData,
      products,
      getCustomersList,
      accounts,
      discounts,
      updateProductRequestDraft,
    } = this.props;
    const { createProductRequest } = productRequests;
    const { firstFetchFlag, modalIsOpen, openRequestModal, isLoadingPrintQrCode } = this.state;
    if (firstFetchFlag && !productRequestsListLoaded) {
      return <Spinner />;
    }

    return (
      <div className="x_panel_">
        <Modal
          title="Import Order Message"
          visible={modalIsOpen}
          onCancel={this.handleButtonCancelClick}
          footer={null}
          className="w-modal"
        >
          {importProductOrderData.data ? (
            <div>Import successed</div>
          ) : (
            this.renderFailedImport()
          )}
        </Modal>
        <Modal
          width="60%"
          title="Make Request"
          visible={openRequestModal}
          maskClosable={false}
          footer={null}
          className="w-modal"
          onCancel={() => this.setState({ openRequestModal: false })}
        >
          {
            openRequestModal ? <ProductRequestForm
            products={products}
            accounts={accounts}
            discounts={discounts}
            productRequestDraft={createProductRequest.productRequestDraft}
            getCustomerInfo={this.getCustomerInfo}
            getSelectedProduct={this.getSelectedProduct}
            onSubmit={this.handleSubmit}
            getCustomersList={getCustomersList}
            isSubmitting={createProductRequest.requesting}
            updateProductRequestDraft={updateProductRequestDraft}
            submitErrors={createProductRequest.error}
            handleAddAddress={this.handleAddAddress}
          /> : null
          }

        </Modal>
        <ProductRequestsTable
          isLoadingPrintQrCode={isLoadingPrintQrCode}
          dataset={productRequests}
          getData={this.handleGetProductRequestsList}
          onHandlePrintQRCode={this.onHandlePrintQRCode}
          changeCurrentTab={this.props.changeCurrentTab}
          changePerPage={this.props.changePerPage}
          updateSearchValue={this.props.updateSearchValue}
          updateFilterState={this.props.updateFilterState}
          changeViewMode={this.props.changeViewMode}
          updateProductRequestList={this.props.updateProductRequestList}
          importProductOrder={this.props.importProductOrder}
          importProductOrderData={this.props.importProductOrderData}
          updateBinDeliveryStatusById={this.props.updateBinDeliveryStatusById}
          onCreateProductRequest={this.onCreateProductRequest}
        />
      </div>
    );
  }
}

ProductRequestsManagePage.propTypes = {
  productRequestsListLoaded: bool,
  getProductRequestsList: func.isRequired,
  setTitle: func.isRequired,
  importProductOrder: func.isRequired,
  importProductOrderData: object.isRequired,
};

ProductRequestsManagePage.defaultProps = {
  productRequestsListLoaded: false,
};

export default compose(
  AdminLayout,
  connect(
    state => ({
      productRequestsListLoaded: state.common.requestFinished.productRequestsList,
      productRequests: state.admin.productRequests.productRequests,
      filters: state.admin.productRequests.productRequests.filters,
      importProductOrderData: state.admin.productRequests.productRequests.importProductOrder,
      form: state.form,
      products: state.admin.products.products,
      accounts: state.admin.accounts,
      discounts: state.admin.discounts.list,
    }),
    dispatch => ({
      ...bindActionCreators({
        importProductOrder,
      }, dispatch),

      // set page title
      setTitle: title => dispatch(setTitle(title)),

      getProductRequestsList: (data) => {
        const action = getProductRequestsList(data);
        dispatch(action);
        return action.promise;
      },

      getProductRequestsDetailsById: (data) => {
        const action = getProductRequestsDetailsById(data);
        dispatch(action);
        return action.promise;
      },
      changeCurrentTab: (tab) => {
        const action = changeCurrentTab(tab);
        dispatch(action);
        return action.promise;
      },
      changePerPage: (page) => {
        const action = changePerPage(page);
        dispatch(action);
        return action.promise;
      },
      updateSearchValue: (search) => {
        const action = updateSearchValue(search);
        dispatch(action);
        return action.promise;
      },
      updateFilterState: (search) => {
        const action = updateFilterState(search);
        dispatch(action);
        return action.promise;
      },
      updateLocationKey: (key) => {
        const action = updateLocationKey(key);
        dispatch(action);
        return action.promise;
      },
      changeViewMode: (viewMode) => {
        const action = changeViewMode(viewMode);
        dispatch(action);
        return action.promise;
      },
      updateBinDeliveryStatusById: (data) => {
        const action = updateBinDeliveryStatusById(data);
        dispatch(action);
        return action.promise;
      },
      getProductsList: (data) => {
        const action = getProductsList(data);
        dispatch(action);
        return action.promise;
      },
      getCustomersList: (data) => {
        const action = getCustomersList(data);
        dispatch(action);
        return action.promise;
      },
      createProductRequest: (data) => {
        const action = createProductRequest(data);
        dispatch(action);
        return action.promise;
      },
      getDiscountsList: (data) => {
        const action = getDiscountsList(data);
        dispatch(action);
        return action.promise;
      },
      updateProductRequestDraft: (data) => {
        const action = updateProductRequestDraft(data);
        dispatch(action);
        return action.promise;
      },
    }),
  ),
  withPermission('listProductRequest'),
  withPermission('listProduct'),
)(withRouter(ProductRequestsManagePage));
