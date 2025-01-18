const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const logFilePath = path.join(__dirname, '../logs/errors.log');

cron.schedule('0 0 * * *', async () => {
  try {
    console.log('Starting log rotation...');

    const logData = fs.readFileSync(logFilePath, 'utf-8');
    if (!logData.trim()) {
      console.log('Log file is empty. Nothing to rotate.');
      return;
    }

    const transformedLogs = logData
      .trim()
      .split('\n')
      .map(logLine => {
        try {
          const log = JSON.parse(logLine);
          return {
            message: log.message || 'No message provided',
            code: log.code || 500,
            time: log.time || Date.now(),
          };
        } catch (err) {
          console.error('Failed to parse log line:', logLine, err);
          return null;
        }
      })
      .filter(Boolean);

    const timestamp = new Date().toISOString().split('T')[0];
    const backupFileName = `${timestamp}-errors.log`;
    const backupFilePath = path.join(__dirname, '../logs', backupFileName);

    fs.writeFileSync(backupFilePath, JSON.stringify(transformedLogs, null, 2));
    console.log(`Logs successfully rotated to ${backupFilePath}`);

    fs.truncateSync(logFilePath, 0);
    console.log('Original log file cleared.');
  } catch (err) {
    console.error('Error during log rotation:', err);
  }
});
