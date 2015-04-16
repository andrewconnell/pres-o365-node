/// <reference path="../../tools/typings/tsd.d.ts" />
/// <reference path="../../tools/typings/server.d.ts" />

import fs = require('fs');
import https = require('https');
import http = require('http');

import express = require('express');
var logger = require('connect-logger');
var cookieParser = require('cookie-parser');
import session = require('express-session');
var FileStore = require('session-file-store')(session);
var expressHandlebars = require('hbs');

var controllerFactory = require('./controllers/index');

// setup express
var app = express();
app.use(logger());
app.use(cookieParser('8d705e4b-c142-420e-955a-a1a58263b6bd'));
app.use(session({
  store: new FileStore(),
  secret: '13603e53-f0af-41dd-b020-dbf5c9e7768e',
  resave: false,
  saveUninitialized: true
}));

// configure handlebars as the view engine
expressHandlebars.registerPartials(__dirname + '/views');

// configure express to use handlebars as the view engine
app.set('view engine', 'hbs');
// change express default where to look for views on the server
app.set('views', __dirname + '/views');

// setup express to have static resource folders
app.use('/public', express.static(__dirname + '/../public'));
app.use('/public/vendor', express.static(__dirname + '/../../bower_components'));

// load UX and API controllers
var controllers = new controllerFactory(app);
controllers.init();

// setup ssl self hosting
var httpServerPort = process.env.PORT || 3000;  // use server value (for Azure) or local port

// create & startup HTTP webserver
http.createServer(app)
    .listen(httpServerPort);

console.log('+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+');
console.log('Web Server listening at https://localhost:%s', httpServerPort);
console.log('+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+');
