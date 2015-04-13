/// <reference path="../../tools/typings/tsd.d.ts" />
/// <reference path="../../tools/typings/server.d.ts" />

import fs = require('fs');
import https = require('https');
import http = require('http');
import express = require('express');
var expressHandlebars = require('hbs');
var controllerFactory = require('./controllers/index');

// setup express
var app = express();

// configure handlebars as the view engine
expressHandlebars.registerPartials(__dirname + '/views');

// configure express to use handlebars as the view engine
app.set('view engine', 'hbs');
// change express default where to look for views on the server
app.set('views', __dirname + '/views');

// setup express to have static resource folders
app.use('/public', express.static(__dirname + '/../public'));
app.use('/public/vendor', express.static(__dirname + '/../../bower_components'));
app.use('/app', express.static(__dirname + '/../app'));

// add cache control
// app.use(express.static(__dirname +'/public', {maxAge: oneDay} ));

// todo - load controllers
var controllers = new controllerFactory(app);
controllers.init();

// todo - load api

// setup ssl self hosting
var https_options = {
  key: fs.readFileSync(__dirname + '/../../../localhost-key.pem'),
  cert: fs.readFileSync(__dirname + '/../../../localhost-cert.pem')
};
var httpServerPort = process.env.PORT || 8443;  // use server value (for Azure) or local port

// create HTTP webserver
//var server = http.createServer(app);
// create HTTPS webserver
var server:any = https.createServer(https_options, app);

// start webserver
server.listen(httpServerPort);

var protocol = 'http';
if (server.cert) {
  protocol += 's';
}

console.log('+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+');
console.log('Web Server listening at %s://[..]:%s', protocol, httpServerPort);
console.log('+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+');
