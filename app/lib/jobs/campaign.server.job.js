'use strict';
var mongoose = require('mongoose'),
    config = require('../../../config/config'),
    orders = require('../../../app/controllers/orders'),
    async = require('async'),
    winston = require('winston'),
    Campaign = mongoose.model('Campaign'),
    stripe = require('stripe')(config.stripe.clientSecret),
    _ = require('lodash');

module.exports = function(agenda) {
  agenda.define('check campaigns maturity', function(job, done) {
    var listOrders = function(campaignId) {
      return function(callback) {
        var query = orders.listByCampaign(campaignId);
        query.lean().exec(function(err, campaignOrders) {
          if(err) {
            winston.log('error getting orders for campaign: ' + campaignId);
          }

          callback(err, campaignOrders)
        });
      }
    };

    var chargeOrders = function(campaignOrders, callback) {
      _.forEach(campaignOrders, function(order) {
        // making the charge
        var customerId = order.payment.customerId;

        // FIXME: need to charge on behalf of the campaign owner
        stripe.charges.create(
          {
            customer: customerId,
            amount: order.amount * 100,
            currency: order.unit,
            description: order.description
          },
          function(err, charge) {
            if(err) {
              winston.error('error charging order: ' + order._id + '; customer id: ' + customerId);
            } else {
              winston.info('order: ' + order._id + ' with customer id: ' + customerId + ' charged');
            }
          }
        );
      });

      // always go through
      callback(undefined);
    };

    var tipCampaign = function(campaign) {
      return function(callback) {
        campaign.matured = true;
        campaign.save(function(err) {
          if(err) {
            winston.log('campaign ' + campaign._id + ' is tipped.');
          }

          callback(err);
        });
      }
    };

    var logging = function(err, results) {
      if (err) {
        winston.error('error while trying to tip campaigns: ', err);
      }
    };

    Campaign.find({created_at: {$lt: Date.now()}}).
      where('matured').equals(false).
      exec(function(err, campaigns) {
      _.forEach(campaigns, function(campaign){
        async.waterfall([
          listOrders(campaign._id),
          chargeOrders,
          tipCampaign(campaign)
        ], logging);
      });
    });
  });

  var checkCampaignMaturity = agenda.schedule(
    config.job.campaignJob.start,
    'check campaigns maturity'
  );

  checkCampaignMaturity.repeatEvery(config.job.campaignJob.frequency).save();
};
