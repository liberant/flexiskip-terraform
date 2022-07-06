import React from 'react';
import {
  ratingStarFormatter,
  dateFormatter,
  userStatusFormatter,
} from '../../../common/components/BSTableFormatters';

import Styles from './Styles';

/* eslint react/prop-types:0 */
/* eslint no-unused-vars:0 */

export const headerStyles = {
  textAlign: 'left',
  fontWeight: '600',
  display: 'block',
};


export const columnDefRisk = [
  {
    title: 'ID',
    key: 'uId',
    dataIndex: 'uId',
  },
  {
    title: 'Business Name',
    key: 'organisation',
    dataIndex: 'organisation',
    render: (text, row) => row.organisation.name,
  },
  {
    title: 'Rating',
    key: 'rating',
    dataIndex: 'rating',
    render: text => ratingStarFormatter(text),
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    render: text => userStatusFormatter(text),
  },
];

export const columnDefInactive = [
  {
    title: 'ID',
    key: 'uId',
    dataIndex: 'uId',
  },
  {
    title: 'Business Name',
    key: 'driverProfile.organisation.name',
    dataIndex: 'driverProfile.organisation.name',
    render: (text, row) => row.driverProfile.organisation.name,
  },
  {
    title: 'Email',
    key: 'email',
    dataIndex: 'email',
  },
  {
    title: 'Last activity date',
    key: 'driverProfile.lastJobAt',
    dataIndex: 'driverProfile.lastJobAt',
    render: (text, row) => dateFormatter(row.driverProfile.lastJobAt),
  },
];
