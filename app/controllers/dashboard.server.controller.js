'use strict';

/* global emit */

/**
 * Module dependencies.
 */
var moment = require('moment'),
    _ = require('lodash'),
    mongoose = require('mongoose'),
    Campaign = mongoose.model('Campaign'),
    Order = mongoose.model('Order');

/**
 * Show total income.
 */
exports.readTotalIncome = function(req, res) {
  // Find orders that it's campaign owned by current user
  var options = {};
  options.map = function () {
    emit(this.account, this.goal);
  };
  options.reduce = function (key, values) {
    return Array.sum(values);
  };
  options.query = {user: req.user._id};

  Order.count(options.query, function(err, count) {
    if(err || !count) {
      // TODO: verbose logging
      res.jsonp({
        total: 0
      });
    }
    else {
      Order.mapReduce(options, function(err, results) {
        if(err || !results.length) {
          // TODO: verbose logging
          res.jsonp({
            total: 0
          });
        } else {
          res.jsonp({
            total: results[0].value
          });
        }
      });
    }
  });
};

/**
 * Show total orders.
 */
exports.readTotalOrders = function(req, res) {
  Order.find({user: req.user._id}).count(function (err, count) {
    if(err || !count) {
      // TODO: verbose logging
      res.jsonp({
        value: 0
      });
    }
    else {
      res.jsonp({
        value: count
      });
    }
  });
};

/**
 * Show total campaigns.
 */
exports.readTotalCampaigns = function(req, res) {
  Campaign.find({user: req.user._id}).count(function (err, count) {
    if(err || !count) {
      // TODO: verbose logging
      res.jsonp({
        value: 0
      });
    }
    else {
      res.jsonp({
        value: count
      });
    }
  });
};

/**
 * Show active campaigns.
 */
exports.readActiveCampaigns = function(req, res) {
  Campaign.find({user: req.user._id, state: {$ne: 'expired'}})
    .count(function (err, count) {
    if(err || !count) {
      // TODO: verbose logging
      res.jsonp({
        value: 0
      });
    }
    else {
      res.jsonp({
        value: count
      });
    }
  });
};

var timeSeriesGenerator = function(model, query, sumBy) {
  return function(req, res) {
    var startDate = new Date(req.query.startDate),
        endDate = new Date(req.query.endDate);
    var _query = {
      user: req.user._id,
      created_at: {
        $gte: startDate,
        $lte: endDate
      }
    };
    _query = _.extend(_query, query);
    var stages = {};
    stages.$match = {
      $match: _query
    };
    stages.$project ={
      $project: {
        year: {$year: '$created_at'},
        month: {$month: '$created_at'},
        day: {$dayOfMonth: '$created_at'}
      }
    };
    stages.$group = {
      $group: {
        _id: {year: '$year', month: '$month', day: '$day'},
        _value: {
          $sum: 1
        }
      }
    };
    if(sumBy) {
      stages.$project.$project[sumBy] = 1;
      stages.$group.$group._value.$sum = '$' + sumBy;
    }
    stages.$sort = {
      $sort: {
        _id: 1
      }
    };

    var getTime = function(_id) {
      return moment([_id.year, _id.month, _id.day].join('-'))
        .toDate().getTime();
    };

    model.count(query, function(err, count) {
      if(err || !count) {
        // TODO: verbose logging
        res.jsonp({
          total: 0,
          values: []
        });
      }
      else {
        model.aggregate(
          stages.$match,
          stages.$project,
          stages.$group,
          stages.$sort,
          function(err, results) {
            if(err || !results.length) {
              // TODO: verbose logging
              res.jsonp({
                total: 0,
                values: []
              });
            } else {
              var values = results.map(function(r) {
                return [getTime(r._id), r._value];
              });
              var total = values.reduce(function (p, c, i, a) {
                c = p + a[i][1];
                return c;
              }, 0);
              res.jsonp({
                total: total,
                values: values
              });
            }
          }
        );
      }
    });
  };
};

/**
 * Show campaigns created.
 */
exports.readCampaignsCreated = timeSeriesGenerator(Campaign);

/**
 * Show orders created.
 */
exports.readOrdersCreated = timeSeriesGenerator(Order);
