const express = require('express');
const path = require('node:path');

const app = express();

const PORT = process.env.PORT || 3000;

// ===*===*===*===*===*===  BUILT-IN  MIDDLEWARES  ===*===*===*===*===*===*===

// Built-in middleware to handle urlencoded data i.e., for HTML form data:
// ‘content-type: application/x-www-form-urlencoded’
app.use(express.urlencoded({ extended: false }));

// express.json() is a body parser for post request except HTML "POST" form,
// whereas express.urlencoded(...) is a body parser for HTML "POST" form.
app.use(express.json());

// To serve static data like images,css, gifs and videos.
//  With this setup you don't need to put relative path to them in html files.
app.use(express.static(path.join(__dirname, '/public')));

// ===*===*===*===*===*===*===*===*===*===*===*===*===*===*===*===*===*===*===

app.get('^/$|^/index(.html)?', (_req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('^/new-page(.html)?', (_req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});

// We can easily do re-direction in Express as follows
app.get('^/old-page(.html)?', (_req, res) => {
  res.redirect('new-page.html');
});

// Catch-all route, to serve custom 404 page
// REM: W/o 404 status set explicitly using res.status(404)..., default status would've been 200, as the 404 file was found on the server (so 200)
app.get('/*', (_req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
