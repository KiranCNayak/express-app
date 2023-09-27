const bcrypt = require('bcrypt');

const { logEvents } = require('../middlewares/logEvents');
const User = require('../model/User');
const { logError } = require('../utils/Utils');

const createNewUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and Password are required!' });
  }

  const duplicate = await User.findOne({ username }).exec();
  if (duplicate) {
    return res.sendStatus(409); // 409 — represents "Conflict". More at https://www.rfc-editor.org/rfc/rfc9110.html#name-409-conflict
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // A default 'role' will be added when the user is created, by Mongoose
    // So there is no need to explicitly use the 'role' property.
    const result = await User.create({
      username,
      password: hashedPassword,
    });

    res.status(201).json({
      message: `New user '${username}' created successfully!`,
    });
  } catch (error) {
    logError(`${error.message}`);
    logEvents(
      `${error.name}: ${error.message} on ${req.method} call to ${req.url} in 'createNewUser' function`,
      'errorLogs.txt',
    );
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createNewUser,
};
