const fs = require('fs');
const path = require('path');

// Створення директорії для логів
const logDirectory = path.join(__dirname, '../logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Вказуємо файл для логів
const logStream = fs.createWriteStream(path.join(logDirectory, 'errors.log'), {
  flags: 'a',
});

// Логгер для обробки помилок
const logError = (message, code, stackTrace) => {
  const logObject = {
    message,
    code,
    time: Date.now(),
    stackTrace: stackTrace.split('\n')[0], // Тільки перший рядок стеку
  };

  const formattedLog = `{ message: "${logObject.message}", code: ${logObject.code}, time: ${logObject.time}, stackTrace: "${logObject.stackTrace}" }\n`;
  logStream.write(formattedLog);
};

module.exports = {
  err: logError,
};
