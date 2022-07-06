import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { delay } from 'redux-saga';

import { setTitle } from '../../../../common/actions';
import { ALERT_DISPLAY_DURATION } from '../../../../common/constants/params';

import {
  getDiscountDetailsById,
  updateDiscountDetails,
  deleteDiscountById,
  unmountClearDiscountDetails,
  getDiscountRegionDefinations,
  getDiscountProductsList,
} from '../actions';

import { withPreventingCheckHOC } from '../../../../common/hocs';
import DiscountDetailsForm from '../components/DiscountDetailsForm';
import AdminLayout from '../../../hoc/AdminLayout';

// import { materialAllowances } from '../constants/discountDefs';
import { Spinner } from '../../../../common/components';
import SimpleNewConfirmDlg from '../../../../common/components/SimpleNewConfirmDlg';

/* eslint no-restricted-globals: 0 */
/* eslint no-underscore-dangle: 0 */

const EDIT_DISCOUNT_FORM = 'admin/editDiscountDetail';

const EditDiscountDetailsForm = compose(
  reduxForm({
    form: EDIT_DISCOUNT_FORM,
    forceUnregisterOnUnmount: true,
    enableReinitialize: true,
  }),
  withPreventingCheckHOC,
)(DiscountDetailsForm);

const selector = formValueSelector(EDIT_DISCOUNT_FORM);

class DiscountsManageEditPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      firstFetchFlag: true,
      userType: 'coupons',
      discountId: this.props.match.params.id,

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

    this.handleDiscountSubmit = this.handleDiscountSubmit.bind(this);
    this.handleSuccesUpdate = this.handleSuccesUpdate.bind(this);
    // this.handleDeletion = this.handleDeletion.bind(this);
    this.onHandleToggleEdit = this.onHandleToggleEdit.bind(this);

    this.onHandleDeleteRequest = this.onHandleDeleteRequest.bind(this);
    this.onHandleConfirmDeleteRequest = this.onHandleConfirmDeleteRequest.bind(this);
    this.onHandleCancelDeleteRequest = this.onHandleCancelDeleteRequest.bind(this);
    this.onHandleDeleteRequestSuccess = this.onHandleDeleteRequestSuccess.bind(this);
  }


  async componentDidMount() {
    const {
      regions, products,
      setTitle, getDiscountDetailsById,
      getDiscountRegionDefinations, getDiscountProductsList,
    } = this.props;
    const { discountId } = this.state;

    setTitle('');
    if (regions.length < 1) {
      await getDiscountRegionDefinations();
    }
    if (products.length < 1) {
      await getDiscountProductsList();
    }
    getDiscountDetailsById({
      url: 'coupons',
      uid: discountId,
    });
  }

  shouldComponentUpdate(nextProps) {
    if (!nextProps.discountDetails && !this.state.firstFetchFlag) {
      return false;
    }

    return true;
  }

  componentWillUnmount() {
    this.props.unmountClearDiscountDetails();
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
      subTitle: 'By clicking DELETE, this discount will be removed.',
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
    });
  }

  async onHandleConfirmDeleteRequest() {
    const { discountId, userType } = this.state;
    try {
      await this.props.deleteDiscountById({
        url: userType,
        uid: discountId,
      });

      const tmpModalContent = {
        title: 'Discount Deleted',
        subTitle: 'The current discount has been deleted',
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
      });
    } catch (error) {
      const tmpModalContent = {
        title: 'Discount Deleted Failed',
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
      });
    }
  }

  onHandleDeleteRequestSuccess() {
    this.props.history.push('/admin/manage-discounts');
  }

  onHandleCancelDeleteRequest() {
    this.setState({
      modalIsOpen: false,
    });
  }

  async handleDiscountSubmit(values) {
    if (!values) {
      return;
    }

    const { userType, discountId } = this.state;

    const {
      status,
      dateStart,
      code,
      name,
      request,
      regions,
      discount,
      extraProducts,
      dateEnd,
      minProdQty,
      products,
      minPrice,
      type,
      quantity,
    } = values;
    const dataRegions = regions && regions.constructor === Array ? regions.map(r => r._id) : [''];
    const dataProducts = products && products.constructor === Array ? products.map(p => p._id) : [''];
    const dataExtraProducts = extraProducts && extraProducts.constructor === Array ? extraProducts.map(e => ({ product: e.product[0]._id, quantity: e.quantity })) : [''];
    const dataRequest = [];
    if (request[0]) {
      dataRequest.push('bin');
    }
    if (request[1]) {
      dataRequest.push('collection');
    }

    let dataType = type.toLowerCase();
    if (dataType.includes('exact')) {
      dataType = 'flat';
    }

    const data = {
      status,
      dateStart,
      code,
      name,
      request: dataRequest, // now should use dataRequest[0]
      regions: dataRegions,
      discount: discount || 0,
      extraProducts: dataExtraProducts, // now should use dataExtraProducts[0]
      dateEnd,
      minProdQty,
      products: dataProducts,
      minPrice,
      type: dataType,
      quantity,
    };

    await this.props.updateDiscountDetails({
      url: userType,
      uid: discountId,
      data,
    });

    this.setState({ isEdit: false });
  }

  async handleSuccesUpdate() {
    await delay(ALERT_DISPLAY_DURATION);
    this.props.history.push('/admin/manage-discounts');
  }

  render() {
    const {
      discountDetails, discount,
      discountType, products, regions,
    } = this.props;
    const {
      firstFetchFlag, isEdit,
      modalIsOpen, modalContent,
    } = this.state;

    if ((firstFetchFlag && !discountDetails) || (JSON.stringify(discount) === '{}')) {
      return (
        <Spinner />
      );
    }

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
          <span style={modalContent.styles.icon}>
            <span className={modalContent.iconSpanName} />
          </span>
        </SimpleNewConfirmDlg>
        <EditDiscountDetailsForm
          addFlag={false}
          editFlag={isEdit}
          data={{ name: discount.name || '', code: discount.code || '' }}
          initialValues={discount}
          discountType={discountType}
          products={products}
          regions={regions}
          onSubmit={this.handleDiscountSubmit}
          handleDeletion={this.onHandleDeleteRequest}
          onToggleEdit={this.onHandleToggleEdit}
        />
      </div>
    );
  }
}

DiscountsManageEditPage.propTypes = {
  discountDetails: PropTypes.bool.isRequired,
  discount: PropTypes.any.isRequired,

  match: PropTypes.any.isRequired,
  history: PropTypes.any.isRequired,

  setTitle: PropTypes.func.isRequired,
  getDiscountDetailsById: PropTypes.func.isRequired,
  updateDiscountDetails: PropTypes.func.isRequired,
  deleteDiscountById: PropTypes.func.isRequired,
  unmountClearDiscountDetails: PropTypes.func.isRequired,
  discountType: PropTypes.string.isRequired,
  products: PropTypes.any.isRequired,
  regions: PropTypes.any.isRequired,
  getDiscountRegionDefinations: PropTypes.func.isRequired,
  getDiscountProductsList: PropTypes.func.isRequired,
};

DiscountsManageEditPage.defaultProps = {
};

export default compose(
  AdminLayout,

  connect(
    state => ({
      discountDetails: state.common.requestFinished.discountDetails || false,
      discount: state.admin.discounts.list.discount || {},
      form: state.form['admin/editDiscountDetail'] || {},
      discountType: selector(state, 'type') || 'percentage',
      products: state.admin.discounts.list.products || [],
      regions: state.admin.discounts.list.regions || [],
    }),
    dispatch => ({
      // set page title
      setTitle: title => dispatch(setTitle(title)),

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

      deleteDiscountById: (data) => {
        const action = deleteDiscountById(data);
        dispatch(action);
        return action.promise;
      },

      getDiscountRegionDefinations: (data) => {
        const action = getDiscountRegionDefinations(data);
        dispatch(action);
        return action.promise;
      },

      getDiscountProductsList: (data) => {
        const action = getDiscountProductsList(data);
        dispatch(action);
        return action.promise;
      },

      unmountClearDiscountDetails: () => {
        const action = unmountClearDiscountDetails();
        dispatch(action);
        return action.promise;
      },


    }),
  ),
)(DiscountsManageEditPage);
