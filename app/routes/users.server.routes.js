'use strict';

module.exports = function(app) {
  // User Routes
  var users = require('../../app/controllers/users'),
      oauth2 = require('../../app/controllers/oauth2.server.controller');

  // Setting up the users profile api
  app.route('/users/me').get(oauth2.authorise, users.me);
  app.route('/users').post(oauth2.authorise, users.update);
  app.route('/users/accounts').delete(oauth2.authorise, users.removeOAuthProvider);
  app.route('/users/:userId').get(oauth2.authorise, users.me);

  // Setting up the users password api
  app.route('/users/password').post(oauth2.authorise, users.changePassword);
  app.route('/auth/forgot').post(users.forgot);
  app.route('/auth/reset/:token').get(users.validateResetToken);
  app.route('/auth/reset/:token').post(users.reset);

  // Setting up the users authentication api
  app.route('/auth/signup').post(users.signup, oauth2.grantToken);
  app.route('/auth/signin').post(oauth2.grantToken);

  // Finish by binding the user middleware
  app.param('userId', users.userByID);
};
