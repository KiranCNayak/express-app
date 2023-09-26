const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header is missing!' });
  }

  const token = authHeader.split(' ')[1]; // Taking only the token, without the "Bearer" string
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) {
      // More info on different Errors: https://github.com/auth0/node-jsonwebtoken#errors--codes
      // Don't send an appropriate error to the user. Generic term is enough.
      // More you give exact status / error type, more vulnerable for attacks.
      return res.status(403).json({ error: 'Invalid Token' });
    }
    req.user = decoded.username;
    next();
  });
};

module.exports = {
  verifyJWT,
};
