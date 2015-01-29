'use strict';

module.exports = function(app) {
  var oauth2 = require('../../app/controllers/oauth2');
  var tags = require('../../app/controllers/tags');

  app.route('/tags')
     .get(tags.list);
};
