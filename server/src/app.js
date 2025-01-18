const express = require('express');
const cors = require('cors');
require('./dbMongo/mongoose');
const router = require('./router');
require('./utils/logRotator');

const handlerError = require('./handlerError/handler');
const loggerErrorHandler = require('./handlerError/loggerErrorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/public', express.static('public'));
app.use(router);

app.use(handlerError);
app.use(loggerErrorHandler);

module.exports = app;
