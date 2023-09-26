const format = require('date-fns/format');

const genericLogger = logType => {
  return message => {
    console.log(
      `[${logType} ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}] — ${message}`,
    );
  };
};

const logError = genericLogger('ERROR');
const logInfo = genericLogger('INFO');

module.exports = {
  logError,
  logInfo,
};
