const path = require('node:path');

const cors = require('cors');
const express = require('express');

const { errorHandler } = require('./middlewares/errorHandler');
const { logToFile } = require('./middlewares/logEvents');

const app = express();

const PORT = process.env.PORT || 3000;

// ===*===*===*===*===*===*  CUSTOM  MIDDLEWARES  *===*===*===*===*===*===*===

app.use(logToFile);

const whiteList = [
  'http://localhost:3000',
  'https://localhost:3000',
  'http://127.0.0.1:3000',
  'https://127.0.0.1:3000',
];
const corsOptions = {
  origin: (origin, callback) => {
    // NOTE: Here, !origin at the end is used to catch the localhost or 127.0.0.1 route, which comes as undefined to origin
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// ===*===*===*===*===*===*===*===*===*===*===*===*===*===*===*===*===*===*===

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

// Our custom error handler
// This should be at the end, always. Because, it will catch errors
// of all functions above it.
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
