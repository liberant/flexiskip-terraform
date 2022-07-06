import PropTypes from "prop-types";
import React, { useEffect, useState, useCallback } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { Modal } from "antd";
import { columnSuppliersDefs } from "./columnsDef";
import { CommonTable } from "../../../../common/components";
import { updateCollectionRequestsDetails} from '../actions';
import Spinner from '../../../../common/components/Spinner';

const ModalAssignSupplier = ({ suppliers, onClose, collectionSelected, updateCollectionRequestsDetails }) => {
  const { contractorOrganisation } = collectionSelected;

  const [supplierSelected, setSupplierSelected] = useState(contractorOrganisation);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const assignSupplierColIndex = columnSuppliersDefs.findIndex(
    (c) => c.accessor === "assign"
  );
  columnSuppliersDefs[assignSupplierColIndex].Cell = useCallback((row) => {
    const isSelected = supplierSelected && row.original._id === supplierSelected._id;
    return (<div style={{ textAlign: "right" }}>
      {isSelected ? (
        <button className="btn btn-primary">Selected</button>
      ) : (
        <button onClick={() => setSupplierSelected(row.original)} className="btn btn-default">Select</button>
      )}
    </div>)
  }, [supplierSelected]);

  useEffect(() => {
    const listSuppliersInRotation = suppliers.filter((item) => item.inRotation);
    setData(listSuppliersInRotation);
  }, [contractorOrganisation, suppliers]);

  const onSave = async () => {
    try {
      setLoading(true);
      await updateCollectionRequestsDetails({
        uid: collectionSelected._id,
        data: {
          contractorOrganisation: supplierSelected._id,
        }
      });
      onClose();
    }catch(error){
      console.log(error);
    }finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      maskClosable={false}
      width="60%"
      title="Assign Supplier"
      visible={true}
      footer={null}
      className="w-modal"
      onCancel={onClose}
    >
      {loading && <Spinner />}
      <CommonTable
        title="Request"
        data={{
          data,
        }}
        noSubTable
        isNotCheckboxTable
        columns={columnSuppliersDefs}
      ></CommonTable>
      <div
        style={{
          textAlign: "right",
          marginTop: 10,
        }}
      >
        <button onClick={onSave} disabled={loading} className="btn btn-primary">Save</button>
      </div>
    </Modal>
  );
};

ModalAssignSupplier.propTypes = {
  suppliers: PropTypes.any.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default compose(
  connect((state) => ({
    suppliers: state.admin.supplier.list,
  }),
  (dispatch) => ({
    updateCollectionRequestsDetails: (data) => {
      const action = updateCollectionRequestsDetails(data);
      dispatch(action);
      return action.promise;
    },
  }))
)(ModalAssignSupplier);
