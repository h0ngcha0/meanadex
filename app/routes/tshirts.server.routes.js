'use strict';

module.exports = function(app) {
  var oauth2 = require('../../app/controllers/oauth2');
  var tshirts = require('../../app/controllers/tshirts');

  // Tshirts Routes
  app.route('/tshirts')
     .get(tshirts.list)
     .post(oauth2.authorise, tshirts.create);

  app.route('/tshirts/:tshirtId')
     .get(tshirts.read)
     .post(oauth2.authorise, tshirts.hasAuthorization, tshirts.update)
     .delete(oauth2.authorise, tshirts.hasAuthorization, tshirts.delete);

  // Finish by binding the Tshirt middleware
  app.param('tshirtId', tshirts.tshirtByID);
};
