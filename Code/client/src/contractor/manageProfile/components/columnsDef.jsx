
import {
  phoneFormatter,
  userIsPrimaryContactorFormatter,
  userStatusFormatter,
} from '../../../common/components/BSTableFormatters';

import Styles from './Styles';

/**
 * Contractor Administrator Users Table Columns Defination
 *
 */
export const columnsContractorAdmin = [
  {
    dataField: 'isPrimary',
    text: '',
    headerStyle: {
      width: 30,
    },
    formatter: userIsPrimaryContactorFormatter,
  },
  {
    dataField: 'email',
    text: 'Email',
    style: { ...Styles.truncate, cursor: 'pointer' },
  },
  {
    dataField: 'firstname',
    text: 'First Name',
    style: { ...Styles.truncate, cursor: 'pointer' },
  },
  {
    dataField: 'lastname',
    text: 'Last Name',
    style: { ...Styles.truncate, cursor: 'pointer' },
  },
  {
    dataField: 'phone',
    text: 'Phone No.',
    style: { ...Styles.truncate, cursor: 'pointer' },
    formatter: phoneFormatter,
  },
  {
    dataField: 'status',
    text: 'Status',
    style: { ...Styles.truncate, cursor: 'pointer' },
    formatter: userStatusFormatter,
  },

];
