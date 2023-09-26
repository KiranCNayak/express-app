const express = require('express');

const router = express.Router();

const { createNewUser } = require('../controllers/registerController');

router.post('/', createNewUser);

module.exports = {
  router,
};
