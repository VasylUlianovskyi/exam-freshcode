const logger = require('../utils/logger');
const loggerErrorHandler = (err, req, res, next) => {
  logger.err(err.message, err.code || 500, err.stack);

  res.status(err.code || 500).json({ error: err.message });
};

module.exports = loggerErrorHandler;
