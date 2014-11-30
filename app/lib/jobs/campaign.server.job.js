'use strict';
var mongoose = require('mongoose'),
    config = require('../../../config/config'),
    orders = require('../../../app/controllers/orders'),
    async = require('async'),
    winston = require('winston'),
    Campaign = mongoose.model('Campaign'),
    _ = require('lodash');

module.exports = function(agenda) {
  agenda.define('check campaigns maturity', function(job, done) {
    var data = job.attrs.data;

    var listOrders = function(campaignId) {
      return function(callback) {
        var query = orders.listByCampaign(campaignId);
        query.lean().exec(function(err, campaignOrders) {
          if(err) {
            console.log('error getting orders for campaign: ' + campaignId);
          }

          callback(err, campaignOrders)
        });
      }
    };

    var chargeOrders = function(campaignOrders, callback) {
      _.forEach(campaignOrders, function(order) {
        // making the charge
      });

      // always go through
      callback(undefined);
    };

    var tipCampaign = function(campaign) {
      return function(callback) {
        campaign.matured = true;
        campaign.save(function(err) {
          if(err) {
            console.log('campaign ' + campaign._id + ' is tipped.');
          }

          callback(err);
        });
      }
    };

    var logging = function(err, results) {
      if (err) {
        winston.error('error while creating order: ', err);
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
