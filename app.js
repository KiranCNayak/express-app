const path = require('node:path');

const cors = require('cors');
const express = require('express');

const { corsOptions } = require('./config/corsOptions');
const { errorHandler } = require('./middlewares/errorHandler');
const { logToRequestLogsFileMiddleware } = require('./middlewares/logEvents');
const { router: employeesRouter } = require('./routes/api/employees');
const { router: rootRouter } = require('./routes/root');

const app = express();

const PORT = process.env.PORT || 3000;

// ===*===*===*===*===*===*  CUSTOM  MIDDLEWARES  *===*===*===*===*===*===*===

app.use(logToRequestLogsFileMiddleware);
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
app.use('/', express.static(path.join(__dirname, '/public')));

// ===*===*===*===*===*===*===*===*===*===*===*===*===*===*===*===*===*===*===

app.use('/', rootRouter);
app.use('/employees', employeesRouter);

// Catch-all route, to serve custom 404 page
// REM: W/o 404 status set explicitly using res.status(404)..., default status would've been 200, as the 404 file was found on the server (so 200)
app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ error: '⚠️ 404 ⚠️ — Page Not Found!' });
  } else {
    res.type('txt').send('⚠️ 404 ⚠️ — Page Not Found!');
  }
});

// Our custom error handler
// This should be at the end, always. Because, it will catch errors
// of all functions above it.
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
