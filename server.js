'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
    config = require('./config/config'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    http = require('http'),
    https = require('https');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(
  config.db,
  function(err) {
    if (err) {
      console.error('\x1b[31m', 'Could not connect to MongoDB!');
      console.log(err);
    }
  }
);

// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

// Start the http app by listening on <port>
http.createServer(app).listen(config.port);

var privateKey = fs.readFileSync(config.ssl.privateKeyPath).toString(),
    certificate = fs.readFileSync(config.ssl.certificatePath).toString(),
    credentials = {key: privateKey, cert: certificate};

// Start the https app by listening on <httpsPort>
https.createServer(credentials, app).listen(config.httpsPort);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('Meanadex started on http port ' + config.port +
            ' and https port ' + config.httpsPort);
