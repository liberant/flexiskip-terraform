import React from 'react';
import moment from 'moment';
import Rating from 'react-rating';
import { Menu, Dropdown } from 'antd';


import {
  getFormattedDate,
  getFormattedTime,
  getFormattedDateTime,
  parseMillisecondsIntoReadableTime,
} from '../utils/common';
import { normalizePhoneNumber10 } from '../components/form/reduxFormComponents';
import {
  statusStyles,
  statusProdctStockType2Styles,
  statusUserType2Styles,
  statusVehicleType2Styles,
  statusBinCollectionRequestStatusStyles,
  statusCollectionRequestType2Styles,
  statusOrderedProductType2Styles,
  statusDiscountType2Styles,
  statusReportType2Styles,
  statusAdvertisingType2Styles,
} from '../constants/styles';

import { UserTypeDefs } from '../constants/commonTypes';

const Styles = {
  cellInventoryAlert: {
    color: '#f06666',
    fontWeight: 600,
  },
};


function dropdownStatus(statusType2Styles = [], onSelectedItem = () => false) {
  return (
    <Menu onClick={onSelectedItem}>
      {statusType2Styles.map(status => (
        <Menu.Item key={status.label}>
          <div style={status.styles}>
            {status.label}
          </div>
        </Menu.Item>
      ))}
    </Menu>
  );
}

/* eslint prefer-destructuring:0 */

function userIsPrimaryContactorFormatter(cell) {
  if (!cell) {
    return (<div />);
  }

  return (
    <div>
      <span
        className="handel-star"
        style={{
          color: '#239dff',
          fontSize: 14,
        }}
      />
    </div>
  );
}
/* eslint no-case-declarations: 0 */
function discountValueFormatter(cell, row) {
  if (!row) {
    return (<div />);
  }

  const { type, discount } = row;
  switch (type) {
    case 'percentage':
      return (
        <div>{`${discount}%`}</div>
      );
    case 'flat':
      return (
        <div>${`${(discount.toFixed(2))}`}</div>
      );
    case 'extra':
      return (
        <div>Extra</div>
      );
    default:
      return (<div />);
  }
}

function advertisingStatusFormatter(cell) {
  if (!cell) {
    return (<div />);
  }
  let styles = {
    ...statusStyles.common,
    color: '#4a4a4a',
    borderColor: '#4a4a4a',
  };

  const index =
    statusAdvertisingType2Styles.findIndex(s =>
      s.label.toLowerCase() === cell.trim().toLowerCase());
  if ((index >= 0) && (index < statusAdvertisingType2Styles.length)) {
    styles = statusAdvertisingType2Styles[index].styles;
  }

  return (
    <div style={{ ...styles, margin: 'unset' }}>
      {cell}
    </div>
  );
}

function discountStatusFormatter(cell) {
  if (!cell) {
    return (<div />);
  }
  let styles = {
    ...statusStyles.common,
    color: '#4a4a4a',
    borderColor: '#4a4a4a',
  };

  const index =
    statusDiscountType2Styles.findIndex(s => s.label.toLowerCase() === cell.trim().toLowerCase());
  if ((index >= 0) && (index < statusDiscountType2Styles.length)) {
    styles = statusDiscountType2Styles[index].styles;
  }

  return (
    <div style={{ ...styles, margin: 'unset' }}>
      {cell}
    </div>
  );
}

function userStatusFormatter(cell) {
  if (!cell) {
    return (<div />);
  }
  let styles = {
    ...statusStyles.common,
    color: '#4a4a4a',
    borderColor: '#4a4a4a',
  };

  const index =
    statusUserType2Styles.findIndex(s => s.label.toLowerCase() === cell.trim().toLowerCase());
  if ((index >= 0) && (index < statusUserType2Styles.length)) {
    styles = statusUserType2Styles[index].styles;
  }

  return (
    <div style={{ ...styles, margin: 'unset' }}>
      {cell}
    </div>
  );
}

function vehicleStatusFormatter(cell) {
  if (!cell) {
    return (<div />);
  }
  let styles = {
    ...statusStyles.common,
    color: '#4a4a4a',
    borderColor: '#4a4a4a',
  };

  const index =
    statusVehicleType2Styles.findIndex(s => s.label.toLowerCase() === cell.trim().toLowerCase());
  if ((index >= 0) && (index < statusVehicleType2Styles.length)) {
    styles = statusVehicleType2Styles[index].styles;
  }

  return (
    <div style={{ ...styles, margin: 'unset' }}>
      {cell}
    </div>
  );
}

function productRequestFormatter(cell) {
  if (!cell) {
    return (<div />);
  }

  let styles = {
    ...statusStyles.common,
    color: '#4a4a4a',
    borderColor: '#4a4a4a',
  };

  const index =
    statusCollectionRequestType2Styles
      .findIndex(s => s.label.toLowerCase() === cell.trim().toLowerCase());


  /* eslint prefer-destructuring:0 */
  if ((index >= 0) && (index < statusCollectionRequestType2Styles.length)) {
    styles = statusCollectionRequestType2Styles[index].styles;
  }

  return (
    <div style={styles}>
      {cell}
    </div>
  );
}

function orderedProductFormatter(cell) {
  if (!cell) {
    return (<div />);
  }

  let styles = {
    ...statusStyles.common,
    color: '#4a4a4a',
    borderColor: '#4a4a4a',
  };

  const index =
    statusOrderedProductType2Styles.findIndex(s =>
      s.label.toLowerCase() === cell.trim().toLowerCase());

  /* eslint prefer-destructuring:0 */
  if ((index >= 0) && (index < statusOrderedProductType2Styles.length)) {
    styles = statusOrderedProductType2Styles[index].styles;
  }

  return (
    <div style={styles}>
      {cell}
    </div>
  );
}

function getTotalQuantityInBinRequest(record) {
  if (record && record.items && record.items.length > 0) {
    return record.items.reduce((accumulator, item) => accumulator + item.quantity, 0);
  }
  return 0;
}

function orderedProductFormatterWithDropdown(cell, record, onSelected) {
  if (!cell) {
    return (<div />);
  }

  let styles = {
    ...statusStyles.common,
    color: '#4a4a4a',
    borderColor: '#4a4a4a',
  };

  const index =
    statusOrderedProductType2Styles.findIndex(s =>
      s.label.toLowerCase() === cell.trim().toLowerCase());

  /* eslint prefer-destructuring:0 */
  if ((index >= 0) && (index < statusOrderedProductType2Styles.length)) {
    styles = statusOrderedProductType2Styles[index].styles;
  }

  const dropdownOverlay = dropdownStatus(statusOrderedProductType2Styles, ({ key }) => {
    onSelected(key, record._id);
  });

  return (
    <Dropdown overlay={dropdownOverlay} trigger={['click']}>
      <div style={{ display: 'flex', alignItems: 'center', width: '118px' }}>
        <div style={styles}>
          {cell}
        </div>
        <span className="handel-pencil" style={{ marginLeft: '5px', color: '#239dff' }} />
      </div>
    </Dropdown>
  );
}

function collectionRequestFormatter(cell) {
  if (!cell) {
    return (<div />);
  }

  let styles = {
    ...statusStyles.common,
    color: '#4a4a4a',
    borderColor: '#4a4a4a',
  };

  const index =
  statusCollectionRequestType2Styles.findIndex(s =>
    s.label.toLowerCase() === cell.trim().toLowerCase());


  /* eslint prefer-destructuring:0 */
  if ((index >= 0) && (index < statusCollectionRequestType2Styles.length)) {
    styles = statusCollectionRequestType2Styles[index].styles;
  }

  return (
    <div style={styles}>
      {cell}
    </div>
  );
}

function binCollectionRequestFormatterWithDropdown(cell, record, onSelected) {
  if (!cell) {
    return (<div />);
  }

  let styles = {
    ...statusStyles.common,
    color: '#4a4a4a',
    borderColor: '#4a4a4a',
  };

  const index =
    statusBinCollectionRequestStatusStyles.findIndex(s =>
      s.label.toLowerCase() === cell.trim().toLowerCase());


  /* eslint prefer-destructuring:0 */
  if ((index >= 0) && (index < statusBinCollectionRequestStatusStyles.length)) {
    styles = statusBinCollectionRequestStatusStyles[index].styles;
  }

  const dropdownOverlay = dropdownStatus(statusBinCollectionRequestStatusStyles, ({ key }) => {
    onSelected(key, record._id);
  });

  return (
    <Dropdown overlay={dropdownOverlay} trigger={['click']}>
      <div style={{ display: 'flex', alignItems: 'center', width: '130px' }}>
        <div style={styles}>
          {cell}
        </div>
        <span className="handel-pencil" style={{ marginLeft: '5px', color: '#239dff' }} />
      </div>
    </Dropdown>
  );
}

function collectionRequestFormatterWithDropdown(cell, record, onSelected) {
  if (!cell) {
    return (<div />);
  }

  let styles = {
    ...statusStyles.common,
    color: '#4a4a4a',
    borderColor: '#4a4a4a',
  };

  const index =
  statusCollectionRequestType2Styles.findIndex(s =>
    s.label.toLowerCase() === cell.trim().toLowerCase());


  /* eslint prefer-destructuring:0 */
  if ((index >= 0) && (index < statusCollectionRequestType2Styles.length)) {
    styles = statusCollectionRequestType2Styles[index].styles;
  }

  const dropdownOverlay = dropdownStatus(statusCollectionRequestType2Styles, ({ key }) => {
    onSelected(key, record._id);
  });

  return (
    <Dropdown overlay={dropdownOverlay} trigger={['click']}>
      <div style={{ display: 'flex', alignItems: 'center', width: '130px' }}>
        <div style={styles}>
          {cell}
        </div>
        <span className="handel-pencil" style={{ marginLeft: '5px', color: '#239dff' }} />
      </div>
    </Dropdown>
  );
}

function reportStatusFormatter(cell) {
  if (!cell) {
    return (<div />);
  }

  let styles = {
    ...statusStyles.common,
    color: '#4a4a4a',
    borderColor: '#4a4a4a',
  };

  const index =
    statusReportType2Styles.findIndex(s =>
      s.label.toLowerCase() === cell.trim().toLowerCase());


  /* eslint prefer-destructuring:0 */
  if ((index >= 0) && (index < statusReportType2Styles.length)) {
    styles = statusReportType2Styles[index].styles;
  }

  return (
    <div style={styles}>
      {cell}
    </div>
  );
}


function actionFormatter(cell) {
  if (!cell) {
    return (<div />);
  }
  return (
    <div>
      <span className="handel-more" />
    </div>
  );
}

function dimensionFormatter(cell) {
  if (!cell) {
    return (<div />);
  }

  return (
    <div>
      {`(L)${cell.length || 0} `}
      <span className="handel-cross" />
      {`(W)${cell.width || 0} `}
      <span className="handel-cross" />
      {`(H)${cell.height || 0} mm`}
    </div>
  );
}

function priceFormatter(cell) {
  if (!cell) {
    return (<div>$ 0.00 </div>);
  }

  return (
    <div>
      {`$ ${(parseFloat(cell)).toFixed(2)}`}
    </div>
  );
}

function fullDateTimeFormatter(cell) {
  if (!cell) {
    return (<div />);
  }

  return getFormattedDateTime(moment.utc(cell).local().format('YYYY-MM-DD HH:mm:ss'));
}

function fullDateTimer2RowsFormatter(cell) {
  if (!cell) {
    return (<div />);
  }

  return (
    <div>
      <div>
        {getFormattedDate(moment.utc(cell).local().format('YYYY-MM-DD HH:mm:ss').substr(0, 10))}
      </div>
      <div>
        {getFormattedTime(moment.utc(cell).local().format('YYYY-MM-DD HH:mm:ss').substr(11))}
      </div>
    </div>
  );
}

function inventoryFormatter(cell) {
  if (!cell) {
    return (<div style={Styles.cellInventoryAlert}> 0 </div>);
  }

  if (cell < 1) {
    return (
      <div style={Styles.cellInventoryAlert}>
        {`${cell}`}
      </div>
    );
  }

  return (
    <div>
      {`${cell}`}
    </div>
  );
}

function stockAlertsFormatter(cell) {
  if (!cell) {
    return (<div />);
  }


  const index =
  statusProdctStockType2Styles.findIndex(s => s.label.toLowerCase() === cell.trim().toLowerCase());

  if ((index >= 0) && (index < statusProdctStockType2Styles.length)) {
    const { label, styles } = statusProdctStockType2Styles[index];
    return (
      <div style={styles}>
        {label}
      </div>
    );
  }

  const styles = {
    ...statusStyles.common,
    color: '#4a4a4a',
    borderColor: '#4a4a4a',
  };

  return (
    <div style={styles}>
      {cell}
    </div>
  );
}

function dateFormatter(cell) {
  if (!cell) {
    return (<div />);
  }

  return getFormattedDate(moment.utc(cell).local().format('YYYY-MM-DD HH:mm:ss').substr(0, 10));
}

function phoneFormatter(cell) {
  if (!cell) {
    return (<div />);
  }

  return `${normalizePhoneNumber10(cell)}`;
}

// the row should have special fields.
function nameContactFormatter(cell, row) {
  if (!row) {
    return (<div />);
  }

  let name = 'default';
  if (row.firstname || row.lastname) {
    name = `${row.firstname} ${row.lastname}`;
  }
  return (
    <div>{name}</div>
  );
}

// show rating value based on 5.
function ratingFormatter(cell) {
  if (!cell) {
    return (<div />);
  }

  return (`${cell}/5`);
}

function ratingStarFormatter(cell) {
  const ratingPoint = cell || 0;

  return (<Rating
    emptySymbol="fa fa-star-o fa-2x"
    fullSymbol="fa fa-star fa-2x"
    initialRating={parseFloat(ratingPoint) || 0}
    placeholderRating={0}
    readonly
  />);
}

// show user roles
function userRolesFormatter(cell) {
  if (!cell) {
    return (<div />);
  }

  let content = '';

  if (cell.constructor === Array) {
    content = '';
    cell.forEach((v) => {
      if (content !== '') {
        content += ', ';
      }
      content += UserTypeDefs[`${v}`] && UserTypeDefs[`${v}`].uiLabel;
    });
  } else {
    content = UserTypeDefs[`${cell}`] && UserTypeDefs[`${cell}`].uiLabel;
  }

  return (<div>{content}</div>);
}

// the row should have special fields.
function nameRatingReviewerFormatter(cell, row) {
  const { reviewer } = row;

  if (!row || !reviewer) {
    return (<div />);
  }

  let name = '';
  name = (reviewer.firstname || reviewer.lastname) && `${reviewer.firstname} ${reviewer.lastname}`;

  return (
    <div>{name}</div>
  );
}

function productQRCodeStatusFormatter(cell) {
  if (!cell) {
    return (<div>Not Printed</div>);
  }

  return (<div>Printed</div>);
}

function productTrackFormatter(cell, row) {
  if (!cell || !row) {
    return (<div />);
  }

  if (row.status === 'Pending') {
    return (
      <div>
        <span
          style={{
            display: 'inline-block',
            width: 69,
            height: 28,
            borderRadius: 3,
            backgroundColor: '#239dff',
            borShadow: '0 4px 8px 0 rgba(35, 157, 255, 0.3)',
            textAlign: 'center',
            color: '#ffffff',
            fontWeight: '600',
          }}
        >
          Track
        </span>
      </div>
    );
  }

  return (
    <div>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`https://www.fastway.com.au/tools/track?l=${row.fastwayLabel}`}
      >
        <span
          style={{
          display: 'inline-block',
          width: 69,
          height: 28,
          borderRadius: 3,
          backgroundColor: '#239dff',
          borShadow: '0 4px 8px 0 rgba(35, 157, 255, 0.3)',
          textAlign: 'center',
          color: '#ffffff',
          fontWeight: '600',
        }}
        >
          Track
        </span>
      </a>
    </div>
  );
}

function prouductStockStatusCheckFormatter(cell, row) {
  if (!row) {
    return (<div />);
  }

  if (!row.status || (row.status.trim().toLowerCase() === 'out of stock')) {
    return (
      <div style={{ color: '#f06666', fontWeight: '600' }}>
        {cell || 'status error'}
      </div>
    );
  }

  return (
    <div>
      {cell}
    </div>
  );
}

function priceStatusFormatter(cell, row) {
  if (!row) {
    return (<div />);
  }

  if (!row.status || (row.status.trim().toLowerCase() === 'out of stock')) {
    return (
      <div style={{ color: '#f06666', fontWeight: '600' }}>
        {`$ ${(parseFloat(cell || 0)).toFixed(2)}`}
      </div>
    );
  }

  return (
    <div>
      {`$ ${(parseFloat(cell || 0)).toFixed(2)}`}
    </div>
  );
}

function dimensionStatusFormatter(cell, row) {
  if (!row || !cell) {
    return (<div />);
  }

  if (!row.status || (row.status.trim().toLowerCase() === 'out of stock')) {
    return (
      <div style={{ color: '#f06666', fontWeight: '600' }}>
        {`(L)${cell.length || 0} `}
        <span className="handel-cross" />
        {`(W)${cell.width || 0} `}
        <span className="handel-cross" />
        {`(H)${cell.height || 0} mm`}
      </div>
    );
  }

  return (
    <div>
      {`(L)${cell.length || 0} `}
      <span className="handel-cross" />
      {`(W)${cell.width || 0} `}
      <span className="handel-cross" />
      {`(H)${cell.height || 0} mm `}
    </div>
  );
}

const stylesRemainingTime = {
  outerBox: {
    display: 'flex',
    justifyContent: 'left',
    flexDirection: 'row',
  },
  innerBox: {
    textAlign: 'center',
    // width: 40,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
  },
  colonBox: {
    textAlign: 'center',
    width: 30,
  },
  hint: {
    fontSize: 10,
    color: '#666666',
  },
};

function remainingTimeFormatter(rowData = {}) {
  const { collectBy, status } = rowData;
  const remainingTime = moment(collectBy) - moment();
  const time = parseMillisecondsIntoReadableTime(
    (status === 'Completed' || status === 'Not Completed') ? '-' : remainingTime || 0,
    true,
  );
  const color =
    (status === 'Completed' || status === 'Not Completed') && remainingTime < 0
      ? 'red'
      : '#666666';
  return (
    <div>
      <div style={stylesRemainingTime.outerBox}>
        <div style={stylesRemainingTime.innerBox}>
          <div style={{ ...stylesRemainingTime.label, color }}>
            {(time.minus) ? `-${time.hours}` : time.hours}
          </div>
          <div style={stylesRemainingTime.hint}>HOURS</div>
        </div>
        <div style={stylesRemainingTime.colonBox}>
          <div style={{ ...stylesRemainingTime.label, color }}>:</div>
        </div>
        <div style={stylesRemainingTime.innerBox}>
          <div style={{ ...stylesRemainingTime.label, color }}>{time.minutes}</div>
          <div style={stylesRemainingTime.hint}>MINS</div>
        </div>
        <div style={stylesRemainingTime.colonBox}>
          <div style={{ ...stylesRemainingTime.label, color }}>:</div>
        </div>
        <div style={stylesRemainingTime.innerBox}>
          <div style={{ ...stylesRemainingTime.label, color }}>{time.seconds}</div>
          <div style={stylesRemainingTime.hint}>SECS</div>
        </div>
      </div>
    </div>
  );
}

function stateFullNameFormatter(cell) {
  if (!cell) {
    return (<div />);
  }

  switch (cell.trim().toLowerCase()) {
    case 'act':
      return (<div>ACT - Australian Captial Territory</div>);
    case 'nt':
      return (<div>NT - Northern Territory</div>);
    case 'qld':
      return (<div>QLD - Queensland</div>);
    case 'nsw':
      return (<div>NSW - New South Wales</div>);
    case 'sa':
      return (<div>SA - South Australia</div>);
    case 'tas':
      return (<div>TAS - Tasmania</div>);
    case 'wa':
      return (<div>WA - Western Australia</div>);
    default:
      return (<div>{cell}</div>);
  }
}

function advertisingSectionFormatter(cell) {
  if (!cell) {
    return (<div />);
  }

  if (cell.toLowerCase().includes('horizontal')) {
    return (
      <div style={{ marginTop: '-5px' }}>
        <span
          className="handel-horizontal"
          style={{
            display: 'inline-block',
            marginRight: 10,
          }}
        />
        <span>Horizontal</span>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '-5px' }}>
      <span
        className="handel-vertical"
        style={{
          display: 'inline-block',
          marginRight: 10,
        }}
      />
      <span>Vertical</span>
    </div>
  );
}


export {
  actionFormatter,
  dimensionFormatter,
  priceFormatter,
  fullDateTimeFormatter,
  inventoryFormatter,
  stockAlertsFormatter,
  dateFormatter,
  phoneFormatter,
  nameContactFormatter,
  productRequestFormatter,
  prouductStockStatusCheckFormatter,
  priceStatusFormatter,
  dimensionStatusFormatter,
  userIsPrimaryContactorFormatter,
  userStatusFormatter,
  vehicleStatusFormatter,
  nameRatingReviewerFormatter,
  ratingFormatter,
  productQRCodeStatusFormatter,
  productTrackFormatter,
  userRolesFormatter,
  collectionRequestFormatter,
  remainingTimeFormatter,
  orderedProductFormatter,
  discountStatusFormatter,
  discountValueFormatter,
  fullDateTimer2RowsFormatter,
  reportStatusFormatter,
  stateFullNameFormatter,
  advertisingStatusFormatter,
  advertisingSectionFormatter,
  ratingStarFormatter,
  orderedProductFormatterWithDropdown,
  getTotalQuantityInBinRequest,
  dropdownStatus,
  collectionRequestFormatterWithDropdown,
  binCollectionRequestFormatterWithDropdown,
};
