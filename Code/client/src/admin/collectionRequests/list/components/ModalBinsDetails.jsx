import PropTypes from 'prop-types';
import React, { useEffect, useState, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Modal } from 'antd';
import { columnBinStatusDefs } from './columnsDef';
import { CommonTable } from '../../../../common/components';
import Spinner from '../../../../common/components/Spinner';
import styles from './Styles';
import { binCollectionRequestFormatterWithDropdown, orderedProductFormatterWithDropdown } from '../../../../common/components/BSTableFormatters';
import httpClient from '../../../../common/http';
import { putBinStatus, putBinCollectionRequestStatus } from '../actions';


const ModalBinsDetails = ({
  onClose, collectionSelected, putBinStatus, putBinCollectionRequestStatus,
}) => {
  const [loading, setLoading] = useState(false);

  // Update bin collection request status
  const onChangeBinStatus = async (status, id) => {
    try {
      setLoading(true);
      await putBinStatus({
        id,
        status,
        collectionRequestId: collectionSelected._id,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Update bin status
  const onChangeCollectionRequestStatus = async (status, id) => {
    try {
      setLoading(true);
      await putBinCollectionRequestStatus({
        id,
        status,
        collectionRequestId: collectionSelected._id,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const renderBinStatus = (text, record) => orderedProductFormatterWithDropdown(text, record, onChangeBinStatus);

  const rendercollectionRequestStatus = (text, record) => binCollectionRequestFormatterWithDropdown(text, record, onChangeCollectionRequestStatus);

  const binStatusColIndex = columnBinStatusDefs.findIndex(c => c.accessor === 'binStatus');
  columnBinStatusDefs[binStatusColIndex].Cell = row => (<div style={{
        ...styles.cell,
      }}
  >
    {renderBinStatus(row.original.bin.status, row.original.bin)}
  </div>);

  const binCollectionStatusColIndex = columnBinStatusDefs.findIndex(c => c.accessor === 'binCollectionStatus');
  columnBinStatusDefs[binCollectionStatusColIndex].Cell = row => (<div style={{
        ...styles.cell,
      }}
  >
    {rendercollectionRequestStatus(row.original.bin.collectionStatus, row.original.bin)}
  </div>);

  return (
    <Modal
      maskClosable={false}
      width="60%"
      title="Bins Details"
      visible
      footer={null}
      className="w-modal"
      onCancel={onClose}
    >
      {loading && <Spinner />}
      <CommonTable
        title="Request"
        data={{
                  data: collectionSelected.items || [],
                }}
        noSubTable
        isNotCheckboxTable
        columns={columnBinStatusDefs}
      />
    </Modal>
  );
};

ModalBinsDetails.propTypes = {
  onClose: PropTypes.func,
};

export default compose(connect(
  state => ({}),
  dispatch => ({
    putBinStatus: (data) => {
      const action = putBinStatus(data);
      dispatch(action);
      return action.promise;
    },
    putBinCollectionRequestStatus: (data) => {
      const action = putBinCollectionRequestStatus(data);
      dispatch(action);
      return action.promise;
    },
  }),
))(ModalBinsDetails);
