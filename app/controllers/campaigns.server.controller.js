'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Campaign = mongoose.model('Campaign'),
    shortId = require('shortid'),
    us = require('underscore'),
    config = require('../../config/config'),
    stripe = require('stripe')(config.stripe.clientSecret),
    utils = require('./utils'),
    _ = require('lodash');

/**
 * Create a Campaign
 */
exports.create = function(req, res) {
  var campaign = new Campaign(req.body);
  campaign.user = req.user;

  campaign.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(campaign);
    }
  });
};

/**
 * Show the current Campaign
 */
exports.read = function(req, res) {
  res.jsonp(req.campaign);
};

/**
 * Update a Campaign
 */
exports.update = function(req, res) {
  var campaign = req.campaign ;

  campaign = _.extend(campaign , req.body);

  campaign.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(campaign);
    }
  });
};

/**
 * Delete an Campaign
 */
exports.delete = function(req, res) {
  var campaign = req.campaign ;

  campaign.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(campaign);
    }
  });
};

/**
 * List of Campaigns owned by a particular user
 */
exports.list = utils.listWithUser(Campaign);

/**
 * Campaign middleware
 */
exports.campaignByID = function(req, res, next, id) {
  Campaign.findById(id).populate('user', 'displayName').exec(function(err, campaign) {
    if (err) return next(err);
    if (! campaign) return next(new Error('Failed to load Campaign ' + id));
    req.campaign = campaign ;
    next();
  });
};

/**
 * Campaign authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  var roles = req.user.roles;

  // user id has to match if not an admin
  if (!us.contains(roles, 'admin')) {
    if (req.campaign.user.id !== req.user.id) {
      return res.status(403).send('User is not authorized');
    }
  }
  next();
};

/**
 * Campaign authorization middleware for admin role exclusive access
 */
exports.hasAdminAuthorization = function(req, res, next) {
  if (!us.contains(req.user.roles, 'admin')) {
    return res.status(403).send('User is not authorized');
  }
  next();
};

/**
 * Campaign url shortid representation
 */
exports.url = function(req, res) {
  res.json(shortId.generate());
};

/**
 * Return Campaign from its url
 */
exports.fromUrl = function(req, res, next) {
  Campaign.findOne(
    {
      url: req.params.url
    },
    function(err, campaign) {
      if (!campaign) {
        next();
      }
      else {
        res.redirect('/#!/campaigns/' + campaign._id);
      }
    }
  );
};

exports.order = function(req, res) {
  var transaction = req.body,
      stripeToken = transaction.stripeToken;

  console.log('ordering.....');
  console.log(stripeToken);
  console.log(transaction);

  stripe.customers.create(
    {
      card: stripeToken
    },
    function(err, customer) {
      if(err) {
        console.log(err);
      } else {
        console.log(customer);
      }
    }
  );
};
