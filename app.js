const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
//
const initializeMongoServer = require('./mongoConfig');

// Routers
const indexRouter = require('./routes/index');
const gameRouter = require('./routes/game');
const sessionRouter = require('./routes/session');

//
initializeMongoServer();

//
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/game', gameRouter);
app.use('/session', sessionRouter);

module.exports = app;
