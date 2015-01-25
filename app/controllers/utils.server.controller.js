'use strict';

var errorHandler = require('./errors'),
    config = require('../../config/config'),
    nodemailer = require('nodemailer'),
    moment = require('moment'),
    _ = require('lodash');

/**
 * List of object by query, sorted by create date, populated
 * with user username
 */
exports.listByQuery = function(model, queryFun, populateMap, callback) {
  return function(req, res) {
    var query = queryFun(req);
    var anchorId = req.param('anchorId');
    var itemsPerPage = req.param('itemsPerPage') || 5;
    var results = model.findPaginated(query, function(err, result) {
                    callback(req, res, err, result);
                  }, itemsPerPage, anchorId).sort('-created');

    _.each(
      populateMap,
      function(value, key) {
        results.populate(key, value);
      }
    );
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
var userQuery = function(queryFun) {
  return function(req) {
    var roles = req.user.roles,
        userId = req.user._id,
        query = queryFun(req);

    // if it is admin, return all
    if (!_.contains(roles, 'admin')) {
      query.user = userId;
    }

    return query;
  };
};

/**
 * Generate a query that filters on date.
 */
var dateQuery = function(req) {
  var query = {},
      startDate = unpack(req.param('startDate')),
      endDate = unpack(req.param('endDate'));

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
exports.listByUser = function(model, populateMap, callback) {
  if(!populateMap) populateMap = {};
  return exports.listByQuery(model, userQuery(dateQuery), populateMap, callback);
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

exports.head = function(elem) {
  if(_.isArray(elem)) {
    return _.head(elem);
  } else {
    return elem;
  }
};

exports.tail = function(elem) {
  if(_.isArray(elem)) {
    return _.tail(elem);
  } else {
    return [];
  }
};
