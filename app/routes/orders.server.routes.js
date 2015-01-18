'use strict';

module.exports = function(app) {
  var oauth2 = require('../../app/controllers/oauth2');
  var orders = require('../../app/controllers/orders');

  // Orders Routes
  app.route('/orders')
     .get(orders.list)
     .post(oauth2.authorise, orders.create);

  app.route('/orders/:orderId')
     .get(orders.read)
     .put(oauth2.authorise, orders.hasAuthorization, orders.update)
     .delete(oauth2.authorise, orders.hasAuthorization, orders.delete);

  // Finish by binding the Order middleware
  app.param('orderId', orders.orderByID);
};
