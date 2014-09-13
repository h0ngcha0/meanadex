'use strict';

module.exports = function(app) {
  var users = require('../../app/controllers/users');
  var tshirts = require('../../app/controllers/tshirts');

  // Tshirts Routes
  app.route('/tshirts')
     .get(tshirts.list)
     .post(users.requiresLogin, tshirts.create);

  app.route('/tshirts/:tshirtId')
     .get(tshirts.read)
     .put(users.requiresLogin, tshirts.hasAuthorization, tshirts.update)
     .delete(users.requiresLogin, tshirts.hasAuthorization, tshirts.delete);

  // Finish by binding the Tshirt middleware
  app.param('tshirtId', tshirts.tshirtByID);
};
