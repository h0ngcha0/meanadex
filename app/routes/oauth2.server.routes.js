'use strict';

module.exports = function(app) {
  // Oauth2 Routes
  var oauth2 = require('../../app/controllers/oauth2.server.controller');

  app.route('/oauth2/token').post(oauth2.grantToken);
};
