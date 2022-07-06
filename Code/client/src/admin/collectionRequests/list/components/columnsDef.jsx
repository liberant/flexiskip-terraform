import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { CollectionRequestsDefs } from '../constants/collectionRequestsDefs';
import {
  actionFormatter,
  dimensionFormatter,
  priceFormatter,
  fullDateTimeFormatter,
  productRequestFormatter,
  collectionRequestFormatter,
  productTrackFormatter,
  remainingTimeFormatter,
  nameContactFormatter,
} from '../../../../common/components/BSTableFormatters';

import Styles from './Styles';

/* eslint react/prop-types:0 */
/* eslint no-unused-vars:0 */

const columnsCollectionRequests = [
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

export const columnDefs = [
  {
    Header: <span style={headerStyles}>Collection Ref</span>,
    accessor: 'code',
    width: 110,
    Cell: row => (
      <Link to={`/admin/collection-requests-view/${row.original._id}`}>
        <div style={{
            ...Styles.truncate,
            ...Styles.cell,
            textAlign: 'left',
          }}
        >
          {row.value}
        </div>
      </Link>
    ),
  },
  {
    Header: <span style={headerStyles}>Request Date</span>,
    accessor: 'createdAt',
    Cell: row => (
      <Link to={`/admin/collection-requests-view/${row.original._id}`}>
        <div style={{
              ...Styles.truncate,
              ...Styles.cell,
              textAlign: 'left',
            }}
        >
          {fullDateTimeFormatter(row.value)}
        </div>
      </Link>
    ),
  },
  {
    Header: <span style={headerStyles}>Driver</span>,
    accessor: 'driver.firstname',
    width: 155,
    Cell: row => (
      <Link to={`/admin/collection-requests-view/${row.original._id}`}>
        <div style={{
          ...Styles.truncate,
          ...Styles.cell,
          textAlign: 'left',
        }}
        >
          {nameContactFormatter(row.value, row.original.driver)}
        </div>
      </Link>
    ),
  },
  {
    Header: <span style={headerStyles}>Supplier</span>,
    accessor: 'contractorOrganisation.name',
    width: 155,
    Cell: row => (
      <Link to={`/admin/collection-requests-view/${row.original._id}`}>
        <div style={{
          ...Styles.truncate,
          ...Styles.cell,
          textAlign: 'left',
        }}
        >
          {row.value}
        </div>
      </Link>
    ),
  },
  {
    Header: <span style={headerStyles}>Assign</span>,
    accessor: 'assignSupplier',
    width: 90,
  },
  {
    Header: <span style={headerStyles}>Bins</span>,
    accessor: 'binsStatus',
    width: 110,
  },
  {
    Header: <span style={headerStyles}>Remaining Time</span>,
    accessor: 'collectBy',
    Cell: row => (
      <Link to={`/admin/collection-requests-view/${row.original._id}`}>
        <div style={{
          ...Styles.truncate, ...Styles.cell, textAlign: 'left',
          }}
        >
          {remainingTimeFormatter(row.original)}
        </div>
      </Link>
    ),
  },
  {
    Header: <span style={headerStyles}>Status</span>,
    accessor: 'status',
  },
  {
    Header: '',
    columns: [
      {
        expander: true,
        width: 80,
        Expander: ({ isExpanded, ...rest }) =>
          (
            <div style={{ marginTop: 10 }}>
              {!isExpanded
              ? (
                <div>
                  Details <i className="fa fa-caret-down" />
                </div>)
              : (
                <div>
                  Collapse <i className="fa fa-caret-up" />
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

export const columnBinStatusDefs = [
  {
    Header: <div style={{ textAlign: 'left' }}>Code</div>,
    width: 80,
    accessor: 'bin.code',
    Cell: row => (
      <div style={{ ...Styles.truncate, ...Styles.cell, textAlign: 'left' }} >{row.value}</div>
    ),
  },
  {
    Header: <div style={{ textAlign: 'left' }}>Name</div>,
    accessor: 'bin.name',
    Cell: row => (
      <div style={{ ...Styles.truncate, ...Styles.cell, textAlign: 'left' }} >{row.value}</div>
    ),
  },
  {
    Header: <div style={{ textAlign: 'left' }}>Status</div>,
    accessor: 'binStatus',
  },
  {
    Header: <div style={{ textAlign: 'left' }}>Collection Request Status</div>,
    accessor: 'binCollectionStatus',
  },
];

export const columnSuppliersDefs = [
  {
    Header: <div style={{textAlign: 'left'}}>Name</div>,
    accessor: 'name',
    Cell: row => (
      <div style={{ ...Styles.truncate, ...Styles.cell,textAlign: 'left'}} >{row.value}</div>
    ),
  },
  {
    Header: <div style={{textAlign: 'left'}}>Address</div>,
    accessor: 'address',
    Cell: row => (
      <div style={{ ...Styles.truncate, ...Styles.cell,textAlign: 'left'}} >
        {row.value}
      </div>
    ),
  },
  {
    Header: '',
    accessor: 'assign',
  },
];

export const columnSubDefs = [
  {
    Header: 'Collection',
    accessor: 'collection.name',
    Cell: row => (
      <div style={{ ...Styles.truncate, ...Styles.cell }} >{row.value}</div>
    ),
  },
  {
    Header: 'QR Code Print',
    accessor: 'collection.status',
    Cell: row => (
      <div style={{ ...Styles.truncate, ...Styles.cell }} >
        {productRequestFormatter(row.value)}
      </div>
    ),
  },
  {
    Header: 'FastWay Tracking No.',
    accessor: 'collection.vendorCode',
    Cell: row => (
      <div style={{ ...Styles.cell }} >
        {row.value}
      </div>
    ),
  },
  {
    Header: 'Status',
    accessor: 'collection.status',
    Cell: row => (
      <div style={{ ...Styles.cell }} >
        {productRequestFormatter(row.value)}
      </div>
    ),
  },
];

export const columnsSubItems = [
  {
    dataField: 'name',
    text: 'Product',
    style: { ...Styles.truncate, ...Styles.cellCursor, paddingTop: 9 },
  },
  {
    dataField: 'productCode',
    text: 'Product Ref.',
    style: { ...Styles.truncate, ...Styles.cellCursor, paddingTop: 9 },
  },
  {
    dataField: 'code',
    text: 'QR Code Number',
    style: { ...Styles.truncate, ...Styles.cellCursor, paddingTop: 9 },
  },
  {
    dataField: 'binStatus',
    text: 'Status',
    style: { ...Styles.truncate, ...Styles.cellCursor, paddingTop: 11 },
    formatter: productRequestFormatter,
  },
];

export const columns = [
  {
    columnsDef: columnsCollectionRequests,
    ...CollectionRequestsDefs.productAdmin,
  },
];


export const columnsItems = [
  {
    dataField: 'name',
    text: 'Collection',
    style: { ...Styles.truncate, ...Styles.cellCursor },
  },
  {
    dataField: 'size',
    text: 'Collection Dimension',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: dimensionFormatter,
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
