'use strict';
var mongoose = require('mongoose'),
    config = require('../../../config/config'),
    orders = require('../../../app/controllers/orders'),
    async = require('async'),
    logger = require('../logger.server.lib.js'),
    Campaign = mongoose.model('Campaign'),
    stripe = require('stripe')(config.stripe.clientSecret),
    _ = require('lodash');

var listAllOrders = function(campaign) {
  return function(callback) {
    var query = orders.listByCampaign(campaign._id);
    query.lean().exec(function(err, campaignOrders) {
      if(err) {
        logger.log('error getting orders for campaign: ' + campaign._id);
      }

      callback(err, campaign, campaignOrders);
    });
  };
};

var maybeChargeOrder = function(order, chargeFlag) {
  return function(callback) {
    // making the charge
    var customerId = order.payment.customerId;

    // chargeFlag determines if charge or not.
    if(chargeFlag) {
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
            logger.error(
              'error charging order: ' + order._id + '; customer id: ' + customerId
            );
          } else {
            logger.info(
              'order: ' + order._id + ' with customer id: ' + customerId + ' charged.'
            );
          }

          callback(err, customerId);
        }
      );
    } else {
      // if not charge, proceed.
      callback(undefined, customerId);
    }
  };
};

var deleteCustomer = function(err, customerId) {
  stripe.customers.del(
    customerId,
    function(err, confirmation) {
      if(err) {
        logger.error('error deleting customer: ' + customerId);
      } else {
        logger.info('customer: ' + customerId + ' deleted.');
      }
    }
  );
};

var maybeChargeOrders = function(campaign, campaignOrders, callback) {
  var numOrders = campaignOrders.length;

  var goalReached = numOrders >= campaign.goal ? true : false;

  _.forEach(campaignOrders, function(order) {
    async.waterfall([
      maybeChargeOrder(order, goalReached)
    ], deleteCustomer);
  });

  // always go through
  callback(undefined, campaign, goalReached);
};

var changeCampaignState = function(campaign, goalReached, callback) {
  campaign.state = goalReached ? 'tipped' : 'expired';
  campaign.save(function(err) {
    if(err) {
      logger.error('campaign ' + campaign._id + ' is tipped.');
    }

    callback(err);
  });
};

var logging = function(err, results) {
  if (err) {
    logger.error('error while trying to tip campaigns: ', err);
  }
};

module.exports = function(agenda) {
  agenda.define('check campaigns maturity', function(job, done) {
    logger.info('check campaigns maturity job started')
    Campaign.find({ended_at: {$lt: Date.now()}}).
      where('state').equals('not_tipped').
      exec(function(err, campaigns) {
      _.forEach(campaigns, function(campaign){
        async.waterfall([
          listAllOrders(campaign),
          maybeChargeOrders,
          changeCampaignState
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
