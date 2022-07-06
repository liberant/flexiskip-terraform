import React from 'react';
import PropTypes from 'prop-types';

import { Table, InputNumber } from 'antd';
import { formatPrice, formatDateTime } from '../../../../common/helpers';
import BinStatus from '../../../../common/components/BinStatus';

const columns = [
  {
    title: 'Product',
    key: 'name',
    render: item => item.bin.name,
  },
  {
    title: 'QR Code',
    key: 'code',
    render: item => item.bin.code,
  },
  {
    title: 'Weight (kg)',
    key: 'weight',
    render: item => item.bin.collectedWeight,
  },
  {
    title: 'Collected',
    key: 'collectedAt',
    render: item =>
      item.binStatus !== 'Not Collected' && formatDateTime(item.bin.collectedAt),
  },
  {
    title: 'Drop-off',
    key: 'droppedAt',
    render: item =>
      item.binStatus !== 'Not Collected' && formatDateTime(item.bin.droppedAt),
  },
  {
    title: 'Cost',
    key: 'price',
    render: item => formatPrice(item.price),
  },
  {
    title: 'Status',
    key: 'status',
    render: item => (
      <BinStatus value={item.binStatus || item.bin.collectionStatus} />
    ),
  },
];

const BinList = ({ collectionRequest, onWeightChange }) => {
  const { items } = collectionRequest;
  const weightColIndex = columns.findIndex(c => c.key === 'weight');
  if (onWeightChange) {
    columns[weightColIndex].render = item => (
      item.binStatus !== 'Not Collected' && (
      <InputNumber
        defaultValue={item.bin.collectedWeight}
        min={0}
        onChange={value =>
            onWeightChange(item.bin._id, { collectedWeight: value })
          }
      />
      )
    );
  } else {
    columns[weightColIndex].render = item =>
      item.binStatus !== 'Not Collected' && item.bin.collectedWeight;
  }

  return (
    <div className="w-panel">
      <div className="w-title">
        <h2>Requested Collection</h2>
      </div>
      <Table
        columns={columns}
        dataSource={items}
        pagination={false}
        rowKey={row => row.bin.code}
      />
    </div>
  );
};

BinList.propTypes = {
  collectionRequest: PropTypes.object.isRequired,
};

BinList.defaultProps = {
  editable: [],
};
export default BinList;
