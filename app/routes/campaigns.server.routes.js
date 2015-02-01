'use strict';

module.exports = function(app) {
  var oauth2 = require('../../app/controllers/oauth2');
  var campaigns = require('../../app/controllers/campaigns');

  // Campaigns Routes
  app.route('/campaigns')
  .get(oauth2.authorise, campaigns.listByUser)
  .post(oauth2.authorise, campaigns.create);

  app.route('/featured_campaigns')
  .get(campaigns.listOfFeatured);

  app.route('/search_campaigns')
  .get(campaigns.search);

  app.route('/campaigns/:campaignId')
  .get(campaigns.read)
  .post(oauth2.authorise, campaigns.hasAuthorization, campaigns.update)
  .delete(oauth2.authorise, campaigns.hasAuthorization, campaigns.delete);

  // Finish by binding the Campaign middleware
  app.param('campaignId', campaigns.campaignByID);
};
