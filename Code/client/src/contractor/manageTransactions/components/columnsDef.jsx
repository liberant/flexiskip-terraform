import React from 'react';
import { Link } from 'react-router-dom';
import { ManageTransactionsDefs } from '../constants/manageTransactionsDefs';
import {
  actionFormatter,
  dimensionFormatter,
  priceFormatter,
  fullDateTimeFormatter,
  productRequestFormatter,
  collectionRequestFormatter,
  dateFormatter,
  nameContactFormatter,
} from '../../../common/components/BSTableFormatters';

import Styles from './Styles';

/* eslint react/prop-types:0 */
/* eslint no-unused-vars:0 */

const columnsManageTransactions = [
  {
    dataField: 'code',
    text: 'Collection Ref.',
    style: { ...Styles.truncate, ...Styles.cellCursor },
  },
  {
    dataField: 'createdAt',
    text: 'Request Date',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: fullDateTimeFormatter,
  },
  {
    dataField: 'remainingTime',
    text: 'Remaining Time',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: fullDateTimeFormatter,
  },
  {
    dataField: 'status',
    text: 'Status',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: productRequestFormatter,
  },
  {
    dataField: '_id',
    text: '',
    formatter: actionFormatter,
  },

];

const headerStyles = {
  textAlign: 'left',
  fontWeight: '600',
  display: 'block',
};

export const columnDefsBin = [
  {
    Header: <span style={headerStyles}>Order Ref</span>,
    accessor: 'code',
    width: 105,
    Cell: row => (
      // <Link to={`/contractor/transactions-edit/${row.original._id}`}>
      <div style={{
          ...Styles.truncate,
          ...Styles.cell,
          textAlign: 'left',
        }}
      >
        {row.value}
      </div>
      // </Link>
    ),
  },
  {
    Header: <span style={headerStyles}>Customer</span>,
    accessor: 'customer.firstname',
    Cell: row => (
      // <Link to={`/contractor/transactions-edit/${row.original._id}`}>
      <div style={{
        ...Styles.truncate,
        ...Styles.cell,
        textAlign: 'left',
      }}
      >
        {nameContactFormatter(row.value, row.original.customer)}
      </div>
      // </Link>
    ),
  },
  {
    Header: <span style={headerStyles}>Address</span>,
    accessor: 'customer.firstname',
    Cell: row => (
      // <Link to={`/contractor/transactions-edit/${row.original._id}`}>
      <div style={{
        ...Styles.truncate,
        ...Styles.cell,
        textAlign: 'left',
      }}
      >
        {row.original.collectionAddress}
      </div>
      // </Link>
    ),
  },
  {
    Header: <span style={headerStyles}>Order At</span>,
    accessor: 'createdAt',
    width: 155,
    Cell: row => (
      // <Link to={`/contractor/transactions-edit/${row.original._id}`}>
      <div style={{
            ...Styles.truncate,
            ...Styles.cell,
            textAlign: 'left',
          }}
      >
        {dateFormatter(row.value)}
      </div>
      // </Link>
    ),
  },
  {
    Header: <span style={headerStyles}>Driver</span>,
    accessor: 'driver.firstname',
    Cell: row => (
      // <Link to={`/contractor/transactions-edit/${row.original._id}`}>
      <div style={{
        ...Styles.truncate,
        ...Styles.cell,
        textAlign: 'left',
      }}
      >
        {nameContactFormatter(row.value, row.original.driver)}
      </div>
      // </Link>
    ),
  },
  {
    Header: <span style={headerStyles}>Status</span>,
    accessor: 'status',
    Cell: row => (
      // <Link to={`/contractor/transactions-edit/${row.original._id}`}>
      <div style={{
          ...Styles.cell,
        }}
      >
        {collectionRequestFormatter(row.value)}
      </div>
      // </Link>
    ),
  },
  {
    Header: '',
    columns: [
      {
        expander: true,
        // width: 150,
        Expander: ({ isExpanded, ...rest }) =>
          (
            <div style={{ marginTop: 10 }}>
              {!isExpanded
              ? (
                <div>
                  <i className="fa fa-caret-down" />
                </div>)
              : (
                <div>
                  <i className="fa fa-caret-up" />
                </div>
              )}
            </div>
          ),
        style: {
          cursor: 'pointer',
          padding: '0',
          textAlign: 'center',
          userSelect: 'none',
          width: 100,
          color: '#239dff',
          fontWeight: '600',
        },
      },
    ],
  },
];

export const columnsSubItems = [
  {
    dataField: 'code',
    text: 'QR Code',
    style: { ...Styles.truncate, ...Styles.cellCursor, paddingTop: 9 },
  },
  {
    dataField: 'name',
    text: 'Product',
    style: { ...Styles.truncate, ...Styles.cellCursor, paddingTop: 9 },
  },
  {
    dataField: 'droppedAt',
    text: 'Finished On',
    formatter: fullDateTimeFormatter,
  },
];

export const columns = [
  {
    columnsDef: columnDefsBin,
    ...ManageTransactionsDefs.binTransactions,
  },
];


export const columnsItems = [
  {
    dataField: 'name',
    text: 'Product',
    style: { ...Styles.truncate, ...Styles.cellCursor },
  },
  {
    dataField: 'productCode',
    text: 'Bin Ref.',
    style: { ...Styles.truncate, ...Styles.cellCursor },
  },
  {
    dataField: 'driverName',
    text: 'Driver',
    style: { ...Styles.truncate, ...Styles.cellCursor },
  },
  {
    dataField: 'price',
    text: 'Price',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: priceFormatter,
  },
  {
    dataField: 'status',
    text: 'Status',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: productRequestFormatter,
  },
  {
    dataField: 'finishedDate',
    text: 'Finished On',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: fullDateTimeFormatter,
  },
];

export const columnsStatusHistories = [
  {
    dataField: 'status',
    text: 'Status History',
    style: { ...Styles.truncate, ...Styles.cellCursor },
  },
  {
    dataField: 'modifiedDate',
    text: 'Changed Date',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: fullDateTimeFormatter,
  },
];
