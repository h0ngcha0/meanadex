'use strict';

/**
 * Module dependencies.
 */
var authom = require('authom'),
    config = require('../../config/config');

authom.createServer({
  service: 'stripe',
  id: config.stripe.clientID,
  secret: config.stripe.clientSecret
});

authom.on('auth', function(req, res, data) {
  // called when a user is authenticated
});

authom.on('error', function(req, res, data) {
  // called when an error occurs during authentication
});

exports.app = authom.app;
