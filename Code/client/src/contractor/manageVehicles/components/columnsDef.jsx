
import {
  dateFormatter,
  vehicleStatusFormatter,
} from '../../../common/components/BSTableFormatters';

import { UserTypeDefs } from '../../../common/constants/commonTypes';
import Styles from './Styles';


/**
 * Vehicle Table Columns Defination
 *
 */
export const columnsVehicle = [
  {
    dataField: 'code',
    text: 'ID',
    style: { ...Styles.cellCursor },
  },
  {
    dataField: 'regNo',
    text: 'REGO No',
    style: { ...Styles.cellCursor },
  },
  {
    dataField: 'model',
    text: 'Vehicle Name',
    style: { ...Styles.truncate, ...Styles.cellCursor },
  },
  {
    dataField: 'class',
    text: 'Class',
    style: { ...Styles.truncate, ...Styles.cellCursor },
  },
  {
    dataField: 'inactiveAt',
    text: 'Registration Expiry',
    formatter: dateFormatter,
    style: { ...Styles.cellCursor },
  },
  {
    dataField: 'status',
    text: 'Status',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: vehicleStatusFormatter,
  },
];

export const columns = [
  {
    columnsDef: columnsVehicle,
    ...UserTypeDefs.driver,
  },
];
