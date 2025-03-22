const ApplicationError = require('./ApplicationError');

class UncorrectPassword extends ApplicationError {
  constructor (message) {
    super(message || 'uncorrect password', 401);
  }
}

module.exports = UncorrectPassword;
