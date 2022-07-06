import React, { Component } from 'react';
import { bool, func } from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { setTitle } from '../../../../common/actions';
import { withPermission } from '../../../../common/hocs/PermissionRequired';

import {
  getCollectionRequestsList,
  getCollectionRequestsDetailsById,
  // updateCollectionRequestsDetails,
  // deleteCollectionRequestsList,
  // deleteCollectionRequestsById,
  updateCollectionRequestsStatusById
} from '../actions';
import Spinner from '../../../../common/components/Spinner';

import CollectionRequestsTable from '../components/CollectionRequestsTable';
import AdminLayout from '../../../hoc/AdminLayout';
import { message, Modal } from "antd";
import CollectionRequestForm from '../components/CollectionRequestForm'
import { getCustomersList } from '../../../manageAccounts/actions';
import { getSuppliers } from '../../../supplier/actions';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

/* eslint react/require-default-props: 0 */
/* eslint react/prop-types: 0 */
/* eslint no-unused-expressions: 0 */

class CollectionRequestsManagePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sizePerPage: 25,
      loading: false,
      openRequestModal: false,
    };

    this.handleGetCollectionRequestsList = this.handleGetCollectionRequestsList.bind(
      this
    );
    this.onCreateCollectionRequest = this.onCreateCollectionRequest.bind(this);
  }

  componentDidMount() {
    const { setTitle, getSuppliers } =
      this.props;
    setTitle("");
    this.handleGetCollectionRequestsList();
    getSuppliers();
  }

  handleGetCollectionRequestsList() {
    try {
      this.setState({ loading: true });
      this.props.getCollectionRequestsList();
    } catch (error) {
      // error
    } finally {
      this.setState({ loading: false });
    }
  }

  //open model create collection request
  onCreateCollectionRequest() {
    this.setState({
      openRequestModal: true,
    });
  }

  render() {
    const {
      collectionRequestsListLoaded,
      collectionRequests,
      // deleteCollectionRequestsById,
      // updateCollectionRequestsStatusById,
      // deleteCollectionRequestsList,
      getCustomersList,
      accounts,
    } = this.props;
    const { loading, openRequestModal } = this.state;
    const stripePromise = loadStripe(process.env.STRIPE_PUB_KEY);

    if (loading || !collectionRequestsListLoaded) {
      return <Spinner />;
    }

    return (
      <div className="x_panel_">
        <Modal
          maskClosable={false}
          width="60%"
          title="Make Request"
          visible={openRequestModal}
          footer={null}
          className="w-modal"
          onCancel={() => this.setState({ openRequestModal: false })}
        >
          {openRequestModal ? <Elements stripe={stripePromise}>
            <CollectionRequestForm
              accounts={accounts}
              getCustomersList={getCustomersList}
              closeModal={() => this.setState({ openRequestModal: false })}
            />
          </Elements> : null}

        </Modal>
        <CollectionRequestsTable
          dataset={collectionRequests}
          getData={this.handleGetCollectionRequestsList}
          updateCollectionRequestsStatusById={
            this.props.updateCollectionRequestsStatusById
          }
          onCreateCollectionRequest={this.onCreateCollectionRequest}
        />
      </div>
    );
  }
}

CollectionRequestsManagePage.propTypes = {
  collectionRequestsListLoaded: bool,
  getCollectionRequestsList: func.isRequired,
  // updateCollectionDetails: func.isRequired,
  // deleteCollectionRequestsList: func.isRequired,
  // deleteCollectionRequestsById: func.isRequired,
  // updateCollectionRequestsStatusById: func.isRequired,
  setTitle: func.isRequired,
};

CollectionRequestsManagePage.defaultProps = {
  collectionRequestsListLoaded: false,
};

export default compose(
  AdminLayout,
  connect(
    (state) => ({
      collectionRequestsListLoaded:
        state.common.requestFinished.collectionRequestsList,
      collectionRequests: state.admin.collectionRequests.list,
      accounts: state.admin.accounts,
    }),
    (dispatch) => ({
      // set page title
      setTitle: (title) => dispatch(setTitle(title)),

      getCollectionRequestsList: (data) => {
        const action = getCollectionRequestsList(data);
        dispatch(action);
        return action.promise;
      },

      getCollectionRequestsDetailsById: (data) => {
        const action = getCollectionRequestsDetailsById(data);
        dispatch(action);
        return action.promise;
      },

      updateCollectionRequestsStatusById: (data) => {
        const action = updateCollectionRequestsStatusById(data);
        dispatch(action);
        return action.promise;
      },

      getCustomersList: (data) => {
        const action = getCustomersList(data);
        dispatch(action);
        return action.promise;
      },

      getSuppliers: (data) => {
        const action = getSuppliers(data);
        dispatch(action);
        return action.promise;
      }
    })
  ),
  withPermission("listCollectionRequest")
)(CollectionRequestsManagePage);
