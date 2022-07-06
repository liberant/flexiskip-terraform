
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * output integers with leading zeros.
 * source: http://stackoverflow.com/questions/2998784/how-to-output-integers-with-leading-zeros-in-javascript
 * @params num : number wants to add leading zeros.
 *         size: how many leading zeros.
 *
 * notice: only max 10 leading zeros.
 * @returns {string}
 */
export function pad(num, size) {
  const s = `0000000000${num}`;
  return s.substr(s.length - size);
}


/**
 * getFormattedDate(input)
 * convert 'YYYY-MM-DD' to 'DD MMM YYYY'
 *         'YYYY-M-D' to 'DD MMM YYYY'
 *
 * @params input 'YYYY-MM-DD' 'YYYY-M-D'
 * @returns {string} 'DD MMM YYYY'
 *
 * created by Matt@25-Nov-2016.
 *
*/
export function getFormattedDate(input) {
  if ((!input) || !/^\d{4}-\d{2}-\d{2}$/.test(input)) {
    return '';
  }
  const pattern = /(.*?)-(.*?)-(.*?)$/;
  const result = input.replace(pattern, (match, p1, p2, p3) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${p3 < 10 ? `0${Math.abs(p3)}` : p3} ${months[(p2 - 1)]}, ${p1}`;
  });

  return (result);
}

/**
 * Function getFullStringDate
 * getFullStringDate()
 * Get date of now
 * @returns {string}
 * return 'YYYY-MM-DD' of TODAY
 * return 'YYYY-MM-DD'
 *
 * created by Matt@16-Jan-2017.
 *
*/
export function getFullStringDate() {
  const today = new Date();

  const stoday = `${today.getFullYear()}-${pad((today.getMonth() + 1), 2)}-${pad(today.getDate(), 2)}`;

  return stoday;
}

/**
 * convert 'HH:MM:SS' to 'hh:MM:SS am/pm'
 * @param input 'HH:MM:SS'
 * @returns {string} 'hh:MM:SS am/pm'
 *
 * created by Matt@22-Feb-2017.
 */
export function getFormattedTime(input) {
  if ((!input) || !/^\d{2}:\d{2}:\d{2}$/.test(input)) {
    return '';
  }
  const pattern = /(.*?):(.*?):(.*?)$/;

  const result = input.replace(
    pattern,
    (match, p1, p2, p3) => `${parseInt(p1, 10) > 12 ? `${pad((parseInt(p1, 10) - 12), 2)}` : `${p1}`}:${p2}:${p3} ${parseInt(p1, 10) > 12 ? 'pm' : 'am'}`,
  );

  return result;
}

/**
 * convert 'YYYY-MM-DD HH:MM:SS' to 'DD MMM YYYY hh:MM:SS am/pm'
 *
 * @param input 'YYYY-MM-DD HH:MM:SS' string
 * @returns {string} 'DD MMM YYYY hh:MM:SS am/pm'
 * created by Matt@22-Feb-2017.
 *
 */
export function getFormattedDateTime(input) {
  if (!input) {
    return '';
  }
  return `${getFormattedDate(input.substr(0, 10))} ${getFormattedTime(input.substr(11, 8))}`;
}

/**
 * input: milliseconds
 * output: hh:mm:ss.
 * source: https://stackoverflow.com/questions/19700283/how-to-convert-time-milliseconds-to-hours-min-sec-format-in-javascript
 *         and add some validations and output.
 * @params milliseconds .
 *
 * @returns {string}
 */
export function parseMillisecondsIntoReadableTime(milliseconds, returnParsedNumberFlag = false) {
  if (typeof milliseconds !== 'number' || !milliseconds) {
    if (!returnParsedNumberFlag) {
      return '00:00:00';
    }
    return {
      hours: '--',
      minutes: '--',
      seconds: '--',
    };
  }

  let minusSign = '';
  let mils = milliseconds;

  if (milliseconds < 0) {
    mils *= -1;
    minusSign = '-';
  }

  // Get hours from milliseconds
  const hours = mils / (1000 * 60 * 60);
  const absoluteHours = Math.floor(hours);
  const h = absoluteHours > 9 ? absoluteHours : `0${absoluteHours}`;

  // Get remainder from hours and convert to minutes
  const minutes = (hours - absoluteHours) * 60;
  const absoluteMinutes = Math.floor(minutes);
  const m = absoluteMinutes > 9 ? absoluteMinutes : `0${absoluteMinutes}`;

  // Get remainder from minutes and convert to seconds
  const seconds = (minutes - absoluteMinutes) * 60;
  const absoluteSeconds = Math.floor(seconds);
  const s = absoluteSeconds > 9 ? absoluteSeconds : `0${absoluteSeconds}`;

  if (!returnParsedNumberFlag) {
    return `${minusSign} ${h}:${m}:${s}`;
  }

  return {
    hours: h,
    minutes: m,
    seconds: s,
    minus: (milliseconds < 0),
  };
}

/**
 * input: error
 * output: error messages as '1. message xxx 2. message xxx'.
 * @params error .
 *
 * @returns {string}
 */
export function getHttpErrorMessages(error) {
  let errorMessages = '';
  if (error && error.response && error.response.data && error.response.data.errors) {
    [[errorMessages]] = Object.values(error.response.data.errors);
  }
  return errorMessages;
}

/**
 * input: Date and interval
 * output: calculated Date.
 * @params date Date.
 * @params n interval
 *
 * @returns {Date}
 */
export function afterDate(date, n) {
  if (date.constructor !== Date) {
    const endDate = new Date();
    return endDate;
  }

  const mTimes = new Date(date);
  const endTimes = mTimes.valueOf() + (n * 24 * 60 * 60 * 1000);
  const endDate = new Date(endTimes);
  return endDate;
}

/**
 * output integers with commas.
 * source: https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
 * @params num : number wants to add commas.
 *
 * @returns {string}
 */
export const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/**
 * Display the unit by the input number. For example:
 *  245 will return 1 K,
 *  5,132 will return 10 K,
 *  23,131 will return 100 K,
 *  150,999 will return 1 M
 * @param {Number} number
 * @returns {Object} number displayed value in 1000 units: K/M/B/T
 */
export const calculateUnitDisplayedByNumber = (number) => {
  let countDigit = 0;
  let reducedNumber = number;
  let output = number;
  let unit = '';
  while (reducedNumber > 1) {
    reducedNumber /= 10;
    countDigit += 1;
  }

  if (countDigit >= 12) {
    output = 10 ** (countDigit - 12);
    unit = 1000000000000;
  } else if (countDigit >= 9) {
    output = 10 ** (countDigit - 9);
    unit = 1000000000;
  } else if (countDigit >= 6) {
    output = 10 ** (countDigit - 6);
    unit = 1000000;
  } else if (countDigit >= 3) {
    output = 10 ** (countDigit - 3);
    unit = 1000;
  } else {
    output = 10 ** countDigit;
  }

  return {
    value: output,
    unit,
  };
};
