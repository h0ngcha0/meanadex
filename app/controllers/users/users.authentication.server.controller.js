'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    errorHandler = require('../errors'),
    mongoose = require('mongoose'),
    logger = require('../../lib/logger.server.lib.js'),
    User = mongoose.model('User');

/**
 * Signup
 */
exports.signup = function(req, res, next) {
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  // Init Variables
  var user = new User(req.body);
  var message = null;

  // Add missing user fields
  user.provider = 'local';

  // Then save the user
  user.save(function(err) {
    if (err) {
      logger.error('Error saving user.', user, err);

      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      next();
    }
  });
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function(req, providerUserProfile, callback) {
  // Define a search query fields
  var searchMainProviderIdentifierField = 'providerData.id';
  var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.service + '.id';

  // Define main provider search query
  var mainProviderSearchQuery = {};
  mainProviderSearchQuery.provider = providerUserProfile.service;
  mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.id;

  // Define additional provider search query
  var additionalProviderSearchQuery = {};
  additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.id;

  // Define a search query to find existing user with current provider profile
  var searchQuery = {
    $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
  };

  User.findOne(searchQuery, function(err, user) {
    if (err) {
      return callback(err);
    } else {
      if (!user) {
        var username = providerUserProfile.data.email;
        User.findOne({username: username}, function(err, user) {
          if (err) {
            return callback(err);
          } else {
            if (!user) {
              user = new User({
                username: username,
                provider: providerUserProfile.service,
                providerData: providerUserProfile
              });

              // And save the user
              return user.save(function(err, user) {
                callback(err, user);
              });
            } else {
              // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
              if (user.provider !== providerUserProfile.service && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.service])) {
                // Add the provider data to the additional provider data field
                if (!user.additionalProvidersData) user.additionalProvidersData = {};
                user.additionalProvidersData[providerUserProfile.service] = providerUserProfile;

                // Then tell mongoose that we've updated the additionalProvidersData field
                user.markModified('additionalProvidersData');

                // And save the user
                return user.save(function(err, user) {
                  callback(err, user);
                });
              } else {
                return callback(err, user);
              }
            }
          }
        });
      } else {
        return callback(err, user);
      }
    }
  });
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function(req, res, next) {
  var user = req.user;
  var provider = req.param('provider');

  if (user && provider) {
    // Delete the additional provider
    if (user.additionalProvidersData[provider]) {
      delete user.additionalProvidersData[provider];

      // Then tell mongoose that we've updated the additionalProvidersData field
      user.markModified('additionalProvidersData');
    }

    user.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(user);
      }
    });
  }
};
