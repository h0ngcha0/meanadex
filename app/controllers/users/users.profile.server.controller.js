'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    path = require('path'),
    errorHandler = require('../errors'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function(req, res) {
  // Init Variables
  var user = req.user;
  var message = null;

  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  // Disable update of username
  delete req.body.username;

  if (user) {
    // Merge existing user
    user = _.extend(user, req.body);
    user.updated = Date.now();

    user.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(user);
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Send User
 */
exports.me = function(req, res) {
  var basename = path.basename(req.path);
  if (basename !== 'me' && req.user.id !== basename) {
    return res.status(403).send('User is not authorized');
  }
  else {
    res.jsonp(req.user || null);
  }
};
