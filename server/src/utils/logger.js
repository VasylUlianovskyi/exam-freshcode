const fs = require('fs');
const path = require('path');

const logDirectory = path.join(__dirname, '../logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const logStream = fs.createWriteStream(path.join(logDirectory, 'errors.log'), {
  flags: 'a',
});

const logError = (message, code, stackTrace) => {
  const logObject = {
    message,
    time: Date.now(),
    code,
    stackTrace: stackTrace instanceof Error ? { stack: stackTrace.stack } : {},
  };

  logStream.write(JSON.stringify(logObject) + '\n');
};

module.exports = {
  err: logError,
};
