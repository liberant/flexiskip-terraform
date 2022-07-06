import {
  dimensionStatusFormatter,
  priceStatusFormatter,
  stockAlertsFormatter,
  inventoryFormatter,
  prouductStockStatusCheckFormatter,
  // dateFormatter,
} from '../../../common/components/BSTableFormatters';

import { ProductDefs } from '../constants/productDefs';
import Styles from './Styles';

// export const columnsCoucilCodes = [
//   {
//     dataField: 'name',
//     text: 'Product Name',
//     // headerStyle: { width: 94 },
//     style: { ...Styles.truncate, ...Styles.cellCursor },
//   },
//   {
//     dataField: 'council.name',
//     text: 'Council Name',
//     style: { ...Styles.truncate, ...Styles.cellCursor },
//   },
//   {
//     dataField: 'startDate',
//     text: 'Start Date',
//     style: { ...Styles.truncate, ...Styles.cellCursor },
//     formatter: dateFormatter,
//   },
//   {
//     dataField: 'endDate',
//     text: 'Period',
//     style: { ...Styles.truncate, ...Styles.cellCursor },
//     formatter: periodFormatter,
//   },
//   {
//     dataField: '_id',
//     text: 'Actions',
//     style: { ...Styles.truncate, ...Styles.cellCursor },
//     formatter: actionFormater,
//     events: {
//       onClick: (e) => {
//         console.warn('e = ', e, ', target = ', e.target);
//       },
//     },
//   },
// ];

const columnsProducts = [
  {
    dataField: 'code',
    text: 'Product Code',
    headerStyle: { width: 94 },
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: prouductStockStatusCheckFormatter,
  },
  {
    dataField: 'name',
    text: 'Name',
    headerStyle: { width: 200 },
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: prouductStockStatusCheckFormatter,
  },
  {
    dataField: 'size',
    text: 'Dimensions',
    style: { ...Styles.cellCursor },
    formatter: dimensionStatusFormatter,
  },
  {
    dataField: 'residentialPrice',
    text: 'Residential Price',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: priceStatusFormatter,
  },
  {
    dataField: 'businessPrice',
    text: 'Business Price',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: priceStatusFormatter,
  },
  {
    dataField: 'quantity',
    text: 'Inventory',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: inventoryFormatter,
  },
  {
    dataField: 'status',
    text: 'Stock Alerts',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: stockAlertsFormatter,
  },
];


export const columns = [
  {
    columnsDef: columnsProducts,
    ...ProductDefs.productAdmin,
  },
];

export const columnsItems = [
  // {
  //   dataField: 'id',
  //   text: 'ID',
  //   style: { ...Styles.truncate, ...Styles.cellCursor },
  // },
  {
    dataField: 'usedDate',
    text: 'Used Date',
    style: { ...Styles.truncate, ...Styles.cellCursor },
  },
  {
    dataField: 'address',
    text: 'Address',
    style: { ...Styles.truncate, ...Styles.cellCursor },
  },
  // {
  //   dataField: 'wasteType',
  //   text: 'Waste Type',
  //   style: { ...Styles.truncate, ...Styles.cellCursor },
  // },
  // {
  //   dataField: 'sucharge',
  //   text: 'Fee',
  //   style: { ...Styles.truncate, ...Styles.cellCursor },
  // },
];
