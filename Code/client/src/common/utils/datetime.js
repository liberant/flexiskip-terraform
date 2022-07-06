import moment from 'moment';
/**
 * Note: The date query is always parse to utc time before query api
 * If we aren't parse to utc time then the server must be parse it
 */

function getStartOfDay(date, utcTime = true) {
  const startDate = moment(date).startOf('day');
  if (utcTime) {
    return moment.utc(startDate).format();
  }
  return startDate.format();
}

function getEndOfDay(date, utcTime = true) {
  const endDate = moment(date).endOf('day');
  if (utcTime) {
    return moment.utc(endDate).format();
  }
  return endDate.format();
}

export {
  getStartOfDay,
  getEndOfDay,
};
