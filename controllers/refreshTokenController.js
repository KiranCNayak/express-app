const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const users = require('../model/users.json');

dotenv.config();

const usersDB = {
  users,
  setUsers: function (data) {
    this.users = data;
  },
};

const getAccessTokenFromRefreshToken = (req, res) => {
  const cookies = req.cookies;

  // Check if there is a property called 'jwt' in the cookies
  // If yes, it means there is a refreshToken
  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }

  const refreshToken = cookies.jwt;

  const foundUser = usersDB.users.find(
    user => user.refreshToken === refreshToken,
  );

  if (!foundUser) {
    return res.status(403).json({ error: "'refreshToken' is invalid" });
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (error, decoded) => {
      if (error || foundUser.username !== decoded.username) {
        return res.sendStatus(403);
      }

      // Reset the refreshToken in the DB
      const accessToken = jwt.sign(
        { username: decoded.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '30s' },
      );

      res.json({ accessToken });
    },
  );
};

module.exports = {
  getAccessTokenFromRefreshToken,
};