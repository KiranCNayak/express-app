const fs = require('node:fs');
const path = require('node:path');

const users = require('../model/users.json');

const fsPromises = fs.promises;

const ONE_DAY_IN_MILLIS = 24 * 60 * 60 * 1000;

const usersDB = {
  users,
  setUsers: function (data) {
    this.users = data;
  },
};

const handleLogout = async (req, res) => {
  // REM: If you are developing a front end as well, you will have to remove both accessToken and refreshToken on Logout.
  const cookies = req.cookies;

  // Check if 'jwt' property is not in cookies
  // If not present, it means refreshToken doesn't exist
  // So just update with 204 — No content
  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }

  const refreshToken = cookies.jwt;

  const foundUser = usersDB.users.find(
    user => user.refreshToken === refreshToken,
  );

  if (!foundUser) {
    // Clear the cookie, since the cookie with 'jwt' property was found
    res.clearCookie('jwt', {
      httpOnly: true,

      // Both of these are needed due to a frontend CORS issue, as told by Dave Gray
      //  in this 6th video of his playlist. (JWT Authentication)
      sameSite: 'None',
      secure: true,
    });
    return res.sendStatus(204);
  }

  // If the control reached this point, that means there is a cookie and
  //  that data is present in the DB (For now it is just a JSON file).
  const otherUsers = usersDB.users.filter(
    user => user.username !== foundUser.username,
  );

  // Set the refreshToken to blank string, to denote clearing it.
  const currentUser = { ...foundUser, refreshToken: '' };

  const updatedUsersArray = [...otherUsers, currentUser];

  usersDB.setUsers(updatedUsersArray);

  await fsPromises.writeFile(
    path.join(__dirname, '..', 'model', 'users.json'),
    JSON.stringify(updatedUsersArray, null, 2),
  );

  res.clearCookie('jwt', {
    httpOnly: true,

    // Both of these are needed due to a frontend CORS issue, as told by Dave Gray
    //  in this 6th video of his playlist. (JWT Authentication)
    sameSite: 'None',
    secure: true,
  });

  res.sendStatus(204);
};

module.exports = {
  handleLogout,
};
