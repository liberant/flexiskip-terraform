export const MAIN_COLOR = '#239dff';
export const APP_BACKGROUND_COLOR = '#F6F6F6';

export const textStyles = {
  truncate: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};

export const statusStyles = {
  common: {
    width: 98,
    height: 18,
    borderRadius: 3,
    textAlign: 'center',
    border: '1px solid #ff9a00',
    fontWeight: '600',
    lineHeight: '15px',
    margin: 'unset',
  },
};

/**
 * FWM-13200 Order Status
 */
export const statusOrderTypes = [
  'Pending',
  'In Progress',
  'Completed',
  'Cancelled',
];

export const statusOrderTypesStyles = [
  '#ff9900',
  '#72c814',
  '#4a4a4a',
  '#f06666',
];

export const statusAdvertisingTypes = [
  'Live',
  'Removed',
  'Suspended',
  'Expired',
  'Ready',
  'Draft',
];

export const statusAdvertisingType2Styles = [
  {
    label: 'Live',
    styles: {
      ...statusStyles.common,
      borderColor: '#72c814',
      color: '#FFFFFF',
      backgroundColor: '#72c814',
    },
  },
  {
    label: 'Removed',
    styles: {
      ...statusStyles.common,
      borderColor: '#666666',
      color: '#FFFFFF',
      backgroundColor: '#666666',
    },
  },
  {
    label: 'Suspended',
    styles: {
      ...statusStyles.common,
      borderColor: '#ff9a00',
      color: '#FFFFFF',
      backgroundColor: '#ff9a00',
    },
  },
  {
    label: 'Expired',
    styles: {
      ...statusStyles.common,
      borderColor: '#f06666',
      color: '#FFFFFF',
      backgroundColor: '#f06666',
    },
  },
  {
    label: 'Ready',
    styles: { ...statusStyles.common, borderColor: '#ff9a00', color: '#ff9900' },
  },
  {
    label: 'Draft',
    styles: { ...statusStyles.common, borderColor: '#239dff', color: '#239dff' },
  },
];

export const statusOrderType2Styles = [
  {
    label: 'Pending',
    styles: { ...statusStyles.common, borderColor: '#ff9900', color: '#ff9900' },
  },
  {
    label: 'In Progress',
    styles: { ...statusStyles.common, borderColor: '#72c814', color: '#72c814' },
  },
  {
    label: 'Completed',
    styles: {
      ...statusStyles.common,
      borderColor: '#72c814',
      color: '#FFFFFF',
      backgroundColor: '#72c814',
    },
  },
  {
    label: 'Cancelled',
    styles: {
      ...statusStyles.common,
      borderColor: '#f06666',
      color: '#FFFFFF',
      backgroundColor: '#f06666',
    },
  },
];

/**
 * FWM-13201 Ordered Product Status
 */
export const statusOrderedProductTypes = [
  'Pending',
  'Ready',
  'Dispatched',
  'Delivered',
  'Cancelled',
];

export const statusOrderedProductType2Styles = [
  {
    label: 'Pending',
    styles: { ...statusStyles.common, borderColor: '#ff9900', color: '#ff9900' },
  },
  {
    label: 'Ready',
    styles: { ...statusStyles.common, borderColor: '#239dff', color: '#239dff' },
  },
  {
    label: 'Dispatched',
    styles: { ...statusStyles.common, borderColor: '#a03de7', color: '#a03de7' },
  },
  {
    label: 'Delivered',
    styles: {
      ...statusStyles.common,
      borderColor: '#72c814',
      color: '#FFFFFF',
      backgroundColor: '#72c814',
    },
  },
  {
    label: 'Cancelled',
    styles: {
      ...statusStyles.common,
      borderColor: '#f06666',
      color: '#FFFFFF',
      backgroundColor: '#f06666',
    },
  },
];

export const productTypes = [
  'Type 1', 'Type 2', 'Type 3', 'Type 4',
];

/**
 * FWM-09801 Product Status
 */
export const statusProductStockTypes = [
  'In Stock',
  'Low of Stock',
  'Out of Stock',
  'Unavailable',
  'Removed',
];

export const statusProdctStockType2Styles = [
  {
    label: 'In Stock',
    styles: { ...statusStyles.common, borderColor: '#72c814', color: '#72c814' },
  },
  {
    label: 'Low of Stock',
    styles: { ...statusStyles.common, borderColor: '#f06666', color: '#f06666' },
  },
  {
    label: 'Out of Stock',
    styles: {
      ...statusStyles.common,
      borderColor: '#f06666',
      color: '#FFFFFF',
      backgroundColor: '#f06666',
    },
  },
  {
    label: 'Unavailable',
    styles: { ...statusStyles.common, borderColor: '#4a4a4a', color: '#4a4a4a' },
  },
  {
    label: 'Removed',
    styles: {
      ...statusStyles.common,
      borderColor: '#666666',
      color: '#FFFFFF',
      backgroundColor: '#666666',
    },
  },
];


/**
 * FWM-00400 User Status
 */
export const statusUserTypes = [
  'Pending',
  'Active',
  'Inactive',
  'Unavailable',
  'Suspended',
  'Removed',
];

export const vehicleStatuses = [
  'Pending',
  'Active',
  'Unavailable',
  'Removed',
];

export const statusUserType2Styles = [
  {
    label: 'Pending',
    styles: { ...statusStyles.common, borderColor: '#ff9a00', color: '#ff9a00' },
  },
  {
    label: 'Active',
    styles: { ...statusStyles.common, borderColor: '#72c814', color: '#72c814' },
  },
  {
    label: 'Inactive',
    styles: { ...statusStyles.common, borderColor: '#f06666', color: '#f06666' },
  },
  {
    label: 'Unavailable',
    styles: { ...statusStyles.common, borderColor: '#4a4a4a', color: '#4a4a4a' },
  },
  {
    label: 'Suspended',
    styles: {
      ...statusStyles.common,
      borderColor: '#ff9a00',
      color: '#FFFFFF',
      backgroundColor: '#ff9a00',
    },
  },
  {
    label: 'Removed',
    styles: {
      ...statusStyles.common,
      borderColor: '#666666',
      color: '#FFFFFF',
      backgroundColor: '#666666',
    },
  },
];

/**
 * FWM-07700 Vehicle Status
 */
export const statusVehicleTypes = [
  'Pending',
  'Active',
  'Unavailable',
  'Removed',
];

export const statusVehicleType2Styles = [
  {
    label: 'Pending',
    styles: { ...statusStyles.common, borderColor: '#ff9a00', color: '#ff9a00' },
  },
  {
    label: 'Active',
    styles: { ...statusStyles.common, borderColor: '#72c814', color: '#72c814' },
  },
  {
    label: 'Unavailable',
    styles: { ...statusStyles.common, borderColor: '#4a4a4a', color: '#4a4a4a' },
  },
  {
    label: 'Removed',
    styles: {
      ...statusStyles.common,
      borderColor: '#666666',
      color: '#FFFFFF',
      backgroundColor: '#666666',
    },
  },
];

/**
 * FWM-14300 Bin - Collection Request Status
 */
export const statusBinCollectionRequestStatus = [
    "New", // bin is new and don't belong to any collection request
    "Requested", // a collection request is made and waiting for driver to accept
    "Accepted", // driver confirmed
    "Collected", // collected by driver
    "Not Collected", // driver refuse to collect
    "Completed", // driver delivered bin at dump site successfully
];

export const statusBinCollectionRequestStatusStyles = [
  {
    label: 'New',
    styles: {
      ...statusStyles.common,
      borderColor: '#ff9900',
      color: '#ff9900',
      width: '120px',
    },
  },
  {
    label: 'Requested',
    styles: {
      ...statusStyles.common,
      borderColor: '#ff9a00',
      color: '#ff9a00',
      width: '120px',
    },
  },
  {
    label: 'Accepted',
    styles: {
      ...statusStyles.common,
      borderColor: '#72c814',
      color: '#72c814',
      width: '120px',
    },
  },
  {
    label: 'Collected',
    styles: {
      ...statusStyles.common,
      borderColor: '#72c814',
      color: '#72c814',
      width: '120px',
    },
  },
  {
    label: 'Not Collected',
    styles: {
      ...statusStyles.common,
      borderColor: '#F06666',
      color: '#FFFFFF',
      backgroundColor: '#F06666',
      width: '120px',
    },
  },
  {
    label: 'Completed',
    styles: {
      ...statusStyles.common,
      borderColor: '#72c814',
      color: '#FFFFFF',
      backgroundColor: '#72c814',
      width: '120px',
    },
  },
];


/**
 * FWM-14300 Collection Request Status
 */
export const statusCollectionRequestTypes = [
  'Requested',
  'Accepted',
  'In Progress',
  'Completed',
  'Cancelled',
];

export const statusCollectionRequestType2Styles = [
  {
    label: 'Requested',
    styles: {
      ...statusStyles.common,
      borderColor: '#ff9a00',
      color: '#ff9a00',
      width: '120px',
    },
  },
  {
    label: 'Accepted',
    styles: {
      ...statusStyles.common,
      borderColor: '#72c814',
      color: '#72c814',
      width: '120px',
    },
  },
  {
    label: 'In Progress',
    styles: {
      ...statusStyles.common,
      borderColor: '#72c814',
      color: '#FFFFFF',
      backgroundColor: '#72c814',
      width: '120px',
    },
  },
  {
    label: 'Completed',
    styles: {
      ...statusStyles.common,
      borderColor: '#72c814',
      color: '#FFFFFF',
      backgroundColor: '#72c814',
      width: '120px',
    },
  },
  {
    label: 'Cancelled',
    styles: {
      ...statusStyles.common,
      borderColor: '#F06666',
      color: '#FFFFFF',
      backgroundColor: '#F06666',
      width: '120px',
    },
  },
  {
    label: 'Not Completed',
    styles: {
      ...statusStyles.common,
      borderColor: '#000000',
      color: '#FFFFFF',
      backgroundColor: '#000000',
      width: '120px',
    },
  },
];

/**
 * FWM-18000 Discount Code Status
 */
export const statusDiscountTypes = [
  'Active',
  'Inactive',
  'Removed',
];

export const statusDiscountType2Styles = [
  {
    label: 'Active',
    styles: { ...statusStyles.common, borderColor: '#72c814', color: '#72c814' },
  },
  {
    label: 'Inactive',
    styles: {
      ...statusStyles.common,
      color: '#4a4a4a',
      borderColor: '#4a4a4a',
    },
  },
  {
    label: 'Removed',
    styles: {
      ...statusStyles.common,
      borderColor: '#666666',
      color: '#FFFFFF',
      backgroundColor: '#666666',
    },
  },
];

/**
 * FWM-24800 Reporting Status
 */
export const statusReportTypes = [
  'Reported',
  'Actioned',
  'Resolved',
];

export const statusReportType2Styles = [
  {
    label: 'Actioned',
    styles: { ...statusStyles.common, borderColor: '#72c814', color: '#72c814' },
  },
  {
    label: 'Reported',
    styles: {
      ...statusStyles.common,
      borderColor: '#f06666',
      color: '#f06666',
      backgroundColor: '#FFFFFF',
    },
  },
  {
    label: 'Resolved',
    styles: {
      ...statusStyles.common,
      borderColor: '#72c814',
      color: '#FFFFFF',
      backgroundColor: '#72c814',
    },
  },

];


export const statusRefArray = {
  user: statusUserType2Styles,
  vehicle: statusVehicleType2Styles,
  order: statusOrderType2Styles,
  orderedProduct: statusOrderedProductType2Styles,
  productStock: statusProdctStockType2Styles,
  collectionRequest: statusCollectionRequestType2Styles,
  discount: statusDiscountType2Styles,
  report: statusReportType2Styles,
  advertising: statusAdvertisingType2Styles,
};
