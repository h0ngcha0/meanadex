'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Tshirt = mongoose.model('Tshirt'),
    Images = require('../../app/controllers/images'),
    utils = require('./utils'),
    _ = require('lodash');

/**
 * Create a Tshirt
 */
exports.create = function(req, res) {
  var tshirt = new Tshirt(req.body);
  tshirt.user = req.user;

  tshirt.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tshirt);
    }
  });
};

/**
 * Show the current Tshirt
 */
exports.read = function(req, res) {
  res.jsonp(req.tshirt);
};

/**
 * Update a Tshirt
 */
exports.update = function(req, res) {
  var tshirt = req.tshirt;
  tshirt = _.extend(tshirt , req.body);

  tshirt.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tshirt);
    }
  });
};

/**
 * Delete an Tshirt
 */
exports.delete = function(req, res) {
  var tshirt = req.tshirt ;

  tshirt.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tshirt);
    }
  });
};

/**
 * List of Tshirts
 */
exports.list = utils.list(
  Tshirt,
  {
    'user': 'displayName',
    'frontImage': 'url',
    'backImage': 'url'
  },
  function(req, res, err, result) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(result);
    }
  }
);

/**
 * Tshirt middleware
 */
exports.tshirtByID = function(req, res, next, id) {
  Tshirt.findById(id).
    populate('user', 'displayName').
    populate('frontImage', 'url').
    populate('backImage', 'url').
    exec(function(err, tshirt) {
    if (err) return next(err);
    if (! tshirt) return next(new Error('Failed to load Tshirt ' + id));
    req.tshirt = tshirt ;
    next();
  });
};

/**
 * Tshirt authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  if (req.tshirt.user.id !== req.user.id) {
    return res.status(403).send('User is not authorized');
  }
  next();
};
