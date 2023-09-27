const fs = require('node:fs');
const path = require('node:path');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const users = require('../model/users.json');

const fsPromises = fs.promises;

dotenv.config();

const ONE_DAY_IN_MILLIS = 24 * 60 * 60 * 1000;

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
    const ROLES_ARRAY = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      {
        UserInfo: {
          roles: ROLES_ARRAY,
          username: foundUser.username,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30s' },
    );

    // Refresh token is generally stored in disk. For now we are using the same DB (users.json).
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' },
    );

    const otherUsers = usersDB.users.filter(
      user => user.username !== foundUser.username,
    );

    // Storing the refreshToken in the same object as the username and password.
    const currentUser = { ...foundUser, refreshToken };

    usersDB.setUsers([...otherUsers, currentUser]);

    await fsPromises.writeFile(
      path.join(__dirname, '..', 'model', 'users.json'),
      JSON.stringify(usersDB.users, null, 2),
    );

    // Some people send the refreshToken in this response.
    // But that would make the Front-end guy to store it
    //  somewhere, like a cookie in normal text format.
    // That will make it vulnerable to be read by Hackers.
    // So, we can send it as a httpOnly cookie, so that it
    //  can't be accessed by using JS code by a hacker.

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      maxAge: ONE_DAY_IN_MILLIS,

      // Both of these are needed due to a frontend CORS issue, as told by Dave Gray
      //  in this 6th video of his playlist. (JWT Authentication)
      sameSite: 'None',
      secure: true, // Comment this property when using Thunder client, it doesn't work if set to true. But it should be true for testing on Chrome / in Production.
    });

    res.json({
      message: `Login successful! Signed in as '${username}'`,
      accessToken,
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = {
  loginUser,
};
