const express = require('express');
const todoroutes = require('./routes/lessonsRoutes');
const app = express();

app.use(express.json());
app.use(todoroutes);
app.listen('3000');

module.exports = app;
