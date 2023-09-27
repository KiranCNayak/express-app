const { logEvents } = require('./logEvents');

const errorHandler = (error, req, res, _next) => {
  logEvents(
    `${error.name}: ${error.message} on ${req.method} call to ${req.url} in 'errorHandler' function`,
    'errorLogs.txt',
  );
  console.error(
    `${error.message}\nLook at 'logs/errorLogs.txt' for more details\n`,
  );
  res.status(500).send(error.message);
};
module.exports = {
  errorHandler,
};
