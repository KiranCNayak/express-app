const fs = require('node:fs');
const path = require('node:path');

const format = require('date-fns/format');
const { v4: uuid } = require('uuid');

const { logError } = require('../utils/Utils');

const fsPromises = fs.promises;

/**
 * Logger function to store logs into a log file, under the logs folder.
 * It creates 'logs' folder & 'logFileName', if they don't already exist.
 * @param {string} message
 * @param {string} logFileName
 */
const logEvents = async (message, logFileName) => {
  const dateTime = `[${format(new Date(), 'yyyy-MM-dd — HH:mm:ss')}]`;
  const logString = `${dateTime}\t\t${uuid()}\t\t${message}\n`;
  try {
    if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
    }
    await fsPromises.appendFile(
      path.join(__dirname, '..', 'logs', logFileName),
      logString,
    );
  } catch (error) {
    console.error(error);
  }
};

const logToFile = (req, res, next) => {
  // Log each request to the server, and store it in the logs folder
  logEvents(
    `${req.method}\t\t${req.headers.origin}\t\t${req.url}\t\t${res.statusCode}`,
    'requestLogs.txt',
  );
  logError(`${req.method} ${req.path}`);
  next();
};

module.exports = {
  logEvents,
  logToFile,
};
