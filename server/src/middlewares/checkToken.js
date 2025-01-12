const jwt = require('jsonwebtoken');
const CONSTANTS = require('../constants');
const TokenError = require('../errors/TokenError');
const userQueries = require('../controllers/queries/userQueries');
const logger = require('./../utils/logger');

module.exports.checkAuth = async (req, res, next) => {
  const accessToken = req.headers.authorization;
  if (!accessToken) {
    return next(new TokenError('need token'));
  }
  try {
    const tokenData = jwt.verify(accessToken, CONSTANTS.JWT_SECRET);
    const foundUser = await userQueries.findUser({ id: tokenData.userId });
    res.send({
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      role: foundUser.role,
      id: foundUser.id,
      avatar: foundUser.avatar,
      displayName: foundUser.displayName,
      balance: foundUser.balance,
      email: foundUser.email,
    });
  } catch (err) {
    logger.err('Token validation failed', 401, err.stack);
  }
};

module.exports.checkToken = async (req, res, next) => {
  let accessToken = req.headers.authorization;
  if (!accessToken) {
    return next(new TokenError('need token'));
  }

  if (accessToken.startsWith('Bearer ')) {
    accessToken = accessToken.split(' ')[1];
  }
  try {
    req.tokenData = jwt.verify(accessToken, CONSTANTS.JWT_SECRET);
    next();
  } catch (err) {
    logger.err('Token validation failed', 401, err.stack);
  }
};
