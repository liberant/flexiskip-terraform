import { dateFormatter, advertisingStatusFormatter, advertisingSectionFormatter } from '../../../common/components/BSTableFormatters';

import { AdvertisingDefs } from '../constants/advertisingDefs';
import Styles from './Styles';


const columnsAdvertising = [
  {
    dataField: 'title',
    text: 'Title',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    // formatter: prouductStockStatusCheckFormatter,
  },
  // {
  //   dataField: 'code',
  //   text: 'Code',
  //   style: { ...Styles.cellCursor },
  //   // formatter: dimensionStatusFormatter,
  // },
  {
    dataField: 'section',
    text: 'Section',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: advertisingSectionFormatter,
  },

  {
    dataField: 'startDate',
    text: 'Start Date',
    headerStyle: { width: 120 },
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: dateFormatter,
  },
  {
    dataField: 'endDate',
    text: 'End Date',
    headerStyle: { width: 120 },
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: dateFormatter,
  },
  {
    dataField: 'status',
    text: 'Status',
    headerStyle: { width: 150 },
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: advertisingStatusFormatter,
  },
  // {
  //   dataField: 'surcharge',
  //   text: 'No. of Advertising',
  //   style: { ...Styles.truncate, ...Styles.cellCursor },
  // },

];


export const columns = [
  {
    columnsDef: columnsAdvertising,
    ...AdvertisingDefs.advertisingAdmin,
  },
];
