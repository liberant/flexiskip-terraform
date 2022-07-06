const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const logger = require('./modules/common/log');
const sentry = require('./modules/common/sentry');
const { notFoundExc } = require('./modules/common/helpers');
const router = require('./router');

const app = express();

app.use(cors());

// integrate template engine
app.set('view engine', 'pug');
app.use(express.static(path.resolve('./assets')));

// integrate sentry with raven-node
sentry.install();
sentry.addRequestHandler(app);

// enable parsing request boby with different content types
app.use(bodyParser.json());

// log http request to console
app.use(morgan('tiny', {
  stream: logger.stream,
  // skip logging for the root path
  // because it is used as health check path by AWS
  skip: req => req.path === '/',
}));

// application router
app.use(router);

// catch 404 and forward to error handler
app.use((req, res, next) => next(notFoundExc('No route found')));

sentry.addErrorHandler(app);

// error handler
app.use((err, req, res, next) => {
  // log uncaught exception
  if (!err.status) {
    logger.error(err.stack);
  }

  const status = err.status || 500;
  res.status(status).json({
    code: err.code || 'server_error',
    message: err.message,
    description: err.description,
    errors: err.errors,
  });
});

module.exports = app;
