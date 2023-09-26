const { logEvents } = require('./logEvents');

const errorHandler = (error, req, res, _next) => {
  logEvents(
    `${error.name}: ${error.message} on ${req.method} call to ${req.url}`,
    'errorLogs.txt',
  );
  console.error(error.stack);
  res.status(500).send(error.message);
};
module.exports = {
  errorHandler,
};
