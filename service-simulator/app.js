/*jshint node:true*/
'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var compress = require('compression');
var cors = require('cors');
var errorHandler = require('./utils/errorHandler')();
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var config = require('./app.config');
var port = process.env.PORT || 4000;
var routes;
var rootUrl = '/api';

// if nodemon, start arguments are passed through the env
var useDev = process.env.USEDEV ? true : false;
var dataSrc = process.env.DATASRC ? process.env.DATASRC : 'dev';
config.messageDelay = process.env.DELAY ? process.env.DELAY * 1000 : 1000;
var code = process.env.ERRORCODE ? process.env.ERRORCODE : ':200';
var codes = code.split(':');

if (code.indexOf(':') === -1) {
  code = ':' + code;
}

config.errorCode = parseInt(codes[1]);
config.errorWhen = codes[0].length > 0 ? codes[0] : '';

app.use(favicon(__dirname + '/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(compress());
app.use(logger('dev'));
app.use(cors());
app.use(errorHandler.init);
app.use(cookieParser());

app.set('case sensitive routing', true);

// if node, pass the arguments through argv
process.argv.forEach(function (val, index, array) {
  var args = val.split('=');

  if (args[0].toLowerCase() === 'datasrc') {
    dataSrc = args[1];
  }

  if (args[0].toLowerCase() === 'usedev') {
    console.log('Using SSO Dev');
  }
  if (args[0] === 'delay') {
    config.messageDelay = parseInt(args[1]);
  }
  if (args[0] === 'errorcode') {

    if (args[1].indexOf(':') === -1) {
      console.log('*** Warning ***: Colon missing cannot parse errorcode expectation');
      config.errorCode = 200;
      config.errorWhen = '';
    } else {
      var codes = args[1].split(':');
      config.errorCode = parseInt(codes[0]);
      config.errorWhen = codes[1].length > 0 ? codes[1] : '';
    }
  }
});

console.log('Return error code: ' + config.errorCode + ' for route "' + (config.errorWhen.length > 0 ? config.errorWhen : 'all') + '" operation[s]');
console.log('Message Delay set to ' + config.messageDelay + ' seconds');
console.log('Using data source: ' + dataSrc);

// default to memory routes
console.log('Using memory routes');
routes = require('./memRoutes/index');
routes.init(app, rootUrl, config, useDev, dataSrc);


console.log('Starting node...');
console.log('PORT=' + port);


var serverWs = require('http').createServer(app);

console.log('** DEV **');
app.use(express.static('./app/'));
app.use(express.static('./'));
app.use('/*', express.static('./app/index.html'));


var server = serverWs.listen(port, function () {
  console.log('Simulator listening on port ' + port);
  console.log('http://localhost:' + port + '/api/sample');
});


