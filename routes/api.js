const express = require('express');
const productRouter = require('./products');
const categoryRouter = require('./categories');

const app = express();

app.use('/products/', productRouter);
app.use('/categories/', categoryRouter);

module.exports = app;
