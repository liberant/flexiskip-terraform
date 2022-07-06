
import {
  actionFormatter,
  dateFormatter,
  phoneFormatter,
  nameContactFormatter,
  userIsPrimaryContactorFormatter,
  userStatusFormatter,
  vehicleStatusFormatter,
  nameRatingReviewerFormatter,
  ratingFormatter,
  userRolesFormatter,
} from '../../../common/components/BSTableFormatters';

import { UserTypeDefs } from '../../../common/constants/commonTypes';
import Styles from './Styles';

/**
 * User Types Table Columns Defination
 *
 */
const columnsDrivers4Accounts = [
  {
    dataField: 'uId',
    text: 'ID',
    style: { ...Styles.truncate, ...Styles.cellCursor },
  },
  {
    dataField: 'name',
    text: 'Name',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: nameContactFormatter,
  },
  {
    dataField: 'phone',
    text: 'Phone no.',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: phoneFormatter,
  },
  {
    dataField: 'email',
    text: 'Email',
    style: { ...Styles.truncate, ...Styles.cellCursor },
  },
  {
    dataField: 'licence.licenceClass',
    text: 'Licence Class',
    style: { ...Styles.truncate, ...Styles.cellCursor },
  },
  {
    dataField: 'status',
    text: 'Status',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: userStatusFormatter,
  },
  // {
  //   dataField: '_id',
  //   text: 'Action',
  //   style: { ...Styles.truncate, ...Styles.cellCursor },
  //   formatter: actionFormatter,
  // },
];

export const columns = [
  // {
  //   columnsDef: columnsResidentialCustomer,
  //   ...UserTypeDefs.residentialCustomer,
  // },
  // {
  //   columnsDef: columnsBusinessCustomer,
  //   ...UserTypeDefs.businessCustomer,
  // },
  // {
  //   columnsDef: columnsBusinessContractor,
  //   ...UserTypeDefs.contractor,
  // },
  {
    columnsDef: columnsDrivers4Accounts,
    ...UserTypeDefs.driver,
  },
  // {
  //   columnsDef: columnsHandelAdmin,
  //   ...UserTypeDefs.admin,
  // },
];

/**
 * Rating Table Columns Defination
 *
 */
export const columnsRating = [
  {
    dataField: 'reviewer.uId',
    text: 'ID',
  },
  {
    dataField: 'reviewer.name',
    text: 'Name',
    style: { ...Styles.truncate },
    formatter: nameRatingReviewerFormatter,
  },
  {
    dataField: 'reviewer.roles',
    text: 'User Type',
    style: { ...Styles.truncate },
    formatter: userRolesFormatter,
  },
  {
    dataField: 'point',
    text: 'Rate',
    formatter: ratingFormatter,
  },
  {
    dataField: 'comment',
    text: 'Comment',
    style: { ...Styles.truncate },
  },
];

export const columnsConnectedUsers = [
  {
    dataField: 'isPrimary',
    text: '',
    headerStyle: {
      width: 30,
    },
    formatter: userIsPrimaryContactorFormatter,
  },
  {
    dataField: 'firstname',
    text: 'First Name',
    style: { ...Styles.truncate },
  },
  {
    dataField: 'lastname',
    text: 'Last Name',
    style: { ...Styles.truncate },
  },
  {
    dataField: 'position',
    text: 'Position',
    style: { ...Styles.truncate },
  },
  {
    dataField: 'phone',
    text: 'Phone No.',
    style: { ...Styles.truncate },
    formatter: phoneFormatter,
  },
  {
    dataField: 'email',
    text: 'Email',
    style: { ...Styles.truncate },
  },
];

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
    dataField: 'firstname',
    text: 'First Name',
    style: { ...Styles.truncate },
  },
  {
    dataField: 'lastname',
    text: 'Last Name',
    style: { ...Styles.truncate },
  },
  {
    dataField: 'position',
    text: 'Position',
    style: { ...Styles.truncate },
  },
  {
    dataField: 'phone',
    text: 'Phone No.',
    style: { ...Styles.truncate },
    formatter: phoneFormatter,
  },
  {
    dataField: 'email',
    text: 'Email',
    style: { ...Styles.truncate },
  },
];


/**
 * Vehicle Table Columns Defination
 *
 */
export const columnsVehicle = [
  {
    dataField: 'uId',
    text: 'ID',
  },
  {
    dataField: 'regNo',
    text: 'REGO No',
  },
  {
    dataField: 'class',
    text: 'Class',
    style: { ...Styles.truncate },
  },
  {
    dataField: 'inactiveAt',
    text: 'Registration Expiry',
    formatter: dateFormatter,
  },
  {
    dataField: 'status',
    text: 'Status',
    style: { ...Styles.truncate },
    formatter: vehicleStatusFormatter,
  },
];

/**
 * Drivers Table Columns Defination
 *
 */
export const columnsDrivers = [
  {
    dataField: 'uId',
    text: 'ID',
    style: { ...Styles.truncate },
  },
  {
    dataField: 'lastname',
    text: 'Name',
    style: { ...Styles.truncate },
    formatter: nameContactFormatter,
  },
  {
    dataField: 'phone',
    text: 'Phone No.',
    style: { ...Styles.truncate },
  },
  {
    dataField: 'email',
    text: 'Email',
    style: { ...Styles.truncate },
  },
  {
    dataField: 'licence.licenceClass',
    text: 'License Class',
    style: { ...Styles.truncate },
  },
  {
    dataField: 'status',
    text: 'Status',
    style: { ...Styles.truncate },
    formatter: userStatusFormatter,
  },
];

/**
 * Linked Contractor Business Table Columns Defination
 *
 */
export const columnsLinkedContractorBusiness = [
  {
    dataField: 'abn',
    text: 'ABN',
    style: { ...Styles.truncate },
  },
  {
    dataField: 'name',
    text: 'Business Name',
    style: { ...Styles.truncate },
  },
  {
    dataField: 'linkedOn',
    text: 'Linked on',
    style: { ...Styles.truncate },
    formatter: dateFormatter,
  },
  {
    dataField: '_id',
    text: 'Action',
    style: { ...Styles.truncate },
    formatter: actionFormatter,
  },
];
