const User = require('../model/User');

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

  const foundUser = await User.findOne({ refreshToken }).exec();

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
  //  that refreshToken is present in the DB.
  foundUser.refreshToken = '';
  await foundUser.save();

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
