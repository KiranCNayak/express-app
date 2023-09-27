const jwt = require('jsonwebtoken');

const User = require('../model/User');

const getAccessTokenFromRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  // Check if there is a property called 'jwt' in the cookies
  // If yes, it means there is a refreshToken
  console.log('Checking if cookie is found ?');
  if (!cookies?.jwt) {
    console.log('Cookie is not found!');
    if (process.env.DEV_MODE) {
      return res.status(401).json({
        error:
          "If you are testing using Thunder client, comment out the 'secure: true' property at line 62, in authController.js",
      });
    } else {
      return res.sendStatus(401);
    }
  }
  console.log('Cookie found');

  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();

  if (!foundUser) {
    return res.status(403).json({ error: "'refreshToken' is invalid" });
  }
  console.log('User with refreshToken found');

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (error, decoded) => {
      console.log('Checking if refreshToken is valid');
      if (error || foundUser.username !== decoded.username) {
        return res.sendStatus(403);
      }
      console.log('refreshToken is indeed valid');

      const ROLES_ARRAY = Object.values(foundUser.roles);

      // Re-create an 'accessToken' using the existing 'refreshToken' in cookies
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
      console.log('creating accessToken using the refreshToken');

      res.json({ accessToken });
    },
  );
};

module.exports = {
  getAccessTokenFromRefreshToken,
};
