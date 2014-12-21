'use strict';

var errorHandler = require('./errors'),
    config = require('../../config/config'),
    nodemailer = require('nodemailer'),
    moment = require('moment'),
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

// Unpack a string contained in a string, usually happens
// when a string was passed from client side to server side
// in URL.
var unpack = function(obj) {
  if(_.isString(obj)) {
    return obj.slice(1, obj.length-1);
  } else {
    return obj;
  }
};

/**
 * Generate a query that filters on userid, if the role is
 * 'admin', get everything.
 */
exports.userQuery = function(req) {
  var query = {},
      userId = req.user._id,
      startDate = unpack(req.param('startDate')),
      endDate = unpack(req.param('endDate')),
      roles = req.user.roles;

  // Trigger callback when date is of valid format
  var setIfDateValid = function(date, callback) {
    if(date) {
      var parsedDate = moment(date, moment.ISO_8601);
      if (parsedDate.isValid()) {
        if (!query.created_at) {
          query.created_at = {};
        }

        callback(parsedDate.toDate());
      }
    }
  };

  // if it is admin, return all
  if (!_.contains(roles, 'admin')) {
    query.user = userId;
  }

  setIfDateValid(startDate, function(date) {
    query.created_at.$gte = date;
  });

  setIfDateValid(endDate, function(date) {
    query.created_at.$lte = date;
  });

  return query;
};


/**
 * Return an array of `model` all of which have user id contained
 * in the request. If user is `admin`, then return all.
 */
exports.listWithUser = function(model, populateMap) {
  if(!populateMap) populateMap = {};
  return exports.listByQuery(model, exports.userQuery, populateMap);
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
