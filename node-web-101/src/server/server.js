var http = require('http');
var express = require('express');
var expressHandlebars = require('hbs');
var ControllerFactory = require('./controllers/index');

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

// load UX and API controllers
var controllers = new ControllerFactory(app);
controllers.init();

var httpServerPort = process.env.PORT || 3000;  // use server value (for Azure) or local port

// create & startup HTTPS webserver
http.createServer(app)
     .listen(httpServerPort);

console.log('+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+');
console.log('Web Server listening at http://localhost:%s', httpServerPort);
console.log('+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+');