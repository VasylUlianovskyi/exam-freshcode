const pino = require('pino-pretty');
const fs = require('fs');
const path = require('path');

const logDirectory = path.join(__dirname, '../logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const logStream = fs.createWriteStream(path.join(logDirectory, 'errors.log'), {
  flags: 'a',
});

const logger = pino(
  {
    level: 'error',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: false,
        translateTime: 'yyyy-mm-dd HH:MM:ss',
      },
    },
  },
  logStream
);

module.exports = logger;
