import React from 'react';
import { Link } from 'react-router-dom';
import { ProductRequestsDefs } from '../constants/productRequestsDefs';
import {
  actionFormatter,
  dimensionFormatter,
  priceFormatter,
  fullDateTimeFormatter,
  productRequestFormatter,
  productQRCodeStatusFormatter,
  productTrackFormatter,
  dimensionStatusFormatter,
  priceStatusFormatter,
  orderedProductFormatter,
  getTotalQuantityInBinRequest,
} from '../../../common/components/BSTableFormatters';

import Styles from './Styles';

/* eslint no-underscore-dangle:0 */
/* eslint react/prop-types:0 */

const columnsProductRequests = [
  {
    dataField: 'code',
    text: 'Order Ref.',
    style: { ...Styles.truncate, ...Styles.cellCursor },
  },
  {
    dataField: 'createdAt',
    text: 'Order Date',
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

export const columnDefs = [
  {
    title: 'Order Ref',
    key: 'code',
    dataIndex: 'code',
    render: (text, record) => (
      <Link to={`/admin/product-requests-edit/${record._id}`} key={record._id}>
        <div style={{ ...Styles.truncate, ...Styles.cell, textAlign: 'left' }} >{text}</div>
      </Link>
    ),
  },
  {
    title: 'Order Date',
    key: 'createdAt',
    dataIndex: 'createdAt',
    render: (text, record) => (
      <Link to={`/admin/product-requests-edit/${record._id}`} key={record._id}>
        <div style={{ ...Styles.truncate, ...Styles.cell, textAlign: 'left' }} >
          {fullDateTimeFormatter(text)}
        </div>
      </Link>
    ),
  },
  {
    title: 'Delivery Method',
    key: 'courier',
    dataIndex: 'courier',
    sorter: true,
    render: (text, record) => (
      <Link to={`/admin/product-requests-edit/${record._id}`} key={record._id}>
        <div style={{
          ...Styles.truncate,
          ...Styles.cell,
          textAlign: 'left',
          textTransform: 'capitalize',
          }}
        >
          {text}
        </div>
      </Link>
    ),
  },
  {
    title: 'Quantity',
    key: 'totalQuantity',
    dataIndex: 'totalQuantity',
    sorter: true,
    render: (text, record) => (
      <Link to={`/admin/product-requests-edit/${record._id}`} key={record._id}>
        <div style={{
          ...Styles.truncate,
          ...Styles.cell,
          textAlign: 'left',
          }}
        >
          {getTotalQuantityInBinRequest(record)}
        </div>
      </Link>
    ),
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    sorter: true,
    render: (text, record) => (
      <Link to={`/admin/product-requests-edit/${record._id}`} key={record._id}>
        <div style={{ ...Styles.cell }} >
          {productRequestFormatter(text)}
        </div>
      </Link>
    ),
  },
  {
    title: '',
    key: 'expand',
    dataIndex: 'expand',
  },
];

export const columnSubDefs = [
  {
    Header: 'Product',
    accessor: 'product.name',
    Cell: row => (
      <div style={{ ...Styles.truncate, ...Styles.cell }} >{row.value}</div>
    ),
  },
  {
    dataField: 'size',
    text: 'Dimensions',
    style: { ...Styles.cellCursor },
    formatter: dimensionStatusFormatter,
  },
  {
    dataField: 'price',
    text: 'Price',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: priceStatusFormatter,
  },
  {
    Header: 'QR Code Print',
    accessor: 'product.status',
    Cell: row => (
      <div style={{ ...Styles.truncate, ...Styles.cell }} >
        {productRequestFormatter(row.value)}
      </div>
    ),
  },
  {
    Header: 'FastWay Tracking No.',
    accessor: 'product.vendorCode',
    Cell: row => (
      <div style={{ ...Styles.cell }} >
        {row.value}
      </div>
    ),
  },
  {
    Header: 'Status',
    accessor: 'product.status',
    Cell: row => (
      <div style={{ ...Styles.cell }} >
        {orderedProductFormatter(row.value)}
      </div>
    ),
  },
];

export const columnsSubItems = [
  {
    title: 'Product',
    key: 'name',
    dataIndex: 'name',
    render: text => (
      <div style={{ ...Styles.truncate, ...Styles.cell, textAlign: 'left' }} >{text}</div>
    ),
  },
  {
    title: 'Quantity',
    key: 'quantity',
    dataIndex: 'quantity',
    sorter: (prev, next) => prev.quantity - next.quantity,
  },
  {
    title: '',
    key: 'expand',
    dataIndex: 'expand',
    width: 120,
    render: (text, record) => (
      <Link to={`/admin/product-requests-edit/${record.binRequest}`} key={record.binRequest}>
        <div
          className="order-table-expdand-button"
          style={{ backgroundColor: '#239dff', color: '#fff' }}
        >
          Details
        </div>
      </Link>
    ),
  },
];

export const columns = [
  {
    columnsDef: columnsProductRequests,
    ...ProductRequestsDefs.productAdmin,
  },
];

export const columnsEditProductItems = [
  {
    title: 'Product',
    key: 'name',
    dataIndex: 'name',
  },
  {
    title: 'Product Dimension',
    key: 'size',
    dataIndex: 'size',
    render: (text, record) => dimensionFormatter(record.size),
  },
  {
    title: 'Price',
    key: 'price',
    dataIndex: 'price',
    render: text => priceFormatter(text),
  },
  {
    title: 'QR Code Print',
    key: 'qrCodeImage',
    dataIndex: 'qrCodeImage',
    render: text => productQRCodeStatusFormatter(text),
  },
  {
    title: 'Tracking No.',
    key: 'fastwayLabel',
    dataIndex: 'fastwayLabel',
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    render: text => orderedProductFormatter(text),
  },
  {
    title: '',
    key: '_id',
    dataIndex: '_id',
    render: (text, record) => productTrackFormatter(text, record),
  },
];


// export const columnsItems = [
//   {
//     dataField: 'name',
//     text: 'Product',
//     style: { ...Styles.truncate, ...Styles.cellCursor },
//   },
//   {
//     dataField: 'size',
//     text: 'Product Dimension',
//     style: { ...Styles.truncate, ...Styles.cellCursor },
//     formatter: dimensionFormatter,
//   },
//   {
//     dataField: 'price',
//     text: 'Price',
//     style: { ...Styles.truncate, ...Styles.cellCursor },
//     formatter: priceFormatter,
//   },
//   {
//     dataField: 'status',
//     text: 'Status',
//     style: { ...Styles.truncate, ...Styles.cellCursor },
//     formatter: productRequestFormatter,
//   },
// ];

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
