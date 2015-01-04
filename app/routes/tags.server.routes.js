'use strict';

module.exports = function(app) {
  var users = require('../../app/controllers/users');
  var tags = require('../../app/controllers/tags');

  app.route('/tags')
     .get(users.requiresLogin, tags.list);
};
