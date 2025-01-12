const loggerErrorHandler = (err, req, res, next) => {
  logger.err(err.message, err.status || 500, err.stack);

  res.status(err.status || 500).json({ error: err.message });
};

module.exports = loggerErrorHandler;
