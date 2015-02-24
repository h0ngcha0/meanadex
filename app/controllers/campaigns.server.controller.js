'use strict';

/* global emit */

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Order = mongoose.model('Order'),
    Campaign = mongoose.model('Campaign'),
    shortId = require('shortid'),
    config = require('../../config/config'),
    utils = require('./utils'),
    async = require('async'),
    agenda = require('../lib/agenda.server.lib.js'),
    logger = require('../lib/logger.server.lib.js'),
    _ = require('lodash');

/**
 * Create a Campaign
 */
exports.create = function(req, res) {
  var campaignReq = req.body,
      campaign = new Campaign(campaignReq);

  campaign.user = req.user;
  var saveCampaign = function(callback) {
    campaign.save(function(err) {
      if (err) {
        logger.error('Save campaign failed.', err);

        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(campaign);
      }

      callback(err);
    });
  };

  var renderEmail = function(callback) {
    var urlPrefix = 'http://' + req.headers.host;

    res.render(
      'templates/campaign-created-confirm-email',
      {
        name: req.user.username,
        appName: config.app.title,
        campaign_name: campaign.name,
        campaign_url: urlPrefix + '/#!/campaigns/' + campaign._id,
        contact_email: config.mailer.from
      },
      function(err, emailHTML) {
        callback(err, emailHTML);
      });
  };

  var sendEmail = function(emailHTML, callback) {
    agenda.now('send email', {
      email: req.user.username,
      emailHTML: emailHTML,
      subject: 'Your campaign is created'
    });

    callback(undefined);
  };

  var logging = function(err, results) {
    if (err) {
      logger.error('Error while creating campaign: ', err);
    }
  };

  async.waterfall([
    saveCampaign,
    renderEmail,
    sendEmail
  ], logging);
};

/**
 * Show the current Campaign
 */
exports.read = function(req, res) {
  var campaign = req.campaign;

  if (!campaign) {
    return res.status(400).send({
      message: 'Campaign not found: ' + req.param('campaignId')
    });
  }

  campaign = campaign.toObject();

  var options = {};
  options.map = function () {
    emit(this.campaign, this.quantity);
  };
  options.reduce = function (key, values) {
    return Array.sum(values);
  };
  options.query = {campaign: campaign._id};

  Order.count(options.query, function(err, count){
    if(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    if(!count) {
      campaign.sold = 0;
      res.jsonp(campaign);
    }
    else {
      Order.mapReduce(options, function(err, results) {
        if(err) {
          logger.error(
            'Error computing sold count for campaign.',
            campaign._id,
            err
          );

          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          campaign.sold = results[0].value;
          res.jsonp(campaign);
        }
      });
    }
  });
};

/**
 * Update a Campaign
 */
exports.update = function(req, res) {
  var campaign = req.campaign ;

  campaign = _.extend(campaign , req.body);

  campaign.save(function(err) {
    if (err) {
      logger.error('Error updating campaign.', campaign._id, err);

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
      logger.error('Error deleting campaign.', campaign._id, err);

      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(campaign);
    }
  });
};

var populateSold = function(campaigns, callback) {
  var augmentCampaign = function(c, callback) {
    var campaign = _.clone(c.toObject());
    var options = {};
    options.map = function () {
      emit(this.campaign, this.quantity);
    };
    options.reduce = function (key, values) {
      return Array.sum(values);
    };
    options.query = {campaign: campaign._id};

    Order.count(options.query, function(err, count){
      if(err) {
        callback(err, campaign);
      }
      if(!count) {
        campaign.sold = 0;
        callback(err, campaign);
      }
      else {
        Order.mapReduce(options, function(err, results) {
          if(err) {
            callback(err, campaign);
          } else {
            campaign.sold = results[0].value;
            callback(err, campaign);
          }
        });
      }
    });
  };
  async.map(campaigns, augmentCampaign, function(err, results) {
    callback(err, results);
  });
};


var pagingResultUnwrapper = function(result) {
  return result.documents;
};

var campaignsCallback = function(resultUnwrapper) {
  return function(req, res, err, result) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var objects = resultUnwrapper(result);
      populateSold(objects, function(err, newObjects) {
        if(err) {
          logger.error('Error populating sold field for campaigns.', err);

          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
        else {
          result.documents = newObjects;
          res.jsonp(result);
        }
      });
    }
  };
};

/**
 * List of Campaigns owned by a particular user
 */
exports.listByUser = utils.listByUser(
  Campaign,
  {
    'user': 'username'
  },
  campaignsCallback(pagingResultUnwrapper)
);

var notTippedCampaignDecorator = function(queryFun) {
  return function(req) {
    var query = queryFun(req);

    query.state = 'not_tipped';
    return query;
  };
};

/**
 * List of Featured Campaigns
 * What makes a campaign featured needs more discussion, right
 * now return campaigns that are not tipped.
 */
exports.listOfFeatured = utils.list(
  Campaign,
  {
    'user': 'username'
  },
  [notTippedCampaignDecorator],
  campaignsCallback(pagingResultUnwrapper)
);

/**
 * Search Campaigns based on name and description
 */
exports.search = utils.listBySearch(
  Campaign,
  {
    'user': 'username'
  },
  [],
  campaignsCallback(utils.searchResultUnwrapper)
);

/**
 * Campaign middleware
 */
exports.campaignByID = function(req, res, next, id) {
  Campaign.findById(id).populate('user', 'username').exec(function(err, campaign) {
    if (err) return next(err);
    req.campaign = campaign;
    next();
  });
};

/**
 * Campaign authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  var roles = req.user.roles;

  // user id has to match if not an admin
  if (!_.contains(roles, 'admin')) {
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
  if (!_.contains(req.user.roles, 'admin')) {
    return res.status(403).send('User is not authorized');
  }
  next();
};
