'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
    url = require('url'),
    StripeStrategy = require('passport-stripe').Strategy,
    config = require('../config'),
    users = require('../../app/controllers/users');

module.exports = function() {
  passport.use(
    new StripeStrategy(
      {
        clientID: config.stripe.clientID,
        clientSecret: config.stripe.clientSecret,
        callbackURL: config.stripe.callbackURL,
        passReqToCallback: true
      },
      function(req, accessToken, refreshToken, profile, done) {
        // Include tokens in profile
        profile.accessToken = accessToken;
        profile.refreshToken = refreshToken;

        var getEmail = function(profile) {
          if (profile.email && profile.emails instanceof Array) {
            return (profile.emails[0] && profile.emails[0].value) || '';
          } else {
            return '';
          }
        };

        // Create the user OAuth profile
        var providerUserProfile = {
          firstName: (profile.name && profile.name.givenName) || '',
          lastName: (profile.name && profile.name.familyName) || '',
          displayName: profile.displayName || 'Stripe User',
          email: getEmail(profile),
          // use stripe user id as username because we might
          // not have firstName/lastName, etc thus will have to
          // way to generate a meaningful name.
          username: profile.stripe_user_id,
          provider: 'stripe',
          providerIdentifierField: 'stripe_user_id',
          providerData: profile
        };

        // Save the user OAuth profile
        users.saveOAuthUserProfile(req, providerUserProfile, done);
      }
  ));
};
