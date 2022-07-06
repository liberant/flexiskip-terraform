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
} from '../../../common/components/BSTableFormatters';

import Styles from './Styles';

/* eslint react/prop-types:0 */
/* eslint no-unused-vars:0 */
/* eslint no-underscore-dangle: 0 */

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
      <Link to={`/admin/product-requests-edit/${row.original._id}`}>
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
    Header: <span style={headerStyles}>Transaction ID</span>,
    accessor: 'stripeChargeId',
    width: 240,
    Cell: row => (
      <div>
        {
          row.value ? (
            <div>
              <span style={{
                  ...Styles.truncate,
                  ...Styles.cell,
                  textAlign: 'left',
                }}
              >
                {row.value}
              </span>
              <a href={`https://dashboard.stripe.com/payments/${row.value}`} target="_blank" rel="noopener noreferrer">
                <span className="handel-open-link" style={{ color: '#239dff', paddingLeft: 5 }} />
              </a>
            </div>
          ) : null
        }

      </div>
    ),
  },
  {
    Header: <span style={headerStyles}>Customer</span>,
    accessor: 'customer.firstname',
    // width: 155,
    Cell: row => (
      <Link to={`/admin/product-requests-edit/${row.original._id}`}>
        <div style={{
          ...Styles.truncate,
          ...Styles.cell,
          textAlign: 'left',
        }}
        >
          {
            row.original && row.original.customer && (`${row.original.customer.firstname || ' '} ${row.original.customer.lastname || ' '}`)
          }
        </div>
      </Link>
    ),
  },
  {
    Header: <span style={headerStyles}>Date Created</span>,
    accessor: 'createdAt',
    Cell: row => (
      <Link to={`/admin/product-requests-edit/${row.original._id}`}>
        <div style={{
              ...Styles.truncate,
              ...Styles.cell,
              textAlign: 'left',
            }}
        >
          {dateFormatter(row.value)}
        </div>
      </Link>
    ),
  },
  {
    Header: <span style={headerStyles}>Payment Type</span>,
    accessor: 'paymentType',
    // width: 155,
    Cell: row => (
      <Link to={`/admin/product-requests-edit/${row.original._id}`}>
        <div style={{
          ...Styles.truncate,
          ...Styles.cell,
          textAlign: 'left',
          textTransform: 'capitalize',
        }}
        >
          {row.value}
        </div>
      </Link>
    ),
  },
  {
    Header: <span style={headerStyles}>Invoice No.</span>,
    accessor: 'invoiceCode',
    // width: 155,
    Cell: row => row.original.paymentType === 'invoice' && (
      <Link to={`/admin/product-requests-edit/${row.original._id}`}>
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
    Header: <span style={headerStyles}>Total Amount</span>,
    accessor: 'total',
    // width: 155,
    Cell: row => (
      <Link to={`/admin/product-requests-edit/${row.original._id}`}>
        <div style={{
          ...Styles.truncate,
          ...Styles.cell,
          textAlign: 'left',
        }}
        >
          {priceFormatter(row.value)}
        </div>
      </Link>
    ),
  },
  {
    Header: <span style={headerStyles}>Discount Amount</span>,
    accessor: 'discount',
    // width: 155,
    Cell: row => (
      <Link to={`/admin/product-requests-edit/${row.original._id}`}>
        <div style={{
          ...Styles.truncate,
          ...Styles.cell,
          textAlign: 'left',
        }}
        >
          {priceFormatter(row.value)}
        </div>
      </Link>
    ),
  },
  {
    Header: <span style={headerStyles}>Status</span>,
    accessor: 'status',
    Cell: row => (
      <Link to={`/admin/product-requests-edit/${row.original._id}`}>
        <div style={{
            ...Styles.cell,
          }}
        >
          {collectionRequestFormatter(row.value)}
        </div>
      </Link>
    ),
  },
  // {
  //   Header: '',
  //   columns: [
  //     {
  //       expander: true,
  //       // width: 150,
  //       Expander: ({ isExpanded, ...rest }) =>
  //         (
  //           <div style={{ marginTop: 10 }}>
  //             {!isExpanded
  //             ? (
  //               <div>
  //                 <i className="fa fa-caret-down" />
  //               </div>)
  //             : (
  //               <div>
  //                 <i className="fa fa-caret-up" />
  //               </div>
  //             )}
  //           </div>
  //         ),
  //       style: {
  //         cursor: 'pointer',
  //         padding: '0',
  //         textAlign: 'center',
  //         userSelect: 'none',
  //         width: 100,
  //         color: '#239dff',
  //         fontWeight: '600',
  //       },
  //     },
  //   ],
  // },
];

export const columnDefsCollection = [
  {
    Header: <span style={headerStyles}>Order Ref</span>,
    accessor: 'code',
    width: 105,
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
    Header: <span style={headerStyles}>Transaction ID</span>,
    accessor: 'stripeChargeId',
    width: 240,
    Cell: row => (
      <div>
        {
          row.value ? (
            <div>
              <span style={{
                ...Styles.truncate,
                ...Styles.cell,
                textAlign: 'left',
              }}
              >
                {row.value}
              </span>
              <a href={`https://dashboard.stripe.com/payments/${row.value}`} target="_blank" rel="noopener noreferrer">
                <span className="handel-open-link" style={{ color: '#239dff', paddingLeft: 5 }} />
              </a>
            </div>
          ) : null
        }

      </div>
    ),
  },
  {
    Header: <span style={headerStyles}>Customer</span>,
    accessor: 'customer',
    // width: 155,
    Cell: row => (
      <Link to={`/admin/collection-requests-view/${row.original._id}`}>
        <div style={{
          ...Styles.truncate,
          ...Styles.cell,
          textAlign: 'left',
        }}
        >
          {
            row.original && row.original.customer && (`${row.original.customer.firstname || ' '} ${row.original.customer.lastname || ' '}`)
          }
        </div>
      </Link>
    ),
  },
  {
    Header: <span style={headerStyles}>Date Created</span>,
    accessor: 'createdAt',
    Cell: row => (
      <Link to={`/admin/collection-requests-view/${row.original._id}`}>
        <div style={{
          ...Styles.truncate,
          ...Styles.cell,
          textAlign: 'left',
        }}
        >
          {dateFormatter(row.value)}
        </div>
      </Link>
    ),
  },
  {
    Header: <span style={headerStyles}>Payment Type</span>,
    accessor: 'paymentType',
    // width: 155,
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
    Header: <span style={headerStyles}>Total Amount</span>,
    accessor: 'total',
    width: 155,
    Cell: row => (
      <Link to={`/admin/collection-requests-view/${row.original._id}`}>
        <div style={{
          ...Styles.truncate,
          ...Styles.cell,
          textAlign: 'left',
        }}
        >
          {priceFormatter(row.value)}
        </div>
      </Link>
    ),
  },
  {
    Header: <span style={headerStyles}>Discount Amount</span>,
    accessor: 'discount',
    width: 155,
    Cell: row => (
      <Link to={`/admin/collection-requests-view/${row.original._id}`}>
        <div style={{
          ...Styles.truncate,
          ...Styles.cell,
          textAlign: 'left',
        }}
        >
          {priceFormatter(row.value)}
        </div>
      </Link>
    ),
  },
  {
    Header: <span style={headerStyles}>Status</span>,
    accessor: 'status',
    Cell: row => (
      <Link to={`/admin/collection-requests-view/${row.original._id}`}>
        <div style={{
          ...Styles.cell,
        }}
        >
          {collectionRequestFormatter(row.value)}
        </div>
      </Link>
    ),
  },
  // {
  //   Header: '',
  //   columns: [
  //     {
  //       expander: true,
  //       // width: 150,
  //       Expander: ({ isExpanded, ...rest }) =>
  //         (
  //           <div style={{ marginTop: 10 }}>
  //             {!isExpanded
  //               ? (
  //                 <div>
  //                   <i className="fa fa-caret-down" />
  //                 </div>)
  //               : (
  //                 <div>
  //                   <i className="fa fa-caret-up" />
  //                 </div>
  //               )}
  //           </div>
  //         ),
  //       style: {
  //         cursor: 'pointer',
  //         padding: '0',
  //         textAlign: 'center',
  //         userSelect: 'none',
  //         width: 100,
  //         color: '#239dff',
  //         fontWeight: '600',
  //       },
  //     },
  //   ],
  // },
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
    text: 'Bin Ref.',
    style: { ...Styles.truncate, ...Styles.cellCursor, paddingTop: 9 },
  },
  {
    dataField: 'price',
    text: 'Price',
    style: { ...Styles.truncate, ...Styles.cellCursor, paddingTop: 9 },
    formatter: priceFormatter,
  },
  {
    dataField: 'status',
    text: 'Status',
    style: { ...Styles.truncate, ...Styles.cellCursor, paddingTop: 11 },
    formatter: productRequestFormatter,
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
  {
    columnsDef: columnDefsCollection,
    ...ManageTransactionsDefs.collectionTransactions,
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
