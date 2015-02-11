'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    logger = require('./logger.server.lib.js');

exports.fetchAccessToken = function(provider) {
  return function(uid, callback) {
    User.findById(
      uid,
      function(err, user) {
        if(err) {
          logger.log('error getting user: ' + uid);
        }

        if(user.additionalProvidersData && user.additionalProvidersData[provider]) {
          callback(err, user.additionalProvidersData[provider].token);
        } else {
          callback(err);
        }
      }
    );
  };
};

// Fetch stripe access token
exports.fetchStripeAccessToken = exports.fetchAccessToken('stripe');
