'use strict';

/**
 * Module dependencies.
 */
var oauth2model = require('./oauth2model.server.controller.js'),
    oauth2server = require('oauth2-server');

var oauth2 = oauth2server({
  model: oauth2model,
  grants: ['password', 'refresh_token'],
  debug: true
});

/**
 * Issue access token
 */
exports.grantToken = oauth2.grant();

/**
 * Authorise
 */
exports.authorise = oauth2.authorise();

/**
 * Error handler
 */
exports.errorHandler = oauth2.errorHandler();
