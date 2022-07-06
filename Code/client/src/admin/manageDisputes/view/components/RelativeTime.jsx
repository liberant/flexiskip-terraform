import moment from 'moment';

function getDateText(time) {
  const t = new Date(time);
  const today = new Date();
  if (t.toDateString() === today.toDateString()) {
    return 'Today';
  }

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (t.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  // display weekday
  const mon = moment().startOf('isoWeek');
  const sun = moment().endOf('isoWeek');
  if (t > mon && t < sun) {
    return moment(t).format('dddd');
  }

  // display weekday, day/month/year
  return moment(t).format('ddd DD MMM YYYY');
}

function getTimeText(time) {
  const t = new Date(time);
  const now = new Date();
  const diff = now.getTime() - t.getTime();

  if (diff < 0) {
    return moment(t).format('h:mm a');
  }

  const minutes = 1000 * 60;
  const hours = minutes * 60;
  if (diff < minutes) {
    return 'Just now';
  } else if (diff < hours) {
    return `${Math.floor(diff / minutes)} minutes ago`;
  } else if (diff <= hours * 5) {
    return `${Math.floor(diff / minutes / 60)} hours ago`;
  }
  return moment(t).format('h:mm a');
}

const RelativeTime = ({ value }) => `${getDateText(value)}, ${getTimeText(value)}`;

export default RelativeTime;
