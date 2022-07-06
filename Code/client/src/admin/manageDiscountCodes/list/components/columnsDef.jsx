import {
  dateFormatter,
  discountStatusFormatter,
  discountValueFormatter,
} from '../../../../common/components/BSTableFormatters';

import { DiscountDefs } from '../constants/discountDefs';
import Styles from './Styles';


const columnsDiscounts = [
  // {
  //   dataField: 'uID',
  //   text: 'ID',
  //   style: { ...Styles.truncate, ...Styles.cellCursor },
  //   // formatter: prouductStockStatusCheckFormatter,
  // },
  {
    dataField: 'code',
    text: 'Code',
    style: { ...Styles.cellCursor },
    // formatter: dimensionStatusFormatter,
  },
  {
    dataField: 'name',
    text: 'Name',
    style: { ...Styles.truncate, ...Styles.cellCursor, width: 100 },
    // formatter: prouductStockStatusCheckFormatter,
  },

  {
    dataField: 'discount',
    text: 'Discount',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: discountValueFormatter,
  },
  {
    dataField: 'dateStart',
    text: 'Start on',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: dateFormatter,
  },
  {
    dataField: 'dateEnd',
    text: 'End on',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: dateFormatter,
  },
  {
    dataField: 'status',
    text: 'Status',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: discountStatusFormatter,
  },
];


export const columns = [
  {
    columnsDef: columnsDiscounts,
    ...DiscountDefs.discountAdmin,
  },
];
