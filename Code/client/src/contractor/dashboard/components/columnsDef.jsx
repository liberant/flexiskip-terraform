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
    Header: <span style={headerStyles}>ID</span>,
    accessor: 'uId',
    // width: 155,
    Cell: row => (
      <div style={{
        ...Styles.truncate,
        ...Styles.cell,
        textAlign: 'left',
      }}
      >
        {row.value}
      </div>
    ),
  },
  {
    Header: <span style={headerStyles}>Business Name</span>,
    accessor: 'organisation.name',
    Cell: row => (
      <div style={{
        ...Styles.truncate,
        ...Styles.cell,
        textAlign: 'left',
      }}
      >
        {row.value}
      </div>
    ),
  },
  {
    Header: <span style={headerStyles}>Rating</span>,
    accessor: 'rating',
    // width: 155,
    Cell: row => (
      <div style={{
        ...Styles.truncate,
        ...Styles.cell,
        textAlign: 'left',
        fontSize: 10,
      }}
      >
        {ratingStarFormatter(row.value)}
      </div>
    ),
  },
  {
    Header: <span style={headerStyles}>Status</span>,
    accessor: 'status',
    Cell: row => (
      <div style={{ ...Styles.truncate, ...Styles.cell, textAlign: 'left' }} >
        {userStatusFormatter(row.value)}
      </div>
    ),
  },
];

export const columnDefInactive = [
  {
    Header: <span style={headerStyles}>ID</span>,
    accessor: 'uId',
    // width: 155,
    Cell: row => (
      <div style={{
        ...Styles.truncate,
        ...Styles.cell,
        textAlign: 'left',
      }}
      >
        {row.value}
      </div>
    ),
  },
  {
    Header: <span style={headerStyles}>Business Name</span>,
    accessor: 'organisation.name',
    Cell: row => (
      <div style={{
        ...Styles.truncate,
        ...Styles.cell,
        textAlign: 'left',
      }}
      >
        {row.value}
      </div>
    ),
  },
  {
    Header: <span style={headerStyles}>Last activity date</span>,
    accessor: 'updatedAt',
    // width: 155,
    Cell: row => (
      <div style={{
        ...Styles.truncate,
        ...Styles.cell,
        textAlign: 'left',
      }}
      >
        {dateFormatter(row.value)}
      </div>
    ),
  },
];


// export const columns = [
//   {
//     columnsDef: columnsCollectionRequests,
//     ...CollectionRequestsDefs.productAdmin,
//   },
// ];
