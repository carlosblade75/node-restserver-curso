const express = require('express');
const app = express();

// middleware, que se ejecuta antes de la petición
app.use(require('./usuario'));
app.use(require('./login'));

module.exports = app;