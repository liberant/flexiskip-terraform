export const APP_NAME = 'handel';
export const API_URL = '/api/v1';
// export const API_URL = 'http://uat.handelme.online/api/v1';
export const REQUEST_TIMEOUT = 300000;
export const ALERT_DISPLAY_DURATION = 2000;
export const TIME_OUT_DEBOUNCE = (process.env && process.env.TIME_OUT_DEBOUNCE) || 500;
export const IDLE_TIMEOUT = (process.env && process.env.IDLE_TIMEOUT) || 2 * 60 * 60 * 1000; // 2 hours
export const { ENVIRONMENT, SENTRY_DNS } = process.env || {
  "process.env.ENVIRONMENT": JSON.stringify("production"),
  "process.env.SENTRY_DNS": JSON.stringify(
    "https://1f4bf702246d45d28e4f0d24d17832ca@sentry.io/264486"
  ),
};
