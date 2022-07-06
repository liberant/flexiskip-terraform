// import { stateFullNameFormatter } from '../../../common/components/BSTableFormatters';
import { CouncilDefs } from '../constants/councilDefs';
import Styles from './Styles';

export const columnsCouncils = [
  {
    title: 'Council Name',
    key: 'name',
    dataIndex: 'name',
  },
  {
    title: 'State',
    key: 'state',
    dataIndex: 'state',
  },
  {
    title: 'No. of Dumpsites',
    key: 'dumpsiteCount',
    dataIndex: 'dumpsiteCount',
  },
];


export const columns = [
  {
    columnsDef: columnsCouncils,
    ...CouncilDefs.councilAdmin,
  },
];

export const columnsItems = [
  {
    dataField: 'code',
    text: 'ID',
    style: { ...Styles.truncate, ...Styles.cellCursor },
  },
  {
    dataField: 'name',
    text: 'Name',
    style: { ...Styles.truncate, ...Styles.cellCursor },
  },
  {
    dataField: 'address',
    text: 'Address',
    style: { ...Styles.truncate, ...Styles.cellCursor },
  },
  {
    dataField: 'wasteType',
    text: 'Waste Type',
    style: { ...Styles.truncate, ...Styles.cellCursor },
  },
  {
    dataField: 'fee',
    text: 'Fee',
    style: { ...Styles.truncate, ...Styles.cellCursor },
  },
];
