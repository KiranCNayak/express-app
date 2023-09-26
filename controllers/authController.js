const bcrypt = require('bcrypt');

const users = require('../model/users.json');

const usersDB = {
  users,
  setUsers: function (data) {
    this.users = data;
  },
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      message: "'username' and 'password' fields are required!",
    });
  }
  const foundUser = usersDB.users.find(user => user.username === username);

  if (!foundUser) {
    return res
      .status(401)
      .json({ error: 'Username / Password is incorrect! Please try again.' });
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (match) {
    // TODO: Create JWTs to be used as 'accessToken' and 'refreshToken'.
    return res.json({
      message: `Login successful! Signed in as '${username}'`,
    });
  } else {
    return res.sendStatus(401);
  }
};

module.exports = {
  loginUser,
};
