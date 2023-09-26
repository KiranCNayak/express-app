const path = require('node:path');

const { Router } = require('express');

const router = Router();

router.get('^/$|^/index(.html)?', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

router.get('^/new-page(.html)?', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'new-page.html'));
});

// We can easily do re-direction in Express as follows
router.get('^/old-page(.html)?', (_req, res) => {
  res.redirect('new-page.html');
});

module.exports = { router };
