'use strict';

/**
 * Module dependencies.
 */
var init = require('./config/init')(),
    config = require('./config/config');

// require newrelic if enabled
if(config.enableNewRelic) {
  require('newrelic');
}

var mongoose = require('mongoose');

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

// Import oauth clients
require('./import-oauth-client')();

// Start the app by listening on <port>
app.listen(config.port);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('Mootee started on http port ' + config.port);
