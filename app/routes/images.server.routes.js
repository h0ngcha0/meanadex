'use strict';

module.exports = function(app) {
  var oauth2 = require('../../app/controllers/oauth2');
  var images = require('../../app/controllers/images');

  // Images Routes
  app.route('/images')
     .get(images.list)
     .post(oauth2.authorise, images.create);

  app.route('/images/:imageId')
     .get(images.read)
     .post(oauth2.authorise, images.hasAuthorization, images.update)
     .delete(oauth2.authorise, images.hasAuthorization, images.delete);

  // Finish by binding the Image middleware
  app.param('imageId', images.imageByID);
};
