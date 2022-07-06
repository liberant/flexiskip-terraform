import React from 'react';
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
import { truncate } from '../../../common/helpers';
import { UserTypeDefs } from '../../../common/constants/commonTypes';
import Styles from './Styles';

/**
 * User Types Table Columns Defination
 *
 */
const columnsResidentialCustomer = [
  {
    dataField: 'uId',
    text: 'ID',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    headerStyle: { width: 131 },
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
    headerStyle: { width: 162 },
  },
  {
    dataField: 'address',
    text: 'Address',
    style: { ...Styles.truncate, ...Styles.cellCursor },
  },
  {
    dataField: 'status',
    text: 'Status',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: userStatusFormatter,
    headerStyle: { width: 130 },
  },
];

const columnsBusinessCustomer = [
  {
    dataField: 'uId',
    text: 'ID',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    headerStyle: { width: 71 },
  },
  {
    dataField: 'organisation.name',
    text: 'Business Name',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    headerStyle: { width: 220 },
  },

  {
    dataField: 'phone',
    text: 'Phone no.',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: phoneFormatter,
    headerStyle: { width: 131 },
  },
  {
    dataField: 'organisation.email',
    text: 'Email',
    style: { ...Styles.truncate, ...Styles.cellCursor },
  },
  {
    dataField: 'firstname',
    text: 'Primary Contact',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: nameContactFormatter,
  },
  {
    dataField: 'status',
    text: 'Status',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: userStatusFormatter,
    headerStyle: { width: 131 },
  },
  // {
  //   dataField: '_id',
  //   text: 'Action',
  //   style: { ...Styles.truncate, ...Styles.cellCursor },
  //   formatter: actionFormatter,
  // },
];

const columnsBusinessContractor = [
  {
    dataField: 'uId',
    text: 'ID',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    headerStyle: { width: 131 },
  },
  {
    dataField: 'organisation.name',
    text: 'Business Name',
    style: { ...Styles.truncate, ...Styles.cellCursor },
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
    dataField: 'firstname',
    text: 'Primary Contact',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: nameContactFormatter,
  },
  {
    dataField: 'status',
    text: 'Status',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: userStatusFormatter,
  },
];

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
    dataField: 'licence.licenceType',
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

const columnsHandelAdmin = [
  {
    dataField: 'uId',
    text: 'ID',
    style: { ...Styles.truncate, ...Styles.cellCursor },
  },
  {
    dataField: 'firstname',
    text: 'First Name',
    style: { ...Styles.truncate, ...Styles.cellCursor },
  },
  {
    dataField: 'lastname',
    text: 'Last Name',
    style: { ...Styles.truncate, ...Styles.cellCursor },
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
    dataField: 'status',
    text: 'Status',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: userStatusFormatter,
  },
];

const columnsHandelCouncilOfficer = [
  {
    dataField: 'uId',
    text: 'ID',
    style: { ...Styles.truncate, ...Styles.cellCursor },
  },
  {
    dataField: 'firstname',
    text: 'First Name',
    style: { ...Styles.truncate, ...Styles.cellCursor },
  },
  {
    dataField: 'lastname',
    text: 'Last Name',
    style: { ...Styles.truncate, ...Styles.cellCursor },
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
    dataField: 'status',
    text: 'Status',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: userStatusFormatter,
  },
];

export const columns = [
  {
    columnsDef: columnsResidentialCustomer,
    ...UserTypeDefs.residentialCustomer,
  },
  {
    columnsDef: columnsBusinessCustomer,
    ...UserTypeDefs.businessCustomer,
  },
  {
    columnsDef: columnsBusinessContractor,
    ...UserTypeDefs.contractor,
  },
  {
    columnsDef: columnsDrivers4Accounts,
    ...UserTypeDefs.driver,
  },
  {
    columnsDef: columnsHandelCouncilOfficer,
    ...UserTypeDefs.councilOfficer,
  },
  {
    columnsDef: columnsHandelAdmin,
    ...UserTypeDefs.admin,
  },
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
    formatter: cell => <span title={cell}>{truncate(cell, 50)}</span>,
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
    style: { ...Styles.cellCursor },
    formatter: userIsPrimaryContactorFormatter,
  },
  {
    dataField: 'firstname',
    text: 'First Name',
    style: { ...Styles.truncate, ...Styles.cellCursor },
  },
  {
    dataField: 'lastname',
    text: 'Last Name',
    style: { ...Styles.truncate, ...Styles.cellCursor },
  },
  {
    dataField: 'position',
    text: 'Position',
    style: { ...Styles.truncate, ...Styles.cellCursor },
  },
  {
    dataField: 'phone',
    text: 'Phone No.',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: phoneFormatter,
  },
  {
    dataField: 'email',
    text: 'Email',
    style: { ...Styles.truncate, ...Styles.cellCursor },
  },
  {
    dataField: 'status',
    text: 'Status',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: userStatusFormatter,
  },
];

/**
 * Contractor Administrator Users Table Columns Defination
 *
 */
export const columnsContractorAdmin = [
  {
    dataField: 'contractorProfile.isPrimary',
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
    dataField: 'contractorProfile.position',
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

/**
 * Drivers Table Columns Defination
 *
 */
export const columnsDrivers = [
  {
    dataField: 'uId',
    text: 'ID',
    style: { ...Styles.truncate, ...Styles.cellCursor },
  },
  {
    dataField: 'lastname',
    text: 'Name',
    style: { ...Styles.truncate, ...Styles.cellCursor },
    formatter: nameContactFormatter,
  },
  {
    dataField: 'phone',
    text: 'Phone No.',
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
    text: 'License Class',
    style: { ...Styles.truncate, ...Styles.cellCursor },
  },
  {
    dataField: 'status',
    text: 'Status',
    style: { ...Styles.truncate, ...Styles.cellCursor },
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
