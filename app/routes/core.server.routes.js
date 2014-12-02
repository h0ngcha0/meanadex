'use strict';

module.exports = function(app) {
  // Root routing
  var core = require('../../app/controllers/core');
  var users = require('../../app/controllers/users');

  app.route('/').get(core.index);
  app.route('/dashboard').get(users.requiresLogin, core.dashboard);
};
