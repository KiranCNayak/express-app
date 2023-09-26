const path = require('node:path');

const { Router } = require('express');

const router = Router();

router.get('^/$|^/index(.html)?', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'subdir', 'index.html'));
});

module.exports = { router };
