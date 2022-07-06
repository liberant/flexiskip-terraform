import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  // CommonBSTable,
  CommonTable,
  InnerSearch,
} from '../../../../common/components';

import styles from './Styles';
import { columnDefs, columnsSubItems } from './columnsDef';
import { collectionRequestFormatterWithDropdown } from '../../../../common/components/BSTableFormatters';
import { TIME_OUT_DEBOUNCE } from '../../../../common/constants/params';
import HandelButton from "../../../../common/components/HandelButton";
import ModalAssignSupplier from "./ModalAssignSupplier";
import ModalBinsDetails from './ModalBinsDetails';
/* eslint no-underscore-dangle: 0 */
import Spinner from '../../../../common/components/Spinner';


class CollectionRequestsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      perPage: 25,
      expandAll: false,
      s: '',
      loading: false,
      collectionSelected: undefined,
      isAssignSupplier: false,
      isShowBinsDetails: false,
    };

    this.selectedSet = [];
    this.selectedBinSet = [];
    this.checkboxTable = null;

    this.handleTableChange = this.handleTableChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handlePerPageChange = this.handlePerPageChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.onHandleExpandAll = this.onHandleExpandAll.bind(this);
    this.onHandleCollapseAll = this.onHandleCollapseAll.bind(this);
    this.handleSelectSub = this.handleSelectSub.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.setCollectionSelected = this.setCollectionSelected.bind(this);
    this.handleShowAssignModal = this.handleShowAssignModal.bind(this);
    this.handleShowBinsDetailsModal = this.handleShowBinsDetailsModal.bind(this);
    this.rendercollectionRequestStatus = this.rendercollectionRequestStatus.bind(this);
    this.onCollectionRequestStatusChange = this.onCollectionRequestStatusChange.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.dataset !== this.props.dataset) {
      this.selectedSet = [];
    }
    return true;
  }

  onHandleExpandAll() {
    this.setState({
      expandAll: true,
    });
  }

  onHandleCollapseAll() {
    this.setState({
      expandAll: false,
    });
  }

  setCollectionSelected(collection) {
    this.setState(() => ({ collectionSelected: collection }));
  }

  handleShowAssignModal(collection) {
    if(!collection){
      this.setState(() => ({ collectionSelected: undefined, isAssignSupplier: false }));
      return;
    }
    this.setState(() => ({ collectionSelected: collection, isAssignSupplier: true }));
  }

  handleShowBinsDetailsModal(collection) {
    if (!collection) {
      this.setState(() => ({ collectionSelected: undefined, isShowBinsDetails: false }));
      return;
    }
    this.setState(() => ({ collectionSelected: collection, isShowBinsDetails: true }));
  }

  handleTableChange(type, { page }) {
    const { perPage } = this.state;
    this.setState(() => ({ loading: true }));
    this.props.getData(perPage, page);
  }

  handlePerPageChange(val) {
    const { s, page } = this.state;
    this.setState(() => ({ loading: true, perPage: val }));
    localStorage.setItem('collectionRequestsTable', JSON.stringify({ s, limit: val, page }));
    this.props.getData();
  }

  handlePageChange(page) {
    const { s, perPage } = this.state;
    this.setState(() => ({ loading: true, page }));
    localStorage.setItem('collectionRequestsTable', JSON.stringify({ s, limit: perPage, page }));
    this.props.getData();
  }

  handleSearch(event) {
    const { page, perPage } = this.state;
    const s = event.target.value;
    this.setState(() => ({ s, loading: true }));
    localStorage.setItem('collectionRequestsTable', JSON.stringify({ s, limit: perPage, page }));
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.props.getData(), TIME_OUT_DEBOUNCE);
  }

  componentDidMount() {
    const table = JSON.parse(localStorage.getItem('collectionRequestsTable'));
    if (table) {
      this.setState(() => ({
        s: table.s,
        perPage: table.limit,
        page: table.page,
      }));
    }
  }

  handleSelect(selection) {
    this.selectedSet = selection;
  }

  handleSelectSub(newSet, removedSet) {
    if (removedSet) {
      removedSet.forEach((r) => {
        this.selectedBinSet = this.selectedBinSet.filter(f => f !== r);
      });
    }
    if (newSet) {
      newSet.forEach((n) => {
        if (!this.selectedBinSet.includes(n)) {
          this.selectedBinSet.push(n);
        }
      });
    }
  }

  // Update delivery status
  onCollectionRequestStatusChange = async (status, id) => {
    this.setState({ loading: true });
    await this.props.updateCollectionRequestsStatusById({
      uid: id,
      status,
    });
    this.setState({ loading: false });
  }

  rendercollectionRequestStatus(text, record) {
    return collectionRequestFormatterWithDropdown(text, record, this.onCollectionRequestStatusChange);
  }

  render() {
    const { dataset, onCreateCollectionRequest } = this.props;
    const {
      perPage,
      s,
      loading,
      expandAll,
      collectionSelected,
      isAssignSupplier,
      isShowBinsDetails
    } = this.state;

    const statusColIndex = columnDefs.findIndex(c => c.accessor === 'status');
    columnDefs[statusColIndex].Cell = row => (
      <div style={{
        ...styles.cell,
      }}
      >
        {this.rendercollectionRequestStatus(row.value, row.original)}
      </div>
    );

    const assignSupplierColIndex = columnDefs.findIndex(c => c.accessor === 'assignSupplier');
    columnDefs[assignSupplierColIndex].Cell = (row) => {
      return (
        <div
          style={{
            ...styles.cell,
            textAlign: "left",
          }}
        >
          <button
            data-toggle="modal"
            data-target="#flipFlop"
            className="btn btn-default"
            onClick={() => this.handleShowAssignModal(row.original)}
          >
            Assign
          </button>
        </div>
      );
    };

    const binsStatusColIndex = columnDefs.findIndex(c => c.accessor === 'binsStatus');
    columnDefs[binsStatusColIndex].Cell = (row) => {
      return (
        <div
          style={{
            ...styles.cell,
            textAlign: "left",
          }}
        >
          <button
            data-toggle="modal"
            data-target="#flipFlop"
            className="btn btn-default"
            onClick={() => this.handleShowBinsDetailsModal(row.original)}
          >
            Details
          </button>
        </div>
      );
    };

    return (
      <div>
        {loading && <Spinner />}
        {
          collectionSelected && isAssignSupplier && (
            <ModalAssignSupplier onClose={() => this.handleShowAssignModal(undefined)} collectionSelected={collectionSelected} />
          )
        }
        {
          collectionSelected && isShowBinsDetails && (
            <ModalBinsDetails onClose={() => this.handleShowBinsDetailsModal(undefined)} collectionSelected={collectionSelected} />
          )
        }
        <div style={{ ...styles.usersTabBoxOuter, marginTop: 30 }}>
          <div style={styles.pageTitleBox}>
            <div>
              <h3 style={{ ...styles.pageTitle }}>Collection Requests</h3>
            </div>
            <HandelButton
              label="Create Request"
              htmlType="button"
              iconColor="white"
              bgColor="blue"
              borderColor="blue"
              shadowColor="blue"
              onClick={onCreateCollectionRequest}
            >
              <span className="handel-bin-request" />
            </HandelButton>
          </div>
        </div>

        <CommonTable
          title="Request"
          data={dataset}
          columns={columnDefs}
          pageSize={perPage}
          // paginationFlag
          // loading={loading}
          isSubTable={false}
          selectRowFlag={false}
          expandAll={expandAll}
          handleSelect={this.handleSelect}
          handleSelectSub={this.handleSelectSub}
          subColumns={columnsSubItems}
          handlePageChange={this.handlePageChange}
          handlePerPageChange={this.handlePerPageChange}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#239dff",
                margin: "10px 24px",
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  width: 100,
                }}
              >
                Request
              </div>
              <div
                style={{
                  display: "flex",
                  fiexDirection: "row",
                }}
              >
                <div
                  className="order-table-expdand-button"
                  onClick={this.onHandleExpandAll}
                >
                  Expand All
                </div>
                <div
                  className="order-table-expdand-button"
                  onClick={this.onHandleCollapseAll}
                >
                  Collapse All
                </div>
              </div>
            </div>
            <div>
              <InnerSearch
                defaultValue={s}
                mainBoxStyles={{
                  margin: "15px 26px",
                }}
                setSearch={this.handleSearch}
              />
            </div>
          </div>
        </CommonTable>
      </div>
    );
  }
}

CollectionRequestsTable.propTypes = {
  // history: PropTypes.any.isRequired,
  dataset: PropTypes.any.isRequired,
  updateCollectionRequestsStatusById: PropTypes.func.isRequired,
  // deleteList: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,
  onCreateCollectionRequest: PropTypes.func.isRequired,
};

export default withRouter(CollectionRequestsTable);
