'use strict';

module.exports = function(app) {
  var users = require('../../app/controllers/users');
  var campaigns = require('../../app/controllers/campaigns');

  // Campaigns Routes
  app.route('/campaigns')
  .get(users.requiresLogin, campaigns.list)
  .post(users.requiresLogin, campaigns.create);

  app.route('/campaigns/:campaignId')
  .get(campaigns.read)
  .put(users.requiresLogin, campaigns.hasAuthorization, campaigns.update)
  .delete(users.requiresLogin, campaigns.hasAuthorization, campaigns.delete);

  app.route('/campaign/url').get(campaigns.url);

  app.route('/:url/').get(campaigns.fromUrl);

  // Finish by binding the Campaign middleware
  app.param('campaignId', campaigns.campaignByID);
};
