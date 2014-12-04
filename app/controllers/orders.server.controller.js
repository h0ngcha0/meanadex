'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Order = mongoose.model('Order'),
    utils = require('./utils'),
    config = require('../../config/config'),
    logger = require('../lib/logger.server.lib.js'),
    async = require('async'),
    agenda = require('../lib/agenda.server.lib.js'),
    _ = require('lodash');

var stripe = require('stripe')(
  config.stripe.clientSecret
);

/**
 * Create a Order
 */
exports.create = function(req, res) {
  var orderReq = req.body,
      payment = orderReq.payment;

  var createCustomer = function(callback) {
    stripe.customers.create(
      {
        email: orderReq.email,
        card: payment.id, // obtained with Stripe.js
        description: 'Charge for campaign: ' + orderReq.description,
        metadata: {
          campaignId: orderReq.campaign,
          amount: req.body.amount * 100,
          currency: req.body.unit
        }
      },
      function(err, customer) {
        if (err) {
          res.status(400).send({
            message: err.message
          });
        }

        callback(err, customer.id);
      }
    );
  };

  var saveOrder = function(customerId, callback) {
    orderReq.payment.customerId = customerId;
    var order = new Order(orderReq);

    order.user = req.user;

    order.save(function(err) {
      if(err) {
        res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(order);
      }

      callback(err);
    });
  };

  var renderEmail = function(callback) {
    var urlPrefix = 'http://' + req.headers.host;

    res.render(
      'templates/order-finish-confirm-email',
      {
        name: req.user.displayName,
        appName: config.app.title,
        campaign_name: orderReq.description,
        campaign_url: urlPrefix + '/#!/campaigns/' + orderReq.campaign
      },
      function(err, emailHTML) {
        callback(err, emailHTML);
      });
  };

  var sendEmail = function(emailHTML, callback) {
    agenda.now('send email', {
      email: orderReq.email,
      emailHTML: emailHTML,
      subject: 'Your order is created'
    });

    callback(undefined);
  };

  var logging = function(err, results) {
    if (err) {
      logger.error('error while creating order: ', err);
    }
  };

  async.waterfall([
    createCustomer,
    saveOrder,
    renderEmail,
    sendEmail
  ], logging);
};

/**
 * Show the current Order
 */
exports.read = function(req, res) {
  res.jsonp(req.order);
};

/**
 * Update a Order
 */
exports.update = function(req, res) {
  var order = req.order ;

  order = _.extend(order , req.body);

  order.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(order);
    }
  });
};

/**
 * Delete an Order
 */
exports.delete = function(req, res) {
  var order = req.order ;

  order.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(order);
    }
  });
};

/**
 * List of Orders
 */
exports.list = utils.listWithUser(
  Order,
  {
    'user': 'displayName',
    'campaign': 'name'
  }
);

/**
 * List of Orders by campaign id
 */
exports.listByCampaign = function(campaignId) {
  return Order.find({
    'campaign': campaignId
  }).sort(
    '-created'
  ).populate(
    'user', 'displayName'
  ).populate(
    'campaign', 'name'
  );
};

/**
 * Order middleware
 */
exports.orderByID = function(req, res, next, id) {
  Order.findById(id).
    populate('user', 'displayName').
    populate('campaign', 'name').
    exec(function(err, order) {
    if (err) return next(err);
    if (! order) return next(new Error('Failed to load Order ' + id));
    req.order = order ;
    next();
  });
};

/**
 * Order authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  if (req.order.user.id !== req.user.id) {
    return res.status(403).send('User is not authorized');
  }
  next();
};
