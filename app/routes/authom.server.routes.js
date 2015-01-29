'use strict';

module.exports = function(app) {
  // Authom Routes
  var authom = require('../../app/controllers/authom.server.controller').authom;

  app.route('/oauth/:service').get(authom.app);

};
