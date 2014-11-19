'use strict';

var errorHandler = require('./errors'),
    us = require('underscore');

/**
 * Generate a query that filters on userid, if the role is
 * 'admin', get everything.
 */
var userQuery = function(req) {
  var userId = req.user._id,
      roles = req.user.roles;

  // if it is admin, return all campaigns
  if (us.contains(roles, 'admin')) {
    return {};
  } else {
    return {user: userId};
  }
};

/**
 * List of object by query, sorted by create date, populated
 * with user displayName
 */
var listByQuery = function(model, queryFun) {
  return function(req, res) {
    var query = queryFun(req);
    model.find(query).
      sort('-created').
      populate('user', 'displayName').
      exec(function(err, objects) {
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


exports.listWithUser = function(model) {
  return listByQuery(model, userQuery);
};
