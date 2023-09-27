const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../model/User');

const ONE_DAY_IN_MILLIS = 24 * 60 * 60 * 1000;

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      message: "'username' and 'password' fields are required!",
    });
  }
  const foundUser = await User.findOne({ username }).exec();

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

    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' },
    );

    //Saving refreshToken with the current User to DB
    foundUser.refreshToken = refreshToken;
    await foundUser.save();

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
