import React from 'react';
import { Link } from 'react-router-dom';

import Styles from '../../components/Styles';
import {
  dateFormatter,
  priceFormatter,
  collectionRequestFormatter,
} from '../../../../common/components/BSTableFormatters';

export const pageSizes = [
  { label: '10 records', value: 10 },
  { label: '20 records', value: 20 },
  { label: '50 records', value: 50 },
  { label: '100 records', value: 100 },
];

function getLinkByType(type) {
  if (type === 'bin') return 'product-requests-edit';
  return 'collection-requests-view';
}

export const columns = type => ([
  {
    title: 'Order Ref',
    dataIndex: 'code',
    key: 'code',
    render: (text, record) => (
      <Link to={`/admin/${getLinkByType(type)}/${record._id}`}>
        <div style={{
            ...Styles.truncate,
            ...Styles.cell,
            textAlign: 'left',
          }}
        >
          {text}
        </div>
      </Link>
    ),
  },
  {
    title: 'Transaction ID',
    dataIndex: 'stripeChargeId',
    key: 'stripeChargeId',
    render: text => (
      <div>
        {
          text ? (
            <div>
              <span style={{
                  ...Styles.truncate,
                  ...Styles.cell,
                  textAlign: 'left',
                }}
              >
                {text}
              </span>
              <a href={`https://dashboard.stripe.com/payments/${text}`} target="_blank" rel="noopener noreferrer">
                <span className="handel-open-link" style={{ color: '#239dff', paddingLeft: 5 }} />
              </a>
            </div>
          ) : null
        }

      </div>
    ),
  },
  {
    title: 'Customer',
    dataIndex: 'customer',
    key: 'customer',
    render: (text, record) => (
      <Link to={`/admin/${getLinkByType(type)}/${record._id}`}>
        <div style={{
          ...Styles.truncate,
          ...Styles.cell,
          textAlign: 'left',
        }}
        >
          {
            record && record.customer && (`${record.customer.firstname || ' '} ${record.customer.lastname || ' '}`)
          }
        </div>
      </Link>
    ),
  },
  {
    title: 'Date Created',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (text, record) => (
      <Link to={`/admin/${getLinkByType(type)}/${record._id}`}>
        <div style={{
              ...Styles.truncate,
              ...Styles.cell,
              textAlign: 'left',
            }}
        >
          {dateFormatter(text)}
        </div>
      </Link>
    ),
  },
  {
    title: 'Payment Type',
    dataIndex: 'paymentType',
    key: 'paymentType',
    render: (text, record) => (
      <Link to={`/admin/${getLinkByType(type)}/${record._id}`}>
        <div style={{
              ...Styles.truncate,
              ...Styles.cell,
              textAlign: 'left',
            }}
        >
          {text}
        </div>
      </Link>
    ),
  },
  {
    title: 'Invoice No.',
    dataIndex: 'invoiceCode',
    key: 'invoiceCode',
    render: (text, record) => (
      <Link to={`/admin/${getLinkByType(type)}/${record._id}`}>
        <div style={{
              ...Styles.truncate,
              ...Styles.cell,
              textAlign: 'left',
            }}
        >
          {text}
        </div>
      </Link>
    ),
  },
  {
    title: 'Total Amount',
    dataIndex: 'total',
    key: 'total',
    render: (text, record) => (
      <Link to={`/admin/${getLinkByType(type)}/${record._id}`}>
        <div style={{
              ...Styles.truncate,
              ...Styles.cell,
              textAlign: 'left',
            }}
        >
          {priceFormatter(text)}
        </div>
      </Link>
    ),
  },
  {
    title: 'Discount',
    dataIndex: 'discount',
    key: 'discount',
    render: (text, record) => (
      <Link to={`/admin/${getLinkByType(type)}/${record._id}`}>
        <div style={{
              ...Styles.truncate,
              ...Styles.cell,
              textAlign: 'left',
            }}
        >
          {priceFormatter(text)}
        </div>
      </Link>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (text, record) => (
      <Link to={`/admin/${getLinkByType(type)}/${record._id}`}>
        <div style={{
              ...Styles.truncate,
              ...Styles.cell,
            }}
        >
          {collectionRequestFormatter(text)}
        </div>
      </Link>
    ),
  },
]);
