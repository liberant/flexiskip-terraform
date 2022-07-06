const config = {
  appName: 'handel',
  appSecret: '76211hhhiku',
  basePath: __dirname,
  port: process.env.PORT || 3000,
  webUrl: process.env.WEB_URL,
  accessTokenLifeTime: '30 days',
  resetPasswordTokenLifeTime: '24 hours',
  setPasswordTokenLifeTime: '72 hours',
  verificationCodeLifeTime: 24, // hours
  sentryDns: process.env.SENTRY_DNS || false,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  googleApiKey: process.env.GOOGLE_API_KEY,
  fastwayApiKey: process.env.FASTWAY_API_KEY,
  driverFcmApiKey: process.env.CUSTOMER_FCM_API_KEY,
  customerFcmApiKey: process.env.DRIVER_FCM_API_KEY,
  db: {
    uri: process.env.DB_URI,
    councilAddressDbUri: process.env.COUNCIL_ADDRESSES_DB_URI,
    debug: process.env.MONGOOSE_DEBUG === 'true',
  },
  mail: {
    transport: {
      /* host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: true, */
      service: 'Mailgun',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PWD,
      },
    },
    autoEmail: 'noreply@handel.group',
    adminEmail: 'admin@handel.group',
    disputeEmail: 'my+admin@theappteam.com.au',
  },
  awsConfig: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucket: process.env.AWS_BUCKET,
    websiteEndpoint: process.env.AWS_BUCKET_ENDPOINT,
    objectKeyPrefix: 'upload/',
  },
  limitDistance: 50,
  limitJob: 10,
  pageJob: 20,
  printSize: [216, 216],
  printMargin: 5,
  productWareHouseAddress:
    '3/259 Cullen Avenue East, Eagle Farm, QLD 4009 Australia',
  broadcastInterval: process.env.BROADCAST_INTERVAL,
  // the time range from creating to accepting
  collectionLifeTime: process.env.COLLECTION_LIFE_TIME,
  // the time range from accepting to progressing
  collectionProcessLifeTime: process.env.COLLECTION_PROCESS_LIFE_TIME, // 72 * 60 * 60 * 1000
  reportSpreadsheetId: process.env.REPORT_SPREADSHEET_ID,
  collectionRequestSheetReport: process.env.COLLECTION_REQUEST_SHEET_REPORT,
  productRequestSheetReport: process.env.PRODUCT_REQUEST_SHEET_REPORT,
  maximumDistance: process.env.MAXIMUM_DISTANCE,

  kerbsideLandingPageUrl: process.env.KERBSIDE_LANDING_PAGE_URL,

  //GCC Violation Charge CRON
  enableGCCViolationChargeCRON: JSON.parse(process.env.ENABLE_GCC_VIOLATION_CHARGE_CRON),

  gccViolationCRONExpression: process.env.GCC_VIOLATION_CRON_EXPRESSION || '0 0 * * *',
  jobQueueCRONExpression: process.env.JOB_QUEUE_CRON_EXPRESSION || '* * * * *',

  gcProductIds: process.env.GC_PRODUCTS ? JSON.parse(process.env.GC_PRODUCTS) : [],
  gcStripeConnectedAccount: process.env.GC_STRIPE_CONNECTED_ACCOUNT,

  clickUpTaskMail: process.env.CLICK_UP_TASK_MAIL,
};

module.exports = config;
