const express = require('express');

const router = express.Router();

const {
  getAccessTokenFromRefreshToken,
} = require('../controllers/refreshTokenController');

router.get('/', getAccessTokenFromRefreshToken);

module.exports = {
  router,
};
