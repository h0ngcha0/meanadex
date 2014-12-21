'use strict';

var errorHandler = require('./errors'),
    config = require('../../config/config'),
    nodemailer = require('nodemailer'),
    _ = require('lodash');

/**
 * List of object by query, sorted by create date, populated
 * with user displayName
 */
exports.listByQuery = function(model, queryFun, populateMap) {
  return function(req, res) {
    var query = queryFun(req);
    var results = model.find(query).sort('-created');

    _.each(
      populateMap,
      function(value, key) {
        results.populate(key, value);
      }
    );

    results.exec(function(err, objects) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(objects);
      }
    });
  };
};

/**
 * Generate a query that filters on userid, if the role is
 * 'admin', get everything.
 */
var userQuery = function(req) {
  var userId = req.user._id,
      roles = req.user.roles;

  // if it is admin, return all campaigns
  if (_.contains(roles, 'admin')) {
    return {};
  } else {
    return {user: userId};
  }
};


/**
 * Return an array of `model` all of which have user id contained
 * in the request. If user is `admin`, then return all.
 */
exports.listWithUser = function(model, populateMap) {
  if(!populateMap) populateMap = {};
  return exports.listByQuery(model, userQuery, populateMap);
};

/**
 * Send mail
 */
exports.sendMail = function(emailHTML, subject, email, callback) {
  var smtpTransport = nodemailer.createTransport(config.mailer.options);
  var mailOptions = {
    to: email,
    from: config.mailer.from,
    subject: subject,
    html: emailHTML
  };

  smtpTransport.sendMail(mailOptions, callback);
};
