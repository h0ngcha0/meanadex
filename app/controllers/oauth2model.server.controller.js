'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    OAuthAccessToken = mongoose.model('OAuthAccessToken'),
    OAuthRefreshToken = mongoose.model('OAuthRefreshToken'),
    OAuthClient = mongoose.model('OAuthClient'),
    OAuthAuthCode = mongoose.model('OAuthAuthCode');

//
// Always required oauth2-server callbacks
//
exports.getAccessToken = function(bearerToken, callback) {
  OAuthAccessToken.findOne(
    {
      accessToken: bearerToken
    },
    function(err, doc) {
      if(err || !doc) {
        return callback(err);
      }
      var opts = {
        path: 'user',
        select: '-salt -password'
      };
      User.populate(doc, opts, callback);
    }
  );
};

exports.getClient = function(clientId, clientSecret, callback) {
  if (clientSecret === null) {
    return OAuthClient.findOne(
      {
        clientId: clientId
      },
      callback
    );
  }
  OAuthClient.findOne(
    {
      clientId: clientId,
      clientSecret: clientSecret
    },
    callback
  );
};

var authorizedClientIds = [
  'meanadex-dashboard',
  'meanadex-android',
  'meanadex-ios',
  'meanadex'
];

exports.grantTypeAllowed = function(clientId, grantType, callback) {
  if (grantType === 'password') {
    return callback(false, authorizedClientIds.indexOf(clientId) >= 0);
  }

  callback(false, true);
};

exports.saveAccessToken = function(token, clientId, expires, user, callback) {
  var accessToken = new OAuthAccessToken({
    accessToken: token,
    clientId: clientId,
    user: user._id,
    expires: expires
  });

  accessToken.save(callback);
};

//
// Required to support password grant type
//
exports.getUser = function(username, password, callback) {
  User.findOne({
    username: username
  }, function(err, user) {
    if (err) {
      return callback(err);
    }
    if (!user) {
      return callback(null);
    }
    if (!user.authenticate(password)) {
      return callback(null);
    }

    // Remove sensitive data
    user.password = undefined;
    user.salt = undefined;

    return callback(null, user);
  });
};

//
// Required to support refreshToken grant type
//
exports.saveRefreshToken = function(token, clientId, expires, user, callback) {
  var refreshToken = new OAuthRefreshToken({
    refreshToken: token,
    clientId: clientId,
    user: user._id,
    expires: expires
  });

  refreshToken.save(callback);
};

exports.getRefreshToken = function(refreshToken, callback) {
  OAuthRefreshToken.findOne(
    {
      refreshToken: refreshToken
    },
    function(err, doc) {
      if(err || !doc) {
        return callback(err);
      }
      var opts = {
        path: 'user',
        select: '-salt -password'
      };
      User.populate(doc, opts, callback);
    }
  );
};

exports.getAuthCode = function(authCode, callback) {
  OAuthAuthCode.findOne(
    {
      authCode: authCode
    },
    function(err, doc) {
      if(err || !doc) {
        return callback(err);
      }
      var opts = {
        path: 'user',
        select: '-salt -password'
      };
      User.populate(doc, opts, callback);
    }
  );
};

exports.saveAuthCode = function(code, clientId, expires, user, callback) {
  var authCode = new OAuthAuthCode({
    authCode: code,
    clientId: clientId,
    user: user._id,
    expires: expires
  });

  authCode.save(callback);
};
