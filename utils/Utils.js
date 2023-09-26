const format = require('date-fns/format');

const genericLogger = logType => {
  return message => {
    console.log(
      `[${logType} ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}] — ${message}`,
    );
  };
};

const logError = genericLogger('ERROR');

module.exports = {
  logError,
};
