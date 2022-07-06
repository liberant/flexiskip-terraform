import React from 'react';
import Styles from './Styles';

export const columns = [
  {
    key: 'customer_no',
    dataIndex: 'customer_no',
    title: 'Council Id',
    render: (text, record) => (
      <div style={{...Styles.cell}} >{text}</div>
    ),
  },
  {
    key: 'class_electoral_division',
    dataIndex: 'class_electoral_division',
    title: 'Division',
    render: (text, record) => (
      <div style={{...Styles.cell}} >{text}</div>
    ),
  },
  {
    key: 'unit_no',
    dataIndex: 'unit_no',
    title: 'Unit No',
    render: (text, record) => (
      <div style={{...Styles.cell}} >{text}</div>
    ),

  },
  {
    key: 'full_address',
    dataIndex: 'full_address',
    title: 'Address',
    render: (text, record) => (
      <div style={{...Styles.cell}} >{text}</div>
    ),

  },
  {
    key: 'city',
    dataIndex: 'city',
    title: 'City',
    render: (text, record) => (
      <div style={{...Styles.cell}} >{text}</div>
    ),
  },
  {
    key: 'postcode',
    dataIndex: 'postcode',
    title: 'Postcode',
    render: (text, record) => (
      <div style={{...Styles.cell}} >{text}</div>
    ),
  },
];
