'use strict';

module.exports = function(app) {
  var users = require('../../app/controllers/users');
  var images = require('../../app/controllers/images');

  // Images Routes
  app.route('/images')
     .get(images.list)
     .post(users.requiresLogin, images.create);

  app.route('/images/:imageId')
     .get(images.read)
     .put(users.requiresLogin, images.hasAuthorization, images.update)
     .delete(users.requiresLogin, images.hasAuthorization, images.delete);

  // Finish by binding the Image middleware
  app.param('imageId', images.imageByID);
};
