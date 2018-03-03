var express = require('express');
var logger = require('./tools/logger');

logger.info(`🍻 Ziroom2RSS start! Cheers!`);

var app = express();
app.all('*', require('./routes/all'));
app.get('/room', require('./routes/room'));
app.listen(1201);