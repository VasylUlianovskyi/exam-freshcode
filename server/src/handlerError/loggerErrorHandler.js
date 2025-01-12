const logger = require('../utils/logger');

const loggerErrorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    time: Date.now(),
    code: err.status || 500,
    stackTrace: err.stack,
  });

  res.status(err.status || 500).json({ error: err.message });
};

module.exports = loggerErrorHandler;
