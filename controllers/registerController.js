const path = require('node:path');
const fs = require('node:fs');

const bcrypt = require('bcrypt');

const { logEvents } = require('../middlewares/logEvents');
const users = require('../model/users.json');
const { logError } = require('../utils/Utils');

const fsPromises = fs.promises;

const usersDB = {
  users,
  setUsers: function (data) {
    this.users = data;
  },
};

const createNewUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and Password are required!' });
  }

  const duplicate = usersDB.users.find(person => person.username === username);
  if (duplicate) {
    return res.sendStatus(409); // 409 — represents "Conflict". More at https://www.rfc-editor.org/rfc/rfc9110.html#name-409-conflict
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      username,
      password: hashedPassword,
    };
    usersDB.setUsers([...usersDB.users, newUser]);

    await fsPromises.writeFile(
      path.join(__dirname, '..', 'model', 'users.json'),
      JSON.stringify(usersDB.users),
    );

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
