const mongoose = require('mongoose');

const { logEvents } = require('../middlewares/logEvents');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  } catch (error) {
    logEvents(
      `${error.name}: ${error.message} in 'connectDB' file, while trying to connect to MongoDB Server`,
      'errorLogs.txt',
    );
    console.error(
      `${error.message}\nLook at 'logs/errorLogs.txt' for more details\n`,
    );
  }
};

module.exports = {
  connectDB,
};
