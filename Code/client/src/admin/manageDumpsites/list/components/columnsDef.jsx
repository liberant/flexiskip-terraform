import { stateFullNameFormatter } from '../../../../common/components/BSTableFormatters';

import { DumpsiteDefs } from '../constants/dumpsiteDefs';
import Styles from './Styles';


const columnsDumpsites = [
  {
    dataField: 'code',
    text: 'ID',
    headerStyle: { width: 100 },
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
    dataField: 'name',
    text: 'Name',
    headerStyle: { width: 180 },
    style: { ...Styles.truncate, ...Styles.cellCursor },
    // formatter: prouductStockStatusCheckFormatter,
  },

  {
    dataField: 'address',
    text: 'Address',
    headerStyle: { minWidth: 200 },
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: stateFullNameFormatter,
  },
  {
    dataField: 'council.name',
    text: 'Associated Council',
    style: { ...Styles.truncate, ...Styles.cellCursor },
  },
  // {
  //   dataField: 'surcharge',
  //   text: 'No. of Dumpsites',
  //   style: { ...Styles.truncate, ...Styles.cellCursor },
  // },

];


export const columns = [
  {
    columnsDef: columnsDumpsites,
    ...DumpsiteDefs.dumpsiteAdmin,
  },
];
