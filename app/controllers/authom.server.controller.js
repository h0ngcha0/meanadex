'use strict';

/**
 * Module dependencies.
 */
var qs = require('querystring'),
    authom = require('authom'),
    async = require('async'),
    users = require('./users'),
    oauth2model = require('./oauth2model.server.controller.js'),
    config = require('../../config/config');

authom.createServer({
  service: 'stripe',
  id: config.stripe.clientID,
  secret: config.stripe.clientSecret
});

var redirectTo = function(req, res, redirectUrl) {
  var baseUrl = req.protocol + '://' + req.headers.host;
  var url = baseUrl + redirectUrl;
  res.writeHead(302, {Location: url});
  res.end();
};

authom.on('auth', function(req, res, data) {
  var code = req.query.code;
  async.waterfall([
    function(callback) {
      users.saveOAuthUserProfile(req, data, callback);
    },
    function(user, callback) {
      var expires = new Date();
      var seconds = expires.getSeconds() + 30;
      expires.setSeconds(seconds);
      oauth2model.saveAuthCode(code, 'meanadex', expires, user, callback);
    }
  ], function(err) {
    var url, params;
    if (err) {
      console.log(err);
      params = qs.stringify({
        error: err.name,
        error_description: err.message
      });
      url =  '/#!/auth/error?' + params;
      redirectTo(req, res, url);
    } else {
      params = qs.stringify({
        code: code
      });
      url = '/#!/auth/token?' + params;
      redirectTo(req, res, url);
    }
  });
});

authom.on('error', function(req, res, data) {
  var params = qs.stringify(data);
  var url = '/#!/auth/error?' + params;
  redirectTo(req, res, url);
});

exports.app = authom.app;
