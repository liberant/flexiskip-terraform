import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { delay } from 'redux-saga';

import { setTitle } from '../../../common/actions';
import { ALERT_DISPLAY_DURATION } from '../../../common/constants/params';

import {
  getCouncilProductDetailsById,
  updateCouncilProductDetailsById,
  unmountClearProductDetails,
  getProductCouncilDefinations,
  updateCouncilProductStatusById,
  deleteCouncilProductById,
} from '../actions';

import { withPreventingCheckHOC } from '../../../common/hocs';
import AdminLayout from '../../hoc/AdminLayout';

import { Spinner } from '../../../common/components';
import SimpleNewConfirmDlg from '../../../common/components/SimpleNewConfirmDlg';
import CouncilProductDetailsForm from '../components/CouncilProductDetailsForm';


/* eslint no-restricted-globals: 0 */
/* eslint no-underscore-dangle: 0 */

const EDIT_COUNCIL_PRODUCT_FORM = 'admin/editCouncilProductDetail';

const EditCouncilProductDetailsForm = compose(
  reduxForm({
    form: EDIT_COUNCIL_PRODUCT_FORM,
    forceUnregisterOnUnmount: true,
    enableReinitialize: true,
  }),
  withPreventingCheckHOC,
)(CouncilProductDetailsForm);

const selector = formValueSelector(EDIT_COUNCIL_PRODUCT_FORM);


class CouncilProductsManageEditPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      firstFetchFlag: true,
      userType: 'council-products',
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

    };

    this.pagination = {
      limit: 10,
      page: 1,
    };

    this.handleProductSubmit = this.handleProductSubmit.bind(this);
    this.handleSuccesUpdate = this.handleSuccesUpdate.bind(this);
    this.onHandleToggleEdit = this.onHandleToggleEdit.bind(this);

    this.onHandleDeleteRequest = this.onHandleDeleteRequest.bind(this);
    this.onHandleConfirmDeleteRequest = this.onHandleConfirmDeleteRequest.bind(this);
    this.onHandleCancelDeleteRequest = this.onHandleCancelDeleteRequest.bind(this);
    this.onHandleDeleteRequestSuccess = this.onHandleDeleteRequestSuccess.bind(this);

    this.onHandleDisableRequest = this.onHandleDisableRequest.bind(this);
    this.onHandleConfirmDisableRequest = this.onHandleConfirmDisableRequest.bind(this);
    this.onHandleCancelDisableRequest = this.onHandleCancelDisableRequest.bind(this);
    this.onHandleDisableRequestSuccess = this.onHandleDisableRequestSuccess.bind(this);

    this.updateCouncilProductStatusById = this.updateCouncilProductStatusById.bind(this);
    this.deleteCouncilProductById = this.deleteCouncilProductById.bind(this);
  }


  componentDidMount() {
    const {
      setTitle, getCouncilProductDetailsById,
      getProductCouncilDefinations,
      // getCouncilProductList,
    } = this.props;
    const { productId } = this.state;

    setTitle('');

    getProductCouncilDefinations();

    getCouncilProductDetailsById({
      uid: productId,
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

  onHandleToggleEdit() {
    const { isEdit } = this.state;
    this.setState({
      isEdit: !isEdit,
    });
  }

  onHandleDisableRequest() {
    const tmpModalContent = {
      title: 'Are You Sure?',
      subTitle: 'By clicking DISABLE, the council product will be disabled.',
      buttonText: 'DISABLE',
      bottomTitle: 'Do not Disable',
      styles: {
        title: {
          color: '#f06666',
        },
        buttonText: {
          color: 'white',
          backgroundColor: '#f06666',
        },
      },
      handleButtonClick: this.onHandleConfirmDisableRequest,
      handleNoButtonClick: this.onHandleCancelDisableRequest,
    };

    this.setState({
      modalIsOpen: true,
      modalContent: tmpModalContent,
      deleteModalFlag: true,
    });
  }

  async onHandleConfirmDisableRequest() {
    const { productId } = this.state;
    try {
      await this.props.updateCouncilProductStatusById({
        uid: productId,
        status: 'Inactive',
      });

      const tmpModalContent = {
        title: 'Product(s) Disabled',
        subTitle: 'The current council product has been deleted',
        buttonText: 'OK',
        bottomTitle: '',
        styles: {
          // modal: { top: 430 },
          bottomTitle: {
            display: 'none',
          },
        },
        handleButtonClick: this.onHandleDisableRequestSuccess,
      };
      this.setState({
        modalIsOpen: true,
        modalContent: tmpModalContent,
        deleteModalFlag: false,
      });
    } catch (error) {
      const tmpModalContent = {
        title: 'Council Product Disabled Failed',
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
        handleButtonClick: this.onHandleCancelDisableRequest,
      };

      this.setState({
        modalIsOpen: true,
        modalContent: tmpModalContent,
        deleteModalFlag: true,
      });
    }
  }

  onHandleDisableRequestSuccess() {
    this.setState({ modalIsOpen: false });
    // this.handleUpdateInventory();
  }

  onHandleCancelDisableRequest() {
    this.setState({
      deleteModalFlag: false,
      modalIsOpen: false,
    });
  }


  onHandleDeleteRequest() {
    const tmpModalContent = {
      title: 'Are You Sure?',
      subTitle: 'By clicking DELETE, the current council product will be removed.',
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
      await this.props.deleteCouncilProductById({
        url: userType,
        uid: productId,
      });

      const tmpModalContent = {
        title: 'Product Deleted',
        subTitle: 'The current council product has been deleted',
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

  async handleProductSubmit(values) {
    if (!values) {
      return;
    }

    const { updateCouncilProductDetailsById } = this.props;
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
      council,
      product: productId,
      busBinPrice,
      busColPrice,
      resBinPrice,
      resColPrice,
      quantity: allowanceCountTotal,
      qtyPerAddress: allowanceCountPerUnit,
      startDate: typeof (startDate) !== 'string' ? startDate.toISOString() : startDate,
      endDate: typeof (endDate) !== 'string' ? endDate.toISOString() : endDate,
    };

    if (updateCouncilProductDetailsById) {
      await this.props.updateCouncilProductDetailsById({
        uid: productId,
        data,
      });
    }

    this.setState({ isEdit: false });
  }

  async handleSuccesUpdate() {
    await delay(ALERT_DISPLAY_DURATION);
    this.props.history.push('/admin/manage-products');
  }

  async updateCouncilProductStatusById({ status }) {
    const { updateCouncilProductStatusById } = this.props;
    const { productId } = this.state;

    if (updateCouncilProductStatusById) {
      await updateCouncilProductStatusById({
        uid: productId,
        status,
      });
    }
  }

  async deleteCouncilProductById() {
    const { deleteCouncilProductById } = this.props;
    const { productId } = this.state;

    if (deleteCouncilProductById) {
      await deleteCouncilProductById({
        uid: productId,
      });
    }
  }

  render() {
    const {
      productDetails, product,
      councils, council,
    } = this.props;
    const {
      firstFetchFlag, isEdit,
      modalIsOpen, modalContent, deleteModalFlag,
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
        <EditCouncilProductDetailsForm
          addFlag={false}
          editFlag={isEdit}
          data={product}
          council={council}
          councils={councils}
          initialValues={product}
          onSubmit={this.handleProductSubmit}
          handleDeletion={this.onHandleDeleteRequest}
          handleChangeStatus={this.onHandleDisableRequest}
          onToggleEdit={this.onHandleToggleEdit}
        />
      </div>
    );
  }
}

CouncilProductsManageEditPage.propTypes = {
  productDetails: PropTypes.bool.isRequired,
  product: PropTypes.any.isRequired,
  councils: PropTypes.array.isRequired,
  council: PropTypes.any.isRequired,
  match: PropTypes.any.isRequired,
  history: PropTypes.any.isRequired,

  setTitle: PropTypes.func.isRequired,
  getCouncilProductDetailsById: PropTypes.func.isRequired,
  updateCouncilProductDetailsById: PropTypes.func.isRequired,
  unmountClearProductDetails: PropTypes.func.isRequired,
  getProductCouncilDefinations: PropTypes.func.isRequired,
  updateCouncilProductStatusById: PropTypes.func.isRequired,
  deleteCouncilProductById: PropTypes.func.isRequired,
};

CouncilProductsManageEditPage.defaultProps = {
};

export default compose(
  AdminLayout,

  connect(
    (state) => {
      const product = state.admin.products.products.councilProduct || {};
      const councils = state.admin.products.products.councils || [];
      let council = selector(state, 'council') || {};

      if ((typeof (selector(state, 'council')) === 'string') && product.council) {
        if (councils.length > 0) {
          const tmpCouncil = councils.find(c => c._id === product.council);
          if (tmpCouncil) {
            council = {
              val: tmpCouncil,
            };
          } else {
            council = {
              val: {},
            };
          }
        }
      }

      if (selector(state, 'council') && typeof (selector(state, 'council')) !== 'string' && !council.val) {
        const tmpCouncil = council;
        council = {
          val: tmpCouncil,
        };
      }

      return ({
        productDetails: state.common.requestFinished.councilProductDetails || false,
        product,
        councils,
        council,
        form: state.form['admin/editCouncilProductDetail'] || {},
      });
    },
    dispatch => ({
      // set page title
      setTitle: title => dispatch(setTitle(title)),

      getCouncilProductDetailsById: (data) => {
        const action = getCouncilProductDetailsById(data);
        dispatch(action);
        return action.promise;
      },

      updateCouncilProductDetailsById: (data) => {
        const action = updateCouncilProductDetailsById(data);
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

    }),
  ),
)(CouncilProductsManageEditPage);
